/**
 * Coffee Bean Database
 * Scientifically accurate data based on real coffee varieties and industry standards
 */

import type { CoffeeBeanData } from '../types/GameTypes';

export const COFFEE_BEANS: { [key: string]: CoffeeBeanData } = {
  arabica_vietnam: {
    id: 'arabica_vietnam',
    name: 'Vietnamese Arabica',
    origin: {
      country: 'Vietnam',
      region: 'Da Lat Highlands',
      altitude: 1500,
      processing: 'washed',
      harvestSeason: [10, 11, 12, 1] // October to January
    },
    economics: {
      basePrice: 8.00,
      rarity: 2,
      marketTrend: 'stable',
      seasonalMultiplier: [1.2, 1.2, 1.1, 1.0, 0.9, 0.8, 0.8, 0.9, 0.9, 0.8, 0.7, 0.9],
      supplyStability: 0.8
    },
    roasting: {
      difficulty: 2,
      heatSensitivity: 0.3,
      developmentWindow: 45,
      crackTemperature: [196, 224],
      optimalRange: [200, 210],
      stirringBenefit: 0.2
    },
    flavor: {
      acidity: 7,
      bitterness: 4,
      sweetness: 6,
      body: 6,
      aroma: 7,
      aftertaste: 6,
      balance: 7
    },
    description: {
      short: 'Bright and fruity',
      detailed: 'Vietnamese Arabica from the Da Lat Highlands offers a bright, clean cup with notable fruit-forward characteristics. The high altitude and volcanic soil contribute to its complex acidity and floral notes.',
      tastingNotes: ['citrus', 'berry', 'floral', 'chocolate'],
      story: 'Grown in the cool highlands of Da Lat, this Arabica represents Vietnam\'s specialty coffee movement, moving beyond traditional Robusta production to showcase the country\'s potential for premium coffee.'
    },
    advice: {
      beginnerTips: [
        'Start with medium heat (200°C) for safe roasting',
        'Listen for first crack around 196°C',
        'Stop roasting 30-45 seconds after first crack for light-medium roast'
      ],
      commonMistakes: [
        'Roasting too fast - this bean needs time to develop',
        'Going too dark - destroys the delicate fruit notes',
        'Insufficient stirring - can cause uneven roasting'
      ],
      expertTechniques: [
        'Try a slow heat ramp to enhance fruit development',
        'Experiment with stopping just before second crack',
        'Use intermittent stirring for better heat distribution'
      ],
      idealBrewMethods: ['pour-over', 'V60', 'Chemex', 'cold brew']
    }
  },

  robusta_brazil: {
    id: 'robusta_brazil',
    name: 'Brazilian Robusta',
    origin: {
      country: 'Brazil',
      region: 'Espírito Santo',
      altitude: 800,
      processing: 'natural',
      harvestSeason: [5, 6, 7, 8] // May to August
    },
    economics: {
      basePrice: 5.00,
      rarity: 1,
      marketTrend: 'stable',
      seasonalMultiplier: [1.1, 1.1, 1.0, 0.9, 0.7, 0.6, 0.7, 0.8, 1.0, 1.1, 1.2, 1.2],
      supplyStability: 0.9
    },
    roasting: {
      difficulty: 1,
      heatSensitivity: 0.2,
      developmentWindow: 60,
      crackTemperature: [200, 230],
      optimalRange: [210, 225],
      stirringBenefit: 0.15
    },
    flavor: {
      acidity: 3,
      bitterness: 8,
      sweetness: 4,
      body: 9,
      aroma: 5,
      aftertaste: 7,
      balance: 6
    },
    description: {
      short: 'Bold and robust',
      detailed: 'Brazilian Robusta delivers a powerful, full-bodied cup with intense bitterness and earthy undertones. Higher caffeine content and strong flavor make it ideal for espresso blends and those who prefer bold coffee.',
      tastingNotes: ['earthy', 'woody', 'dark chocolate', 'nuts'],
      story: 'From the coastal state of Espírito Santo, this Robusta represents Brazil\'s commitment to quality even in their commodity-grade coffee production. Essential for authentic espresso blends.'
    },
    advice: {
      beginnerTips: [
        'Can handle higher temperatures than Arabica',
        'Great for practicing roasting techniques',
        'Develops flavor best in medium-dark to dark roasts'
      ],
      commonMistakes: [
        'Under-roasting - Robusta needs development to taste good',
        'Expecting bright acidity - this bean is naturally low-acid',
        'Roasting alone for filter coffee - better in blends'
      ],
      expertTechniques: [
        'Push to second crack for full body development',
        'Blend with Arabica for balanced espresso',
        'Use for creating signature house blends'
      ],
      idealBrewMethods: ['espresso', 'moka pot', 'French press', 'Turkish coffee']
    }
  },

  geisha_ethiopia: {
    id: 'geisha_ethiopia',
    name: 'Ethiopian Geisha',
    origin: {
      country: 'Ethiopia',
      region: 'Gesha Village',
      altitude: 2000,
      processing: 'washed',
      harvestSeason: [11, 12, 1, 2] // November to February
    },
    economics: {
      basePrice: 15.00,
      rarity: 5,
      marketTrend: 'rising',
      seasonalMultiplier: [0.8, 0.9, 1.2, 1.3, 1.4, 1.5, 1.4, 1.3, 1.2, 1.0, 0.7, 0.6],
      supplyStability: 0.3
    },
    roasting: {
      difficulty: 5,
      heatSensitivity: 0.7,
      developmentWindow: 25,
      crackTemperature: [190, 218],
      optimalRange: [195, 200],
      stirringBenefit: 0.4
    },
    flavor: {
      acidity: 9,
      bitterness: 2,
      sweetness: 8,
      body: 4,
      aroma: 10,
      aftertaste: 9,
      balance: 8
    },
    description: {
      short: 'Extraordinary floral',
      detailed: 'The legendary Geisha variety from its Ethiopian homeland offers an unparalleled coffee experience. Intensely floral and tea-like, with jasmine, bergamot, and tropical fruit notes that seem almost impossible in coffee.',
      tastingNotes: ['jasmine', 'bergamot', 'tropical fruit', 'tea-like', 'honey'],
      story: 'The original Geisha variety, discovered in the Gesha village of Ethiopia. This is the genetic parent of all the famous Panamanian Geisha that broke auction records. Extremely rare and difficult to source.'
    },
    advice: {
      beginnerTips: [
        'This is an expert-level bean - practice with easier varieties first',
        'Use very gentle heat - this bean burns easily',
        'Light roasting preserves the unique floral characteristics'
      ],
      commonMistakes: [
        'Roasting too hot or fast - ruins the delicate flavors',
        'Going past light-medium roast - destroys what makes it special',
        'Poor stirring - can create severe unevenness due to density variations'
      ],
      expertTechniques: [
        'Use lowest possible heat with extended development',
        'Stop roasting at the very beginning of first crack',
        'Consider air-cooling instead of water quenching',
        'Cup immediately to assess development - adjust next batch accordingly'
      ],
      idealBrewMethods: ['pour-over', 'syphon', 'Chemex', 'cupping']
    }
  },

  liberica_philippines: {
    id: 'liberica_philippines',
    name: 'Philippine Liberica',
    origin: {
      country: 'Philippines',
      region: 'Batangas',
      altitude: 300,
      processing: 'natural',
      harvestSeason: [3, 4, 5] // March to May
    },
    economics: {
      basePrice: 12.00,
      rarity: 4,
      marketTrend: 'rising',
      seasonalMultiplier: [1.3, 1.2, 0.8, 0.7, 0.8, 1.0, 1.1, 1.2, 1.3, 1.4, 1.4, 1.3],
      supplyStability: 0.4
    },
    roasting: {
      difficulty: 4,
      heatSensitivity: 0.5,
      developmentWindow: 35,
      crackTemperature: [198, 226],
      optimalRange: [205, 215],
      stirringBenefit: 0.3
    },
    flavor: {
      acidity: 4,
      bitterness: 6,
      sweetness: 5,
      body: 8,
      aroma: 8,
      aftertaste: 7,
      balance: 6
    },
    description: {
      short: 'Uniquely woody',
      detailed: 'Philippine Liberica offers a distinctive coffee experience unlike any other species. With its large beans and unique woody, smoky flavor profile, it provides full body with unusual but pleasant fruity and floral undertones.',
      tastingNotes: ['woody', 'smoky', 'jackfruit', 'dark chocolate', 'spice'],
      story: 'Liberica coffee from the Philippines represents one of the four main coffee species. Nearly extinct due to coffee rust disease, it\'s making a comeback thanks to Filipino coffee enthusiasts preserving this unique genetic heritage.'
    },
    advice: {
      beginnerTips: [
        'Expect very different flavors from Arabica - embrace the uniqueness',
        'Medium roast brings out the best characteristics',
        'Beans are larger - adjust roasting timing accordingly'
      ],
      commonMistakes: [
        'Comparing directly to Arabica - it\'s a different experience entirely',
        'Under-roasting - Liberica needs development to balance woody notes',
        'Roasting too light - can emphasize harsh woody flavors'
      ],
      expertTechniques: [
        'Extend development time due to larger bean size',
        'Monitor density changes - beans crack differently than Arabica',
        'Experiment with medium-dark roasts for unique flavor balance'
      ],
      idealBrewMethods: ['French press', 'espresso', 'cold brew', 'traditional Filipino brewing']
    }
  },

  bourbon_jamaica: {
    id: 'bourbon_jamaica',
    name: 'Jamaica Blue Mountain Bourbon',
    origin: {
      country: 'Jamaica',
      region: 'Blue Mountain',
      altitude: 1200,
      processing: 'washed',
      harvestSeason: [9, 10, 11, 12] // September to December
    },
    economics: {
      basePrice: 20.00,
      rarity: 5,
      marketTrend: 'stable',
      seasonalMultiplier: [1.4, 1.3, 1.2, 1.1, 1.0, 1.0, 1.0, 1.0, 0.8, 0.7, 0.8, 1.0],
      supplyStability: 0.6
    },
    roasting: {
      difficulty: 4,
      heatSensitivity: 0.4,
      developmentWindow: 40,
      crackTemperature: [194, 222],
      optimalRange: [198, 208],
      stirringBenefit: 0.25
    },
    flavor: {
      acidity: 6,
      bitterness: 3,
      sweetness: 8,
      body: 7,
      aroma: 9,
      aftertaste: 8,
      balance: 9
    },
    description: {
      short: 'Supremely balanced',
      detailed: 'Jamaica Blue Mountain Bourbon is renowned as one of the world\'s finest coffees. Grown in the mist-covered Blue Mountains, it offers exceptional balance with mild acidity, full body, and clean, sweet finish with no bitter aftertaste.',
      tastingNotes: ['mild acidity', 'chocolate', 'nuts', 'caramel', 'clean finish'],
      story: 'Protected by geographical designation, authentic Jamaica Blue Mountain coffee commands premium prices worldwide. The Bourbon variety grown here represents centuries of careful cultivation in ideal mountain conditions.'
    },
    advice: {
      beginnerTips: [
        'This premium bean deserves careful attention - practice with cheaper beans first',
        'Light to medium roast preserves the famous balance',
        'Very forgiving - hard to ruin completely'
      ],
      commonMistakes: [
        'Over-roasting - destroys the delicate balance that makes it famous',
        'Rushing the roast - this bean rewards patience',
        'Mixing with other beans - should be enjoyed pure'
      ],
      expertTechniques: [
        'Use moderate heat with extended development for complexity',
        'Stop just after first crack for optimal balance',
        'Focus on even heat distribution - this bean shows off roasting skill'
      ],
      idealBrewMethods: ['pour-over', 'drip coffee', 'French press', 'espresso']
    }
  },

  typica_hawaii: {
    id: 'typica_hawaii',
    name: 'Hawaiian Kona Typica',
    origin: {
      country: 'United States',
      region: 'Kona District, Hawaii',
      altitude: 800,
      processing: 'washed',
      harvestSeason: [8, 9, 10, 11] // August to November
    },
    economics: {
      basePrice: 18.00,
      rarity: 4,
      marketTrend: 'stable',
      seasonalMultiplier: [1.3, 1.3, 1.2, 1.1, 1.0, 1.0, 1.0, 0.8, 0.7, 0.8, 0.9, 1.2],
      supplyStability: 0.7
    },
    roasting: {
      difficulty: 3,
      heatSensitivity: 0.3,
      developmentWindow: 50,
      crackTemperature: [195, 223],
      optimalRange: [200, 212],
      stirringBenefit: 0.2
    },
    flavor: {
      acidity: 5,
      bitterness: 4,
      sweetness: 7,
      body: 7,
      aroma: 8,
      aftertaste: 7,
      balance: 8
    },
    description: {
      short: 'Smooth and rich',
      detailed: 'Hawaiian Kona Typica offers a smooth, rich cup with low acidity and nutty sweetness. The volcanic soil and tropical climate of the Kona district create a unique terroir that produces consistently excellent coffee with a clean, smooth finish.',
      tastingNotes: ['nuts', 'brown sugar', 'butter', 'mild spice', 'smooth'],
      story: 'Kona coffee represents the only commercial coffee grown in the United States. The Typica variety was introduced to Hawaii in the 1800s and has adapted perfectly to the volcanic slopes of Mauna Loa, creating America\'s premium coffee.'
    },
    advice: {
      beginnerTips: [
        'Very forgiving bean - great for intermediate roasters',
        'Medium roast highlights the nutty characteristics',
        'Consistent density makes even roasting easier'
      ],
      commonMistakes: [
        'Roasting too light - doesn\'t develop the signature nutty flavors',
        'Going too dark - overwhelms the smooth characteristics',
        'Insufficient development time - rushes the complex flavor formation'
      ],
      expertTechniques: [
        'Use steady heat ramp for even development',
        'Extend development phase for enhanced nuttiness',
        'Try stopping at different points in first crack for variety'
      ],
      idealBrewMethods: ['drip coffee', 'pour-over', 'French press', 'cold brew']
    }
  }
};

// Bean categories for easy filtering and progression
export const BEAN_CATEGORIES = {
  beginner: ['robusta_brazil', 'typica_hawaii'],
  intermediate: ['arabica_vietnam', 'bourbon_jamaica'],
  advanced: ['liberica_philippines', 'geisha_ethiopia']
};

// Seasonal availability helper
export function isBeanInSeason(beanId: string, month: number): boolean {
  const bean = COFFEE_BEANS[beanId];
  if (!bean) return false;
  return bean.origin.harvestSeason.includes(month);
}

// Price calculation with market factors
export function calculateCurrentPrice(beanId: string, month: number, marketEvents: string[] = []): number {
  const bean = COFFEE_BEANS[beanId];
  if (!bean) return 0;
  
  let price = bean.economics.basePrice;
  
  // Apply seasonal multiplier
  const seasonalMultiplier = bean.economics.seasonalMultiplier[month - 1] || 1.0;
  price *= seasonalMultiplier;
  
  // Apply market volatility (random variation based on supply stability)
  const volatility = (1 - bean.economics.supplyStability) * 0.2; // Max 20% variation
  const randomFactor = 1 + (Math.random() - 0.5) * volatility;
  price *= randomFactor;
  
  // Apply market events (simplified)
  for (const event of marketEvents) {
    if (event.includes(bean.origin.country.toLowerCase())) {
      if (event.includes('frost') || event.includes('drought')) {
        price *= 1.15; // 15% increase for supply disruption
      } else if (event.includes('harvest') || event.includes('surplus')) {
        price *= 0.9; // 10% decrease for oversupply
      }
    }
  }
  
  return Math.round(price * 100) / 100; // Round to 2 decimal places
}
