/**
 * Core type definitions for Coffee Roaster game
 * Based on authentic coffee industry standards and practices
 */

// ===== COFFEE BEAN TYPES =====

export interface CoffeeBeanOrigin {
  country: string;
  region: string;
  farm?: string;
  altitude: number; // meters above sea level
  processing: 'washed' | 'natural' | 'honey' | 'pulped-natural';
  harvestSeason: number[]; // months when available (1-12)
}

export interface CoffeeBeanEconomics {
  basePrice: number; // USD per kg
  rarity: 1 | 2 | 3 | 4 | 5; // affects availability and price premium
  marketTrend: 'rising' | 'stable' | 'falling';
  seasonalMultiplier: number[]; // 12 months of price variation
  supplyStability: number; // 0.1-1.0 (affects price volatility)
}

export interface CoffeeBeanRoasting {
  difficulty: 1 | 2 | 3 | 4 | 5; // roasting skill required
  heatSensitivity: number; // 0.1-1.0 (burns easily?)
  developmentWindow: number; // seconds of optimal roasting
  crackTemperature: [number, number]; // [first crack, second crack] in °C
  optimalRange: [number, number]; // [min temp, max temp] for best results
  stirringBenefit: number; // 0.1-0.5 quality improvement from stirring
}

export interface FlavorProfile {
  acidity: number; // 1-10 (brightness, tartness)
  bitterness: number; // 1-10 (coffee compounds)
  sweetness: number; // 1-10 (natural sugars)
  body: number; // 1-10 (mouthfeel, weight)
  aroma: number; // 1-10 (smell intensity)
  aftertaste: number; // 1-10 (lingering flavor)
  balance: number; // 1-10 (harmony of elements)
}

export interface CoffeeBeanDescription {
  short: string; // "Bright and fruity"
  detailed: string; // full paragraph description
  tastingNotes: string[]; // ["chocolate", "citrus", "floral"]
  story: string; // origin story, cultural significance
}

export interface CoffeeBeanAdvice {
  beginnerTips: string[];
  commonMistakes: string[];
  expertTechniques: string[];
  idealBrewMethods: string[];
}

export interface CoffeeBeanData {
  id: string;
  name: string;
  origin: CoffeeBeanOrigin;
  economics: CoffeeBeanEconomics;
  roasting: CoffeeBeanRoasting;
  flavor: FlavorProfile;
  description: CoffeeBeanDescription;
  advice: CoffeeBeanAdvice;
}

// ===== ROASTING TYPES =====

export interface RoastingControls {
  temperature: number; // °C (150-250)
  time: number; // seconds
  stirring: boolean; // on/off
}

export interface RoastingState {
  currentTemp: number;
  elapsedTime: number;
  phase: 'drying' | 'maillard' | 'first_crack' | 'development' | 'second_crack' | 'cooling';
  beanColor: string; // hex color representing current roast level
  moisture: number; // percentage (starts ~12%, drops to ~3%)
  quality: number; // real-time quality prediction (0-100)
  warnings: string[]; // current warnings/alerts
}

export interface RoastingPerformance {
  temperatureAccuracy: number; // 0-100
  timingAccuracy: number; // 0-100
  heatConsistency: number; // 0-100
  stirringEffectiveness: number; // 0-100
  burningPenalty: number; // 0-30
  underdevelopmentPenalty: number; // 0-20
  rushPenalty: number; // 0-15
}

export interface RoastedCoffee {
  beanId: string;
  quantity: number; // kg
  roastLevel: 'light' | 'medium-light' | 'medium' | 'medium-dark' | 'dark';
  qualityScore: number; // 0-100
  flavorProfile: FlavorProfile;
  roastingData: RoastingPerformance;
  timestamp: Date;
  beanCost: number;
  energyCost: number;
  laborCost: number;
  suggestedPrice: number;
}

// ===== CUSTOMER TYPES =====

export interface CustomerPreferences {
  flavorProfile: {
    acidity: [number, number]; // preferred range [min, max]
    bitterness: [number, number];
    body: [number, number];
    sweetness: [number, number];
    complexity: number; // minimum complexity threshold
  };
  origins: {
    preferred: string[]; // favorite regions
    avoided: string[]; // disliked regions
    adventurous: boolean; // try new origins?
  };
  roastLevels: {
    preferred: ('light' | 'medium' | 'dark')[];
    tolerance: number; // how flexible they are
  };
  brewingMethods: {
    primary: string; // main brewing method
    secondary: string[]; // alternative methods
    equipment: string[]; // what they own
  };
  values: {
    sustainability: number; // 0-10 importance
    fairTrade: number; // 0-10 importance
    organic: number; // 0-10 importance
    localRoasting: number; // 0-10 importance
    priceConsciousness: number; // 0-10 (10 = very price sensitive)
  };
}

export interface CustomerEconomics {
  budgetRange: [number, number]; // [min, max] per kg
  orderFrequency: number; // orders per month
  quantityRange: [number, number]; // [min, max] kg per order
  seasonality: number[]; // monthly ordering likelihood
  paymentTerms: string; // "immediate", "net30", etc.
  tipGenerosity: number; // 0-0.2 (0-20% tips for great service)
}

export interface CustomerRelationship {
  trustLevel: number; // 0-100 (affects forgiveness)
  communicationStyle: 'formal' | 'casual' | 'technical' | 'friendly';
  feedbackStyle: 'detailed' | 'brief' | 'emotional' | 'analytical';
  referralPower: number; // 0-10 (influence on bringing new customers)
  negotiationWillingness: number; // 0-10 (flexible on price/terms)
}

export interface CoffeeBeanVariety {
  id: string;
  name: string;
  origin: string;
  characteristics: {
    size: 'small' | 'medium' | 'large';
    density: 'low' | 'medium' | 'high';
    processingMethod: 'washed' | 'natural' | 'honey';
    altitude: number; // meters above sea level
  };
  flavorProfile: {
    acidity: number;    // 1-10
    body: number;       // 1-10
    sweetness: number;  // 1-10
    notes: string[];    // Primary flavor notes
  };
  price: number;        // Price per pound
  rarity: 'common' | 'uncommon' | 'rare' | 'exotic';
}

export interface CustomerProfile {
  id: string;
  name: string;
  type: 'casual' | 'enthusiast' | 'purist' | 'health_focused' | 'professional';
  avatar: string;
  
  psychology: {
    priceConsciousness: number; // 0-1
    qualityExpectation: number; // 0-1
    brandLoyalty: number; // 0-1
    adventurousness: number; // 0-1
    patience: number; // 0-1
    moodStability: number; // 0-1
    priceFlexibility: number; // 0-1
  };
  
  preferences: {
    weights: {
      price: number;
      taste: number;
      aroma: number;
      body: number;
      balance: number;
    };
    flavorProfile: {
      acidity: { min: number; max: number; ideal: number };
      bitterness: { min: number; max: number; ideal: number };
      sweetness: { min: number; max: number; ideal: number };
      body: { min: number; max: number; ideal: number };
    };
    roastLevel: { min: number; max: number; ideal: number };
    origins: string[];
    avoidOrigins: string[];
    maxPrice: number;
    preferredVolume: number;
  };
  
  behavior: {
    visitFrequency: number;
    orderPatterns: {
      repeatCustomer: number;
      timeConsistency: number;
      seasonalVariation: number;
    };
    communication: {
      verbosity: number;
      complaintTendency: number;
      tipGenerosity: number;
    };
    satisfaction: {
      baseThreshold: number;
      toleranceRange: number;
      memoryDecay: number;
    };
  };
  
  dialogue: {
    greetings: string[];
    orders: string[];
    reactions: {
      satisfied: string[];
      dissatisfied: string[];
      priceReaction: string[];
    };
  };
  
  personalStory: string;
  
  unlockConditions: {
    storyMode: boolean;
    reputation: number;
    special: string[];
  };
}

export interface CustomerOrder {
  orderId: string;
  customer: CustomerProfile;
  requirements: {
    quantity: number;
    qualityMinimum: number;
    flavorRequirements: Partial<FlavorProfile>;
    roastLevel: 'light' | 'medium' | 'dark' | 'any';
    origin?: string;
    brewingOptimization: string;
    specialRequirements: string[];
    certifications: string[];
  };
  commercial: {
    budget: number;
    paymentTerms: string;
    urgency: 'low' | 'normal' | 'rush' | 'emergency';
    negotiable: boolean;
    loyaltyDiscount: number;
  };
  timeline: {
    orderDate: Date;
    dueDate: Date;
    flexibility: number; // days flexibility
  };
}

// Simple order interface for game use
export interface Order {
  id: string;
  customer: CustomerProfile;
  items: any[];
  totalPrice: number;
  status: 'pending' | 'in-progress' | 'completed' | 'cancelled';
  timestamp: number;
  preferences: any;
  deadline: number;
}

// ===== GAME STATE TYPES =====

export interface PlayerData {
  money: number;
  reputation: number;
  level: number;
  experience: number;
  unlockedBeans: string[];
  unlockedEquipment: string[];
  achievements: string[];
}

export interface BeanInventory {
  beanId: string;
  quantity: number; // kg
  quality: 'premium' | 'standard' | 'budget';
  purchaseDate: Date;
  purchasePrice: number;
}

export interface EquipmentData {
  roaster: {
    model: string;
    level: number;
    condition: number; // 0-100%
    upgrades: string[];
  };
  accessories: {
    [key: string]: {
      level: number;
      condition: number;
    };
  };
}

export interface GameState {
  player: PlayerData;
  inventory: {
    beans: BeanInventory[];
    roastedCoffee: RoastedCoffee[];
  };
  equipment: EquipmentData;
  orders: {
    active: CustomerOrder[];
    completed: CustomerOrder[];
    failed: CustomerOrder[];
  };
  market: {
    currentPrices: { [beanId: string]: number };
    priceHistory: { [beanId: string]: number[] };
    events: string[];
  };
  settings: {
    audioEnabled: boolean;
    musicVolume: number;
    sfxVolume: number;
    accessibility: {
      highContrast: boolean;
      largeText: boolean;
      reducedMotion: boolean;
    };
  };
}

// ===== SCENE TYPES =====

export const SceneKeys = {
  BOOT: 'boot',
  MAIN_MENU: 'main-menu',
  COFFEE_MARKET: 'coffee-market',
  ROASTING_LAB: 'roasting-lab',
  ANALYSIS: 'analysis',
  ORDER_MANAGEMENT: 'order-management',
  SETTINGS: 'settings',
  TUTORIAL: 'tutorial'
} as const;

export type SceneKey = typeof SceneKeys[keyof typeof SceneKeys];

// ===== UI TYPES =====

export interface UIButtonConfig {
  x: number;
  y: number;
  width: number;
  height: number;
  text: string;
  style?: Phaser.Types.GameObjects.Text.TextStyle;
  backgroundColor?: number;
  borderColor?: number;
  borderWidth?: number;
  onClick?: () => void;
  onHover?: () => void;
  onOut?: () => void;
}

export interface ModalConfig {
  title: string;
  content: string;
  buttons: {
    text: string;
    action: () => void;
    style?: 'primary' | 'secondary' | 'danger';
  }[];
  width?: number;
  height?: number;
  closable?: boolean;
}

// ===== ANALYTICS TYPES =====

export interface AnalyticsEvent {
  event: string;
  properties: { [key: string]: any };
  timestamp: Date;
  sessionId: string;
  playerId: string;
}

export interface SessionMetrics {
  sessionId: string;
  startTime: Date;
  endTime?: Date;
  totalRoasts: number;
  totalSales: number;
  averageQuality: number;
  customerSatisfaction: number;
  profit: number;
  achievements: string[];
}

// ===== QUALITY CALCULATION TYPES =====

export interface CoffeeQualityScore {
  overall: number; // 0-10 overall quality score
  acidity: number; // 0-10 acidity level
  bitterness: number; // 0-10 bitterness level  
  sweetness: number; // 0-10 sweetness level
  body: number; // 0-10 body/mouthfeel
  aroma: number; // 0-10 aroma intensity
  balance: number; // 0-10 flavor balance
  finish: number; // 0-10 aftertaste quality
  defects: string[]; // Array of detected defects
  notes: string[]; // Tasting notes
}

export interface QualityFactors {
  beanQuality: number; // inherent bean quality (60-95)
  roastDifficulty: number; // difficulty penalty (0-20)
  temperatureAccuracy: number; // how close to optimal temp (0-25)
  timingAccuracy: number; // how close to optimal time (0-25)
  heatConsistency: number; // temperature stability (0-15)
  stirringEffectiveness: number; // even heat distribution (0-10)
  burningPenalty: number; // overheating damage (0-30)
  underdevelopmentPenalty: number; // insufficient roasting (0-20)
  rushPenalty: number; // emergency stop penalty (0-15)
}

export interface QualityResult {
  overallScore: number; // 0-100 final quality
  breakdown: QualityFactors;
  grade: 'F' | 'D' | 'C' | 'B' | 'A' | 'S'; // letter grade
  recommendations: string[]; // improvement suggestions
  brewingMethods: string[]; // best brewing methods for this roast
  marketingDescription: string; // auto-generated sales copy
  targetCustomers: string[]; // customer types who would like this
}

// ===== EVENT TYPES =====

export interface GameEvent {
  type: string;
  data?: any;
  timestamp: Date;
}

export const GAME_EVENTS = {
  BEAN_PURCHASED: 'bean_purchased',
  ROAST_STARTED: 'roast_started',
  ROAST_COMPLETED: 'roast_completed',
  ORDER_RECEIVED: 'order_received',
  ORDER_COMPLETED: 'order_completed',
  LEVEL_UP: 'level_up',
  ACHIEVEMENT_UNLOCKED: 'achievement_unlocked',
  EQUIPMENT_UPGRADED: 'equipment_upgraded',
  CUSTOMER_SATISFIED: 'customer_satisfied',
  CUSTOMER_DISSATISFIED: 'customer_dissatisfied'
} as const;

export type GameEventType = typeof GAME_EVENTS[keyof typeof GAME_EVENTS];
