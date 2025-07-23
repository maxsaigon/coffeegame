/**
 * Coffee Bean Entity
 * Individual coffee bean with physics and roasting properties
 */

import Phaser from 'phaser';
import type { CoffeeBeanVariety } from '../types/GameTypes';

export class CoffeeBean extends Phaser.Physics.Arcade.Sprite {
  public variety: CoffeeBeanVariety;
  public roastLevel: number = 0; // 0 = green, 1 = fully roasted
  public temperature: number = 20; // Celsius
  public moisture: number = 12; // Percentage
  public isDefective: boolean = false;
  public age: number = 0; // Days since roasting
  
  private targetRoastLevel: number = 0;
  private roastingRate: number = 0.001; // Per millisecond

  constructor(
    scene: Phaser.Scene, 
    x: number, 
    y: number, 
    variety: CoffeeBeanVariety,
    texture: string = 'coffee-bean'
  ) {
    super(scene, x, y, texture);
    
    this.variety = variety;
    this.scene.add.existing(this);
    this.scene.physics.add.existing(this);
    
    this.setupPhysics();
    this.updateVisuals();
    this.bindEvents();
  }

  private setupPhysics(): void {
    // Make bean affected by gravity and collisions
    const body = this.body as Phaser.Physics.Arcade.Body;
    body.setGravityY(300);
    body.setBounce(0.3, 0.3);
    body.setCollideWorldBounds(true);
    body.setDrag(50, 0);
    
    // Set size based on bean variety
    const sizeMultiplier = this.variety.characteristics.size === 'large' ? 1.2 : 
                          this.variety.characteristics.size === 'small' ? 0.8 : 1.0;
    this.setScale(sizeMultiplier);
  }

  private updateVisuals(): void {
    // Update color based on roast level
    const greenColor = 0x6B8E23; // Green
    const lightBrownColor = 0xD2B48C; // Light brown
    const mediumBrownColor = 0x8B4513; // Medium brown
    const darkBrownColor = 0x654321; // Dark brown
    const blackColor = 0x2F1B14; // Almost black
    
    let currentColor = greenColor;
    
    if (this.roastLevel <= 0.2) {
      // Green to light brown
      const t = this.roastLevel / 0.2;
      currentColor = Phaser.Display.Color.Interpolate.ColorWithColor(
        Phaser.Display.Color.ValueToColor(greenColor),
        Phaser.Display.Color.ValueToColor(lightBrownColor),
        1,
        t
      ).color;
    } else if (this.roastLevel <= 0.5) {
      // Light to medium brown
      const t = (this.roastLevel - 0.2) / 0.3;
      currentColor = Phaser.Display.Color.Interpolate.ColorWithColor(
        Phaser.Display.Color.ValueToColor(lightBrownColor),
        Phaser.Display.Color.ValueToColor(mediumBrownColor),
        1,
        t
      ).color;
    } else if (this.roastLevel <= 0.8) {
      // Medium to dark brown
      const t = (this.roastLevel - 0.5) / 0.3;
      currentColor = Phaser.Display.Color.Interpolate.ColorWithColor(
        Phaser.Display.Color.ValueToColor(mediumBrownColor),
        Phaser.Display.Color.ValueToColor(darkBrownColor),
        1,
        t
      ).color;
    } else {
      // Dark brown to black
      const t = (this.roastLevel - 0.8) / 0.2;
      currentColor = Phaser.Display.Color.Interpolate.ColorWithColor(
        Phaser.Display.Color.ValueToColor(darkBrownColor),
        Phaser.Display.Color.ValueToColor(blackColor),
        1,
        t
      ).color;
    }
    
    this.setTint(currentColor);
    
    // Add visual effects for defects
    if (this.isDefective) {
      this.setTint(0x666666); // Gray tint for defective beans
    }
  }

  private bindEvents(): void {
    // Make bean interactive
    this.setInteractive();
    
    this.on('pointerdown', () => {
      this.onSelect();
    });
    
    this.on('pointerover', () => {
      this.setScale(this.scaleX * 1.1, this.scaleY * 1.1);
    });
    
    this.on('pointerout', () => {
      this.setScale(this.scaleX / 1.1, this.scaleY / 1.1);
    });
  }

  public startRoasting(targetLevel: number = 0.7): void {
    this.targetRoastLevel = Math.min(targetLevel, 1.0);
    this.roastingRate = this.calculateRoastingRate();
    
    console.log(`Starting to roast ${this.variety.name} bean to level ${targetLevel}`);
  }

  public stopRoasting(): void {
    this.targetRoastLevel = this.roastLevel;
    this.roastingRate = 0;
    
    console.log(`Stopped roasting ${this.variety.name} bean at level ${this.roastLevel.toFixed(2)}`);
  }

  public update(_time: number, delta: number): void {
    // Update roasting if in progress
    if (this.roastingRate > 0 && this.roastLevel < this.targetRoastLevel) {
      const roastIncrease = this.roastingRate * delta;
      this.roastLevel = Math.min(this.roastLevel + roastIncrease, this.targetRoastLevel);
      
      // Update temperature during roasting
      this.temperature = 20 + (this.roastLevel * 200); // Up to 220°C
      
      // Reduce moisture during roasting
      this.moisture = Math.max(2, 12 - (this.roastLevel * 8)); // Down to 2%
      
      // Check for defects based on roasting conditions
      this.checkForDefects();
      
      // Update visuals
      this.updateVisuals();
    }
    
    // Age the bean over time
    this.age += delta / (1000 * 60 * 60 * 24); // Convert to days
  }

  private calculateRoastingRate(): number {
    // Base rate varies by bean variety
    let baseRate = 0.001;
    
    // Adjust based on bean characteristics
    if (this.variety.characteristics.density === 'high') {
      baseRate *= 0.8; // Denser beans roast slower
    } else if (this.variety.characteristics.density === 'low') {
      baseRate *= 1.2; // Less dense beans roast faster
    }
    
    // Adjust based on bean size
    if (this.variety.characteristics.size === 'large') {
      baseRate *= 0.9; // Larger beans roast slower
    } else if (this.variety.characteristics.size === 'small') {
      baseRate *= 1.1; // Smaller beans roast faster
    }
    
    return baseRate;
  }

  private checkForDefects(): void {
    // Simple defect detection based on roasting conditions
    if (this.roastLevel > 0.9 && this.temperature > 220) {
      // Over-roasted
      this.isDefective = true;
    }
    
    if (this.roastingRate > 0.002) {
      // Roasting too fast
      this.isDefective = true;
    }
  }

  private onSelect(): void {
    // Emit event for bean selection
    this.scene.events.emit('beanSelected', this);
    
    // Visual feedback
    this.scene.tweens.add({
      targets: this,
      scaleX: this.scaleX * 1.2,
      scaleY: this.scaleY * 1.2,
      duration: 100,
      yoyo: true,
      ease: 'Power2'
    });
  }

  // Getters for bean properties
  public getRoastLevel(): number {
    return this.roastLevel;
  }

  public getTemperature(): number {
    return this.temperature;
  }

  public getMoisture(): number {
    return this.moisture;
  }

  public getAge(): number {
    return this.age;
  }

  public isRoasting(): boolean {
    return this.roastingRate > 0 && this.roastLevel < this.targetRoastLevel;
  }

  public getQuality(): number {
    let quality = 1.0;
    
    // Reduce quality for defects
    if (this.isDefective) quality *= 0.3;
    
    // Reduce quality based on age
    if (this.age > 14) quality *= 0.8; // 2 weeks old
    if (this.age > 30) quality *= 0.6; // 1 month old
    
    // Optimal roast level for quality
    const optimalRoast = 0.65;
    const roastDeviation = Math.abs(this.roastLevel - optimalRoast);
    quality *= Math.max(0.5, 1 - roastDeviation);
    
    return Math.max(0, Math.min(1, quality));
  }

  public getInfo(): string {
    return `${this.variety.name}\\n` +
           `Roast: ${(this.roastLevel * 100).toFixed(1)}%\\n` +
           `Quality: ${(this.getQuality() * 100).toFixed(1)}%\\n` +
           `Age: ${this.age.toFixed(1)} days`;
  }

  // Clean up when destroying
  public destroy(): void {
    this.removeAllListeners();
    super.destroy();
  }
}
