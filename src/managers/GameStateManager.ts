/**
 * Game State Manager
 * Manages the overall game state, progression, and data persistence
 */

import { SaveManager } from './SaveManager.js';

// Simple game state interface for internal use
interface SimpleGameState {
  gameTime: number;
  dayCount: number;
  player: {
    name: string;
    level: number;
    experience: number;
    reputation: number;
    money: number;
    skillPoints: number;
    unlockedFeatures: string[];
    achievements: string[];
    statistics: {
      totalOrdersCompleted: number;
      totalRevenue: number;
      bestQualityScore: number;
      daysPlayed: number;
      coffeeBagsRoasted: number;
    };
  };
  inventory: {
    greenBeans: any[];
    roastedBeans: any[];
    equipment: any[];
    supplies: any[];
  };
  equipment: any;
  customers: any[];
  activeOrders: any[];
  completedOrders: any[];
  gameSettings: {
    difficulty: string;
    tutorialComplete: boolean;
    soundEnabled: boolean;
    musicEnabled: boolean;
    autoSaveInterval: number;
  };
  version: string;
}

export class GameStateManager {
  private static instance: GameStateManager;
  private gameState: SimpleGameState;
  private saveManager: SaveManager;
  
  // Game state listeners
  private stateChangeListeners: Map<string, ((state: SimpleGameState) => void)[]> = new Map();
  
  private constructor() {
    this.saveManager = new SaveManager();
    this.gameState = this.createInitialGameState();
    this.loadGameState();
  }

  public static getInstance(): GameStateManager {
    if (!GameStateManager.instance) {
      GameStateManager.instance = new GameStateManager();
    }
    return GameStateManager.instance;
  }

  private createInitialGameState(): SimpleGameState {
    return {
      gameTime: 0,
      dayCount: 1,
      player: {
        name: 'New Roaster',
        level: 1,
        experience: 0,
        reputation: 50,
        money: 1000,
        skillPoints: 0,
        unlockedFeatures: ['basic_roasting'],
        achievements: [],
        statistics: {
          totalOrdersCompleted: 0,
          totalRevenue: 0,
          bestQualityScore: 0,
          daysPlayed: 0,
          coffeeBagsRoasted: 0
        }
      },
      inventory: {
        greenBeans: [
          {
            beanId: 'colombia-supremo',
            quantity: 5,
            purchaseDate: Date.now(),
            origin: 'Colombia',
            quality: 75
          }
        ],
        roastedBeans: [],
        equipment: [],
        supplies: [
          {
            itemId: 'burlap-bags',
            quantity: 20,
            itemType: 'packaging'
          }
        ]
      },
      equipment: {
        roasters: [
          {
            id: 'basic-roaster',
            type: 'drum',
            capacity: 5,
            condition: 100,
            upgradeLevel: 0,
            features: ['temperature-control', 'timer']
          }
        ],
        grinders: [],
        storage: [
          {
            id: 'basic-storage',
            type: 'shelf',
            capacity: 50,
            condition: 100,
            upgradeLevel: 0,
            features: ['basic-climate-control']
          }
        ],
        quality: [
          {
            id: 'basic-scale',
            type: 'scale',
            precision: 1,
            condition: 100,
            upgradeLevel: 0,
            features: ['digital-display']
          }
        ]
      },
      customers: [],
      activeOrders: [],
      completedOrders: [],
      gameSettings: {
        difficulty: 'medium',
        tutorialComplete: false,
        soundEnabled: true,
        musicEnabled: true,
        autoSaveInterval: 300000 // 5 minutes
      },
      version: '1.0.0'
    };
  }

  // Game State Access Methods
  public getGameState(): SimpleGameState {
    return { ...this.gameState }; // Return a copy to prevent direct modification
  }

  public getPlayer(): any {
    return { ...this.gameState.player };
  }

  public getInventory(): any {
    return this.gameState.inventory;
  }

  public getEquipment(): any {
    return { ...this.gameState.equipment };
  }

  // Game State Modification Methods
  public updatePlayer(updates: any): void {
    this.gameState.player = { ...this.gameState.player, ...updates };
    this.notifyStateChange('player');
    this.autoSave();
  }

  public addMoney(amount: number): void {
    this.gameState.player.money += amount;
    this.notifyStateChange('money');
    this.autoSave();
  }

  public spendMoney(amount: number): boolean {
    if (this.gameState.player.money >= amount) {
      this.gameState.player.money -= amount;
      this.notifyStateChange('money');
      this.autoSave();
      return true;
    }
    return false;
  }

  public addExperience(amount: number): void {
    const oldLevel = this.gameState.player.level;
    this.gameState.player.experience += amount;
    
    // Check for level up
    const newLevel = this.calculateLevel(this.gameState.player.experience);
    if (newLevel > oldLevel) {
      this.gameState.player.level = newLevel;
      this.gameState.player.skillPoints += (newLevel - oldLevel);
      this.notifyStateChange('levelUp');
    }
    
    this.notifyStateChange('experience');
    this.autoSave();
  }

  private calculateLevel(experience: number): number {
    // Simple level calculation: every 1000 XP = 1 level
    return Math.floor(experience / 1000) + 1;
  }

  public updateReputation(change: number): void {
    this.gameState.player.reputation = Math.max(0, Math.min(100, 
      this.gameState.player.reputation + change));
    this.notifyStateChange('reputation');
    this.autoSave();
  }

  public addInventoryItem(item: any): void {
    // Add item to appropriate inventory category
    if (item.type === 'green-beans') {
      this.gameState.inventory.greenBeans.push(item);
    } else if (item.type === 'roasted-beans') {
      this.gameState.inventory.roastedBeans.push(item);
    } else if (item.type === 'equipment') {
      this.gameState.inventory.equipment.push(item);
    } else if (item.type === 'supplies') {
      this.gameState.inventory.supplies.push(item);
    }
    
    this.notifyStateChange('inventory');
    this.autoSave();
  }

  public removeInventoryItem(itemId: string, quantity: number = 1): boolean {
    // Find and remove item from inventory
    let found = false;
    
    // Check green beans
    const greenBeanIndex = this.gameState.inventory.greenBeans.findIndex(bean => bean.beanId === itemId);
    if (greenBeanIndex !== -1) {
      this.gameState.inventory.greenBeans[greenBeanIndex].quantity -= quantity;
      if (this.gameState.inventory.greenBeans[greenBeanIndex].quantity <= 0) {
        this.gameState.inventory.greenBeans.splice(greenBeanIndex, 1);
      }
      found = true;
    }
    
    // Check supplies
    const suppliesIndex = this.gameState.inventory.supplies.findIndex(supply => supply.itemId === itemId);
    if (suppliesIndex !== -1) {
      this.gameState.inventory.supplies[suppliesIndex].quantity -= quantity;
      if (this.gameState.inventory.supplies[suppliesIndex].quantity <= 0) {
        this.gameState.inventory.supplies.splice(suppliesIndex, 1);
      }
      found = true;
    }
    
    if (found) {
      this.notifyStateChange('inventory');
      this.autoSave();
    }
    
    return found;
  }

  public clearInventory(): void {
    console.log('DEBUG: Clearing all inventory items');
    this.gameState.inventory.greenBeans = [];
    this.gameState.inventory.roastedBeans = [];
    this.gameState.inventory.equipment = [];
    this.gameState.inventory.supplies = [];
    
    this.notifyStateChange('inventory');
    this.autoSave();
  }

  public advanceDay(): void {
    this.gameState.dayCount++;
    this.gameState.player.statistics.daysPlayed++;
    
    // Age inventory items
    this.ageInventory();
    
    // Process daily events
    this.processDailyEvents();
    
    this.notifyStateChange('dayAdvance');
    this.autoSave();
  }

  private ageInventory(): void {
    // Age green beans (quality decreases over time)
    this.gameState.inventory.greenBeans.forEach(bean => {
      const daysSincePurchase = (Date.now() - bean.purchaseDate) / (1000 * 60 * 60 * 24);
      if (daysSincePurchase > 365) { // After 1 year, quality starts declining
        bean.quality = Math.max(10, bean.quality - 0.1);
      }
    });
    
    // Age roasted beans (go stale faster)
    this.gameState.inventory.roastedBeans.forEach(bean => {
      const daysSinceRoast = (Date.now() - bean.roastDate) / (1000 * 60 * 60 * 24);
      if (daysSinceRoast > 14) { // After 2 weeks, quality drops significantly
        bean.quality = Math.max(5, bean.quality - 0.5);
      }
    });
  }

  private processDailyEvents(): void {
    // Generate random events, market changes, etc.
    console.log(`Day ${this.gameState.dayCount} begins!`);
    
    // Update reputation based on recent performance
    if (this.gameState.completedOrders.length > 0) {
      const recentOrders = this.gameState.completedOrders.slice(-10); // Last 10 orders
      const avgSatisfaction = recentOrders.reduce((sum, order) => sum + (order.satisfaction || 50), 0) / recentOrders.length;
      
      if (avgSatisfaction > 80) {
        this.updateReputation(1);
      } else if (avgSatisfaction < 50) {
        this.updateReputation(-1);
      }
    }
  }

  public unlockFeature(featureId: string): void {
    if (!this.gameState.player.unlockedFeatures.includes(featureId)) {
      this.gameState.player.unlockedFeatures.push(featureId);
      this.notifyStateChange('featureUnlock');
      this.autoSave();
    }
  }

  public addAchievement(achievementId: string): void {
    if (!this.gameState.player.achievements.includes(achievementId)) {
      this.gameState.player.achievements.push(achievementId);
      this.notifyStateChange('achievement');
      this.autoSave();
    }
  }

  // Save/Load Methods
  public saveGame(slotName: string = 'autosave'): void {
    this.saveManager.saveGame(this.gameState, slotName);
    console.log(`Game saved to slot: ${slotName}`);
  }

  public loadGame(slotName: string = 'autosave'): boolean {
    const loadedState = this.saveManager.loadGame(slotName);
    if (loadedState) {
      this.gameState = loadedState;
      this.notifyStateChange('gameLoaded');
      console.log(`Game loaded from slot: ${slotName}`);
      return true;
    }
    return false;
  }

  public loadGameState(): void {
    // Try to load autosave on startup
    this.loadGame('autosave');
  }

  private autoSave(): void {
    // Auto-save after significant changes
    if (this.gameState.gameSettings.autoSaveInterval > 0) {
      this.saveGame('autosave');
    }
  }

  // Event System
  public addEventListener(event: string, callback: (state: SimpleGameState) => void): void {
    if (!this.stateChangeListeners.has(event)) {
      this.stateChangeListeners.set(event, []);
    }
    this.stateChangeListeners.get(event)!.push(callback);
  }

  public removeEventListener(event: string, callback: (state: SimpleGameState) => void): void {
    const listeners = this.stateChangeListeners.get(event);
    if (listeners) {
      const index = listeners.indexOf(callback);
      if (index !== -1) {
        listeners.splice(index, 1);
      }
    }
  }

  private notifyStateChange(event: string): void {
    const listeners = this.stateChangeListeners.get(event);
    if (listeners) {
      listeners.forEach(callback => callback(this.gameState));
    }
    
    // Also notify general state change listeners
    const generalListeners = this.stateChangeListeners.get('stateChange');
    if (generalListeners) {
      generalListeners.forEach(callback => callback(this.gameState));
    }
  }

  // Utility Methods
  public canAfford(cost: number): boolean {
    return this.gameState.player.money >= cost;
  }

  public hasFeature(featureId: string): boolean {
    return this.gameState.player.unlockedFeatures.includes(featureId);
  }

  public hasAchievement(achievementId: string): boolean {
    return this.gameState.player.achievements.includes(achievementId);
  }

  public getInventoryCount(itemId: string): number {
    // Check green beans
    const greenBean = this.gameState.inventory.greenBeans.find(bean => bean.beanId === itemId);
    if (greenBean) return greenBean.quantity;
    
    // Check supplies
    const supply = this.gameState.inventory.supplies.find(supply => supply.itemId === itemId);
    if (supply) return supply.quantity;
    
    return 0;
  }

  // Development/Debug Methods
  public resetGameState(): void {
    this.gameState = this.createInitialGameState();
    this.notifyStateChange('gameReset');
    this.saveGame('autosave');
  }

  public exportGameState(): string {
    return JSON.stringify(this.gameState, null, 2);
  }

  public importGameState(stateJson: string): boolean {
    try {
      const importedState = JSON.parse(stateJson);
      if (this.validateGameState(importedState)) {
        this.gameState = importedState;
        this.notifyStateChange('gameImported');
        this.autoSave();
        return true;
      }
    } catch (error) {
      console.error('Failed to import game state:', error);
    }
    return false;
  }

  private validateGameState(state: any): boolean {
    // Basic validation of game state structure
    return state && 
           typeof state.gameTime === 'number' &&
           typeof state.dayCount === 'number' &&
           state.player && 
           state.inventory && 
           state.equipment;
  }
}
