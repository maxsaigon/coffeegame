/**
 * Roasting Drum Component
 * The main roasting device that heats and rotates coffee beans
 */

import Phaser from 'phaser';
import { CoffeeBean } from './CoffeeBean';

export class RoastingDrum extends Phaser.GameObjects.Container {
  private drumBody!: Phaser.GameObjects.Ellipse;
  private heatingElement!: Phaser.GameObjects.Graphics;
  private temperatureDisplay!: Phaser.GameObjects.Text;
  
  public temperature: number = 20; // Celsius
  public targetTemperature: number = 20;
  public isHeating: boolean = false;
  public isRotating: boolean = false;
  public rotationSpeed: number = 30; // RPM
  
  private beans: CoffeeBean[] = [];
  private heatRamp: number = 2; // Degrees per second
  private maxTemperature: number = 250; // Celsius
  private thermalMass: number = 50; // Heat retention factor
  
  // Visual elements
  private flames: Phaser.GameObjects.Particles.ParticleEmitter | null = null;
  private steamEmitter: Phaser.GameObjects.Particles.ParticleEmitter | null = null;
  
  constructor(scene: Phaser.Scene, x: number, y: number) {
    super(scene, x, y);
    
    this.scene.add.existing(this);
    this.createDrumVisuals();
    this.setupInteractions();
    this.createParticleEffects();
  }

  private createDrumVisuals(): void {
    // Main drum body
    this.drumBody = new Phaser.GameObjects.Ellipse(
      this.scene, 0, 0, 200, 120, 0x8B4513, 1
    );
    this.drumBody.setStrokeStyle(4, 0x654321);
    this.add(this.drumBody);
    
    // Heating element indicator
    this.heatingElement = new Phaser.GameObjects.Graphics(this.scene);
    this.updateHeatingElement();
    this.add(this.heatingElement);
    
    // Temperature display
    this.temperatureDisplay = new Phaser.GameObjects.Text(
      this.scene, 0, -80, `${this.temperature.toFixed(0)}°C`, 
      {
        fontSize: '18px',
        color: '#ffffff',
        backgroundColor: '#000000',
        padding: { x: 8, y: 4 }
      }
    );
    this.temperatureDisplay.setOrigin(0.5);
    this.add(this.temperatureDisplay);
    
    // Drum opening/lid
    const lid = new Phaser.GameObjects.Ellipse(
      this.scene, 0, -40, 180, 30, 0x666666, 1
    );
    lid.setStrokeStyle(2, 0x444444);
    this.add(lid);
    
    // Rotation indicator (small mark on drum)
    const rotationMark = new Phaser.GameObjects.Rectangle(
      this.scene, 80, 0, 10, 4, 0xffffff
    );
    this.add(rotationMark);
  }

  private setupInteractions(): void {
    this.drumBody.setInteractive();
    
    this.drumBody.on('pointerdown', () => {
      this.scene.events.emit('drumClicked', this);
    });
    
    this.drumBody.on('pointerover', () => {
      this.drumBody.setStrokeStyle(4, 0xffffff);
    });
    
    this.drumBody.on('pointerout', () => {
      this.drumBody.setStrokeStyle(4, 0x654321);
    });
  }

  private createParticleEffects(): void {
    // Temporarily disabled for testing - particles need texture assets
    console.log('Particle effects disabled for testing');
    /*
    // Heat/flame particles for when heating is active
    if (this.scene.add.particles) {
      const flameParticles = this.scene.add.particles(0, 60, 'spark', {
        speed: { min: 20, max: 40 },
        scale: { start: 0.1, end: 0.05 },
        lifespan: 300,
        tint: [0xff6600, 0xff3300, 0xffaa00]
      });
      
      flameParticles.stop();
      this.flames = flameParticles;
      
      // Steam particles for when beans are roasting
      const steamParticles = this.scene.add.particles(0, -50, 'smoke', {
        speed: { min: 10, max: 30 },
        scale: { start: 0.05, end: 0.2 },
        lifespan: 1000,
        alpha: { start: 0.8, end: 0 },
        tint: 0xcccccc
      });
      
      steamParticles.stop();
      this.steamEmitter = steamParticles;
    }
    */
  }

  private updateHeatingElement(): void {
    this.heatingElement.clear();
    
    if (this.isHeating) {
      // Draw heating element as glowing coils
      const intensity = Math.min(this.temperature / this.maxTemperature, 1);
      const heatColor = Phaser.Display.Color.Interpolate.ColorWithColor(
        Phaser.Display.Color.ValueToColor(0x666666),
        Phaser.Display.Color.ValueToColor(0xff3300),
        1,
        intensity
      );
      
      this.heatingElement.lineStyle(6, heatColor.color);
      
      // Draw heating coils under the drum
      for (let i = 0; i < 3; i++) {
        const y = 50 + (i * 8);
        this.heatingElement.beginPath();
        this.heatingElement.arc(0, y, 60 - (i * 10), 0, Math.PI);
        this.heatingElement.strokePath();
      }
    }
  }

  public addBeans(beans: CoffeeBean[]): void {
    beans.forEach(bean => {
      this.beans.push(bean);
      // Position beans randomly within the drum
      const angle = Math.random() * Math.PI * 2;
      const radius = Math.random() * 70;
      bean.setPosition(
        this.x + Math.cos(angle) * radius,
        this.y + Math.sin(angle) * radius * 0.6 + 10
      );
    });
    
    console.log(`Added ${beans.length} beans to roasting drum. Total: ${this.beans.length}`);
  }

  public removeBeans(): CoffeeBean[] {
    const removedBeans = [...this.beans];
    this.beans = [];
    
    console.log(`Removed ${removedBeans.length} beans from roasting drum`);
    return removedBeans;
  }

  public startHeating(targetTemp: number = 200): void {
    this.targetTemperature = Math.min(targetTemp, this.maxTemperature);
    this.isHeating = true;
    
    if (this.flames) {
      this.flames.start();
    }
    
    console.log(`Started heating drum to ${this.targetTemperature}°C`);
  }

  public stopHeating(): void {
    this.isHeating = false;
    this.targetTemperature = this.temperature;
    
    if (this.flames) {
      this.flames.stop();
    }
    
    console.log('Stopped heating drum');
  }

  public startRotation(speed: number = 30): void {
    this.rotationSpeed = Math.max(5, Math.min(speed, 100)); // 5-100 RPM
    this.isRotating = true;
    
    console.log(`Started drum rotation at ${this.rotationSpeed} RPM`);
  }

  public stopRotation(): void {
    this.isRotating = false;
    console.log('Stopped drum rotation');
  }

  public startRoasting(): void {
    this.startHeating();
    this.startRotation();
    
    // Start roasting all beans in the drum
    this.beans.forEach(bean => {
      bean.startRoasting();
    });
    
    if (this.steamEmitter && this.beans.length > 0) {
      this.steamEmitter.start();
    }
    
    console.log(`Started roasting ${this.beans.length} beans`);
  }

  public stopRoasting(): void {
    this.stopHeating();
    // Keep rotation going for cooling
    
    // Stop roasting all beans
    this.beans.forEach(bean => {
      bean.stopRoasting();
    });
    
    if (this.steamEmitter) {
      this.steamEmitter.stop();
    }
    
    console.log('Stopped roasting beans');
  }

  public update(_time: number, delta: number): void {
    this.updateTemperature(delta);
    this.updateRotation(delta);
    this.updateBeans(delta);
    this.updateVisuals();
  }

  private updateTemperature(delta: number): void {
    const deltaSeconds = delta / 1000;
    
    if (this.isHeating && this.temperature < this.targetTemperature) {
      // Heat up towards target
      const heatIncrease = this.heatRamp * deltaSeconds;
      this.temperature = Math.min(
        this.temperature + heatIncrease,
        this.targetTemperature
      );
    } else if (!this.isHeating || this.temperature > this.targetTemperature) {
      // Cool down towards ambient (20°C) or target
      const targetTemp = this.isHeating ? this.targetTemperature : 20;
      const cooldownRate = (this.temperature - targetTemp) / this.thermalMass;
      const temperatureChange = cooldownRate * deltaSeconds;
      
      if (this.temperature > targetTemp) {
        this.temperature = Math.max(
          this.temperature - temperatureChange,
          targetTemp
        );
      }
    }
    
    // Update temperature display
    this.temperatureDisplay.setText(`${this.temperature.toFixed(0)}°C`);
    
    // Update temperature color
    const tempRatio = Math.min(this.temperature / this.maxTemperature, 1);
    const tempColor = Phaser.Display.Color.Interpolate.ColorWithColor(
      Phaser.Display.Color.ValueToColor(0x4444ff),
      Phaser.Display.Color.ValueToColor(0xff4444),
      1,
      tempRatio
    );
    this.temperatureDisplay.setColor(`#${tempColor.color.toString(16).padStart(6, '0')}`);
  }

  private updateRotation(delta: number): void {
    if (this.isRotating) {
      const rotationDelta = (this.rotationSpeed / 60) * (delta / 1000) * 360;
      this.rotation += Phaser.Math.DegToRad(rotationDelta);
      
      // Move beans in circular motion
      this.beans.forEach((bean, index) => {
        const baseAngle = (index / this.beans.length) * Math.PI * 2;
        const currentAngle = baseAngle + this.rotation;
        const radius = 60 + Math.sin(currentAngle * 3) * 10; // Variable radius for mixing effect
        
        bean.setPosition(
          this.x + Math.cos(currentAngle) * radius,
          this.y + Math.sin(currentAngle) * radius * 0.6 + 10
        );
      });
    }
  }

  private updateBeans(delta: number): void {
    // Update all beans with current drum conditions
    this.beans.forEach(bean => {
      // Update bean (this will handle roasting progress)
      bean.update(0, delta);
    });
  }

  private updateVisuals(): void {
    this.updateHeatingElement();
    
    // Update drum color based on temperature
    const tempRatio = Math.min(this.temperature / 200, 1); // Start color change at 200°C
    if (tempRatio > 0) {
      const drumColor = Phaser.Display.Color.Interpolate.ColorWithColor(
        Phaser.Display.Color.ValueToColor(0x8B4513),
        Phaser.Display.Color.ValueToColor(0xcc6600),
        1,
        tempRatio
      );
      this.drumBody.setFillStyle(drumColor.color);
    }
  }

  // Getters for drum status
  public getTemperature(): number {
    return this.temperature;
  }

  public getBeanCount(): number {
    return this.beans.length;
  }

  public isCurrentlyRoasting(): boolean {
    return this.isHeating && this.beans.length > 0;
  }

  public getAverageRoastLevel(): number {
    if (this.beans.length === 0) return 0;
    
    const totalRoast = this.beans.reduce((sum, bean) => sum + bean.getRoastLevel(), 0);
    return totalRoast / this.beans.length;
  }

  public getBeans(): CoffeeBean[] {
    return [...this.beans]; // Return copy to prevent external modification
  }

  // Clean up when destroying
  public destroy(): void {
    if (this.flames) {
      this.flames.destroy();
    }
    if (this.steamEmitter) {
      this.steamEmitter.destroy();
    }
    super.destroy();
  }
}
