/**
 * Coffee Roaster Game
 * Main entry point for the game
 */

import './style.css';
import Phaser from 'phaser';
import { LoadingScene } from './scenes/LoadingScene';
import { SimpleMenuScene } from './scenes/SimpleMenuScene';
import { SimpleGameScene } from './scenes/SimpleGameScene';
import { SimpleTutorialScene } from './scenes/SimpleTutorialScene';
import { CoffeeMarketScene } from './scenes/CoffeeMarketScene';
import { RoastingLabScene } from './scenes/RoastingLabScene';

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
    SimpleMenuScene,
    SimpleGameScene,
    SimpleTutorialScene,
    CoffeeMarketScene,
    RoastingLabScene
  ]
};

// Initialize the game
console.log('Starting Coffee Roaster Game...');

// Create Phaser game
const game = new Phaser.Game(gameConfig);

console.log('Phaser game instance created', game);

// Basic error handling
window.addEventListener('error', (error) => {
  console.error('Game error:', error.message, error.filename, error.lineno);
});

console.log('Game initialization complete');
