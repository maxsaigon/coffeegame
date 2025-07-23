/**
 * Scene Manager
 * Handles scene transitions and state management
 */

import Phaser from 'phaser';
import { SceneKeys } from '../types/GameTypes';

export interface SceneTransition {
  from: string;
  to: string;
  duration: number;
  effect: 'fade' | 'slide' | 'zoom' | 'none';
  data?: any;
}

export class SceneManager {
  private currentScene: string;
  private sceneHistory: string[] = [];

  constructor() {
    this.currentScene = SceneKeys.BOOT;
  }

  /**
   * Simple scene transition
   */
  public static transitionTo(scene: Phaser.Scene, sceneKey: string, data?: any): void {
    scene.scene.start(sceneKey, data);
  }

  /**
   * Fade transition between scenes
   */
  public static fadeTransition(
    scene: Phaser.Scene, 
    sceneKey: string, 
    duration: number = 500, 
    data?: any
  ): void {
    scene.cameras.main.fadeOut(duration, 0, 0, 0);
    scene.cameras.main.once('camerafadeoutcomplete', () => {
      scene.scene.start(sceneKey, data);
    });
  }

  /**
   * Launch overlay scene
   */
  public static launchOverlay(scene: Phaser.Scene, sceneKey: string, data?: any): void {
    scene.scene.launch(sceneKey, data);
    scene.scene.bringToTop(sceneKey);
  }

  /**
   * Close overlay scene
   */
  public static closeOverlay(scene: Phaser.Scene, sceneKey: string): void {
    scene.scene.stop(sceneKey);
  }

  /**
   * Pause current scene
   */
  public static pauseScene(scene: Phaser.Scene): void {
    scene.scene.pause();
  }

  /**
   * Resume current scene
   */
  public static resumeScene(scene: Phaser.Scene): void {
    scene.scene.resume();
  }

  /**
   * Get current scene key
   */
  public getCurrentScene(): string {
    return this.currentScene;
  }

  /**
   * Set current scene
   */
  public setCurrentScene(sceneKey: string): void {
    this.sceneHistory.push(this.currentScene);
    this.currentScene = sceneKey;
  }

  /**
   * Go back to previous scene
   */
  public static goBack(scene: Phaser.Scene): void {
    // This would need scene history implementation
    scene.scene.start(SceneKeys.MAIN_MENU);
  }

  /**
   * Emergency reset to main menu
   */
  public static emergencyReset(scene: Phaser.Scene): void {
    console.warn('Emergency scene reset triggered');
    scene.scene.start(SceneKeys.MAIN_MENU);
  }
}
