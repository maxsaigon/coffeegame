/**
 * Main Menu Scene
 * Game startup and navigation
 */

import Phaser from 'phaser';
import { MainMenu } from '../components/UI/MainMenu';
import { AudioManager } from '../managers/AudioManager';
import { SceneKeys } from '../types/GameTypes';

export class MenuScene extends Phaser.Scene {
  private mainMenu!: MainMenu;
  private audioManager!: AudioManager;

  constructor() {
    super({ key: SceneKeys.MAIN_MENU });
  }

  preload() {
    // Load menu assets
    this.load.image('menu-background', 'assets/images/coffee-menu-bg.jpg');
    this.load.image('logo', 'assets/images/coffee-roaster-logo.png');
    
    // Load menu audio
    this.load.audio('menu-music', 'assets/audio/menu-theme.mp3');
    this.load.audio('button-click', 'assets/audio/button-click.wav');
    this.load.audio('button-hover', 'assets/audio/button-hover.wav');
    
    // Load loading screen assets for next scene
    this.load.image('loading-bg', 'assets/images/loading-background.jpg');
    this.load.image('loading-spinner', 'assets/images/coffee-bean-spinner.png');
  }

  create() {
    // Create background
    const background = this.add.image(this.scale.width / 2, this.scale.height / 2, 'menu-background');
    background.setDisplaySize(this.scale.width, this.scale.height);
    
    // Initialize audio manager
    this.audioManager = new AudioManager(this);
    
    // Create main menu UI
    this.mainMenu = new MainMenu(this, 0, 0);
    
    // Setup menu interactions
    this.setupMenuInteractions();
    
    // Start background music
    this.audioManager.playMusic('menu-music', { loop: true, volume: 0.4 });
    
    // Add version info
    const versionText = this.add.text(10, this.scale.height - 30, 'Coffee Roaster v1.0.0', {
      fontSize: '16px',
      color: '#ffffff'
    });
    versionText.setAlpha(0.7);
    
    console.log('MenuScene initialized successfully');
  }

  private setupMenuInteractions() {
    // Start Game button
    this.input.on('startGame', () => {
      this.playButtonSound();
      this.startGame();
    });
    
    // Tutorial button
    this.input.on('startTutorial', () => {
      this.playButtonSound();
      this.startTutorial();
    });
    
    // Settings button
    this.input.on('openSettings', () => {
      this.playButtonSound();
      this.openSettings();
    });
    
    // Quit button (for desktop apps)
    this.input.on('quitGame', () => {
      this.playButtonSound();
      this.quitGame();
    });
    
    // Keyboard shortcuts
    this.input.keyboard?.on('keydown-ENTER', () => {
      this.startGame();
    });
    
    this.input.keyboard?.on('keydown-T', () => {
      this.startTutorial();
    });
    
    this.input.keyboard?.on('keydown-ESC', () => {
      this.quitGame();
    });
  }

  private playButtonSound() {
    this.audioManager.playSound('button-click', { volume: 0.5 });
  }

  private startGame() {
    // Fade out music
    this.audioManager.stopMusic();
    
    // Show loading screen and transition
    this.cameras.main.fadeOut(500, 0, 0, 0);
    
    this.cameras.main.once('camerafadeoutcomplete', () => {
      this.scene.start(SceneKeys.ROASTING_LAB);
    });
  }

  private startTutorial() {
    this.audioManager.stopMusic();
    
    this.cameras.main.fadeOut(500, 0, 0, 0);
    
    this.cameras.main.once('camerafadeoutcomplete', () => {
      this.scene.start(SceneKeys.TUTORIAL);
    });
  }

  private openSettings() {
    // Launch settings as overlay
    this.scene.launch(SceneKeys.SETTINGS);
    this.scene.pause();
  }

  private quitGame() {
    // For web, just show a confirmation
    const confirmQuit = confirm('Are you sure you want to quit?');
    if (confirmQuit) {
      // For PWA or Electron apps, this could actually close the app
      window.close();
    }
  }

  // Handle returning from settings
  public onSettingsClosed() {
    this.scene.resume();
  }

  // Handle window resize
  public resize(width: number, height: number) {
    // Update background size
    const background = this.children.getByName('menu-background') as Phaser.GameObjects.Image;
    if (background) {
      background.setDisplaySize(width, height);
    }
    
    // Update main menu positioning
    if (this.mainMenu) {
      this.mainMenu.setPosition(width / 2, height / 2);
    }
  }

  // Public methods for external control
  public showMainMenu() {
    if (this.mainMenu) {
      this.mainMenu.setVisible(true);
    }
  }

  public hideMainMenu() {
    if (this.mainMenu) {
      this.mainMenu.setVisible(false);
    }
  }

  public playMenuMusic() {
    this.audioManager.playMusic('menu-music', { loop: true, volume: 0.4 });
  }

  public stopMenuMusic() {
    this.audioManager.stopMusic();
  }
}
