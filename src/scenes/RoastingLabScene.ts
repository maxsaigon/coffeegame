/**
 * Professional Roasting Lab Scene
 * Complete roasting simulation with temperature, timing, and drum controls
 */

import Phaser from 'phaser';
import { SceneKeys } from '../types/GameTypes';
import { GameStateManager } from '../managers/GameStateManager';
import { COFFEE_BEANS } from '../data/CoffeeBeans';
import type { CoffeeBeanData } from '../types/GameTypes';
import { ChemistryAnalyticsPanel } from '../components/ChemistryAnalyticsPanel';

interface RoastingState {
  isRoasting: boolean;
  temperature: number; // °C
  targetTemperature: number;
  time: number; // seconds
  phase: 'drying' | 'maillard' | 'first_crack' | 'development' | 'second_crack' | 'cooling';
  roastLevel: number; // 0-1 (green to black)
  drumSpeed: number; // RPM
  moisture: number; // percentage
  beanCount: number;
  quality: number; // 0-100
  warnings: string[];
  // Cooling phase properties
  coolingStartTime?: number;
  coolingStartTemp?: number;
  targetCoolingTime?: number;
  coolingRate?: number;
}

interface TemperatureControl {
  current: number;
  target: number;
  heatPower: number; // 0-100%
  maxTemp: number;
  minTemp: number;
}

interface TimingControl {
  totalTime: number;
  phaseTime: number;
  targetTime: number;
  isTimerRunning: boolean;
}

interface DrumControl {
  speed: number; // RPM
  direction: 'clockwise' | 'counterclockwise';
  isRunning: boolean;
  temperature: number;
}

export class RoastingLabScene extends Phaser.Scene {
  private gameStateManager!: GameStateManager;
  private analyticsPanel!: ChemistryAnalyticsPanel;
  
  // Roasting state
  private roastingState: RoastingState = {
    isRoasting: false,
    temperature: 20,
    targetTemperature: 20,
    time: 0,
    phase: 'drying',
    roastLevel: 0,
    drumSpeed: 0,
    moisture: 12,
    beanCount: 0,
    quality: 100,
    warnings: []
  };
  
  // Controls
  private tempControl: TemperatureControl = {
    current: 20,
    target: 20,
    heatPower: 0,
    maxTemp: 250,
    minTemp: 20
  };
  
  private timingControl: TimingControl = {
    totalTime: 0,
    phaseTime: 0,
    targetTime: 900, // 15 minutes default
    isTimerRunning: false
  };
  
  private drumControl: DrumControl = {
    speed: 0,
    direction: 'clockwise',
    isRunning: false,
    temperature: 20
  };
  
  // Selected bean
  private selectedBean: CoffeeBeanData | null = null;
  
  // UI Elements
  private temperatureDisplay!: Phaser.GameObjects.Text;
  private timeDisplay!: Phaser.GameObjects.Text;
  private phaseDisplay!: Phaser.GameObjects.Text;
  private qualityDisplay!: Phaser.GameObjects.Text;
  private drumDisplay!: Phaser.GameObjects.Text;
  private warningsDisplay!: Phaser.GameObjects.Text;
  private beanDisplay!: Phaser.GameObjects.Text;  // Add this for dynamic updates
  
  // Cooling phase UI
  private coolingProgressDisplay!: Phaser.GameObjects.Text;
  private coolingTempDisplay!: Phaser.GameObjects.Text;
  private coolingTimer!: Phaser.Time.TimerEvent;
  
  // Controls UI
  private heatSlider!: Phaser.GameObjects.Rectangle;
  private drumSpeedSlider!: Phaser.GameObjects.Rectangle;
  private drumAnimation!: Phaser.GameObjects.Graphics;
  private beansInDrum: Phaser.GameObjects.Ellipse[] = [];
  
  // Temperature chart
  private temperatureChart: { time: number; temp: number; roastLevel: number }[] = [];
  
  constructor() {
    super({ key: SceneKeys.ROASTING_LAB });
  }

  create() {
    // Initialize managers
    this.gameStateManager = GameStateManager.getInstance();
    this.analyticsPanel = new ChemistryAnalyticsPanel(this);
    
    // Listen for scene resume events
    this.events.on('resume', this.onSceneResume, this);
    this.events.on('wake', this.onSceneResume, this);
    
    // Background
    this.add.rectangle(this.scale.width / 2, this.scale.height / 2, this.scale.width, this.scale.height, 0x2d1f1a);
    
    // Create UI
    this.createHeader();
    this.createRoastingDrum();
    this.createTemperatureControl();
    this.createTimingControl();
    this.createDrumControl();
    this.createRoastingControls();
    this.createBeanSelector();
    this.createInformation();
    this.createNavigationButtons();
    
    // Start update loop
    this.time.addEvent({
      delay: 100, // Update every 100ms
      callback: this.updateRoasting,
      callbackScope: this,
      loop: true
    });
  }

  private onSceneResume(): void {
    console.log('RoastingLabScene resumed - refreshing beans');
    this.loadAvailableBeans();
  }

  private createHeader(): void {
    this.add.text(this.scale.width / 2, 25, '🔥 Professional Roasting Lab', {
      fontSize: '28px',
      color: '#d4af37',
      fontStyle: 'bold'
    }).setOrigin(0.5);
    
    this.add.text(this.scale.width / 2, 50, 'Precision Coffee Roasting Simulation', {
      fontSize: '16px',
      color: '#ffffff',
      fontStyle: 'italic'
    }).setOrigin(0.5);
  }

  private createRoastingDrum(): void {
    const drumX = this.scale.width / 2 - 200;
    const drumY = 200;
    
    // Drum housing
    const drumHousing = this.add.ellipse(drumX, drumY, 180, 120, 0x4a4a4a);
    drumHousing.setStrokeStyle(4, 0x666666);
    
    // Inner drum
    this.drumAnimation = this.add.graphics();
    this.updateDrumVisual();
    
    // Drum label
    this.add.text(drumX, drumY + 80, 'Roasting Drum', {
      fontSize: '14px',
      color: '#ffffff'
    }).setOrigin(0.5);
    
    // Temperature probe
    this.add.line(drumX + 90, drumY, 0, 0, 20, 0, 0xff4444, 1);
    this.add.circle(drumX + 110, drumY, 4, 0xff4444);
    this.add.text(drumX + 120, drumY - 5, '🌡️', {
      fontSize: '16px'
    });
  }

  private updateDrumVisual(): void {
    if (!this.drumAnimation) return;
    
    const drumX = this.scale.width / 2 - 200;
    const drumY = 200;
    
    this.drumAnimation.clear();
    
    // Drum interior
    const drumColor = this.getDrumColor();
    this.drumAnimation.fillStyle(drumColor);
    this.drumAnimation.fillEllipse(drumX, drumY, 160, 100);
    
    // Rotating elements
    if (this.drumControl.isRunning) {
      const rotation = (this.time.now / 1000) * (this.drumControl.speed / 60) * 2 * Math.PI;
      
      // Drum lines
      this.drumAnimation.lineStyle(2, 0x888888);
      for (let i = 0; i < 8; i++) {
        const angle = (i * Math.PI / 4) + rotation;
        const startX = drumX + Math.cos(angle) * 60;
        const startY = drumY + Math.sin(angle) * 40;
        const endX = drumX + Math.cos(angle) * 80;
        const endY = drumY + Math.sin(angle) * 50;
        this.drumAnimation.lineBetween(startX, startY, endX, endY);
      }
    }
    
    // Update beans in drum
    this.updateBeansInDrum();
  }

  private getDrumColor(): number {
    const temp = this.tempControl.current;
    if (temp < 100) return 0x654321; // Cool brown
    if (temp < 150) return 0x8B4513; // Warming brown
    if (temp < 200) return 0xA0522D; // Hot brown
    if (temp < 230) return 0xCD853F; // Very hot
    return 0xFFB347; // Extremely hot
  }

  private updateBeansInDrum(): void {
    // Clear existing beans
    this.beansInDrum.forEach(bean => bean.destroy());
    this.beansInDrum = [];
    
    if (this.selectedBean && this.roastingState.beanCount > 0) {
      const drumX = this.scale.width / 2 - 200;
      const drumY = 200;
      const beanCount = Math.min(this.roastingState.beanCount, 20);
      
      for (let i = 0; i < beanCount; i++) {
        const angle = (i / beanCount) * Math.PI * 2;
        const radius = 30 + Math.random() * 40;
        const x = drumX + Math.cos(angle) * radius;
        const y = drumY + Math.sin(angle) * (radius * 0.6);
        
        const beanColor = this.getBeanColor();
        const bean = this.add.ellipse(x, y, 6, 4, beanColor);
        this.beansInDrum.push(bean);
      }
    }
  }

  private getBeanColor(): number {
    const roastLevel = this.roastingState.roastLevel;
    if (roastLevel < 0.1) return 0x6B8E23; // Green
    if (roastLevel < 0.3) return 0xDAA520; // Light brown
    if (roastLevel < 0.5) return 0xCD853F; // Medium brown
    if (roastLevel < 0.7) return 0x8B4513; // Dark brown
    if (roastLevel < 0.9) return 0x654321; // Very dark
    return 0x2F1B14; // Almost black
  }

  private createTemperatureControl(): void {
    const controlX = this.scale.width / 2 + 100;
    const controlY = 120;
    
    // Temperature control panel
    this.add.rectangle(controlX, controlY, 200, 150, 0x333333);
    this.add.text(controlX, controlY - 60, '🌡️ Temperature Control', {
      fontSize: '16px',
      color: '#ffffff',
      fontStyle: 'bold'
    }).setOrigin(0.5);
    
    // Current temperature display
    this.temperatureDisplay = this.add.text(controlX, controlY - 35, '20°C', {
      fontSize: '24px',
      color: '#ff6b35',
      fontStyle: 'bold'
    }).setOrigin(0.5);
    
    // Target temperature
    this.add.text(controlX, controlY - 10, 'Target:', {
      fontSize: '12px',
      color: '#ffffff'
    }).setOrigin(0.5);
    
    // Heat power slider
    this.add.text(controlX - 80, controlY + 15, 'Heat:', {
      fontSize: '12px',
      color: '#ffffff'
    });
    
    this.add.rectangle(controlX, controlY + 15, 120, 10, 0x666666); // slider background
    this.heatSlider = this.add.rectangle(controlX - 60, controlY + 15, 8, 12, 0xff4444);
    this.heatSlider.setInteractive({ draggable: true });
    
    this.heatSlider.on('drag', (_pointer: Phaser.Input.Pointer, dragX: number) => {
      const minX = controlX - 60;
      const maxX = controlX + 60;
      const clampedX = Phaser.Math.Clamp(dragX, minX, maxX);
      this.heatSlider.x = clampedX;
      
      this.tempControl.heatPower = ((clampedX - minX) / (maxX - minX)) * 100;
    });
    
    // Temperature buttons
    const tempDownBtn = this.add.text(controlX - 60, controlY + 40, '➖', {
      fontSize: '16px',
      color: '#ffffff',
      backgroundColor: '#666666',
      padding: { x: 8, y: 4 }
    }).setOrigin(0.5);
    
    const tempUpBtn = this.add.text(controlX + 60, controlY + 40, '➕', {
      fontSize: '16px',
      color: '#ffffff',
      backgroundColor: '#666666',
      padding: { x: 8, y: 4 }
    }).setOrigin(0.5);
    
    tempDownBtn.setInteractive({ useHandCursor: true });
    tempUpBtn.setInteractive({ useHandCursor: true });
    
    tempDownBtn.on('pointerdown', () => {
      this.tempControl.target = Math.max(this.tempControl.minTemp, this.tempControl.target - 5);
    });
    
    tempUpBtn.on('pointerdown', () => {
      this.tempControl.target = Math.min(this.tempControl.maxTemp, this.tempControl.target + 5);
    });
  }

  private createTimingControl(): void {
    const controlX = this.scale.width / 2 + 320;
    const controlY = 120;
    
    // Timing control panel
    this.add.rectangle(controlX, controlY, 160, 150, 0x333333);
    this.add.text(controlX, controlY - 60, '⏱️ Timing Control', {
      fontSize: '16px',
      color: '#ffffff',
      fontStyle: 'bold'
    }).setOrigin(0.5);
    
    // Time displays
    this.timeDisplay = this.add.text(controlX, controlY - 35, '00:00', {
      fontSize: '20px',
      color: '#4caf50',
      fontStyle: 'bold'
    }).setOrigin(0.5);
    
    this.phaseDisplay = this.add.text(controlX, controlY - 10, 'Ready', {
      fontSize: '14px',
      color: '#ffffff'
    }).setOrigin(0.5);
    
    // Start/Stop buttons
    const startBtn = this.add.text(controlX - 30, controlY + 20, '▶️', {
      fontSize: '20px',
      backgroundColor: '#4caf50',
      padding: { x: 8, y: 4 }
    }).setOrigin(0.5);
    
    const stopBtn = this.add.text(controlX + 30, controlY + 20, '⏹️', {
      fontSize: '20px',
      backgroundColor: '#f44336',
      padding: { x: 8, y: 4 }
    }).setOrigin(0.5);
    
    startBtn.setInteractive({ useHandCursor: true });
    stopBtn.setInteractive({ useHandCursor: true });
    
    startBtn.on('pointerdown', () => {
      this.startRoasting();
    });
    
    stopBtn.on('pointerdown', () => {
      this.stopRoasting();
    });
    
    // Reset button
    const resetBtn = this.add.text(controlX, controlY + 50, '🔄 Reset', {
      fontSize: '12px',
      color: '#ffffff',
      backgroundColor: '#666666',
      padding: { x: 8, y: 4 }
    }).setOrigin(0.5);
    
    resetBtn.setInteractive({ useHandCursor: true });
    resetBtn.on('pointerdown', () => {
      this.resetRoasting();
    });
  }

  private createDrumControl(): void {
    const controlX = this.scale.width / 2 - 200;
    const controlY = 320;
    
    // Drum control panel
    this.add.rectangle(controlX, controlY, 180, 100, 0x333333);
    this.add.text(controlX, controlY - 35, '🥁 Drum Control', {
      fontSize: '16px',
      color: '#ffffff',
      fontStyle: 'bold'
    }).setOrigin(0.5);
    
    this.drumDisplay = this.add.text(controlX, controlY - 10, '0 RPM', {
      fontSize: '16px',
      color: '#ffffff'
    }).setOrigin(0.5);
    
    // Drum speed slider
    this.add.text(controlX - 70, controlY + 15, 'Speed:', {
      fontSize: '12px',
      color: '#ffffff'
    });
    
    this.add.rectangle(controlX, controlY + 15, 100, 8, 0x666666); // slider background
    this.drumSpeedSlider = this.add.rectangle(controlX - 50, controlY + 15, 6, 10, 0x4caf50);
    this.drumSpeedSlider.setInteractive({ draggable: true });
    
    this.drumSpeedSlider.on('drag', (_pointer: Phaser.Input.Pointer, dragX: number) => {
      const minX = controlX - 50;
      const maxX = controlX + 50;
      const clampedX = Phaser.Math.Clamp(dragX, minX, maxX);
      this.drumSpeedSlider.x = clampedX;
      
      this.drumControl.speed = ((clampedX - minX) / (maxX - minX)) * 60; // 0-60 RPM
      this.drumDisplay.setText(`${Math.round(this.drumControl.speed)} RPM`);
    });
    
    // Drum on/off - Make more prominent
    const drumToggle = this.add.text(controlX, controlY + 40, '▶️ START DRUM', {
      fontSize: '14px',
      color: '#ffffff',
      backgroundColor: '#4caf50',
      padding: { x: 12, y: 6 },
      fontStyle: 'bold'
    }).setOrigin(0.5);
    
    drumToggle.setInteractive({ useHandCursor: true });
    drumToggle.on('pointerdown', () => {
      this.drumControl.isRunning = !this.drumControl.isRunning;
      drumToggle.setText(this.drumControl.isRunning ? '⏸️ STOP DRUM' : '▶️ START DRUM');
      drumToggle.setStyle({ backgroundColor: this.drumControl.isRunning ? '#f44336' : '#4caf50' });
    });
  }

  private createRoastingControls(): void {
    const controlY = 420;
    
    // Main roasting control
    const startRoastBtn = this.add.text(this.scale.width / 2, controlY, '🔥 Start Roasting', {
      fontSize: '18px',
      color: '#ffffff',
      backgroundColor: '#ff6b35',
      padding: { x: 15, y: 8 }
    }).setOrigin(0.5);
    
    startRoastBtn.setInteractive({ useHandCursor: true });
    startRoastBtn.on('pointerdown', () => {
      if (!this.roastingState.isRoasting) {
        this.startRoasting();
        startRoastBtn.setText('🛑 Stop Roasting');
        startRoastBtn.setStyle({ backgroundColor: '#f44336' });
      } else {
        this.stopRoasting();
        startRoastBtn.setText('🔥 Start Roasting');
        startRoastBtn.setStyle({ backgroundColor: '#ff6b35' });
      }
    });
    
    // Analytics button
    const analyticsBtn = this.add.text(this.scale.width / 2 + 150, controlY, '📊 Analytics', {
      fontSize: '16px',
      color: '#ffffff',
      backgroundColor: '#2196f3',
      padding: { x: 12, y: 6 }
    }).setOrigin(0.5);
    
    analyticsBtn.setInteractive({ useHandCursor: true });
    analyticsBtn.on('pointerdown', () => {
      this.showAnalytics();
    });
  }

  private createBeanSelector(): void {
    const selectorY = 480;
    
    this.add.text(50, selectorY, 'Selected Bean:', {
      fontSize: '14px',
      color: '#ffffff'
    });
    
    // Create bean display text that will be updated
    this.beanDisplay = this.add.text(150, selectorY, 'Loading...', {
      fontSize: '14px',
      color: '#d4af37'
    });
    
    const selectBtn = this.add.text(350, selectorY, '📦 Select Bean', {
      fontSize: '14px',
      color: '#ffffff',
      backgroundColor: '#6B4423',
      padding: { x: 8, y: 4 }
    });
    
    selectBtn.setInteractive({ useHandCursor: true });
    selectBtn.on('pointerdown', () => {
      this.scene.start(SceneKeys.COFFEE_MARKET);
    });
    
    // Initial load of available beans
    this.loadAvailableBeans();
  }
  
  private loadAvailableBeans(): void {
    const inventory = this.gameStateManager.getInventory();
    console.log('DEBUG: Loading beans, inventory has', inventory.greenBeans?.length || 0, 'beans');
    
    if (inventory.greenBeans && inventory.greenBeans.length > 0) {
      // Sort by purchase date to get most recently purchased bean first
      const sortedBeans = [...inventory.greenBeans].sort((a, b) => 
        new Date(b.purchaseDate).getTime() - new Date(a.purchaseDate).getTime()
      );
      
      const selectedInventoryBean = sortedBeans[0]; // Most recent purchase
      console.log('DEBUG: Selected most recent bean:', selectedInventoryBean.beanId);
      
      // Try direct lookup first, then alternative lookup
      this.selectedBean = COFFEE_BEANS[selectedInventoryBean.beanId] || 
        Object.values(COFFEE_BEANS).find(bean => bean.id === selectedInventoryBean.beanId) || null;
      
      if (this.selectedBean) {
        this.roastingState.beanCount = selectedInventoryBean.quantity * 1000; // Convert kg to grams
        
        const displayText = `${this.selectedBean.name} (${selectedInventoryBean.quantity}kg)`;
        this.beanDisplay.setText(displayText);
        console.log('DEBUG: Successfully loaded bean:', this.selectedBean.name);
      } else {
        this.beanDisplay.setText('Bean data not found');
        this.roastingState.beanCount = 0;
        console.log('DEBUG: Bean lookup failed for:', selectedInventoryBean.beanId);
      }
    } else {
      this.beanDisplay.setText('No beans available - Go to Market!');
      this.selectedBean = null;
      this.roastingState.beanCount = 0;
      console.log('DEBUG: No beans in inventory');
    }
  }

  private createInformation(): void {
    const infoX = this.scale.width / 2 + 100;
    const infoY = 280;
    
    // Information panel
    this.add.rectangle(infoX, infoY, 200, 120, 0x1a1a1a);
    this.add.text(infoX, infoY - 50, 'Roasting Information', {
      fontSize: '14px',
      color: '#ffffff',
      fontStyle: 'bold'
    }).setOrigin(0.5);
    
    this.qualityDisplay = this.add.text(infoX, infoY - 25, 'Quality: 100%', {
      fontSize: '12px',
      color: '#4caf50'
    }).setOrigin(0.5);
    
    this.warningsDisplay = this.add.text(infoX, infoY + 50, '', {
      fontSize: '12px',
      color: '#ff4444',
      backgroundColor: '#000000',
      padding: { x: 8, y: 4 },
      wordWrap: { width: 200 }
    }).setOrigin(0.5);
    
    // Roast level indicator
    this.add.rectangle(infoX, infoY + 30, 160, 12, 0x666666); // background
    const roastLevelBar = this.add.rectangle(infoX - 80, infoY + 30, 0, 10, 0x8B4513);
    
    this.events.on('roastLevelUpdate', (level: number) => {
      roastLevelBar.width = level * 160;
      roastLevelBar.x = infoX - 80 + (level * 160 / 2);
    });
  }

  private createNavigationButtons(): void {
    const backBtn = this.add.text(30, this.scale.height - 30, '⬅️ Back to Market', {
      fontSize: '14px',
      color: '#ffffff',
      backgroundColor: '#424242',
      padding: { x: 10, y: 6 }
    });
    
    backBtn.setInteractive({ useHandCursor: true });
    backBtn.on('pointerdown', () => {
      this.scene.start(SceneKeys.COFFEE_MARKET);
    });
    
    const menuBtn = this.add.text(this.scale.width - 30, this.scale.height - 30, 'Main Menu ➡️', {
      fontSize: '14px',
      color: '#ffffff',
      backgroundColor: '#424242',
      padding: { x: 10, y: 6 }
    }).setOrigin(1, 0);
    
    menuBtn.setInteractive({ useHandCursor: true });
    menuBtn.on('pointerdown', () => {
      this.scene.start(SceneKeys.MAIN_MENU);
    });
  }

  private startRoasting(): void {
    if (!this.selectedBean || this.roastingState.beanCount <= 0) {
      this.showWarning('No beans selected! Go to Coffee Market first.');
      return;
    }
    
    this.roastingState.isRoasting = true;
    this.timingControl.isTimerRunning = true;
    this.drumControl.isRunning = true;
    
    this.roastingState.phase = 'drying';
    this.roastingState.warnings = [];
    
    // Add initial warning for testing
    this.addWarning('🔥 Roasting started - Monitor temperature carefully!');
    
    console.log('Started roasting:', this.selectedBean.name);
  }

  private stopRoasting(): void {
    this.roastingState.isRoasting = false;
    this.timingControl.isTimerRunning = false;
    this.roastingState.phase = 'cooling';
    
    // Start cooling phase instead of immediately finishing
    this.startCooling();
  }
  
  private startCooling(): void {
    console.log('Starting cooling phase...');
    
    // Initialize cooling state
    this.roastingState.coolingStartTime = this.time.now;
    this.roastingState.coolingStartTemp = this.tempControl.current;
    this.roastingState.targetCoolingTime = 180; // 3 minutes optimal cooling
    
    // Show cooling phase UI
    this.showCoolingPhase();
    
    // Start cooling timer
    this.coolingTimer = this.time.addEvent({
      delay: 100, // Update every 100ms
      callback: this.updateCooling,
      callbackScope: this,
      loop: true
    });
  }
  
  private showCoolingPhase(): void {
    // Clear roasting controls but keep some displays
    this.hideRoastingControls();
    
    // Add cooling phase header
    this.add.text(this.scale.width / 2, 50, '❄️ COOLING PHASE', {
      fontSize: '32px',
      color: '#00bcd4',
      fontStyle: 'bold'
    }).setOrigin(0.5);
    
    // Cooling instructions
    this.add.text(this.scale.width / 2, 100, 'Beans are cooling down to preserve flavor and stop development', {
      fontSize: '16px',
      color: '#cccccc'
    }).setOrigin(0.5);
    
    // Cooling progress display
    this.coolingProgressDisplay = this.add.text(this.scale.width / 2, 140, '', {
      fontSize: '18px',
      color: '#00bcd4'
    }).setOrigin(0.5);
    
    // Temperature display (larger during cooling)
    this.coolingTempDisplay = this.add.text(this.scale.width / 2, 200, '', {
      fontSize: '48px',
      color: '#ff6b35',
      fontStyle: 'bold'
    }).setOrigin(0.5);
    
    // Cooling tips
    this.add.text(this.scale.width / 2, 270, '💡 Professional Cooling Tips:', {
      fontSize: '20px',
      color: '#d4af37'
    }).setOrigin(0.5);
    
    const coolingTips = [
      '• Rapid cooling preserves desired flavor profile',
      '• Slower cooling allows continued development',
      '• Target: Cool to 50°C within 3-4 minutes',
      '• Proper cooling prevents over-roasting'
    ];
    
    coolingTips.forEach((tip, index) => {
      this.add.text(this.scale.width / 2, 310 + (index * 25), tip, {
        fontSize: '14px',
        color: '#cccccc'
      }).setOrigin(0.5);
    });
    
    // Fast cooling button (professional technique)
    const fastCoolBtn = this.add.text(this.scale.width / 2 - 100, 450, '🌪️ Fast Cool', {
      fontSize: '16px',
      color: '#ffffff',
      backgroundColor: '#00bcd4',
      padding: { x: 15, y: 10 }
    }).setOrigin(0.5);
    
    fastCoolBtn.setInteractive({ useHandCursor: true });
    fastCoolBtn.on('pointerdown', () => {
      this.roastingState.coolingRate = 3.0; // Faster cooling
      fastCoolBtn.setVisible(false);
      this.showMessage('Fast cooling activated!', '#00bcd4');
    });
    
    // Natural cooling (default)
    const naturalCoolBtn = this.add.text(this.scale.width / 2 + 100, 450, '🍃 Natural Cool', {
      fontSize: '16px', 
      color: '#ffffff',
      backgroundColor: '#4caf50',
      padding: { x: 15, y: 10 }
    }).setOrigin(0.5);
    
    naturalCoolBtn.setInteractive({ useHandCursor: true });
    naturalCoolBtn.on('pointerdown', () => {
      this.roastingState.coolingRate = 1.0; // Normal cooling
      naturalCoolBtn.setVisible(false);
      this.showMessage('Natural cooling selected', '#4caf50');
    });
    
    // Set default cooling rate
    this.roastingState.coolingRate = 1.5; // Medium cooling rate
  }
  
  private updateCooling(): void {
    if (!this.roastingState.coolingStartTime || !this.roastingState.targetCoolingTime) return;
    
    const elapsed = (this.time.now - this.roastingState.coolingStartTime) / 1000; // seconds
    const progress = Math.min(elapsed / this.roastingState.targetCoolingTime, 1.0);
    
    // Calculate cooling temperature (exponential decay)
    const startTemp = this.roastingState.coolingStartTemp || 200;
    const targetTemp = 50; // Target cooling temperature
    const coolingRate = this.roastingState.coolingRate || 1.5;
    
    this.tempControl.current = startTemp * Math.exp(-coolingRate * elapsed / 60) + targetTemp;
    this.tempControl.current = Math.max(this.tempControl.current, targetTemp);
    
    // Update cooling displays
    if (this.coolingProgressDisplay) {
      this.coolingProgressDisplay.setText(`Cooling Progress: ${Math.round(progress * 100)}%`);
    }
    
    if (this.coolingTempDisplay) {
      this.coolingTempDisplay.setText(`${Math.round(this.tempControl.current)}°C`);
    }
    
    // Check if cooling is complete
    if (this.tempControl.current <= 60 || elapsed >= this.roastingState.targetCoolingTime * 1.2) {
      this.completeCooling();
    }
  }
  
  private completeCooling(): void {
    console.log('Cooling phase complete');
    
    // Stop cooling timer
    if (this.coolingTimer) {
      this.coolingTimer.destroy();
    }
    
    // Calculate cooling quality impact
    const coolingTime = this.roastingState.coolingStartTime ? 
      (this.time.now - this.roastingState.coolingStartTime) / 1000 : 180;
    const coolingBonus = this.calculateCoolingBonus(coolingTime);
    this.roastingState.quality += coolingBonus;
    
    // Proceed to quality analysis
    this.finishRoasting();
  }
  
  private calculateCoolingBonus(coolingTime: number): number {
    // Professional cooling timing bonus
    if (coolingTime <= 180) { // Under 3 minutes - excellent
      return 5;
    } else if (coolingTime <= 240) { // Under 4 minutes - good  
      return 2;
    } else if (coolingTime <= 300) { // Under 5 minutes - acceptable
      return 0;
    } else { // Too slow - penalty
      return -3;
    }
  }
  
  private hideRoastingControls(): void {
    // Hide main roasting controls during cooling
    // Keep temperature and time displays visible but disable controls
  }

  private resetRoasting(): void {
    this.roastingState = {
      isRoasting: false,
      temperature: 20,
      targetTemperature: 20,
      time: 0,
      phase: 'drying',
      roastLevel: 0,
      drumSpeed: 0,
      moisture: 12,
      beanCount: this.roastingState.beanCount,
      quality: 100,
      warnings: []
    };
    
    this.tempControl.current = 20;
    this.tempControl.target = 20;
    this.timingControl.totalTime = 0;
    this.timingControl.phaseTime = 0;
    this.temperatureChart = [];
  }

  private updateRoasting(): void {
    if (!this.roastingState.isRoasting) return;
    
    const deltaTime = 0.1; // 100ms
    
    // Update time
    if (this.timingControl.isTimerRunning) {
      this.timingControl.totalTime += deltaTime;
      this.timingControl.phaseTime += deltaTime;
      this.roastingState.time = this.timingControl.totalTime;
    }
    
    // Update temperature
    this.updateTemperature(deltaTime);
    
    // Update roasting progression
    this.updateRoastingProgression(deltaTime);
    
    // Update phase
    this.updateRoastingPhase();
    
    // Update quality
    this.updateQuality();
    
    // Update UI
    this.updateUI();
    
    // Record data for chart
    this.temperatureChart.push({
      time: this.timingControl.totalTime,
      temp: this.tempControl.current,
      roastLevel: this.roastingState.roastLevel
    });
  }

  private updateTemperature(deltaTime: number): void {
    // Temperature follows heat power with realistic heating curve
    const heatPower = this.tempControl.heatPower / 100;
    const maxHeatingRate = 5; // °C per second at full power
    const coolingRate = 0.5; // Natural cooling rate
    
    let targetTemp = this.tempControl.target;
    if (heatPower > 0) {
      targetTemp = Math.min(this.tempControl.maxTemp, 20 + (this.tempControl.maxTemp - 20) * heatPower);
    }
    
    const tempDiff = targetTemp - this.tempControl.current;
    const heatingRate = tempDiff > 0 ? maxHeatingRate * heatPower : -coolingRate;
    
    this.tempControl.current += heatingRate * deltaTime;
    this.tempControl.current = Phaser.Math.Clamp(this.tempControl.current, this.tempControl.minTemp, this.tempControl.maxTemp);
    
    this.roastingState.temperature = this.tempControl.current;
    this.drumControl.temperature = this.tempControl.current;
  }

  private updateRoastingProgression(deltaTime: number): void {
    if (!this.selectedBean) return;
    
    const temp = this.tempControl.current;
    const roastingRate = this.calculateRoastingRate(temp);
    
    // Update roast level
    this.roastingState.roastLevel += roastingRate * deltaTime;
    this.roastingState.roastLevel = Phaser.Math.Clamp(this.roastingState.roastLevel, 0, 1);
    
    // Update moisture
    if (temp > 100) {
      const moistureRate = (temp - 100) / 1000;
      this.roastingState.moisture -= moistureRate * deltaTime;
      this.roastingState.moisture = Math.max(1, this.roastingState.moisture);
    }
    
    this.events.emit('roastLevelUpdate', this.roastingState.roastLevel);
  }

  private calculateRoastingRate(temperature: number): number {
    // Roasting rate based on temperature
    if (temperature < 160) return 0;
    if (temperature < 180) return 0.001;
    if (temperature < 200) return 0.005;
    if (temperature < 220) return 0.015;
    if (temperature < 240) return 0.025;
    return 0.04; // Very fast roasting at high temps
  }

  private updateRoastingPhase(): void {
    const time = this.timingControl.totalTime;
    const temp = this.tempControl.current;
    const roastLevel = this.roastingState.roastLevel;
    
    if (time < 180 && temp < 160) {
      this.roastingState.phase = 'drying';
    } else if (time < 360 && roastLevel < 0.3) {
      this.roastingState.phase = 'maillard';
    } else if (roastLevel < 0.6) {
      this.roastingState.phase = 'first_crack';
    } else if (roastLevel < 0.8) {
      this.roastingState.phase = 'development';
    } else {
      this.roastingState.phase = 'second_crack';
    }
  }

  private updateQuality(): void {
    let quality = 100;
    
    // Temperature too high penalty
    if (this.tempControl.current > 200) { // Lowered from 240 for easier testing
      quality -= 30;
      this.addWarning('Temperature too high! Risk of burning.');
    }
    
    // Too fast roasting penalty
    const time = this.timingControl.totalTime;
    if (this.roastingState.roastLevel > 0.5 && time < 300) {
      quality -= 20;
      this.addWarning('Roasting too fast! Beans need more development time.');
    }
    
    // Drum not running penalty
    if (!this.drumControl.isRunning) {
      quality -= 15;
      this.addWarning('Drum not running! Beans will roast unevenly.');
    }
    
    // Update quality gradually
    this.roastingState.quality = Phaser.Math.Linear(this.roastingState.quality, quality, 0.1);
  }

  private addWarning(warning: string): void {
    if (!this.roastingState.warnings.includes(warning)) {
      this.roastingState.warnings.push(warning);
      console.log('DEBUG: Warning added:', warning);
      console.log('DEBUG: Total warnings:', this.roastingState.warnings.length);
    }
  }

  private updateUI(): void {
    // Update temperature display
    this.temperatureDisplay.setText(`${Math.round(this.tempControl.current)}°C`);
    
    // Update time display
    const minutes = Math.floor(this.timingControl.totalTime / 60);
    const seconds = Math.floor(this.timingControl.totalTime % 60);
    this.timeDisplay.setText(`${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`);
    
    // Update phase display
    this.phaseDisplay.setText(this.roastingState.phase.replace('_', ' ').toUpperCase());
    
    // Update quality display
    this.qualityDisplay.setText(`Quality: ${Math.round(this.roastingState.quality)}%`);
    
    // Update warnings
    const warningText = this.roastingState.warnings.join('\n');
    this.warningsDisplay.setText(warningText);
    console.log('DEBUG: Updating warnings display:', warningText);
    
    // Update drum visual
    this.updateDrumVisual();
  }

  private finishRoasting(): void {
    console.log('Finished roasting with quality:', this.roastingState.quality);
    
    // Create roasted coffee result
    const roastedCoffee = {
      type: 'roasted-beans',
      beanId: this.selectedBean?.id || '',
      quantity: this.roastingState.beanCount / 1000, // Convert back to kg
      roastLevel: this.getRoastLevelName(),
      quality: this.roastingState.quality,
      totalTime: this.timingControl.totalTime,
      finalTemperature: this.tempControl.current,
      roastDate: new Date()
    };
    
    // Add to inventory
    this.gameStateManager.addInventoryItem(roastedCoffee);
    
    // Show completion message and quality analysis
    this.showQualityAnalysis(roastedCoffee);
  }
  
  private showQualityAnalysis(roastedCoffee: any): void {
    // Clear existing UI
    this.children.removeAll();
    
    // Create quality analysis screen
    this.add.text(this.scale.width / 2, 50, '☕ Quality Analysis Results', {
      fontSize: '32px',
      color: '#d4af37',
      fontStyle: 'bold'
    }).setOrigin(0.5);
    
    // Bean info
    const beanName = this.selectedBean?.name || 'Unknown Bean';
    this.add.text(this.scale.width / 2, 120, beanName, {
      fontSize: '24px',
      color: '#8b4513'
    }).setOrigin(0.5);
    
    // Quality score with color coding
    const qualityColor = roastedCoffee.quality >= 80 ? '#4caf50' : 
                        roastedCoffee.quality >= 60 ? '#ff9800' : '#f44336';
    
    this.add.text(this.scale.width / 2, 180, `Quality Score: ${Math.round(roastedCoffee.quality)}%`, {
      fontSize: '28px',
      color: qualityColor,
      fontStyle: 'bold'
    }).setOrigin(0.5);
    
    // Roast details
    const detailsY = 250;
    this.add.text(this.scale.width / 2, detailsY, `Roast Level: ${roastedCoffee.roastLevel}`, {
      fontSize: '18px',
      color: '#ffffff'
    }).setOrigin(0.5);
    
    this.add.text(this.scale.width / 2, detailsY + 30, `Total Time: ${Math.floor(roastedCoffee.totalTime / 60)}:${(roastedCoffee.totalTime % 60).toFixed(0).padStart(2, '0')}`, {
      fontSize: '18px',
      color: '#ffffff'
    }).setOrigin(0.5);
    
    this.add.text(this.scale.width / 2, detailsY + 60, `Final Temperature: ${Math.round(roastedCoffee.finalTemperature)}°C`, {
      fontSize: '18px',
      color: '#ffffff'
    }).setOrigin(0.5);
    
    // Flavor profile analysis
    this.add.text(this.scale.width / 2, detailsY + 110, '🔬 Flavor Profile Analysis:', {
      fontSize: '20px',
      color: '#d4af37'
    }).setOrigin(0.5);
    
    const flavor = this.selectedBean?.flavor;
    if (flavor) {
      const flavorY = detailsY + 150;
      this.add.text(this.scale.width / 4, flavorY, `Acidity: ${flavor.acidity}/10`, { fontSize: '16px', color: '#ffffff' });
      this.add.text(this.scale.width * 3/4, flavorY, `Sweetness: ${flavor.sweetness}/10`, { fontSize: '16px', color: '#ffffff' });
      this.add.text(this.scale.width / 4, flavorY + 25, `Body: ${flavor.body}/10`, { fontSize: '16px', color: '#ffffff' });
      this.add.text(this.scale.width * 3/4, flavorY + 25, `Aroma: ${flavor.aroma}/10`, { fontSize: '16px', color: '#ffffff' });
    }
    
    // Professional feedback
    const feedback = this.getQualityFeedback(roastedCoffee.quality);
    this.add.text(this.scale.width / 2, 480, feedback, {
      fontSize: '16px',
      color: '#cccccc',
      align: 'center',
      wordWrap: { width: 600 }
    }).setOrigin(0.5);
    
    // Action buttons
    const btnY = this.scale.height - 80;
    
    const roastAgainBtn = this.add.text(this.scale.width / 3, btnY, '🔄 Roast Again', {
      fontSize: '18px',
      color: '#ffffff',
      backgroundColor: '#4caf50',
      padding: { x: 15, y: 10 }
    }).setOrigin(0.5);
    
    roastAgainBtn.setInteractive({ useHandCursor: true });
    roastAgainBtn.on('pointerdown', () => {
      this.scene.restart(); // Restart the roasting lab
    });
    
    const marketBtn = this.add.text(this.scale.width * 2/3, btnY, '🛒 Coffee Market', {
      fontSize: '18px',
      color: '#ffffff',
      backgroundColor: '#8b4513',
      padding: { x: 15, y: 10 }
    }).setOrigin(0.5);
    
    marketBtn.setInteractive({ useHandCursor: true });
    marketBtn.on('pointerdown', () => {
      this.scene.start('coffee-market');
    });
  }
  
  private getQualityFeedback(quality: number): string {
    if (quality >= 90) {
      return "Exceptional! This roast showcases the bean's full potential with perfect development and balanced flavor notes.";
    } else if (quality >= 80) {
      return "Excellent roasting! Great flavor development with minor room for improvement in timing or temperature control.";
    } else if (quality >= 70) {
      return "Good roast with solid flavor development. Consider adjusting temperature curve for better extraction.";
    } else if (quality >= 60) {
      return "Acceptable roast but some flavors are underdeveloped. Try longer development time or better heat management.";
    } else {
      return "This roast needs improvement. Check temperature control, timing, and drum rotation for better results.";
    }
  }

  private getRoastLevelName(): string {
    const level = this.roastingState.roastLevel;
    if (level < 0.2) return 'Light';
    if (level < 0.4) return 'Medium-Light';
    if (level < 0.6) return 'Medium';
    if (level < 0.8) return 'Medium-Dark';
    return 'Dark';
  }

  private showAnalytics(): void {
    if (!this.selectedBean) return;
    
    // Clear existing UI
    this.children.removeAll();
    
    // Create analytics screen
    this.add.text(this.scale.width / 2, 30, '🔬 Professional Roasting Guide', {
      fontSize: '28px',
      color: '#d4af37',
      fontStyle: 'bold'
    }).setOrigin(0.5);
    
    // Bean information header
    this.add.text(this.scale.width / 2, 80, this.selectedBean.name, {
      fontSize: '24px',
      color: '#8b4513',
      fontStyle: 'bold'
    }).setOrigin(0.5);
    
    this.add.text(this.scale.width / 2, 110, `Origin: ${this.selectedBean.origin.country} - ${this.selectedBean.origin.region}`, {
      fontSize: '16px',
      color: '#cccccc'
    }).setOrigin(0.5);
    
    // Bean characteristics
    const charY = 150;
    this.add.text(this.scale.width / 2, charY, '📊 Bean Characteristics:', {
      fontSize: '20px',
      color: '#d4af37'
    }).setOrigin(0.5);
    
    this.add.text(this.scale.width / 4, charY + 30, `Difficulty: ${this.getDifficultyName(this.selectedBean.roasting.difficulty)}`, {
      fontSize: '14px',
      color: '#ffffff'
    });
    
    this.add.text(this.scale.width * 3/4, charY + 30, `Heat Sensitivity: ${this.selectedBean.roasting.heatSensitivity}`, {
      fontSize: '14px',
      color: '#ffffff'
    });
    
    this.add.text(this.scale.width / 4, charY + 50, `Development Window: ${this.selectedBean.roasting.developmentWindow}s`, {
      fontSize: '14px',
      color: '#ffffff'
    });
    
    this.add.text(this.scale.width * 3/4, charY + 50, `Crack Temp: ${this.selectedBean.roasting.crackTemperature[0]}-${this.selectedBean.roasting.crackTemperature[1]}°C`, {
      fontSize: '14px',
      color: '#ffffff'
    });
    
    // Professional roasting profiles
    const profileY = 230;
    this.add.text(this.scale.width / 2, profileY, '☕ Professional Roasting Profiles:', {
      fontSize: '20px',
      color: '#d4af37'
    }).setOrigin(0.5);
    
    // Get roasting profiles for this bean
    const profiles = this.getRoastingProfiles(this.selectedBean);
    
    // Light roast profile
    this.createRoastProfile('Light Roast', profiles.light, this.scale.width / 4, profileY + 40, '#ffd54f');
    
    // Medium roast profile  
    this.createRoastProfile('Medium Roast', profiles.medium, this.scale.width / 2, profileY + 40, '#ff8f00');
    
    // Dark roast profile
    this.createRoastProfile('Dark Roast', profiles.dark, this.scale.width * 3/4, profileY + 40, '#5d4037');
    
    // Professional tips
    const tipsY = profileY + 200;
    this.add.text(this.scale.width / 2, tipsY, '💡 Professional Tips:', {
      fontSize: '20px',
      color: '#d4af37'
    }).setOrigin(0.5);
    
    const tips = this.selectedBean.advice.beginnerTips;
    tips.slice(0, 3).forEach((tip, index) => {
      this.add.text(this.scale.width / 2, tipsY + 30 + (index * 25), `• ${tip}`, {
        fontSize: '14px',
        color: '#cccccc',
        wordWrap: { width: 700 }
      }).setOrigin(0.5);
    });
    
    // Navigation buttons
    const btnY = this.scale.height - 60;
    
    const backBtn = this.add.text(this.scale.width / 3, btnY, '⬅️ Back to Roasting', {
      fontSize: '18px',
      color: '#ffffff',
      backgroundColor: '#4caf50',
      padding: { x: 15, y: 10 }
    }).setOrigin(0.5);
    
    backBtn.setInteractive({ useHandCursor: true });
    backBtn.on('pointerdown', () => {
      this.scene.restart(); // Restart roasting lab
    });
    
    const marketBtn = this.add.text(this.scale.width * 2/3, btnY, '🛒 Coffee Market', {
      fontSize: '18px',
      color: '#ffffff',
      backgroundColor: '#8b4513',
      padding: { x: 15, y: 10 }
    }).setOrigin(0.5);
    
    marketBtn.setInteractive({ useHandCursor: true });
    marketBtn.on('pointerdown', () => {
      this.scene.start('coffee-market');
    });
  }
  
  private createRoastProfile(name: string, profile: any, x: number, y: number, color: string): void {
    // Profile box background
    this.add.rectangle(x, y + 70, 200, 140, 0x333333).setStrokeStyle(2, parseInt(color.replace('#', '0x')));
    
    // Profile name
    this.add.text(x, y, name, {
      fontSize: '16px',
      color: color,
      fontStyle: 'bold'
    }).setOrigin(0.5);
    
    // Profile parameters
    this.add.text(x, y + 25, `⏱️ Time: ${profile.time}`, {
      fontSize: '12px',
      color: '#ffffff'
    }).setOrigin(0.5);
    
    this.add.text(x, y + 45, `🌡️ Temp: ${profile.temperature}°C`, {
      fontSize: '12px',
      color: '#ffffff'
    }).setOrigin(0.5);
    
    this.add.text(x, y + 65, `🥁 Drum: ${profile.drumSpeed} RPM`, {
      fontSize: '12px',
      color: '#ffffff'
    }).setOrigin(0.5);
    
    this.add.text(x, y + 85, `📈 Phases:`, {
      fontSize: '11px',
      color: '#cccccc'
    }).setOrigin(0.5);
    
    this.add.text(x, y + 105, profile.phases, {
      fontSize: '10px',
      color: '#cccccc',
      wordWrap: { width: 180 },
      align: 'center'
    }).setOrigin(0.5);
  }
  
  private getRoastingProfiles(bean: any): any {
    const baseTemp = bean.roasting.optimalRange[0];
    const maxTemp = bean.roasting.optimalRange[1];
    
    return {
      light: {
        time: '8-10 min',
        temperature: `${baseTemp}-${baseTemp + 15}`,
        drumSpeed: '25-35',
        phases: 'Dry: 3-4 min\nMaillard: 2-3 min\n1st Crack: Begin\nDev: 1-2 min'
      },
      medium: {
        time: '10-12 min', 
        temperature: `${baseTemp + 10}-${maxTemp}`,
        drumSpeed: '30-40',
        phases: 'Dry: 4-5 min\nMaillard: 3-4 min\n1st Crack: Full\nDev: 2-3 min'
      },
      dark: {
        time: '12-15 min',
        temperature: `${maxTemp}-${maxTemp + 20}`,
        drumSpeed: '35-45', 
        phases: 'Dry: 5-6 min\nMaillard: 4-5 min\n1st+2nd Crack\nDev: 3-4 min'
      }
    };
  }
  
  private getDifficultyName(level: number): string {
    switch(level) {
      case 1: return 'Beginner';
      case 2: return 'Intermediate';
      case 3: return 'Advanced';
      case 4: return 'Expert';
      case 5: return 'Master';
      default: return 'Unknown';
    }
  }

  private showWarning(message: string): void {
    const warningText = this.add.text(this.scale.width / 2, this.scale.height / 2, message, {
      fontSize: '18px',
      color: '#ff9800',
      backgroundColor: '#000000',
      padding: { x: 15, y: 8 }
    }).setOrigin(0.5).setDepth(1000);
    
    this.time.delayedCall(3000, () => {
      warningText.destroy();
    });
  }

  private showMessage(message: string, color: string): void {
    const messageText = this.add.text(this.scale.width / 2, this.scale.height / 2, message, {
      fontSize: '20px',
      color: color,
      backgroundColor: '#000000',
      padding: { x: 15, y: 8 }
    }).setOrigin(0.5).setDepth(1000);
    
    this.time.delayedCall(3000, () => {
      messageText.destroy();
    });
  }
}
