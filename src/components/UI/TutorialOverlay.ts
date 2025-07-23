/**
 * Tutorial Overlay UI
 * Interactive overlay for tutorial guidance and hints
 */

import Phaser from 'phaser';

export interface TutorialOverlayConfig {
  x: number;
  y: number;
  width: number;
  height: number;
  title: string;
  message: string;
  showProgress?: boolean;
  showSkip?: boolean;
  backgroundColor?: number;
  textColor?: string;
}

export class TutorialOverlay extends Phaser.GameObjects.Container {
  private config: TutorialOverlayConfig;
  private background!: Phaser.GameObjects.Graphics;
  private titleText!: Phaser.GameObjects.Text;
  private messageText!: Phaser.GameObjects.Text;
  private progressBar!: Phaser.GameObjects.Graphics;
  private skipButton!: Phaser.GameObjects.Container;
  private nextButton!: Phaser.GameObjects.Container;
  
  private currentProgress: number = 0;
  private maxProgress: number = 100;
  private isVisible: boolean = false;
  
  constructor(scene: Phaser.Scene, config: TutorialOverlayConfig) {
    super(scene, config.x, config.y);
    
    this.config = {
      backgroundColor: 0x000000,
      textColor: '#ffffff',
      showProgress: true,
      showSkip: true,
      ...config
    };
    
    this.scene.add.existing(this);
    this.createOverlay();
    this.setDepth(1000); // High depth to ensure it's on top
  }

  private createOverlay(): void {
    this.createBackground();
    this.createTitle();
    this.createMessage();
    
    if (this.config.showProgress) {
      this.createProgressBar();
    }
    
    if (this.config.showSkip) {
      this.createSkipButton();
    }
    
    this.createNextButton();
    this.setVisible(false);
  }

  private createBackground(): void {
    this.background = new Phaser.GameObjects.Graphics(this.scene);
    
    // Semi-transparent background
    this.background.fillStyle(this.config.backgroundColor || 0x000000, 0.9);
    this.background.fillRoundedRect(
      -this.config.width / 2,
      -this.config.height / 2,
      this.config.width,
      this.config.height,
      10
    );
    
    // Border
    this.background.lineStyle(2, 0x4CAF50, 1);
    this.background.strokeRoundedRect(
      -this.config.width / 2,
      -this.config.height / 2,
      this.config.width,
      this.config.height,
      10
    );
    
    this.add(this.background);
  }

  private createTitle(): void {
    this.titleText = new Phaser.GameObjects.Text(
      this.scene,
      0,
      -this.config.height / 2 + 25,
      this.config.title,
      {
        fontSize: '20px',
        color: this.config.textColor || '#ffffff',
        fontFamily: 'Arial',
        fontStyle: 'bold',
        align: 'center'
      }
    );
    this.titleText.setOrigin(0.5);
    this.add(this.titleText);
  }

  private createMessage(): void {
    this.messageText = new Phaser.GameObjects.Text(
      this.scene,
      0,
      -this.config.height / 2 + 70,
      this.config.message,
      {
        fontSize: '16px',
        color: this.config.textColor || '#ffffff',
        fontFamily: 'Arial',
        align: 'center',
        wordWrap: { width: this.config.width - 40 }
      }
    );
    this.messageText.setOrigin(0.5, 0);
    this.add(this.messageText);
  }

  private createProgressBar(): void {
    this.progressBar = new Phaser.GameObjects.Graphics(this.scene);
    this.updateProgressBar();
    this.add(this.progressBar);
  }

  private updateProgressBar(): void {
    if (!this.progressBar) return;
    
    this.progressBar.clear();
    
    const barWidth = this.config.width - 60;
    const barHeight = 8;
    const barX = -barWidth / 2;
    const barY = this.config.height / 2 - 60;
    
    // Background
    this.progressBar.fillStyle(0x333333, 1);
    this.progressBar.fillRoundedRect(barX, barY, barWidth, barHeight, 4);
    
    // Progress fill
    const progressWidth = (this.currentProgress / this.maxProgress) * barWidth;
    this.progressBar.fillStyle(0x4CAF50, 1);
    this.progressBar.fillRoundedRect(barX, barY, progressWidth, barHeight, 4);
    
    // Border
    this.progressBar.lineStyle(1, 0x666666, 1);
    this.progressBar.strokeRoundedRect(barX, barY, barWidth, barHeight, 4);
  }

  private createSkipButton(): void {
    this.skipButton = new Phaser.GameObjects.Container(this.scene, 0, 0);
    
    const buttonX = this.config.width / 2 - 60;
    const buttonY = -this.config.height / 2 + 15;
    
    const bg = new Phaser.GameObjects.Rectangle(
      this.scene, buttonX, buttonY, 80, 25, 0x666666
    );
    bg.setInteractive();
    bg.setStrokeStyle(1, 0xffffff);
    
    const text = new Phaser.GameObjects.Text(
      this.scene, buttonX, buttonY, 'Skip', {
        fontSize: '12px',
        color: '#ffffff',
        fontFamily: 'Arial'
      }
    );
    text.setOrigin(0.5);
    
    this.skipButton.add([bg, text]);
    
    // Button interactions
    bg.on('pointerover', () => {
      bg.setFillStyle(0x888888);
    });
    
    bg.on('pointerout', () => {
      bg.setFillStyle(0x666666);
    });
    
    bg.on('pointerdown', () => {
      this.emit('skip');
    });
    
    this.add(this.skipButton);
  }

  private createNextButton(): void {
    this.nextButton = new Phaser.GameObjects.Container(this.scene, 0, 0);
    
    const buttonX = 0;
    const buttonY = this.config.height / 2 - 30;
    
    const bg = new Phaser.GameObjects.Rectangle(
      this.scene, buttonX, buttonY, 100, 30, 0x4CAF50
    );
    bg.setInteractive();
    bg.setStrokeStyle(1, 0xffffff);
    
    const text = new Phaser.GameObjects.Text(
      this.scene, buttonX, buttonY, 'Next', {
        fontSize: '14px',
        color: '#ffffff',
        fontFamily: 'Arial',
        fontStyle: 'bold'
      }
    );
    text.setOrigin(0.5);
    
    this.nextButton.add([bg, text]);
    
    // Button interactions
    bg.on('pointerover', () => {
      bg.setFillStyle(0x66BB6A);
      this.nextButton.setScale(1.05);
    });
    
    bg.on('pointerout', () => {
      bg.setFillStyle(0x4CAF50);
      this.nextButton.setScale(1);
    });
    
    bg.on('pointerdown', () => {
      this.emit('next');
    });
    
    this.add(this.nextButton);
  }

  public showOverlay(title: string, message: string): void {
    this.config.title = title;
    this.config.message = message;
    
    this.titleText.setText(title);
    this.messageText.setText(message);
    
    this.setVisible(true);
    this.isVisible = true;
    
    // Animate in
    this.setAlpha(0);
    this.setScale(0.8);
    
    this.scene.tweens.add({
      targets: this,
      alpha: 1,
      scaleX: 1,
      scaleY: 1,
      duration: 300,
      ease: 'Back.easeOut'
    });
  }

  public hideOverlay(): void {
    if (!this.isVisible) return;
    
    this.scene.tweens.add({
      targets: this,
      alpha: 0,
      scaleX: 0.8,
      scaleY: 0.8,
      duration: 200,
      ease: 'Power2.easeIn',
      onComplete: () => {
        this.setVisible(false);
        this.isVisible = false;
      }
    });
  }

  public updateProgress(current: number, max: number): void {
    this.currentProgress = current;
    this.maxProgress = max;
    this.updateProgressBar();
  }

  public setNextButtonText(text: string): void {
    const nextText = this.nextButton.getAt(1) as Phaser.GameObjects.Text;
    if (nextText) {
      nextText.setText(text);
    }
  }

  public enableNextButton(): void {
    this.nextButton.setVisible(true);
    
    const bg = this.nextButton.getAt(0) as Phaser.GameObjects.Rectangle;
    if (bg) {
      bg.setFillStyle(0x4CAF50);
      bg.setInteractive();
    }
  }

  public disableNextButton(): void {
    const bg = this.nextButton.getAt(0) as Phaser.GameObjects.Rectangle;
    if (bg) {
      bg.setFillStyle(0x666666);
      bg.disableInteractive();
    }
  }

  public showSkipButton(): void {
    if (this.skipButton) {
      this.skipButton.setVisible(true);
    }
  }

  public hideSkipButton(): void {
    if (this.skipButton) {
      this.skipButton.setVisible(false);
    }
  }

  public pulse(): void {
    // Add a pulsing effect to get attention
    this.scene.tweens.add({
      targets: this,
      scaleX: 1.05,
      scaleY: 1.05,
      duration: 500,
      yoyo: true,
      repeat: 2,
      ease: 'Sine.easeInOut'
    });
  }

  public pointToElement(x: number, y: number): void {
    // Create an arrow pointing to a specific element
    const arrow = new Phaser.GameObjects.Graphics(this.scene);
    arrow.lineStyle(3, 0xffff00, 1);
    
    // Calculate arrow direction
    const dx = x - this.x;
    const dy = y - this.y;
    const angle = Math.atan2(dy, dx);
    
    // Draw arrow
    const arrowLength = 50;
    const arrowX = Math.cos(angle) * arrowLength;
    const arrowY = Math.sin(angle) * arrowLength;
    
    arrow.moveTo(0, 0);
    arrow.lineTo(arrowX, arrowY);
    
    // Arrow head
    const headSize = 10;
    arrow.lineTo(arrowX - headSize * Math.cos(angle - 0.3), arrowY - headSize * Math.sin(angle - 0.3));
    arrow.moveTo(arrowX, arrowY);
    arrow.lineTo(arrowX - headSize * Math.cos(angle + 0.3), arrowY - headSize * Math.sin(angle + 0.3));
    
    this.add(arrow);
    
    // Animate arrow
    arrow.setAlpha(0);
    this.scene.tweens.add({
      targets: arrow,
      alpha: 1,
      duration: 300,
      yoyo: true,
      repeat: 3,
      onComplete: () => {
        arrow.destroy();
      }
    });
  }

  public isOverlayVisible(): boolean {
    return this.isVisible;
  }

  // Utility method to create quick tutorial hints
  public static createHint(scene: Phaser.Scene, x: number, y: number, message: string, duration: number = 3000): TutorialOverlay {
    const hint = new TutorialOverlay(scene, {
      x: x,
      y: y,
      width: 200,
      height: 80,
      title: 'Hint',
      message: message,
      showProgress: false,
      showSkip: false
    });
    
    hint.showOverlay('Hint', message);
    
    // Auto-hide after duration
    scene.time.delayedCall(duration, () => {
      hint.hideOverlay();
      scene.time.delayedCall(300, () => {
        hint.destroy();
      });
    });
    
    return hint;
  }

  public destroy(): void {
    this.removeAllListeners();
    super.destroy();
  }
}
