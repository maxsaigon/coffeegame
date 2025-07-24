/**
 * Coffee Market Scene - Bean Selection and Purchase Interface
 * Professional bean market with authentic varieties and pricing
 */

import Phaser from 'phaser';
import { SceneKeys } from '../types/GameTypes';
import { COFFEE_BEANS, calculateCurrentPrice, isBeanInSeason } from '../data/CoffeeBeans';
import type { CoffeeBeanData } from '../types/GameTypes';
import { GameStateManager } from '../managers/GameStateManager';

interface BeanCard {
  container: Phaser.GameObjects.Container;
  beanData: CoffeeBeanData;
  priceText: Phaser.GameObjects.Text;
  quantityText: Phaser.GameObjects.Text;
  selectedQuantity: number;
}

export class CoffeeMarketScene extends Phaser.Scene {
  private gameStateManager!: GameStateManager;
  private beanCards: BeanCard[] = [];
  private selectedBeans: Map<string, number> = new Map();
  private totalCostText!: Phaser.GameObjects.Text;
  private playerMoneyText!: Phaser.GameObjects.Text;
  private currentMonth: number = new Date().getMonth() + 1;
  
  constructor() {
    super({ key: SceneKeys.COFFEE_MARKET });
  }

  create() {
    console.log('CoffeeMarketScene created');
    
    // Initialize game state manager
    this.gameStateManager = GameStateManager.getInstance();
    
    // Background
    this.add.rectangle(this.scale.width / 2, this.scale.height / 2, this.scale.width, this.scale.height, 0x2d1b0e);
    
    // Header
    this.createHeader();
    
    // Bean market grid
    this.createBeanMarket();
    
    // Shopping cart UI
    this.createShoppingCart();
    
    // Navigation buttons
    this.createNavigationButtons();
  }

  private createHeader(): void {
    // Title
    this.add.text(this.scale.width / 2, 40, '☕ Global Coffee Market', {
      fontSize: '36px',
      color: '#d4af37',
      fontStyle: 'bold'
    }).setOrigin(0.5);
    
    // Subtitle
    this.add.text(this.scale.width / 2, 80, 'Select Premium Coffee Beans from Around the World', {
      fontSize: '18px',
      color: '#ffffff',
      fontStyle: 'italic'
    }).setOrigin(0.5);
    
    // Player money display
    const playerData = this.gameStateManager.getPlayer();
    this.playerMoneyText = this.add.text(this.scale.width - 20, 20, `💰 $${playerData.money.toFixed(2)}`, {
      fontSize: '20px',
      color: '#4caf50',
      fontStyle: 'bold'
    }).setOrigin(1, 0);
    
    // Current season indicator
    const monthNames = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
    this.add.text(20, 20, `🗓️ ${monthNames[this.currentMonth - 1]} - Season affects pricing`, {
      fontSize: '16px',
      color: '#ffeb3b'
    });
  }

  private createBeanMarket(): void {
    const startY = 120;
    const cardWidth = 380;
    const cardHeight = 220;
    const cols = 2;
    const spacing = 20;
    
    let index = 0;
    
    Object.entries(COFFEE_BEANS).forEach(([, beanData]) => {
      const row = Math.floor(index / cols);
      const col = index % cols;
      
      const x = (this.scale.width / 2) - (cols * cardWidth + (cols - 1) * spacing) / 2 + col * (cardWidth + spacing);
      const y = startY + row * (cardHeight + spacing);
      
      this.createBeanCard(beanData, x, y, cardWidth, cardHeight);
      index++;
    });
  }

  private createBeanCard(beanData: CoffeeBeanData, x: number, y: number, width: number, height: number): void {
    const container = this.add.container(x, y);
    
    // Card background
    const bg = this.add.rectangle(0, 0, width, height, 0x3e2723);
    bg.setStrokeStyle(2, 0x5d4037);
    container.add(bg);
    
    // Bean name and origin
    const nameText = this.add.text(-width/2 + 15, -height/2 + 15, beanData.name, {
      fontSize: '18px',
      color: '#d4af37',
      fontStyle: 'bold'
    });
    container.add(nameText);
    
    const originText = this.add.text(-width/2 + 15, -height/2 + 40, `📍 ${beanData.origin.region}, ${beanData.origin.country}`, {
      fontSize: '14px',
      color: '#ffffff'
    });
    container.add(originText);
    
    // Price calculation
    const currentPrice = calculateCurrentPrice(beanData.id, this.currentMonth);
    const isInSeason = isBeanInSeason(beanData.id, this.currentMonth);
    
    const priceText = this.add.text(-width/2 + 15, -height/2 + 65, `💲 $${currentPrice.toFixed(2)}/kg ${isInSeason ? '🌿 In Season' : '❄️ Off Season'}`, {
      fontSize: '16px',
      color: isInSeason ? '#4caf50' : '#ff9800'
    });
    container.add(priceText);
    
    // Rarity indicator
    const rarityStars = '⭐'.repeat(beanData.economics.rarity);
    const rarityText = this.add.text(-width/2 + 15, -height/2 + 90, `Rarity: ${rarityStars}`, {
      fontSize: '14px',
      color: '#ffc107'
    });
    container.add(rarityText);
    
    // Flavor profile preview
    const flavorNotes = beanData.description.tastingNotes.slice(0, 3).join(', ');
    const flavorText = this.add.text(-width/2 + 15, -height/2 + 115, `🍃 ${flavorNotes}`, {
      fontSize: '12px',
      color: '#81c784'
    });
    container.add(flavorText);
    
    // Quantity selection controls
    const quantityY = height/2 - 60;
    
    // Quantity label
    const qtyLabel = this.add.text(-width/2 + 15, quantityY - 20, 'Quantity (kg):', {
      fontSize: '14px',
      color: '#ffffff'
    });
    container.add(qtyLabel);
    
    // Decrease button
    const decreaseBtn = this.add.text(-width/2 + 15, quantityY, '➖', {
      fontSize: '16px',
      color: '#ffffff',
      backgroundColor: '#f44336',
      padding: { x: 8, y: 4 }
    });
    decreaseBtn.setInteractive({ useHandCursor: true });
    container.add(decreaseBtn);
    
    // Quantity display
    const quantityText = this.add.text(-width/2 + 65, quantityY, '0', {
      fontSize: '16px',
      color: '#ffffff',
      backgroundColor: '#424242',
      padding: { x: 12, y: 4 }
    });
    container.add(quantityText);
    
    // Increase button
    const increaseBtn = this.add.text(-width/2 + 105, quantityY, '➕', {
      fontSize: '16px',
      color: '#ffffff',
      backgroundColor: '#4caf50',
      padding: { x: 8, y: 4 }
    });
    increaseBtn.setInteractive({ useHandCursor: true });
    container.add(increaseBtn);
    
    // Add to cart button
    const addToCartBtn = this.add.text(width/2 - 15, quantityY, '🛒 Add to Cart', {
      fontSize: '14px',
      color: '#ffffff',
      backgroundColor: '#2196f3',
      padding: { x: 10, y: 6 }
    }).setOrigin(1, 0.5);
    addToCartBtn.setInteractive({ useHandCursor: true });
    container.add(addToCartBtn);
    
    // Store bean card data
    const beanCard: BeanCard = {
      container,
      beanData,
      priceText,
      quantityText,
      selectedQuantity: 0
    };
    
    this.beanCards.push(beanCard);
    
    // Button event handlers
    decreaseBtn.on('pointerdown', () => {
      if (beanCard.selectedQuantity > 0) {
        beanCard.selectedQuantity--;
        quantityText.setText(beanCard.selectedQuantity.toString());
        // Don't update cart until user clicks "Add to Cart"
      }
    });
    
    increaseBtn.on('pointerdown', () => {
      const playerData = this.gameStateManager.getPlayer();
      const maxAffordable = Math.floor(playerData.money / currentPrice);
      if (beanCard.selectedQuantity < maxAffordable && beanCard.selectedQuantity < 50) {
        beanCard.selectedQuantity++;
        quantityText.setText(beanCard.selectedQuantity.toString());
        // Don't update cart until user clicks "Add to Cart"
      }
    });
    
    addToCartBtn.on('pointerdown', () => {
      if (beanCard.selectedQuantity > 0) {
        this.addToCart(beanData.id, beanCard.selectedQuantity);
        // Keep the selected quantity visible - don't reset to 0
        // User can see what they added and add more if needed
        this.showMessage(`Added ${beanCard.selectedQuantity}kg to cart!`, '#4caf50');
      }
    });
    
    // Hover effects
    bg.setInteractive();
    bg.on('pointerover', () => {
      bg.setFillStyle(0x4e342e);
      this.showBeanDetails(beanData);
    });
    
    bg.on('pointerout', () => {
      bg.setFillStyle(0x3e2723);
    });
  }

  private addToCart(beanId: string, quantity: number): void {
    // Set the cart quantity to the selected quantity (replace, don't add)
    this.selectedBeans.set(beanId, quantity);
    this.updateTotalCost();
    
    // Visual feedback
    this.add.text(this.scale.width / 2, this.scale.height / 2, `Set ${quantity}kg in cart!`, {
      fontSize: '20px',
      color: '#4caf50',
      backgroundColor: '#000000',
      padding: { x: 15, y: 8 }
    }).setOrigin(0.5).setDepth(1000);
    
    // Remove message after 1 second
    this.time.delayedCall(1000, () => {
      // Message will auto-destroy
    });
  }

  private updateTotalCost(): void {
    let totalCost = 0;
    
    this.selectedBeans.forEach((quantity, beanId) => {
      const price = calculateCurrentPrice(beanId, this.currentMonth);
      totalCost += price * quantity;
    });
    
    if (this.totalCostText) {
      this.totalCostText.setText(`Total: $${totalCost.toFixed(2)}`);
      
      // Color code based on affordability
      const playerData = this.gameStateManager.getPlayer();
      if (totalCost > playerData.money) {
        this.totalCostText.setColor('#f44336'); // Red if can't afford
      } else {
        this.totalCostText.setColor('#4caf50'); // Green if affordable
      }
    }
  }

  private createShoppingCart(): void {
    const cartY = this.scale.height - 80;
    
    // Cart background
    this.add.rectangle(this.scale.width / 2, cartY, this.scale.width - 40, 60, 0x1a1a1a, 0.9);
    
    // Cart title
    this.add.text(30, cartY - 20, '🛒 Shopping Cart', {
      fontSize: '18px',
      color: '#ffffff',
      fontStyle: 'bold'
    });
    
    // Total cost
    this.totalCostText = this.add.text(this.scale.width / 2 - 200, cartY, 'Total: $0.00', {
      fontSize: '20px',
      color: '#4caf50',
      fontStyle: 'bold'
    });
    
    // Purchase button
    const purchaseBtn = this.add.text(this.scale.width - 150, cartY, '💳 Purchase', {
      fontSize: '18px',
      color: '#ffffff',
      backgroundColor: '#2e7d32',
      padding: { x: 15, y: 8 }
    }).setOrigin(0.5);
    
    purchaseBtn.setInteractive({ useHandCursor: true });
    purchaseBtn.on('pointerdown', () => {
      this.processPurchase();
    });
    
    // Clear cart button
    const clearBtn = this.add.text(this.scale.width - 280, cartY, '🗑️ Clear', {
      fontSize: '16px',
      color: '#ffffff',
      backgroundColor: '#d32f2f',
      padding: { x: 10, y: 6 }
    }).setOrigin(0.5);
    
    clearBtn.setInteractive({ useHandCursor: true });
    clearBtn.on('pointerdown', () => {
      this.clearCart();
    });
  }

  private processPurchase(): void {
    if (this.selectedBeans.size === 0) {
      this.showMessage('Cart is empty!', '#ff9800');
      return;
    }
    
    let totalCost = 0;
    this.selectedBeans.forEach((quantity, beanId) => {
      const price = calculateCurrentPrice(beanId, this.currentMonth);
      totalCost += price * quantity;
    });
    
    const playerData = this.gameStateManager.getPlayer();
    if (totalCost > playerData.money) {
      this.showMessage('Insufficient funds!', '#f44336');
      return;
    }
    
    // Process purchase
    this.selectedBeans.forEach((quantity, beanId) => {
      const price = calculateCurrentPrice(beanId, this.currentMonth);
      const totalItemCost = price * quantity;
      
      console.log('DEBUG: Adding bean to inventory:', {
        beanId,
        quantity,
        price,
        totalItemCost
      });
      
      // Add to inventory
      this.gameStateManager.addInventoryItem({
        type: 'green-beans',
        beanId,
        quantity,
        quality: 'premium',
        purchaseDate: new Date(),
        purchasePrice: price
      });
      
      // Deduct money
      this.gameStateManager.spendMoney(totalItemCost);
    });
    
    // Debug check inventory after purchase
    const currentInventory = this.gameStateManager.getInventory();
    console.log('DEBUG: Inventory after purchase:', currentInventory);
    
    this.showMessage(`Successfully purchased ${this.selectedBeans.size} bean varieties!`, '#4caf50');
    
    // Add debug logging for scene transition
    console.log('DEBUG: About to clear cart and navigate...');
    console.log('DEBUG: Current selectedBeans size:', this.selectedBeans.size);
    
    this.clearCart();
    this.updatePlayerMoneyDisplay();
  }

  private clearCart(): void {
    this.selectedBeans.clear();
    
    // Reset all quantity displays
    this.beanCards.forEach(card => {
      card.selectedQuantity = 0;
      const quantityText = card.container.list.find(child => 
        child instanceof Phaser.GameObjects.Text && child.text.match(/^\d+$/)
      ) as Phaser.GameObjects.Text;
      if (quantityText) {
        quantityText.setText('0');
      }
    });
    
    this.updateTotalCost();
  }

  private updatePlayerMoneyDisplay(): void {
    const playerData = this.gameStateManager.getPlayer();
    this.playerMoneyText.setText(`💰 $${playerData.money.toFixed(2)}`);
  }

  private showBeanDetails(beanData: CoffeeBeanData): void {
    // Could implement a detailed popup here
    // For now, just log the details
    console.log('Bean Details:', beanData.description.detailed);
  }

  private showMessage(message: string, color: string): void {
    const messageText = this.add.text(this.scale.width / 2, this.scale.height / 2 - 100, message, {
      fontSize: '24px',
      color: color,
      backgroundColor: '#000000',
      padding: { x: 20, y: 10 }
    }).setOrigin(0.5).setDepth(1000);
    
    // Fade out after 2 seconds
    this.time.delayedCall(2000, () => {
      messageText.destroy();
    });
  }

  private createNavigationButtons(): void {
    // Back to menu button
    const backBtn = this.add.text(30, this.scale.height - 150, '⬅️ Back to Menu', {
      fontSize: '16px',
      color: '#ffffff',
      backgroundColor: '#424242',
      padding: { x: 12, y: 8 }
    });
    
    backBtn.setInteractive({ useHandCursor: true });
    backBtn.on('pointerdown', () => {
      this.scene.start(SceneKeys.MAIN_MENU);
    });
    
    // Go to Roasting Lab button
    const roastingBtn = this.add.text(this.scale.width - 30, this.scale.height - 150, 'Roasting Lab ➡️', {
      fontSize: '16px',
      color: '#ffffff',
      backgroundColor: '#8b4513',
      padding: { x: 12, y: 8 }
    }).setOrigin(1, 0);
    
    roastingBtn.setInteractive({ useHandCursor: true });
    roastingBtn.on('pointerdown', () => {
      this.scene.start(SceneKeys.ROASTING_LAB);
    });
  }
}
