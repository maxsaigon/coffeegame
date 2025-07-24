/**
 * Simplified Menu Scene for Testing
 * Direct button implementation without MainMenu component
 */

import Phaser from 'phaser';
import { AudioManager } from '../managers/AudioManager';
import { SceneKeys } from '../types/GameTypes';

export class SimpleMenuScene extends Phaser.Scene {
  // private audioManager!: AudioManager; // Commented out to avoid unused variable warnings

  constructor() {
    super({ key: SceneKeys.MAIN_MENU });
    console.log('SimpleMenuScene constructor called');
  }

  create() {
    console.log('SimpleMenuScene create started');
    
    // Create background
    this.add.rectangle(this.scale.width / 2, this.scale.height / 2, this.scale.width, this.scale.height, 0x2c1810);
    
    // Initialize audio manager
    // this.audioManager = new AudioManager(this); // Commented out to avoid unused variable warnings
    new AudioManager(this); // Initialize but don't store reference
    
    // Title
    this.add.text(this.scale.width / 2, this.scale.height * 0.2, 'Coffee Roaster Tycoon', {
      fontSize: '48px',
      color: '#ffffff',
      fontFamily: 'Arial'
    }).setOrigin(0.5);
    
    // Start Game Button
    const startButton = this.add.text(this.scale.width / 2, this.scale.height * 0.5, 'Start Game', {
      fontSize: '32px',
      color: '#ffffff',
      fontFamily: 'Arial',
      backgroundColor: '#8B4513',
      padding: { x: 20, y: 10 }
    }).setOrigin(0.5);
    
    startButton.setInteractive({ useHandCursor: true });
    
    startButton.on('pointerover', () => {
      startButton.setStyle({ backgroundColor: '#d4af37' });
      console.log('Start Game button hover');
    });
    
    startButton.on('pointerout', () => {
      startButton.setStyle({ backgroundColor: '#8B4513' });
    });
    
    startButton.on('pointerdown', () => {
      console.log('Start Game clicked - transitioning to tutorial');
      startButton.setStyle({ backgroundColor: '#555555' });
      this.startTutorial();
    });
    
    startButton.on('pointerup', () => {
      startButton.setStyle({ backgroundColor: '#d4af37' });
    });
    
    // Coffee Market Button
    const marketButton = this.add.text(this.scale.width / 2, this.scale.height * 0.5, '☕ Coffee Market', {
      fontSize: '32px',
      color: '#ffffff',
      fontFamily: 'Arial',
      backgroundColor: '#6B4423',
      padding: { x: 20, y: 10 }
    }).setOrigin(0.5);
    
    marketButton.setInteractive({ useHandCursor: true });
    
    marketButton.on('pointerover', () => {
      marketButton.setStyle({ backgroundColor: '#d4af37' });
      console.log('Coffee Market button hover');
    });
    
    marketButton.on('pointerout', () => {
      marketButton.setStyle({ backgroundColor: '#6B4423' });
    });
    
    marketButton.on('pointerdown', () => {
      console.log('Coffee Market clicked - going to coffee market scene');
      marketButton.setStyle({ backgroundColor: '#555555' });
      this.goToCoffeeMarket();
    });
    
    marketButton.on('pointerup', () => {
      marketButton.setStyle({ backgroundColor: '#d4af37' });
    });
    
    // Options Button - now renamed to "Roasting Lab"
    const optionsButton = this.add.text(this.scale.width / 2, this.scale.height * 0.6, '🔥 Roasting Lab', {
      fontSize: '32px',
      color: '#ffffff',
      fontFamily: 'Arial',
      backgroundColor: '#8B4513',
      padding: { x: 20, y: 10 }
    }).setOrigin(0.5);
    
    optionsButton.setInteractive({ useHandCursor: true });
    
    optionsButton.on('pointerover', () => {
      optionsButton.setStyle({ backgroundColor: '#d4af37' });
      console.log('Roasting Lab button hover');
    });
    
    optionsButton.on('pointerout', () => {
      optionsButton.setStyle({ backgroundColor: '#8B4513' });
    });
    
    optionsButton.on('pointerdown', () => {
      console.log('Roasting Lab clicked - going to roasting lab scene');
      optionsButton.setStyle({ backgroundColor: '#555555' });
      this.startGame();
    });
    
    optionsButton.on('pointerup', () => {
      optionsButton.setStyle({ backgroundColor: '#d4af37' });
    });
    
    // Add version info
    const versionText = this.add.text(10, this.scale.height - 30, 'Coffee Roaster v1.0.0', {
      fontSize: '16px',
      color: '#ffffff'
    });
    versionText.setAlpha(0.7);
    
    console.log('SimpleMenuScene initialized successfully');
  }

  private startTutorial() {
    console.log('Starting tutorial scene...');
    this.scene.start(SceneKeys.TUTORIAL);
  }

  private startGame() {
    console.log('Starting game scene...');
    this.scene.start(SceneKeys.ROASTING_LAB);
  }

  private goToCoffeeMarket() {
    console.log('Going to coffee market scene...');
    this.scene.start(SceneKeys.COFFEE_MARKET);
  }
}
