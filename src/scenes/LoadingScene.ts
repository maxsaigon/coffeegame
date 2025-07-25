/**
 * Loading Scene
 * Asset preloading and initialization
 */

import Phaser from 'phaser';
import { SceneKeys } from '../types/GameTypes';

export class LoadingScene extends Phaser.Scene {
  private loadingBar!: Phaser.GameObjects.Graphics;
  private loadingText!: Phaser.GameObjects.Text;
  private progressText!: Phaser.GameObjects.Text;
  private spinner!: Phaser.GameObjects.Image;
  
  private totalAssets: number = 0;
  private loadedAssets: number = 0;

  constructor() {
    super({ key: SceneKeys.BOOT });
    console.log('LoadingScene constructor called');
  }

  preload() {
    console.log('LoadingScene preload started');
    
    // Create loading UI first
    this.createLoadingUI();
    
    // Setup loading event listeners
    this.setupLoadingListeners();
    
    // Load all game assets
    this.loadGameAssets();
    
    console.log('LoadingScene preload completed');
  }

  create() {
    console.log('LoadingScene create started');
    
    // Small delay to show completed loading
    this.time.delayedCall(500, () => {
      this.startMainMenu();
    });
  }

  private createLoadingUI() {
    const centerX = this.scale.width / 2;
    const centerY = this.scale.height / 2;
    
    // Background
    this.add.rectangle(centerX, centerY, this.scale.width, this.scale.height, 0x2c1810);
    
    // Coffee-themed loading screen
    this.add.text(centerX, centerY - 150, '☕ Coffee Roaster', {
      fontSize: '48px',
      color: '#d4af37',
      fontFamily: 'serif'
    }).setOrigin(0.5);
    
    // Loading text
    this.loadingText = this.add.text(centerX, centerY - 50, 'Grinding coffee beans...', {
      fontSize: '24px',
      color: '#ffffff'
    }).setOrigin(0.5);
    
    // Progress bar background
    const progressBarBg = this.add.rectangle(centerX, centerY, 400, 20, 0x555555);
    progressBarBg.setStrokeStyle(2, 0xffffff);
    
    // Progress bar fill
    this.loadingBar = this.add.graphics();
    
    // Progress percentage
    this.progressText = this.add.text(centerX, centerY + 40, '0%', {
      fontSize: '18px',
      color: '#ffffff'
    }).setOrigin(0.5);
    
    // Simple text spinner instead of image (since image isn't loaded yet)
    this.add.text(centerX, centerY + 100, '☕', {
      fontSize: '32px',
      color: '#d4af37'
    }).setOrigin(0.5);
  }

  private setupLoadingListeners() {
    // Track loading progress
    this.load.on('progress', (progress: number) => {
      this.updateProgress(progress);
    });
    
    this.load.on('fileprogress', (file: Phaser.Loader.File) => {
      this.updateLoadingText(file.key);
    });
    
    this.load.on('complete', () => {
      this.onLoadComplete();
    });
  }

  private loadGameAssets() {
    // Images (using SVG placeholders for now)
    this.load.image('coffee-bean', 'assets/images/coffee-bean.svg');
    this.load.image('roasting-drum', 'assets/images/roasting-drum.svg');
    this.load.image('customer-sprite', 'assets/images/customer.svg');
    this.load.image('background', 'assets/images/coffee-shop-bg.svg');
    this.load.image('menu-background', 'assets/images/coffee-menu-bg.svg');
    this.load.image('logo', 'assets/images/coffee-roaster-logo.svg');
    this.load.image('loading-spinner', 'assets/images/loading-spinner.svg');
    
    // Audio files (temporarily disabled for testing)
    // this.load.audio('background-music', 'assets/audio/coffee-shop-ambient.mp3');
    // this.load.audio('menu-music', 'assets/audio/menu-theme.mp3');
    // this.load.audio('roasting-sound', 'assets/audio/roasting.mp3');
    // this.load.audio('customer-arrive', 'assets/audio/bell.mp3');
    // this.load.audio('button-click', 'assets/audio/button-click.wav');
    // this.load.audio('button-hover', 'assets/audio/button-hover.wav');
    
    // Sprite sheets (temporarily disabled)
    // this.load.spritesheet('coffee-beans-sheet', 'assets/images/coffee-beans-spritesheet.png', {
    //   frameWidth: 32,
    //   frameHeight: 32
    // });
    
    // this.load.spritesheet('customer-animations', 'assets/images/customer-spritesheet.png', {
    //   frameWidth: 64,
    //   frameHeight: 96
    // });
    
    // UI assets (temporarily disabled)
    // this.load.image('button-normal', 'assets/ui/button-normal.png');
    // this.load.image('button-hover', 'assets/ui/button-hover.png');
    // this.load.image('button-pressed', 'assets/ui/button-pressed.png');
    // this.load.image('panel-bg', 'assets/ui/panel-background.png');
    
    // Coffee data (JSON files) (temporarily disabled)
    // this.load.json('coffee-varieties', 'assets/data/coffee-varieties.json');
    // this.load.json('roasting-profiles', 'assets/data/roasting-profiles.json');
    // this.load.json('customer-data', 'assets/data/customers.json');
    
    // Fonts (temporarily disabled)
    // this.load.bitmapFont('coffee-font', 'assets/fonts/coffee-font.png', 'assets/fonts/coffee-font.xml');
    
    // Set total assets count
    this.totalAssets = this.load.list.size;
  }

  private updateProgress(progress: number) {
    // Update progress bar
    this.loadingBar.clear();
    this.loadingBar.fillStyle(0xd4af37);
    this.loadingBar.fillRect(
      this.scale.width / 2 - 200, 
      this.scale.height / 2 - 10, 
      400 * progress, 
      20
    );
    
    // Update percentage text
    this.progressText.setText(`${Math.round(progress * 100)}%`);
  }

  private updateLoadingText(assetKey: string) {
    const loadingMessages = [
      'Grinding coffee beans...',
      'Heating the roaster...',
      'Preparing equipment...',
      'Loading customer profiles...',
      'Calibrating taste sensors...',
      'Organizing inventory...',
      'Setting up the shop...',
      'Final preparations...'
    ];
    
    // Cycle through loading messages
    const messageIndex = Math.floor(Math.random() * loadingMessages.length);
    this.loadingText.setText(loadingMessages[messageIndex]);
    
    console.log(`Loaded asset: ${assetKey}`);
  }

  private onLoadComplete() {
    this.loadingText.setText('Ready to brew!');
    this.progressText.setText('100%');
    
    // Stop spinner
    this.tweens.killTweensOf(this.spinner);
    
    // Show completion effect
    this.cameras.main.flash(200, 212, 175, 55, false);
    
    console.log('All assets loaded successfully');
  }

  private startMainMenu() {
    console.log('LoadingScene: Starting main menu transition...');
    
    // Fade out and transition to main menu
    this.cameras.main.fadeOut(500, 44, 24, 16);
    
    this.cameras.main.once('camerafadeoutcomplete', () => {
      console.log('LoadingScene: Fade out complete, starting main menu scene');
      this.scene.start(SceneKeys.MAIN_MENU);
    });
  }

  // Handle loading errors
  // Utility method to get loading progress
  public getLoadingProgress(): number {
    return this.loadedAssets / this.totalAssets;
  }
}
