/**
 * Simplified Game Scene for Testing
 * Now includes Customer AI Learning System
 */

import Phaser from 'phaser';
import { SceneKeys } from '../types/GameTypes';
import { CustomerLearningManager } from '../components/CustomerLearningManager';
import type { GameInteractionEvent } from '../components/CustomerLearningManager';
import { ChemistryAnalyticsPanel, type ChemistryData } from '../components/ChemistryAnalyticsPanel';
import { CoffeeChemistry } from '../utils/CoffeeChemistry';

export class SimpleGameScene extends Phaser.Scene {
  private learningManager!: CustomerLearningManager;
  private analyticsPanel!: ChemistryAnalyticsPanel;
  private currentCustomerId: string = 'customer_001';
  private gameTime: number = 0;
  private shopBusyness: number = 0.3;

  constructor() {
    super({ key: SceneKeys.SIMPLE_GAME });
    console.log('SimpleGameScene constructor called');
  }

  create() {
    console.log('SimpleGameScene create started');
    
    // Initialize learning manager and analytics panel
    this.learningManager = new CustomerLearningManager(this);
    this.analyticsPanel = new ChemistryAnalyticsPanel(this);
    
    // Background
    this.add.rectangle(this.scale.width / 2, this.scale.height / 2, this.scale.width, this.scale.height, 0x8B4513);
    
    // Title
    this.add.text(this.scale.width / 2, 50, 'Coffee Roasting Lab - AI Learning Demo', {
      fontSize: '32px',
      color: '#ffffff'
    }).setOrigin(0.5);
    
    // Customer AI Demo Area
    this.add.rectangle(this.scale.width / 2, 200, 700, 120, 0x654321);
    this.add.text(this.scale.width / 2, 160, 'Customer AI Learning System Demo', {
      fontSize: '24px',
      color: '#ffffff'
    }).setOrigin(0.5);
    
    // Get current customer AI
    const customerAI = this.learningManager.getCustomerAI(this.currentCustomerId);
    customerAI.update({ gameTime: this.gameTime, shopBusyness: this.shopBusyness });
    
    // Demo buttons
    this.createDemoButtons();
    
    // Navigation buttons
    this.createNavigationButtons();
    
    // Display customer analytics
    this.createAnalyticsDisplay();
    
    console.log('SimpleGameScene created successfully');
  }

  private createDemoButtons(): void {
    // Serve Good Coffee button
    const goodCoffeeBtn = this.add.text(150, 300, 'Serve Great Coffee', {
      fontSize: '20px',
      color: '#ffffff',
      backgroundColor: '#2e7d32',
      padding: { x: 15, y: 8 }
    }).setOrigin(0.5);
    
    goodCoffeeBtn.setInteractive({ useHandCursor: true });
    goodCoffeeBtn.on('pointerdown', () => {
      this.simulateInteraction('coffee_served', {
        coffeeQuality: 85,
        responseTime: 45,
        coffeeDetails: {
          roast: 'medium',
          flavor: 'chocolatey',
          temperature: 165,
          quality: 85
        }
      });
    });
    
    // Serve Poor Coffee button
    const poorCoffeeBtn = this.add.text(400, 300, 'Serve Poor Coffee', {
      fontSize: '20px',
      color: '#ffffff',
      backgroundColor: '#d32f2f',
      padding: { x: 15, y: 8 }
    }).setOrigin(0.5);
    
    poorCoffeeBtn.setInteractive({ useHandCursor: true });
    poorCoffeeBtn.on('pointerdown', () => {
      this.simulateInteraction('coffee_served', {
        coffeeQuality: 25,
        responseTime: 120,
        coffeeDetails: {
          roast: 'dark',
          flavor: 'bitter',
          temperature: 140,
          quality: 25
        }
      });
    });
    
    // Ignore Customer button
    const ignoreBtn = this.add.text(650, 300, 'Ignore Customer', {
      fontSize: '20px',
      color: '#ffffff',
      backgroundColor: '#795548',
      padding: { x: 15, y: 8 }
    }).setOrigin(0.5);
    
    ignoreBtn.setInteractive({ useHandCursor: true });
    ignoreBtn.on('pointerdown', () => {
      this.simulateInteraction('customer_ignored', {});
    });
    
    // New Customer button
    const newCustomerBtn = this.add.text(400, 360, 'New Customer', {
      fontSize: '18px',
      color: '#ffffff',
      backgroundColor: '#1976d2',
      padding: { x: 15, y: 8 }
    }).setOrigin(0.5);
    
    newCustomerBtn.setInteractive({ useHandCursor: true });
    newCustomerBtn.on('pointerdown', () => {
      this.currentCustomerId = 'customer_' + Math.floor(Math.random() * 1000).toString().padStart(3, '0');
      const customerAI = this.learningManager.getCustomerAI(this.currentCustomerId, true);
      customerAI.update({ gameTime: this.gameTime, shopBusyness: this.shopBusyness });
      this.updateAnalyticsDisplay();
    });
    
    // Add Chemistry Demo Buttons
    this.createChemistryDemoButtons();
  }

  private createChemistryDemoButtons(): void {
    // Chemistry Demo Section
    this.add.rectangle(this.scale.width / 2, 450, 700, 100, 0x2d5016);
    this.add.text(this.scale.width / 2, 410, 'Coffee Chemistry Demo', {
      fontSize: '20px',
      color: '#ffffff'
    }).setOrigin(0.5);
    
    // Light Roast Chemistry
    const lightRoastBtn = this.add.text(200, 450, 'Light Roast\n(190°C, 8min)', {
      fontSize: '16px',
      color: '#ffffff',
      backgroundColor: '#8d6e63',
      padding: { x: 10, y: 8 },
      align: 'center'
    }).setOrigin(0.5);
    
    lightRoastBtn.setInteractive({ useHandCursor: true });
    lightRoastBtn.on('pointerdown', () => {
      this.demonstrateChemistry(190, 480, 'arabica', 'Light Roast');
    });
    
    // Medium Roast Chemistry
    const mediumRoastBtn = this.add.text(400, 450, 'Medium Roast\n(210°C, 10min)', {
      fontSize: '16px',
      color: '#ffffff',
      backgroundColor: '#5d4037',
      padding: { x: 10, y: 8 },
      align: 'center'
    }).setOrigin(0.5);
    
    mediumRoastBtn.setInteractive({ useHandCursor: true });
    mediumRoastBtn.on('pointerdown', () => {
      this.demonstrateChemistry(210, 600, 'arabica', 'Medium Roast');
    });
    
    // Dark Roast Chemistry
    const darkRoastBtn = this.add.text(600, 450, 'Dark Roast\n(230°C, 12min)', {
      fontSize: '16px',
      color: '#ffffff',
      backgroundColor: '#3e2723',
      padding: { x: 10, y: 8 },
      align: 'center'
    }).setOrigin(0.5);
    
    darkRoastBtn.setInteractive({ useHandCursor: true });
    darkRoastBtn.on('pointerdown', () => {
      this.demonstrateChemistry(230, 720, 'arabica', 'Dark Roast');
    });
    
    // Advanced Analytics Button
    const analyticsBtn = this.add.text(this.scale.width / 2, 500, '📊 Advanced Chemistry Analytics', {
      fontSize: '18px',
      color: '#ffffff',
      backgroundColor: '#1565c0',
      padding: { x: 15, y: 10 }
    }).setOrigin(0.5);
    
    analyticsBtn.setInteractive({ useHandCursor: true });
    analyticsBtn.on('pointerdown', () => {
      // Show analytics for a default medium roast
      this.showDetailedAnalytics(210, 600, 'arabica', 'Sample Medium Roast');
    });
    
    analyticsBtn.on('pointerover', () => {
      analyticsBtn.setStyle({ backgroundColor: '#1976d2' });
    });
    
    analyticsBtn.on('pointerout', () => {
      analyticsBtn.setStyle({ backgroundColor: '#1565c0' });
    });
  }

  private showDetailedAnalytics(temperature: number, time: number, beanType: string, _roastName: string): void {
    // Calculate detailed chemistry data
    const flavorProfile = CoffeeChemistry.calculateFlavorProfile(temperature, time, beanType);
    const scaScore = CoffeeChemistry.calculateSCAScore(flavorProfile);
    const analysis = CoffeeChemistry.getEducationalAnalysis(flavorProfile, temperature, time);
    
    const chemistryData: ChemistryData = {
      temperature,
      time,
      beanType,
      flavorProfile,
      scaScore,
      analysis
    };
    
    this.analyticsPanel.showAnalytics(chemistryData);
  }

  private demonstrateChemistry(temperature: number, time: number, beanType: string, roastName: string): void {
    const customerAI = this.learningManager.getCustomerAI(this.currentCustomerId);
    
    // Evaluate coffee using sophisticated chemistry
    const evaluation = customerAI.evaluateCoffeeChemistry(temperature, time, beanType);
    
    // Get detailed flavor profile from CoffeeChemistry system
    const flavorProfile = CoffeeChemistry.calculateFlavorProfile(temperature, time, beanType);
    const scaScore = CoffeeChemistry.calculateSCAScore(flavorProfile);
    const analysis = CoffeeChemistry.getEducationalAnalysis(flavorProfile, temperature, time);
    
    // Learn from this experience
    customerAI.learnFromChemicalExperience(flavorProfile, evaluation.satisfaction, {
      temperature,
      time,
      beanType
    });
    
    // Display enhanced analytics panel
    const chemistryData: ChemistryData = {
      temperature,
      time,
      beanType,
      flavorProfile,
      scaScore,
      analysis
    };
    
    this.analyticsPanel.showAnalytics(chemistryData);
    
    // Also display brief results for quick reference
    this.displayChemistryResults(roastName, evaluation);
    this.updateAnalyticsDisplay();
  }

  private displayChemistryResults(roastName: string, evaluation: any): void {
    // Clear any existing result text
    const existingResults = this.children.getByName('chemistryResults');
    if (existingResults) {
      existingResults.destroy();
    }
    
    // Create results display
    const results = this.add.group([], { name: 'chemistryResults' });
    
    // Background for results
    const resultBg = this.add.rectangle(this.scale.width / 2, 550, 680, 100, 0x1a1a1a, 0.9);
    results.add(resultBg);
    
    // Results text
    const resultText = this.add.text(this.scale.width / 2, 530, 
      `${roastName} Results:\nSatisfaction: ${evaluation.satisfaction.toFixed(1)}% | Feedback: "${evaluation.feedback}"`, {
      fontSize: '14px',
      color: '#ffffff',
      align: 'center',
      wordWrap: { width: 650 }
    }).setOrigin(0.5);
    results.add(resultText);
    
    // Enhanced chemistry analysis button
    const analysisBtn = this.add.text(this.scale.width / 2, 570, '🔬 View Detailed Chemistry Analytics', {
      fontSize: '14px',
      color: '#ffeb3b',
      backgroundColor: '#424242',
      padding: { x: 12, y: 6 }
    }).setOrigin(0.5);
    
    analysisBtn.setInteractive({ useHandCursor: true });
    analysisBtn.on('pointerdown', () => {
      // The detailed analytics panel is already shown, but we can toggle it
      console.log('Detailed Analytics Panel is displayed above');
    });
    
    analysisBtn.on('pointerover', () => {
      analysisBtn.setStyle({ backgroundColor: '#616161' });
    });
    
    analysisBtn.on('pointerout', () => {
      analysisBtn.setStyle({ backgroundColor: '#424242' });
    });
    
    results.add(analysisBtn);
    
    // Auto-remove after 8 seconds (longer time to read the enhanced info)
    this.time.delayedCall(8000, () => {
      if (results && results.scene) {
        results.destroy(true);
      }
    });
  }

  private createNavigationButtons(): void {
    // Tutorial button
    const tutorialButton = this.add.text(150, 500, 'Tutorial', {
      fontSize: '24px',
      color: '#ffffff',
      backgroundColor: '#8B4513',
      padding: { x: 15, y: 8 }
    }).setOrigin(0.5);
    
    tutorialButton.setInteractive({ useHandCursor: true });
    tutorialButton.on('pointerover', () => {
      tutorialButton.setStyle({ backgroundColor: '#d4af37' });
    });
    tutorialButton.on('pointerout', () => {
      tutorialButton.setStyle({ backgroundColor: '#8B4513' });
    });
    tutorialButton.on('pointerdown', () => {
      console.log('Going to tutorial');
      this.scene.start(SceneKeys.TUTORIAL);
    });
    
    // Back to menu button
    const menuButton = this.add.text(650, 500, 'Main Menu', {
      fontSize: '24px',
      color: '#ffffff',
      backgroundColor: '#555555',
      padding: { x: 15, y: 8 }
    }).setOrigin(0.5);
    
    menuButton.setInteractive({ useHandCursor: true });
    menuButton.on('pointerover', () => {
      menuButton.setStyle({ backgroundColor: '#777777' });
    });
    menuButton.on('pointerout', () => {
      menuButton.setStyle({ backgroundColor: '#555555' });
    });
    menuButton.on('pointerdown', () => {
      console.log('Back to main menu');
      this.scene.start(SceneKeys.MAIN_MENU);
    });
  }

  private createAnalyticsDisplay(): void {
    this.updateAnalyticsDisplay();
  }

  private updateAnalyticsDisplay(): void {
    // Clear previous analytics
    const existingAnalytics = this.children.getByName('analytics');
    if (existingAnalytics) {
      existingAnalytics.destroy();
    }
    
    const customerAI = this.learningManager.getCustomerAI(this.currentCustomerId);
    const analytics = customerAI.getAnalytics();
    const globalMetrics = this.learningManager.getGlobalMetrics();
    
    const analyticsText = [
      `Customer ID: ${this.currentCustomerId}`,
      `Visit Count: ${analytics.visitCount}`,
      `Loyalty Level: ${Math.round(analytics.loyaltyLevel)}%`,
      `Player Skill (AI's view): ${Math.round(analytics.learningMetrics.playerSkillLevel)}%`,
      ``,
      `Global Stats:`,
      `Total Served: ${globalMetrics.totalCustomersServed}`,
      `Avg Satisfaction: ${Math.round(globalMetrics.averageSatisfaction)}%`,
      `Avg Service Time: ${Math.round(globalMetrics.averageServiceTime)}s`
    ].join('\n');
    
    const analyticsDisplay = this.add.text(50, 400, analyticsText, {
      fontSize: '14px',
      color: '#ffffff',
      backgroundColor: '#000000',
      padding: { x: 10, y: 10 }
    });
    analyticsDisplay.setAlpha(0.8);
    analyticsDisplay.setName('analytics');
  }

  private simulateInteraction(type: GameInteractionEvent['type'], data: GameInteractionEvent['data']): void {
    const event: GameInteractionEvent = {
      type,
      customerID: this.currentCustomerId,
      data,
      gameContext: {
        gameTime: this.gameTime,
        shopBusyness: this.shopBusyness,
        playerLevel: 1
      }
    };
    
    this.learningManager.processInteraction(event);
    
    // Update the customer AI
    const customerAI = this.learningManager.getCustomerAI(this.currentCustomerId);
    customerAI.update({ gameTime: this.gameTime, shopBusyness: this.shopBusyness });
    
    // Update analytics display
    this.updateAnalyticsDisplay();
    
    // Increment game time
    this.gameTime += 60;
  }
}
