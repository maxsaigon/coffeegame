/**
 * Tutorial Scene
 * Interactive tutorial for teaching coffee roasting fundamentals
 */

import Phaser from 'phaser';
import { TutorialManager } from '../components/TutorialManager';
import { CoffeeBean } from '../components/CoffeeBean';
import { RoastingDrum } from '../components/RoastingDrum';
import { SceneKeys } from '../types/GameTypes';
import type { CoffeeBeanVariety } from '../types/GameTypes';

export class TutorialScene extends Phaser.Scene {
  private tutorialManager!: TutorialManager;
  private roastingDrum!: RoastingDrum;
  private tutorialBeans: CoffeeBean[] = [];
  private ui!: Phaser.GameObjects.Container;
  private overlayGraphics!: Phaser.GameObjects.Graphics;
  private currentStep: number = 0;
  
  // Tutorial state
  private canSkip: boolean = true;
  private playerExperience: string = 'beginner'; // beginner, intermediate, experienced
  
  constructor() {
    super({ key: SceneKeys.TUTORIAL });
    console.log('TutorialScene constructor called');
  }

  create(): void {
    console.log('TutorialScene create started');
    
    this.createBackground();
    this.createTutorialEnvironment();
    this.createUI();
    this.setupTutorialManager();
    this.startTutorial();
    
    // Add skip option
    this.createSkipButton();
    
    console.log('TutorialScene created successfully');
  }

  private createBackground(): void {
    // Create coffee shop background
    this.add.rectangle(
      this.cameras.main.centerX,
      this.cameras.main.centerY,
      this.cameras.main.width,
      this.cameras.main.height,
      0x8B4513
    );
    
    // Add simple textures for tutorial environment
    const counter = this.add.rectangle(400, 500, 600, 100, 0x654321);
    counter.setStrokeStyle(2, 0x333333);
    
    // Add tutorial workspace
    const workspace = this.add.rectangle(400, 350, 500, 200, 0x8B7355);
    workspace.setStrokeStyle(2, 0x555555);
    
    // Tutorial title
    this.add.text(400, 50, 'Coffee Roasting Tutorial', {
      fontSize: '32px',
      color: '#ffffff',
      fontFamily: 'Arial',
      fontStyle: 'bold'
    }).setOrigin(0.5);
  }

  private createTutorialEnvironment(): void {
    // Create a simple roasting drum for tutorial
    this.roastingDrum = new RoastingDrum(this, 400, 350);
    
    // Create tutorial beans with a common variety
    const colombianBean: CoffeeBeanVariety = {
      id: 'colombia-tutorial',
      name: 'Colombian Supremo',
      origin: 'Colombia',
      characteristics: {
        size: 'medium',
        density: 'medium',
        processingMethod: 'washed',
        altitude: 1500
      },
      flavorProfile: {
        acidity: 6,
        body: 7,
        sweetness: 6,
        notes: ['chocolate', 'caramel', 'nutty']
      },
      price: 8.50,
      rarity: 'common'
    };
    
    // Create beans for tutorial
    for (let i = 0; i < 5; i++) {
      const bean = new CoffeeBean(this, 300 + (i * 20), 450, colombianBean);
      this.tutorialBeans.push(bean);
    }
  }

  private createUI(): void {
    this.ui = this.add.container(0, 0);
    
    // Create overlay for highlighting elements
    this.overlayGraphics = this.add.graphics();
    this.overlayGraphics.setDepth(100);
    
    // Tutorial progress indicator
    const progressBg = this.add.rectangle(400, 600, 300, 30, 0x333333, 0.8);
    progressBg.setStrokeStyle(2, 0xffffff);
    this.ui.add(progressBg);
    
    const progressText = this.add.text(400, 600, 'Tutorial Progress: 0/8', {
      fontSize: '16px',
      color: '#ffffff',
      fontFamily: 'Arial'
    }).setOrigin(0.5);
    this.ui.add(progressText);
  }

  private setupTutorialManager(): void {
    this.tutorialManager = new TutorialManager(this);
    
    // Listen for tutorial events
    this.tutorialManager.on('stepComplete', (stepData: any) => {
      this.onTutorialStepComplete(stepData);
    });
    
    this.tutorialManager.on('tutorialComplete', () => {
      this.onTutorialComplete();
    });
    
    this.tutorialManager.on('highlight', (element: any, message: string) => {
      this.highlightElement(element, message);
    });
  }

  private startTutorial(): void {
    // Ask player about their experience level
    this.showExperienceSelector();
  }

  private showExperienceSelector(): void {
    const modal = this.add.container(400, 300);
    
    const bg = this.add.rectangle(0, 0, 400, 250, 0x000000, 0.9);
    bg.setStrokeStyle(2, 0xffffff);
    modal.add(bg);
    
    const title = this.add.text(0, -80, 'Welcome to Coffee Roasting!', {
      fontSize: '20px',
      color: '#ffffff',
      fontFamily: 'Arial',
      fontStyle: 'bold'
    }).setOrigin(0.5);
    modal.add(title);
    
    const subtitle = this.add.text(0, -50, 'What\'s your coffee experience level?', {
      fontSize: '16px',
      color: '#cccccc',
      fontFamily: 'Arial'
    }).setOrigin(0.5);
    modal.add(subtitle);
    
    // Experience level buttons
    const beginnerBtn = this.createExperienceButton(0, -10, 'Beginner', 'beginner');
    const intermediateBtn = this.createExperienceButton(0, 20, 'Some Experience', 'intermediate');
    const experiencedBtn = this.createExperienceButton(0, 50, 'I\'m a Pro', 'experienced');
    
    modal.add([beginnerBtn, intermediateBtn, experiencedBtn]);
    
    // Store modal reference for cleanup
    this.ui.add(modal);
  }

  private createExperienceButton(x: number, y: number, text: string, level: string): Phaser.GameObjects.Container {
    const button = this.add.container(x, y);
    
    const bg = this.add.rectangle(0, 0, 150, 25, 0x4CAF50);
    bg.setInteractive();
    bg.setStrokeStyle(1, 0xffffff);
    
    const buttonText = this.add.text(0, 0, text, {
      fontSize: '14px',
      color: '#ffffff',
      fontFamily: 'Arial'
    }).setOrigin(0.5);
    
    button.add([bg, buttonText]);
    
    // Button interactions
    bg.on('pointerover', () => {
      bg.setFillStyle(0x66BB6A);
    });
    
    bg.on('pointerout', () => {
      bg.setFillStyle(0x4CAF50);
    });
    
    bg.on('pointerdown', () => {
      this.playerExperience = level;
      this.startTutorialSteps();
      // Remove modal
      this.ui.removeAll(true);
      this.createUI(); // Recreate base UI
    });
    
    return button;
  }

  private startTutorialSteps(): void {
    // Adjust tutorial based on experience level
    let steps = this.tutorialManager.getTutorialSteps(this.playerExperience);
    this.tutorialManager.startTutorial(steps);
  }

  private onTutorialStepComplete(stepData: any): void {
    this.currentStep++;
    this.updateProgressIndicator();
    
    // Add small delay before next step
    this.time.delayedCall(1000, () => {
      this.clearHighlight();
    });
    
    console.log(`Tutorial step ${this.currentStep} completed:`, stepData);
  }

  private onTutorialComplete(): void {
    // Tutorial completed successfully
    this.showCompletionScreen();
  }

  private showCompletionScreen(): void {
    const modal = this.add.container(400, 300);
    
    const bg = this.add.rectangle(0, 0, 500, 300, 0x000000, 0.9);
    bg.setStrokeStyle(2, 0x4CAF50);
    modal.add(bg);
    
    const title = this.add.text(0, -80, 'Tutorial Complete!', {
      fontSize: '28px',
      color: '#4CAF50',
      fontFamily: 'Arial',
      fontStyle: 'bold'
    }).setOrigin(0.5);
    modal.add(title);
    
    const message = this.add.text(0, -30, 
      'Congratulations! You\'ve learned the basics of coffee roasting.\n' +
      'Remember: practice makes perfect. Each bean variety\n' +
      'has unique characteristics to discover.', {
      fontSize: '16px',
      color: '#ffffff',
      fontFamily: 'Arial',
      align: 'center',
      wordWrap: { width: 450 }
    }).setOrigin(0.5);
    modal.add(message);
    
    // Buttons
    const playBtn = this.createButton(0, 50, 'Start Playing!', 0x4CAF50, () => {
      this.startMainGame();
    });
    
    const replayBtn = this.createButton(0, 85, 'Replay Tutorial', 0x2196F3, () => {
      this.restartTutorial();
    });
    
    modal.add([playBtn, replayBtn]);
    this.ui.add(modal);
  }

  private createButton(x: number, y: number, text: string, color: number, callback: () => void): Phaser.GameObjects.Container {
    const button = this.add.container(x, y);
    
    const bg = this.add.rectangle(0, 0, 180, 30, color);
    bg.setInteractive();
    bg.setStrokeStyle(1, 0xffffff);
    
    const buttonText = this.add.text(0, 0, text, {
      fontSize: '16px',
      color: '#ffffff',
      fontFamily: 'Arial'
    }).setOrigin(0.5);
    
    button.add([bg, buttonText]);
    
    // Button interactions
    bg.on('pointerover', () => {
      bg.setScale(1.05);
    });
    
    bg.on('pointerout', () => {
      bg.setScale(1);
    });
    
    bg.on('pointerdown', () => {
      callback();
    });
    
    return button;
  }

  private createSkipButton(): void {
    if (!this.canSkip) return;
    
    const skipBtn = this.add.text(750, 50, 'Skip Tutorial', {
      fontSize: '16px',
      color: '#ffffff',
      backgroundColor: '#666666',
      padding: { x: 10, y: 5 }
    });
    
    skipBtn.setInteractive();
    
    skipBtn.on('pointerover', () => {
      skipBtn.setStyle({ backgroundColor: '#888888' });
    });
    
    skipBtn.on('pointerout', () => {
      skipBtn.setStyle({ backgroundColor: '#666666' });
    });
    
    skipBtn.on('pointerdown', () => {
      this.showSkipConfirmation();
    });
  }

  private showSkipConfirmation(): void {
    const modal = this.add.container(400, 300);
    
    const bg = this.add.rectangle(0, 0, 350, 150, 0x000000, 0.9);
    bg.setStrokeStyle(2, 0xffffff);
    modal.add(bg);
    
    const title = this.add.text(0, -40, 'Skip Tutorial?', {
      fontSize: '20px',
      color: '#ffffff',
      fontFamily: 'Arial'
    }).setOrigin(0.5);
    modal.add(title);
    
    const message = this.add.text(0, -10, 'Are you sure you want to skip the tutorial?', {
      fontSize: '14px',
      color: '#cccccc',
      fontFamily: 'Arial'
    }).setOrigin(0.5);
    modal.add(message);
    
    const yesBtn = this.createButton(-60, 30, 'Yes, Skip', 0xf44336, () => {
      this.startMainGame();
    });
    
    const noBtn = this.createButton(60, 30, 'No, Continue', 0x4CAF50, () => {
      modal.destroy();
    });
    
    modal.add([yesBtn, noBtn]);
    this.ui.add(modal);
  }

  private highlightElement(element: any, message: string): void {
    this.overlayGraphics.clear();
    
    if (element && element.x !== undefined && element.y !== undefined) {
      // Create highlight circle around element
      this.overlayGraphics.lineStyle(4, 0xffff00, 0.8);
      this.overlayGraphics.strokeCircle(element.x, element.y, 60);
      
      // Add pulsing effect
      this.tweens.add({
        targets: this.overlayGraphics,
        alpha: 0.3,
        duration: 800,
        yoyo: true,
        repeat: -1
      });
      
      // Show message
      this.showTutorialMessage(message, element.x, element.y - 100);
    }
  }

  private showTutorialMessage(message: string, x: number, y: number): void {
    // Remove existing message
    const existingMessage = this.ui.getByName('tutorialMessage');
    if (existingMessage) {
      existingMessage.destroy();
    }
    
    const messageBg = this.add.rectangle(x, y, 250, 60, 0x000000, 0.9);
    messageBg.setStrokeStyle(2, 0x4CAF50);
    messageBg.setName('tutorialMessage');
    
    const messageText = this.add.text(x, y, message, {
      fontSize: '14px',
      color: '#ffffff',
      fontFamily: 'Arial',
      align: 'center',
      wordWrap: { width: 230 }
    }).setOrigin(0.5);
    messageText.setName('tutorialMessageText');
    
    this.ui.add([messageBg, messageText]);
  }

  private clearHighlight(): void {
    this.overlayGraphics.clear();
    
    // Remove tutorial message
    const message = this.ui.getByName('tutorialMessage');
    const messageText = this.ui.getByName('tutorialMessageText');
    
    if (message) message.destroy();
    if (messageText) messageText.destroy();
  }

  private updateProgressIndicator(): void {
    const progressText = this.ui.getByName('progressText') as Phaser.GameObjects.Text;
    if (progressText) {
      const totalSteps = this.tutorialManager.getTotalSteps();
      progressText.setText(`Tutorial Progress: ${this.currentStep}/${totalSteps}`);
    }
  }

  private startMainGame(): void {
    // Mark tutorial as complete in game state
    // This would typically save to the game state manager
    console.log('Starting main game after tutorial');
    this.scene.start('GameScene');
  }

  private restartTutorial(): void {
    this.currentStep = 0;
    this.ui.removeAll(true);
    this.overlayGraphics.clear();
    
    // Restart the scene
    this.scene.restart();
  }

  update(): void {
    // Update roasting drum
    this.roastingDrum?.update(0, this.game.loop.delta);
    
    // Update beans
    this.tutorialBeans.forEach(bean => {
      bean.update(0, this.game.loop.delta);
    });
    
    // Update tutorial manager
    this.tutorialManager?.update();
  }

  // Public methods for tutorial manager to interact with scene
  public getRoastingDrum(): RoastingDrum {
    return this.roastingDrum;
  }

  public getTutorialBeans(): CoffeeBean[] {
    return this.tutorialBeans;
  }

  public showMessage(message: string, duration: number = 3000): void {
    const messageText = this.add.text(400, 150, message, {
      fontSize: '18px',
      color: '#4CAF50',
      fontFamily: 'Arial',
      backgroundColor: '#000000',
      padding: { x: 15, y: 8 }
    }).setOrigin(0.5);
    
    // Auto-remove after duration
    this.time.delayedCall(duration, () => {
      messageText.destroy();
    });
  }

  destroy(): void {
    this.tutorialManager?.destroy();
  }
}
