/**
 * Main Gameplay Scene
 * Core game loop and mechanics
 */

import Phaser from 'phaser';
import { GameHUD } from '../components/UI/GameHUD';
import { CustomerPanel } from '../components/UI/CustomerPanel';
import { InventoryMenu } from '../components/UI/InventoryMenu';
import { RoastingSimulation } from '../systems/RoastingSimulation';
import { AudioManager } from '../managers/AudioManager';
import { SceneKeys } from '../types/GameTypes';

export class GameScene extends Phaser.Scene {
  private gameHUD!: GameHUD;
  private customerPanel!: CustomerPanel;
  private inventoryMenu!: InventoryMenu;
  private roastingSimulation!: RoastingSimulation;
  private audioManager!: AudioManager;
  
  private score: number = 0;
  private gameTime: number = 0;
  private isPaused: boolean = false;

  constructor() {
    super({ key: SceneKeys.ROASTING_LAB });
    console.log('GameScene constructor called');
  }

  preload() {
    // Game assets are loaded by LoadingScene, no need to reload here
    // this.load.image('coffee-bean', 'assets/images/coffee-bean.png');
    // this.load.image('roasting-drum', 'assets/images/roasting-drum.png');
    // this.load.image('customer-sprite', 'assets/images/customer.png');
    // this.load.image('background', 'assets/images/coffee-shop-bg.png');
    
    // Load audio (temporarily disabled)
    // this.load.audio('background-music', 'assets/audio/coffee-shop-ambient.mp3');
    // this.load.audio('roasting-sound', 'assets/audio/roasting.mp3');
    // this.load.audio('customer-arrive', 'assets/audio/bell.mp3');
  }

  create() {
    console.log('GameScene create started');
    
    // Initialize background with color instead of image for now
    this.add.rectangle(this.scale.width / 2, this.scale.height / 2, this.scale.width, this.scale.height, 0x8B4513);
    
    // Initialize managers
    this.audioManager = new AudioManager(this);
    this.roastingSimulation = new RoastingSimulation(this);
    
    // Initialize UI
    this.gameHUD = new GameHUD(this, 0, 0);
    this.customerPanel = new CustomerPanel(this, this.scale.width / 2 - 200, this.scale.height - 150);
    this.inventoryMenu = new InventoryMenu(this, this.scale.width - 300, 0);
    
    // Setup input handlers
    this.setupInputHandlers();
    
    // Start background music
    this.audioManager.playMusic('background-music', { loop: true, volume: 0.3 });
    
    // Start game systems
    this.startGameLoop();
    
    console.log('GameScene initialized successfully');
  }

  update(time: number, delta: number) {
    if (this.isPaused) return;
    
    this.gameTime += delta;
    
    // Update game systems
    this.roastingSimulation.update(time, delta);
    
    // Update UI
    this.gameHUD.updateTime(this.gameTime);
    this.gameHUD.updateScore(this.score);
  }

  private setupInputHandlers() {
    // Keyboard shortcuts
    this.input.keyboard?.on('keydown-ESC', () => {
      this.togglePause();
    });
    
    this.input.keyboard?.on('keydown-I', () => {
      this.inventoryMenu.toggleVisibility();
    });
    
    // Mouse/touch interactions
    this.input.on('pointerdown', (pointer: Phaser.Input.Pointer) => {
      // Handle game interactions
      console.log('Game interaction at:', pointer.x, pointer.y);
    });
  }

  private startGameLoop() {
    // Initialize customer spawning
    this.time.addEvent({
      delay: 10000, // Customer every 10 seconds
      callback: this.spawnCustomer,
      callbackScope: this,
      loop: true
    });
    
    // Initialize roasting events
    this.roastingSimulation.start();
  }

  private spawnCustomer() {
    // Simulate customer arrival
    this.audioManager.playSound('customer-arrive');
    this.customerPanel.updateCustomerInfo('New Customer', 'Medium roast coffee');
    
    // Hide customer panel after 5 seconds
    this.time.delayedCall(5000, () => {
      this.customerPanel.hide();
    });
  }

  private togglePause() {
    this.isPaused = !this.isPaused;
    
    if (this.isPaused) {
      this.audioManager.stopMusic();
      // Show pause menu
      this.showPauseMenu();
    } else {
      this.audioManager.playMusic('background-music', { loop: true, volume: 0.3 });
      // Hide pause menu
      this.hidePauseMenu();
    }
  }

  private showPauseMenu() {
    // Create pause overlay
    const pauseOverlay = this.add.rectangle(
      this.scale.width / 2, 
      this.scale.height / 2, 
      this.scale.width, 
      this.scale.height, 
      0x000000, 
      0.7
    );
    
    const pauseText = this.add.text(
      this.scale.width / 2, 
      this.scale.height / 2, 
      'PAUSED\\nPress ESC to continue', 
      {
        fontSize: '48px',
        color: '#ffffff',
        align: 'center'
      }
    );
    pauseText.setOrigin(0.5);
    
    // Store references for cleanup
    this.data.set('pauseOverlay', pauseOverlay);
    this.data.set('pauseText', pauseText);
  }

  private hidePauseMenu() {
    const pauseOverlay = this.data.get('pauseOverlay');
    const pauseText = this.data.get('pauseText');
    
    if (pauseOverlay) pauseOverlay.destroy();
    if (pauseText) pauseText.destroy();
  }

  // Public methods for game state management
  public addScore(points: number) {
    this.score += points;
  }

  public getCurrentScore(): number {
    return this.score;
  }

  public getGameTime(): number {
    return this.gameTime;
  }

  public pauseGame() {
    this.isPaused = true;
  }

  public resumeGame() {
    this.isPaused = false;
  }

  // Scene transition methods
  public goToMainMenu() {
    this.scene.start(SceneKeys.MAIN_MENU);
  }

  public openInventory() {
    this.inventoryMenu.toggleVisibility();
  }

  public openSettings() {
    this.scene.launch(SceneKeys.SETTINGS);
  }
}
