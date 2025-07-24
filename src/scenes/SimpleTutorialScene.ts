/**
 * Simplified Tutorial Scene for Testing
 */

import Phaser from 'phaser';
import { SceneKeys } from '../types/GameTypes';

export class SimpleTutorialScene extends Phaser.Scene {
  constructor() {
    super({ key: SceneKeys.TUTORIAL });
    console.log('SimpleTutorialScene constructor called');
  }

  create() {
    console.log('SimpleTutorialScene create started');
    
    // Background
    this.add.rectangle(this.scale.width / 2, this.scale.height / 2, this.scale.width, this.scale.height, 0x654321);
    
    // Title
    this.add.text(this.scale.width / 2, 100, 'Coffee Roasting Tutorial', {
      fontSize: '48px',
      color: '#ffffff'
    }).setOrigin(0.5);
    
    // Instructions
    this.add.text(this.scale.width / 2, 200, 'Welcome to the Coffee Roaster!\nThis is a simplified tutorial scene.', {
      fontSize: '24px',
      color: '#ffffff',
      align: 'center'
    }).setOrigin(0.5);
    
    // Skip button
    const skipButton = this.add.text(this.scale.width / 2, 400, 'Skip Tutorial → Go to Game', {
      fontSize: '32px',
      color: '#ffffff',
      backgroundColor: '#8B4513',
      padding: { x: 20, y: 10 }
    }).setOrigin(0.5);
    
    skipButton.setInteractive({ useHandCursor: true });
    
    skipButton.on('pointerover', () => {
      skipButton.setStyle({ backgroundColor: '#d4af37' });
    });
    
    skipButton.on('pointerout', () => {
      skipButton.setStyle({ backgroundColor: '#8B4513' });
    });
    
    skipButton.on('pointerdown', () => {
      console.log('Skip tutorial - going to game scene');
      this.scene.start(SceneKeys.ROASTING_LAB);
    });
    
    // Back to menu button
    const backButton = this.add.text(this.scale.width / 2, 500, 'Back to Menu', {
      fontSize: '24px',
      color: '#ffffff',
      backgroundColor: '#555555',
      padding: { x: 15, y: 8 }
    }).setOrigin(0.5);
    
    backButton.setInteractive({ useHandCursor: true });
    
    backButton.on('pointerover', () => {
      backButton.setStyle({ backgroundColor: '#777777' });
    });
    
    backButton.on('pointerout', () => {
      backButton.setStyle({ backgroundColor: '#555555' });
    });
    
    backButton.on('pointerdown', () => {
      console.log('Back to menu');
      this.scene.start(SceneKeys.MAIN_MENU);
    });
    
    console.log('SimpleTutorialScene created successfully');
  }
}
