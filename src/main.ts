/**
 * Coffee Roaster Game
 * Main entry point for the game
 */

import './style.css';
import Phaser from 'phaser';
import { LoadingScene } from './scenes/LoadingScene';
import { MenuScene } from './scenes/MenuScene';
import { GameScene } from './scenes/GameScene';
import { TutorialScene } from './scenes/TutorialScene';

// Game configuration
const gameConfig: Phaser.Types.Core.GameConfig = {
  type: Phaser.AUTO,
  width: 800,
  height: 600,
  parent: 'app',
  backgroundColor: '#2c3e50',
  scale: {
    mode: Phaser.Scale.FIT,
    autoCenter: Phaser.Scale.CENTER_BOTH,
    min: {
      width: 400,
      height: 300
    },
    max: {
      width: 1600,
      height: 1200
    }
  },
  physics: {
    default: 'arcade',
    arcade: {
      gravity: { x: 0, y: 0 },
      debug: false
    }
  },
  audio: {
    disableWebAudio: false
  },
  scene: [
    LoadingScene,
    MenuScene,
    GameScene,
    TutorialScene
  ]
};

// Initialize the game
class CoffeeRoasterGame {
  private game: Phaser.Game;

  constructor() {
    console.log('Initializing Coffee Roaster Game...');
    
    // Create game container in HTML
    this.createGameContainer();
    
    // Initialize Phaser game
    this.game = new Phaser.Game(gameConfig);
    
    // Add error handling
    this.setupErrorHandling();
    
    console.log('Coffee Roaster Game initialized successfully!');
  }

  private createGameContainer(): void {
    const app = document.querySelector<HTMLDivElement>('#app')!;
    app.innerHTML = `
      <div id="game-container">
        <div id="game-title">
          <h1>☕ Coffee Roaster</h1>
          <p>Professional Coffee Simulation Game</p>
        </div>
        <div id="game-canvas"></div>
        <div id="game-info">
          <p>Loading game assets...</p>
        </div>
      </div>
    `;
  }

  private setupErrorHandling(): void {
    this.game.events.on('ready', () => {
      console.log('Game ready - starting loading scene');
      const info = document.querySelector('#game-info p');
      if (info) info.textContent = 'Game loaded successfully!';
    });

    window.addEventListener('error', (error) => {
      console.error('Game error:', error);
      const info = document.querySelector('#game-info p');
      if (info) info.textContent = 'Error loading game. Please refresh the page.';
    });
  }

  public getGame(): Phaser.Game {
    return this.game;
  }
}

// Start the game when DOM is ready
document.addEventListener('DOMContentLoaded', () => {
  new CoffeeRoasterGame();
});
