/**
 * Customer Component
 * Represents a customer with preferences, orders, and feedback
 */

import Phaser from 'phaser';
import type { CustomerProfile, Order, CoffeeQualityScore } from '../types/GameTypes';

export class Customer extends Phaser.GameObjects.Container {
  public profile: CustomerProfile;
  public currentOrder: Order | null = null;
  public satisfaction: number = 100; // 0-100
  public patience: number = 100; // 0-100, decreases over time
  public loyaltyLevel: number = 0; // 0-100, increases with good service
  
  private avatar!: Phaser.GameObjects.Image;
  private nameText!: Phaser.GameObjects.Text;
  private speechBubble!: Phaser.GameObjects.Container;
  private satisfactionBar!: Phaser.GameObjects.Graphics;
  private patienceBar!: Phaser.GameObjects.Graphics;
  
  private patienceDecayRate: number = 5; // Points per second
  private isWaitingForOrder: boolean = false;
  private orderStartTime: number = 0;
  
  constructor(scene: Phaser.Scene, x: number, y: number, profile: CustomerProfile) {
    super(scene, x, y);
    
    this.profile = profile;
    this.scene.add.existing(this);
    
    this.createVisuals();
    this.setupInteractions();
    this.generateInitialOrder();
  }

  private createVisuals(): void {
    // Customer avatar
    this.avatar = new Phaser.GameObjects.Image(
      this.scene, 0, 0, this.profile.avatar
    );
    this.avatar.setScale(0.8);
    this.add(this.avatar);
    
    // Customer name
    this.nameText = new Phaser.GameObjects.Text(
      this.scene, 0, 60, this.profile.name,
      {
        fontSize: '14px',
        color: '#333333',
        align: 'center'
      }
    );
    this.nameText.setOrigin(0.5);
    this.add(this.nameText);
    
    // Satisfaction bar (green/yellow/red)
    this.satisfactionBar = new Phaser.GameObjects.Graphics(this.scene);
    this.add(this.satisfactionBar);
    
    // Patience bar (blue, decreases over time)
    this.patienceBar = new Phaser.GameObjects.Graphics(this.scene);
    this.add(this.patienceBar);
    
    // Speech bubble container
    this.speechBubble = new Phaser.GameObjects.Container(this.scene, 0, -80);
    this.add(this.speechBubble);
    
    this.updateStatusBars();
    this.createSpeechBubble();
  }

  private setupInteractions(): void {
    this.avatar.setInteractive();
    
    this.avatar.on('pointerdown', () => {
      this.onCustomerClick();
    });
    
    this.avatar.on('pointerover', () => {
      this.avatar.setTint(0xcccccc);
      this.showCustomerInfo();
    });
    
    this.avatar.on('pointerout', () => {
      this.avatar.clearTint();
      this.hideCustomerInfo();
    });
  }

  private generateInitialOrder(): void {
    // Generate an order based on customer preferences
    const order: Order = {
      id: `order-${Date.now()}`,
      customer: this.profile,
      items: this.generateOrderItems(),
      totalPrice: 0,
      status: 'pending',
      timestamp: Date.now(),
      preferences: this.generateOrderPreferences(),
      deadline: Date.now() + this.getOrderDeadline()
    };
    
    // Calculate total price
    order.totalPrice = order.items.reduce((sum: number, item: any) => sum + item.price, 0);
    
    this.currentOrder = order;
    this.isWaitingForOrder = true;
    this.orderStartTime = Date.now();
    
    this.updateSpeechBubble();
    
    console.log(`${this.profile.name} placed order:`, order);
  }

  private generateOrderItems(): any[] {
    // Generate coffee orders based on customer type
    const items = [];
    const basePrice = 3.50;
    
    switch (this.profile.type) {
      case 'casual':
        items.push({
          type: 'coffee',
          variety: 'house blend',
          roastLevel: 0.6, // Medium roast
          quantity: 1,
          price: basePrice
        });
        break;
        
      case 'enthusiast':
        items.push({
          type: 'coffee',
          variety: 'single origin',
          roastLevel: 0.65, // Medium-dark
          quantity: 1,
          price: basePrice * 1.5,
          specificOrigin: this.getPreferredOrigin()
        });
        break;
        
      case 'purist':
        items.push({
          type: 'coffee',
          variety: 'specialty grade',
          roastLevel: this.getPreferredRoastLevel(),
          quantity: 1,
          price: basePrice * 2,
          specificOrigin: this.getPreferredOrigin(),
          processingMethod: this.getPreferredProcessing()
        });
        break;
        
      case 'health_focused':
        items.push({
          type: 'coffee',
          variety: 'organic',
          roastLevel: 0.4, // Light roast (more antioxidants)
          quantity: 1,
          price: basePrice * 1.3,
          organic: true,
          decaf: Math.random() < 0.3
        });
        break;
        
      case 'professional':
        // Multiple smaller orders
        items.push({
          type: 'coffee',
          variety: 'espresso blend',
          roastLevel: 0.7,
          quantity: 3,
          price: basePrice * 0.9 * 3 // Bulk discount
        });
        break;
    }
    
    return items;
  }

  private generateOrderPreferences(): any {
    return {
      maxWaitTime: this.getOrderDeadline(),
      qualityThreshold: this.getQualityThreshold(),
      priceFlexibility: this.profile.psychology.priceFlexibility,
      preferredRoastLevel: this.getPreferredRoastLevel(),
      flavorPreferences: this.profile.preferences.flavorProfile
    };
  }

  private getOrderDeadline(): number {
    // Customer type affects how long they're willing to wait
    const baseWaitTime = 60000; // 1 minute
    
    switch (this.profile.type) {
      case 'professional': return baseWaitTime * 0.5; // Very impatient
      case 'purist': return baseWaitTime * 2; // Patient for quality
      case 'enthusiast': return baseWaitTime * 1.5;
      case 'casual': return baseWaitTime;
      case 'health_focused': return baseWaitTime * 1.2;
      default: return baseWaitTime;
    }
  }

  private getQualityThreshold(): number {
    // Minimum quality score customer will accept
    switch (this.profile.type) {
      case 'purist': return 85;
      case 'enthusiast': return 75;
      case 'professional': return 70;
      case 'health_focused': return 65;
      case 'casual': return 60;
      default: return 65;
    }
  }

  private getPreferredRoastLevel(): number {
    // Customer type influences roast preference
    switch (this.profile.type) {
      case 'purist': return 0.4 + Math.random() * 0.4; // Light to medium
      case 'enthusiast': return 0.5 + Math.random() * 0.3; // Medium to dark
      case 'professional': return 0.7; // Dark for espresso
      case 'casual': return 0.6; // Medium
      case 'health_focused': return 0.3 + Math.random() * 0.2; // Light
      default: return 0.5 + Math.random() * 0.3;
    }
  }

  private getPreferredOrigin(): string {
    const origins = [
      'Ethiopia', 'Colombia', 'Jamaica', 'Hawaii', 'Guatemala',
      'Brazil', 'Kenya', 'Costa Rica', 'Yemen', 'Peru'
    ];
    return origins[Math.floor(Math.random() * origins.length)];
  }

  private getPreferredProcessing(): string {
    const methods = ['washed', 'natural', 'honey'];
    return methods[Math.floor(Math.random() * methods.length)];
  }

  private createSpeechBubble(): void {
    // Create speech bubble background
    const bubble = new Phaser.GameObjects.Graphics(this.scene);
    bubble.fillStyle(0xffffff, 0.9);
    bubble.lineStyle(2, 0x333333);
    bubble.fillRoundedRect(-60, -30, 120, 50, 10);
    bubble.strokeRoundedRect(-60, -30, 120, 50, 10);
    
    // Speech bubble tail
    bubble.fillTriangle(-10, 20, 0, 35, 10, 20);
    bubble.strokeTriangle(-10, 20, 0, 35, 10, 20);
    
    this.speechBubble.add(bubble);
    
    // Initial speech text
    this.updateSpeechBubble();
  }

  private updateSpeechBubble(): void {
    // Remove existing text
    this.speechBubble.list.forEach(child => {
      if (child instanceof Phaser.GameObjects.Text) {
        child.destroy();
      }
    });
    
    let speechText = '';
    
    if (this.currentOrder) {
      if (this.patience > 70) {
        speechText = this.getOrderSpeech();
      } else if (this.patience > 30) {
        speechText = this.getImpatientSpeech();
      } else {
        speechText = this.getAngrySpeech();
      }
    } else {
      speechText = this.getGreetingSpeech();
    }
    
    const text = new Phaser.GameObjects.Text(
      this.scene, 0, -10, speechText,
      {
        fontSize: '10px',
        color: '#333333',
        align: 'center',
        wordWrap: { width: 100 }
      }
    );
    text.setOrigin(0.5);
    this.speechBubble.add(text);
  }

  private getOrderSpeech(): string {
    const speeches = [
      "I'd like my usual!",
      "One coffee, please",
      "Make it a good one!",
      "I'm in the mood for something special",
      "Surprise me with your best!"
    ];
    return speeches[Math.floor(Math.random() * speeches.length)];
  }

  private getImpatientSpeech(): string {
    return "How much longer?";
  }

  private getAngrySpeech(): string {
    return "This is taking forever!";
  }

  private getGreetingSpeech(): string {
    return "Hello there!";
  }

  private updateStatusBars(): void {
    this.satisfactionBar.clear();
    this.patienceBar.clear();
    
    // Satisfaction bar
    const satColor = this.satisfaction > 70 ? 0x00ff00 : 
                     this.satisfaction > 40 ? 0xffff00 : 0xff0000;
    this.satisfactionBar.fillStyle(satColor);
    this.satisfactionBar.fillRect(-30, 75, (this.satisfaction / 100) * 60, 4);
    this.satisfactionBar.lineStyle(1, 0x333333);
    this.satisfactionBar.strokeRect(-30, 75, 60, 4);
    
    // Patience bar
    this.patienceBar.fillStyle(0x0066ff);
    this.patienceBar.fillRect(-30, 82, (this.patience / 100) * 60, 4);
    this.patienceBar.lineStyle(1, 0x333333);
    this.patienceBar.strokeRect(-30, 82, 60, 4);
  }

  private onCustomerClick(): void {
    this.scene.events.emit('customerClicked', this);
    
    // Visual feedback
    this.scene.tweens.add({
      targets: this.avatar,
      scaleX: 0.9,
      scaleY: 0.9,
      duration: 100,
      yoyo: true,
      ease: 'Power2'
    });
  }

  private showCustomerInfo(): void {
    // Show detailed customer information on hover
    this.scene.events.emit('showCustomerInfo', this);
  }

  private hideCustomerInfo(): void {
    this.scene.events.emit('hideCustomerInfo');
  }

  public update(_time: number, delta: number): void {
    if (this.isWaitingForOrder) {
      this.updatePatience(delta);
    }
    this.updateStatusBars();
  }

  private updatePatience(delta: number): void {
    const deltaSeconds = delta / 1000;
    this.patience = Math.max(0, this.patience - (this.patienceDecayRate * deltaSeconds));
    
    // Update speech bubble based on patience
    if (this.patience <= 30 && this.patience > 0) {
      this.updateSpeechBubble();
    }
    
    // Customer leaves if patience reaches 0
    if (this.patience <= 0) {
      this.leaveAngry();
    }
  }

  public serveOrder(coffeeQuality: CoffeeQualityScore): void {
    if (!this.currentOrder) return;
    
    this.isWaitingForOrder = false;
    
    // Evaluate the served coffee
    const satisfaction = this.evaluateCoffee(coffeeQuality);
    this.satisfaction = satisfaction;
    
    // Update loyalty based on satisfaction
    if (satisfaction > 80) {
      this.loyaltyLevel = Math.min(100, this.loyaltyLevel + 10);
    } else if (satisfaction < 50) {
      this.loyaltyLevel = Math.max(0, this.loyaltyLevel - 5);
    }
    
    // Mark order as completed
    this.currentOrder.status = 'completed';
    
    // Give feedback
    this.giveFeedback(satisfaction);
    
    // Leave after feedback
    this.scene.time.delayedCall(3000, () => {
      this.leave();
    });
  }

  private evaluateCoffee(quality: CoffeeQualityScore): number {
    // Customer evaluates coffee based on their preferences
    let score = quality.overall * 10; // Convert 0-10 to 0-100
    
    // Adjust based on customer type
    switch (this.profile.type) {
      case 'purist':
        // Very sensitive to quality
        score *= 1.2;
        break;
      case 'casual':
        // More forgiving
        score = Math.max(score, 60);
        break;
      case 'professional':
        // Focus on consistency
        score += (quality.balance - 5) * 5;
        break;
    }
    
    // Time penalty if served late
    const waitTime = Date.now() - this.orderStartTime;
    const maxWaitTime = this.getOrderDeadline();
    if (waitTime > maxWaitTime) {
      const latePenalty = ((waitTime - maxWaitTime) / maxWaitTime) * 20;
      score -= latePenalty;
    }
    
    return Math.max(0, Math.min(100, score));
  }

  private giveFeedback(satisfaction: number): void {
    let feedbackText = '';
    
    if (satisfaction > 85) {
      feedbackText = "Excellent! This is amazing!";
    } else if (satisfaction > 70) {
      feedbackText = "Pretty good, thanks!";
    } else if (satisfaction > 50) {
      feedbackText = "It's okay, I guess...";
    } else {
      feedbackText = "This is not what I expected.";
    }
    
    // Update speech bubble with feedback
    this.speechBubble.list.forEach(child => {
      if (child instanceof Phaser.GameObjects.Text) {
        child.setText(feedbackText);
      }
    });
    
    console.log(`${this.profile.name} feedback (${satisfaction}%): ${feedbackText}`);
  }

  private leaveAngry(): void {
    this.satisfaction = 0;
    this.loyaltyLevel = Math.max(0, this.loyaltyLevel - 20);
    
    // Angry feedback
    this.speechBubble.list.forEach(child => {
      if (child instanceof Phaser.GameObjects.Text) {
        child.setText("I'm never coming back!");
      }
    });
    
    this.scene.time.delayedCall(2000, () => {
      this.leave();
    });
    
    console.log(`${this.profile.name} left angry!`);
  }

  private leave(): void {
    // Customer leaves the shop
    this.scene.tweens.add({
      targets: this,
      alpha: 0,
      duration: 1000,
      onComplete: () => {
        this.scene.events.emit('customerLeft', this);
        this.destroy();
      }
    });
  }

  // Getters for customer status
  public getCurrentOrder(): Order | null {
    return this.currentOrder;
  }

  public getSatisfaction(): number {
    return this.satisfaction;
  }

  public getPatience(): number {
    return this.patience;
  }

  public getLoyalty(): number {
    return this.loyaltyLevel;
  }

  public isWaiting(): boolean {
    return this.isWaitingForOrder;
  }

  public getProfile(): CustomerProfile {
    return this.profile;
  }

  // Clean up when destroying
  public destroy(): void {
    this.removeAllListeners();
    super.destroy();
  }
}
