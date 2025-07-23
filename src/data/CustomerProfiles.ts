/**
 * Customer Profiles Database
 * AI-driven customer behaviors based on real coffee consumer psychology
 */

import type { CustomerProfile, CoffeeQualityScore } from '../types/GameTypes';

export const CUSTOMER_PROFILES: { [key: string]: CustomerProfile } = {
  casual_drinker: {
    id: 'casual_drinker',
    name: 'Sarah Chen',
    type: 'casual',
    avatar: 'casual_01',
    
    psychology: {
      priceConsciousness: 0.7,
      qualityExpectation: 0.4,
      brandLoyalty: 0.3,
      adventurousness: 0.2,
      patience: 0.8,
      moodStability: 0.6,
      priceFlexibility: 0.5
    },
    
    preferences: {
      weights: {
        price: 0.4,
        taste: 0.3,
        aroma: 0.1,
        body: 0.1,
        balance: 0.1
      },
      flavorProfile: {
        acidity: { min: 3, max: 7, ideal: 5 },
        bitterness: { min: 2, max: 6, ideal: 4 },
        sweetness: { min: 4, max: 8, ideal: 6 },
        body: { min: 4, max: 8, ideal: 6 }
      },
      roastLevel: { min: 0.3, max: 0.7, ideal: 0.5 }, // 0=light, 1=dark
      origins: ['Vietnam', 'Brazil', 'Colombia'],
      avoidOrigins: [],
      maxPrice: 12.00,
      preferredVolume: 250
    },
    
    behavior: {
      visitFrequency: 0.3, // 30% chance per day
      orderPatterns: {
        repeatCustomer: 0.6,
        timeConsistency: 0.4,
        seasonalVariation: 0.2
      },
      communication: {
        verbosity: 0.3,
        complaintTendency: 0.2,
        tipGenerosity: 0.4
      },
      satisfaction: {
        baseThreshold: 0.5,
        toleranceRange: 0.3,
        memoryDecay: 0.1 // How quickly they forget bad experiences
      }
    },
    
    dialogue: {
      greetings: [
        "Hi! I'll take my usual coffee, please.",
        "Good morning! Something simple today.",
        "Hey there! Just need my coffee fix.",
        "Morning! The regular, if you don't mind."
      ],
      orders: [
        "Something not too strong, medium roast would be great.",
        "I like my coffee smooth and easy to drink.",
        "Nothing too fancy, just good coffee.",
        "Maybe something from Brazil? I heard it's good."
      ],
      reactions: {
        satisfied: [
          "This is perfect! Just how I like it.",
          "Mmm, this hits the spot!",
          "Great coffee, thanks!",
          "This is exactly what I needed."
        ],
        dissatisfied: [
          "This is a bit too strong for me...",
          "Hmm, not quite what I expected.",
          "This tastes a little off...",
          "Maybe something milder next time?"
        ],
        priceReaction: [
          "That's a bit pricey for me...",
          "I usually don't spend this much on coffee.",
          "Maybe something more budget-friendly?",
          "Do you have anything cheaper?"
        ]
      }
    },
    
    personalStory: "Sarah is a graphic designer who discovered coffee during late college nights. She values consistency over complexity and prefers cafes that remember her order. Price-conscious but willing to pay for reliability.",
    
    unlockConditions: {
      storyMode: true,
      reputation: 0,
      special: []
    }
  },

  coffee_enthusiast: {
    id: 'coffee_enthusiast',
    name: 'Marcus Rodriguez',
    type: 'enthusiast',
    avatar: 'enthusiast_01',
    
    psychology: {
      priceConsciousness: 0.3,
      qualityExpectation: 0.8,
      brandLoyalty: 0.4,
      adventurousness: 0.7,
      patience: 0.6,
      moodStability: 0.7,
      priceFlexibility: 0.6
    },
    
    preferences: {
      weights: {
        price: 0.15,
        taste: 0.35,
        aroma: 0.25,
        body: 0.15,
        balance: 0.1
      },
      flavorProfile: {
        acidity: { min: 4, max: 9, ideal: 7 },
        bitterness: { min: 2, max: 8, ideal: 5 },
        sweetness: { min: 5, max: 9, ideal: 7 },
        body: { min: 3, max: 8, ideal: 6 }
      },
      roastLevel: { min: 0.2, max: 0.6, ideal: 0.4 },
      origins: ['Ethiopia', 'Kenya', 'Guatemala', 'Panama'],
      avoidOrigins: [],
      maxPrice: 25.00,
      preferredVolume: 300
    },
    
    behavior: {
      visitFrequency: 0.5,
      orderPatterns: {
        repeatCustomer: 0.3, // Likes to try new things
        timeConsistency: 0.6,
        seasonalVariation: 0.4
      },
      communication: {
        verbosity: 0.8,
        complaintTendency: 0.6, // Will speak up about quality
        tipGenerosity: 0.7
      },
      satisfaction: {
        baseThreshold: 0.7,
        toleranceRange: 0.2,
        memoryDecay: 0.05 // Remembers experiences longer
      }
    },
    
    dialogue: {
      greetings: [
        "Good morning! What single origins do you have today?",
        "Hey! I'm looking for something special.",
        "Hi there! Any new beans this week?",
        "Morning! I'm in the mood for something unique."
      ],
      orders: [
        "I'd love to try that Ethiopian Geisha if you have it.",
        "Something with bright acidity and floral notes?",
        "Do you have any washed process beans from high altitude?",
        "I'm looking for complexity - maybe something funky?"
      ],
      reactions: {
        satisfied: [
          "Wow! This has incredible complexity!",
          "The acidity balance is perfect here.",
          "I can really taste the terroir in this.",
          "This is exactly what I was hoping for!"
        ],
        dissatisfied: [
          "The development seems a bit underdone...",
          "I'm getting some astringency in the finish.",
          "This roast doesn't bring out the bean's potential.",
          "The flavor profile isn't quite balanced."
        ],
        priceReaction: [
          "Premium price for premium coffee - I get it.",
          "Worth it for this quality!",
          "A bit steep, but if it's exceptional...",
          "I'll pay for quality, but this better be good."
        ]
      }
    },
    
    personalStory: "Marcus is a software engineer who fell in love with coffee during a trip to Costa Rica. He studies coffee like wine, values origin stories, and isn't afraid to give detailed feedback. He's building his home brewing setup.",
    
    unlockConditions: {
      storyMode: true,
      reputation: 200,
      special: ['served_specialty_bean']
    }
  },

  espresso_purist: {
    id: 'espresso_purist',
    name: 'Giulia Rossi',
    type: 'purist',
    avatar: 'purist_01',
    
    psychology: {
      priceConsciousness: 0.2,
      qualityExpectation: 0.9,
      brandLoyalty: 0.8,
      adventurousness: 0.3,
      patience: 0.4,
      moodStability: 0.5,
      priceFlexibility: 0.3
    },
    
    preferences: {
      weights: {
        price: 0.1,
        taste: 0.4,
        aroma: 0.2,
        body: 0.25,
        balance: 0.05
      },
      flavorProfile: {
        acidity: { min: 3, max: 6, ideal: 4 },
        bitterness: { min: 6, max: 9, ideal: 7 },
        sweetness: { min: 4, max: 7, ideal: 5 },
        body: { min: 7, max: 10, ideal: 9 }
      },
      roastLevel: { min: 0.6, max: 0.85, ideal: 0.75 },
      origins: ['Brazil', 'Italy', 'Guatemala'],
      avoidOrigins: ['Ethiopia', 'Kenya'], // Too acidic for espresso
      maxPrice: 30.00,
      preferredVolume: 60 // Double shot
    },
    
    behavior: {
      visitFrequency: 0.8, // Daily customer
      orderPatterns: {
        repeatCustomer: 0.9, // Very routine
        timeConsistency: 0.9,
        seasonalVariation: 0.1
      },
      communication: {
        verbosity: 0.6,
        complaintTendency: 0.8, // Very particular
        tipGenerosity: 0.9 // Rewards excellence
      },
      satisfaction: {
        baseThreshold: 0.8,
        toleranceRange: 0.15,
        memoryDecay: 0.02 // Never forgets
      }
    },
    
    dialogue: {
      greetings: [
        "Buongiorno! My usual doppio, per favore.",
        "Good morning. Double espresso, dark roast.",
        "Ciao! I need my morning doppio.",
        "Morning. The usual - and make it perfect."
      ],
      orders: [
        "Double espresso, Brazilian blend, dark roast only.",
        "I want full body, low acidity, perfect crema.",
        "Traditional espresso - none of that light roast nonsense.",
        "Something that can stand up to milk, but drinking it black."
      ],
      reactions: {
        satisfied: [
          "Perfetto! This is how espresso should be.",
          "Excellent crema, perfect extraction.",
          "This reminds me of my nonna's favorite bar in Rome.",
          "Finally, someone who knows espresso!"
        ],
        dissatisfied: [
          "This is sour! Espresso should not be sour!",
          "Where is the body? This is like tea!",
          "The crema is all wrong - check your grind.",
          "This is not espresso - this is just bitter water."
        ],
        priceReaction: [
          "I pay for perfection, nothing less.",
          "Price doesn't matter if it's done right.",
          "Quality espresso is worth any price.",
          "I'll pay, but it better be perfect."
        ]
      }
    },
    
    personalStory: "Giulia moved from Milan to study architecture. She's horrified by what some places call 'espresso' and is on a mission to find authentic Italian-style coffee. Very loyal to places that get it right.",
    
    unlockConditions: {
      storyMode: true,
      reputation: 500,
      special: ['perfect_espresso_score']
    }
  },

  health_conscious: {
    id: 'health_conscious',
    name: 'David Kim',
    type: 'health_focused',
    avatar: 'health_01',
    
    psychology: {
      priceConsciousness: 0.4,
      qualityExpectation: 0.7,
      brandLoyalty: 0.5,
      adventurousness: 0.4,
      patience: 0.7,
      moodStability: 0.8,
      priceFlexibility: 0.4
    },
    
    preferences: {
      weights: {
        price: 0.25,
        taste: 0.3,
        aroma: 0.15,
        body: 0.1,
        balance: 0.2
      },
      flavorProfile: {
        acidity: { min: 6, max: 9, ideal: 7 },
        bitterness: { min: 1, max: 4, ideal: 2 },
        sweetness: { min: 6, max: 9, ideal: 8 },
        body: { min: 3, max: 6, ideal: 4 }
      },
      roastLevel: { min: 0.1, max: 0.4, ideal: 0.25 },
      origins: ['Ethiopia', 'Guatemala', 'Colombia'],
      avoidOrigins: [],
      maxPrice: 18.00,
      preferredVolume: 200
    },
    
    behavior: {
      visitFrequency: 0.4,
      orderPatterns: {
        repeatCustomer: 0.5,
        timeConsistency: 0.8, // Routine-oriented
        seasonalVariation: 0.3
      },
      communication: {
        verbosity: 0.5,
        complaintTendency: 0.3,
        tipGenerosity: 0.5
      },
      satisfaction: {
        baseThreshold: 0.6,
        toleranceRange: 0.25,
        memoryDecay: 0.08
      }
    },
    
    dialogue: {
      greetings: [
        "Good morning! Do you have any organic options?",
        "Hi! I'm looking for something light and healthy.",
        "Morning! What's your lightest roast today?",
        "Hey! Anything with high antioxidants?"
      ],
      orders: [
        "Light roast, single origin, nothing processed.",
        "I prefer bright, clean flavors - no bitter aftertaste.",
        "Something that won't make me jittery - low acid?",
        "Do you have anything that's naturally sweet?"
      ],
      reactions: {
        satisfied: [
          "This is so clean and bright!",
          "Perfect! Not bitter at all.",
          "I love how smooth this is.",
          "This gives me energy without the crash."
        ],
        dissatisfied: [
          "This is way too bitter for me.",
          "I can feel the acid in my stomach...",
          "This doesn't taste very clean.",
          "Too intense - I need something gentler."
        ],
        priceReaction: [
          "A bit pricey, but health is worth it.",
          "Is this organic? That would justify the price.",
          "I'd rather pay more for quality ingredients.",
          "Maybe something more affordable that's still healthy?"
        ]
      }
    },
    
    personalStory: "David is a yoga instructor and nutritionist who views coffee as part of his wellness routine. He prefers light roasts for their antioxidants and avoids anything that might disrupt his balanced lifestyle.",
    
    unlockConditions: {
      storyMode: true,
      reputation: 150,
      special: ['light_roast_mastery']
    }
  },

  business_professional: {
    id: 'business_professional',
    name: 'Amanda Torres',
    type: 'professional',
    avatar: 'business_01',
    
    psychology: {
      priceConsciousness: 0.2,
      qualityExpectation: 0.6,
      brandLoyalty: 0.7,
      adventurousness: 0.3,
      patience: 0.3, // Always in a hurry
      moodStability: 0.4, // Stress affects mood
      priceFlexibility: 0.7
    },
    
    preferences: {
      weights: {
        price: 0.15,
        taste: 0.25,
        aroma: 0.1,
        body: 0.3,
        balance: 0.2
      },
      flavorProfile: {
        acidity: { min: 4, max: 7, ideal: 5 },
        bitterness: { min: 5, max: 8, ideal: 6 },
        sweetness: { min: 4, max: 7, ideal: 5 },
        body: { min: 6, max: 9, ideal: 7 }
      },
      roastLevel: { min: 0.4, max: 0.8, ideal: 0.6 },
      origins: ['Colombia', 'Guatemala', 'Brazil'],
      avoidOrigins: [],
      maxPrice: 22.00,
      preferredVolume: 400 // Large size
    },
    
    behavior: {
      visitFrequency: 0.9, // Daily, sometimes twice
      orderPatterns: {
        repeatCustomer: 0.8,
        timeConsistency: 0.9, // Very routine
        seasonalVariation: 0.1
      },
      communication: {
        verbosity: 0.4, // Efficient communication
        complaintTendency: 0.5,
        tipGenerosity: 0.8 // Good tips for speed
      },
      satisfaction: {
        baseThreshold: 0.6,
        toleranceRange: 0.3,
        memoryDecay: 0.12 // Forgets quickly due to stress
      }
    },
    
    dialogue: {
      greetings: [
        "Morning! Large coffee to go, please.",
        "Hi! I'm running late - the usual?",
        "Quick coffee to go - make it strong!",
        "Good morning! I need fuel for meetings."
      ],
      orders: [
        "Large, medium-dark roast, full body.",
        "Something reliable that'll keep me going.",
        "I need caffeine that works - strength over flavor.",
        "Whatever's fast and gets the job done."
      ],
      reactions: {
        satisfied: [
          "Perfect! This'll get me through my morning.",
          "Great coffee - just what I needed.",
          "This hits the spot. See you tomorrow!",
          "Excellent as always. Thanks!"
        ],
        dissatisfied: [
          "This is weak - I have a long day ahead.",
          "Not quite right, but I don't have time...",
          "This won't cut it for my morning meetings.",
          "I need something stronger than this."
        ],
        priceReaction: [
          "Fine, but make it worth the premium.",
          "Price is no object if it's good coffee.",
          "I'll pay for quality and consistency.",
          "Speed and quality - that's what I'm paying for."
        ]
      }
    },
    
    personalStory: "Amanda is a corporate lawyer who treats coffee as essential fuel. She values consistency and strength over complexity, and will pay premium prices for reliability and speed of service.",
    
    unlockConditions: {
      storyMode: true,
      reputation: 100,
      special: ['speed_service_bonus']
    }
  }
};

// Customer type categories for game progression
export const CUSTOMER_TYPES = {
  starter: ['casual_drinker', 'business_professional'],
  intermediate: ['health_conscious', 'coffee_enthusiast'],
  advanced: ['espresso_purist'],
  special: [] // Event-specific customers
};

// Utility functions for customer AI behavior
export class CustomerAI {
  static calculateSatisfaction(
    customer: CustomerProfile,
    coffee: CoffeeQualityScore,
    price: number,
    serviceSpeed: number
  ): number {
    const prefs = customer.preferences;
    const weights = prefs.weights;
    
    // Calculate taste satisfaction
    const tasteSatisfaction = this.calculateTasteSatisfaction(customer, coffee);
    
    // Calculate price satisfaction
    const priceSatisfaction = price <= prefs.maxPrice ? 1.0 : Math.max(0, 2 - (price / prefs.maxPrice));
    
    // Calculate service satisfaction (speed matters for some customers)
    const serviceSatisfaction = Math.min(1.0, serviceSpeed * customer.psychology.patience);
    
    // Weighted average
    const overallSatisfaction = 
      (tasteSatisfaction * (weights.taste + weights.aroma + weights.body + weights.balance)) +
      (priceSatisfaction * weights.price) +
      (serviceSatisfaction * 0.1); // Service is 10% weight
    
    // Apply psychology modifiers
    const moodFactor = 0.8 + (Math.random() * 0.4 * customer.psychology.moodStability);
    
    return Math.max(0, Math.min(1, overallSatisfaction * moodFactor));
  }
  
  static calculateTasteSatisfaction(customer: CustomerProfile, coffee: CoffeeQualityScore): number {
    const prefs = customer.preferences.flavorProfile;
    
    // Check if each flavor component is within acceptable range
    const acidityScore = this.scoreFlavorComponent(coffee.acidity, prefs.acidity);
    const bitternessScore = this.scoreFlavorComponent(coffee.bitterness, prefs.bitterness);
    const sweetnessScore = this.scoreFlavorComponent(coffee.sweetness, prefs.sweetness);
    const bodyScore = this.scoreFlavorComponent(coffee.body, prefs.body);
    
    return (acidityScore + bitternessScore + sweetnessScore + bodyScore) / 4;
  }
  
  private static scoreFlavorComponent(
    actual: number,
    preference: { min: number; max: number; ideal: number }
  ): number {
    if (actual < preference.min || actual > preference.max) {
      return 0; // Outside acceptable range
    }
    
    // Calculate distance from ideal
    const distance = Math.abs(actual - preference.ideal);
    const range = (preference.max - preference.min) / 2;
    
    return Math.max(0, 1 - (distance / range));
  }
  
  static selectRandomDialogue(customer: CustomerProfile, category: string, subcategory?: string): string {
    const dialogue = customer.dialogue as any; // Type assertion for flexible dialogue access
    const dialogues = subcategory 
      ? dialogue[category][subcategory]
      : dialogue[category];
    
    if (!dialogues || dialogues.length === 0) return "...";
    
    return dialogues[Math.floor(Math.random() * dialogues.length)];
  }
  
  static shouldVisitToday(customer: CustomerProfile): boolean {
    return Math.random() < customer.behavior.visitFrequency;
  }
  
  static calculateRepeatOrder(customer: CustomerProfile, _lastOrder: any): boolean {
    return Math.random() < customer.behavior.orderPatterns.repeatCustomer;
  }
}
