/**
 * Save Data Types
 * Interfaces for game save/load system
 */

import type { GameState } from './GameTypes';

export interface SaveSlot {
  id: string;
  name: string;
  timestamp: Date;
  gameVersion: string;
  playTime: number; // in milliseconds
  thumbnail?: string; // base64 encoded screenshot
}

export interface SaveData {
  slot: SaveSlot;
  gameState: GameState;
  metadata: SaveMetadata;
  checksum: string; // for corruption detection
}

export interface SaveMetadata {
  saveVersion: string;
  compressionUsed: boolean;
  encryptionUsed: boolean;
  platform: string;
  deviceInfo: {
    screen: { width: number; height: number };
    userAgent: string;
    language: string;
  };
}

export interface SaveFile {
  version: string;
  saves: { [slotId: string]: SaveData };
  settings: {
    autoSave: boolean;
    autoSaveInterval: number; // minutes
    maxSaveSlots: number;
    compressionEnabled: boolean;
  };
}

export interface SaveValidationResult {
  isValid: boolean;
  errors: string[];
  warnings: string[];
  corruptedData: string[];
  repairableIssues: string[];
}

export interface SaveStats {
  totalSaves: number;
  totalPlayTime: number;
  oldestSave: Date;
  newestSave: Date;
  averageSaveSize: number;
  corruptedSaves: number;
}

// Save operation types
export type SaveOperation = 'create' | 'update' | 'delete' | 'export' | 'import';

export interface SaveOperationResult {
  success: boolean;
  operation: SaveOperation;
  slotId: string;
  error?: string;
  warning?: string;
  timestamp: Date;
}

// Auto-save configuration
export interface AutoSaveConfig {
  enabled: boolean;
  interval: number; // minutes
  maxAutoSaves: number;
  saveOnImportantEvents: boolean;
  saveOnExit: boolean;
}

// Export/Import types
export interface ExportData {
  saveData: SaveData;
  exportDate: Date;
  exportVersion: string;
  includeSettings: boolean;
  includeMetadata: boolean;
}

export interface ImportOptions {
  overwriteExisting: boolean;
  validateBeforeImport: boolean;
  createBackup: boolean;
  mergeSettings: boolean;
}
