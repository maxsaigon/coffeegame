/**
 * Save Manager
 * Handles saving and loading game data to/from localStorage
 */

export interface SaveSlot {
  name: string;
  timestamp: number;
  gameData: any;
  version: string;
}

export class SaveManager {
  private readonly SAVE_KEY_PREFIX = 'coffee_roaster_save_';

  public saveGame(gameData: any, slotName: string): boolean {
    try {
      const saveSlot: SaveSlot = {
        name: slotName,
        timestamp: Date.now(),
        gameData: gameData,
        version: '1.0.0'
      };

      const saveKey = this.SAVE_KEY_PREFIX + slotName;
      localStorage.setItem(saveKey, JSON.stringify(saveSlot));
      
      console.log(`Game saved to slot: ${slotName}`);
      return true;
    } catch (error) {
      console.error('Failed to save game:', error);
      return false;
    }
  }

  public loadGame(slotName: string): any | null {
    try {
      const saveKey = this.SAVE_KEY_PREFIX + slotName;
      const saveData = localStorage.getItem(saveKey);
      
      if (saveData) {
        const saveSlot: SaveSlot = JSON.parse(saveData);
        console.log(`Game loaded from slot: ${slotName}`);
        return saveSlot.gameData;
      }
      
      console.log(`No save data found for slot: ${slotName}`);
      return null;
    } catch (error) {
      console.error('Failed to load game:', error);
      return null;
    }
  }

  public deleteSave(slotName: string): boolean {
    try {
      const saveKey = this.SAVE_KEY_PREFIX + slotName;
      localStorage.removeItem(saveKey);
      console.log(`Save slot deleted: ${slotName}`);
      return true;
    } catch (error) {
      console.error('Failed to delete save:', error);
      return false;
    }
  }

  public listSaves(): SaveSlot[] {
    const saves: SaveSlot[] = [];
    
    try {
      for (let i = 0; i < localStorage.length; i++) {
        const key = localStorage.key(i);
        if (key && key.startsWith(this.SAVE_KEY_PREFIX)) {
          const saveData = localStorage.getItem(key);
          if (saveData) {
            const saveSlot: SaveSlot = JSON.parse(saveData);
            saves.push(saveSlot);
          }
        }
      }
      
      // Sort by timestamp (newest first)
      saves.sort((a, b) => b.timestamp - a.timestamp);
    } catch (error) {
      console.error('Failed to list saves:', error);
    }
    
    return saves;
  }

  public saveExists(slotName: string): boolean {
    const saveKey = this.SAVE_KEY_PREFIX + slotName;
    return localStorage.getItem(saveKey) !== null;
  }

  public getSaveInfo(slotName: string): SaveSlot | null {
    try {
      const saveKey = this.SAVE_KEY_PREFIX + slotName;
      const saveData = localStorage.getItem(saveKey);
      
      if (saveData) {
        return JSON.parse(saveData);
      }
    } catch (error) {
      console.error('Failed to get save info:', error);
    }
    
    return null;
  }

  public exportSave(slotName: string): string | null {
    try {
      const saveKey = this.SAVE_KEY_PREFIX + slotName;
      const saveData = localStorage.getItem(saveKey);
      
      if (saveData) {
        return saveData;
      }
    } catch (error) {
      console.error('Failed to export save:', error);
    }
    
    return null;
  }

  public importSave(saveData: string, slotName: string): boolean {
    try {
      const saveSlot: SaveSlot = JSON.parse(saveData);
      
      // Validate save data structure
      if (this.validateSaveData(saveSlot)) {
        saveSlot.name = slotName; // Update slot name
        saveSlot.timestamp = Date.now(); // Update timestamp
        
        const saveKey = this.SAVE_KEY_PREFIX + slotName;
        localStorage.setItem(saveKey, JSON.stringify(saveSlot));
        
        console.log(`Save imported to slot: ${slotName}`);
        return true;
      } else {
        console.error('Invalid save data format');
        return false;
      }
    } catch (error) {
      console.error('Failed to import save:', error);
      return false;
    }
  }

  private validateSaveData(saveSlot: any): boolean {
    return saveSlot &&
           typeof saveSlot.name === 'string' &&
           typeof saveSlot.timestamp === 'number' &&
           saveSlot.gameData &&
           typeof saveSlot.version === 'string';
  }

  public clearAllSaves(): boolean {
    try {
      const keysToRemove: string[] = [];
      
      for (let i = 0; i < localStorage.length; i++) {
        const key = localStorage.key(i);
        if (key && key.startsWith(this.SAVE_KEY_PREFIX)) {
          keysToRemove.push(key);
        }
      }
      
      keysToRemove.forEach(key => localStorage.removeItem(key));
      
      console.log(`Cleared ${keysToRemove.length} save slots`);
      return true;
    } catch (error) {
      console.error('Failed to clear saves:', error);
      return false;
    }
  }

  public getStorageUsage(): { used: number; total: number; percentage: number } {
    try {
      let totalSize = 0;
      let saveSize = 0;
      
      for (let i = 0; i < localStorage.length; i++) {
        const key = localStorage.key(i);
        if (key) {
          const itemSize = (localStorage.getItem(key) || '').length;
          totalSize += itemSize;
          
          if (key.startsWith(this.SAVE_KEY_PREFIX)) {
            saveSize += itemSize;
          }
        }
      }
      
      // Estimate total localStorage capacity (usually 5-10MB)
      const estimatedCapacity = 5 * 1024 * 1024; // 5MB
      
      return {
        used: saveSize,
        total: estimatedCapacity,
        percentage: (saveSize / estimatedCapacity) * 100
      };
    } catch (error) {
      console.error('Failed to get storage usage:', error);
      return { used: 0, total: 0, percentage: 0 };
    }
  }
}
