/**
 * Tutorial Steps Data
 * Comprehensive tutorial content and progression data
 */

export interface TutorialStepData {
  id: string;
  category: 'introduction' | 'basics' | 'intermediate' | 'advanced' | 'mastery';
  title: string;
  description: string;
  objective: string;
  hints: string[];
  estimatedTime: number; // in seconds
  prerequisites?: string[];
  unlocks?: string[];
  difficulty: 1 | 2 | 3 | 4 | 5;
}

export const TUTORIAL_STEPS: Record<string, TutorialStepData> = {
  // Introduction Steps
  welcome: {
    id: 'welcome',
    category: 'introduction',
    title: 'Welcome to Coffee Roasting!',
    description: 'Welcome to the art and science of coffee roasting. You\'ll learn to transform green coffee beans into aromatic, flavorful roasted coffee.',
    objective: 'Understand the basics of coffee roasting',
    hints: [
      'Coffee roasting is both an art and a science',
      'Every bean variety has unique characteristics',
      'Temperature and timing are crucial for flavor development'
    ],
    estimatedTime: 30,
    difficulty: 1
  },

  beans_introduction: {
    id: 'beans_introduction',
    category: 'introduction',
    title: 'Understanding Coffee Beans',
    description: 'These green coffee beans are the raw material. They need heat to develop the flavors and aromas we associate with coffee.',
    objective: 'Learn about green coffee beans and their properties',
    hints: [
      'Green beans have no coffee aroma or flavor yet',
      'Different origins have different characteristics',
      'Bean density affects roasting time'
    ],
    estimatedTime: 45,
    difficulty: 1
  },

  equipment_overview: {
    id: 'equipment_overview',
    category: 'introduction',
    title: 'Roasting Equipment',
    description: 'Your roasting drum heats and agitates the beans for even roasting. Temperature control is essential.',
    objective: 'Familiarize yourself with the roasting equipment',
    hints: [
      'The drum rotates to ensure even heat distribution',
      'Temperature can be adjusted during roasting',
      'Watch for visual and auditory cues'
    ],
    estimatedTime: 60,
    difficulty: 1
  },

  // Basic Steps
  first_roast: {
    id: 'first_roast',
    category: 'basics',
    title: 'Your First Roast',
    description: 'Let\'s start with a simple roast. Add beans to the drum and begin heating.',
    objective: 'Complete your first coffee roast',
    hints: [
      'Start with medium heat',
      'Listen for the "first crack" sound',
      'Watch the bean color change from green to brown'
    ],
    estimatedTime: 300,
    prerequisites: ['beans_introduction', 'equipment_overview'],
    difficulty: 2
  },

  temperature_control: {
    id: 'temperature_control',
    category: 'basics',
    title: 'Temperature Control',
    description: 'Learn to control temperature during roasting. Too hot and you\'ll burn the beans, too cool and they won\'t develop properly.',
    objective: 'Master basic temperature control',
    hints: [
      'Start around 350°F (175°C)',
      'Gradually increase temperature',
      'Never exceed 450°F (230°C) for most beans'
    ],
    estimatedTime: 240,
    prerequisites: ['first_roast'],
    difficulty: 2
  },

  timing_fundamentals: {
    id: 'timing_fundamentals',
    category: 'basics',
    title: 'Roasting Time and Development',
    description: 'Timing affects flavor development. Shorter roasts preserve acidity, longer roasts develop body and reduce acidity.',
    objective: 'Understand how time affects flavor',
    hints: [
      'Light roasts: 8-10 minutes',
      'Medium roasts: 10-12 minutes',
      'Dark roasts: 12-15 minutes'
    ],
    estimatedTime: 180,
    prerequisites: ['temperature_control'],
    difficulty: 2
  },

  // Intermediate Steps
  crack_recognition: {
    id: 'crack_recognition',
    category: 'intermediate',
    title: 'First and Second Crack',
    description: 'Learn to identify the auditory cues that indicate roast progression. First crack signals light roast, second crack indicates dark roast.',
    objective: 'Identify first and second crack sounds',
    hints: [
      'First crack sounds like popcorn popping',
      'Second crack is quieter and more irregular',
      'Stop before second crack for medium roasts'
    ],
    estimatedTime: 300,
    prerequisites: ['timing_fundamentals'],
    unlocks: ['advanced_profiling'],
    difficulty: 3
  },

  flavor_development: {
    id: 'flavor_development',
    category: 'intermediate',
    title: 'Flavor Development Time',
    description: 'The time between first crack and the end of roasting is crucial for flavor development. This affects sweetness, acidity, and body.',
    objective: 'Control flavor development through timing',
    hints: [
      'Longer development time = more body',
      'Shorter development time = more acidity',
      'Aim for 20-25% of total roast time'
    ],
    estimatedTime: 360,
    prerequisites: ['crack_recognition'],
    difficulty: 3
  },

  heat_application: {
    id: 'heat_application',
    category: 'intermediate',
    title: 'Heat Application Techniques',
    description: 'Learn to adjust heat throughout the roast. Proper heat application prevents scorching and ensures even development.',
    objective: 'Master heat adjustment techniques',
    hints: [
      'Reduce heat approaching first crack',
      'Increase airflow to control temperature',
      'Watch for signs of uneven roasting'
    ],
    estimatedTime: 300,
    prerequisites: ['flavor_development'],
    difficulty: 3
  },

  // Advanced Steps
  roast_profiling: {
    id: 'roast_profiling',
    category: 'advanced',
    title: 'Creating Roast Profiles',
    description: 'Develop consistent roast profiles by tracking temperature curves and timing. This ensures reproducible results.',
    objective: 'Create and follow a roast profile',
    hints: [
      'Record temperature every 30 seconds',
      'Note key events (yellowing, first crack, etc.)',
      'Aim for smooth temperature curves'
    ],
    estimatedTime: 600,
    prerequisites: ['heat_application'],
    unlocks: ['origin_specific_roasting'],
    difficulty: 4
  },

  defect_identification: {
    id: 'defect_identification',
    category: 'advanced',
    title: 'Identifying Roast Defects',
    description: 'Learn to spot common roasting defects like tipping, scorching, and underdevelopment that affect cup quality.',
    objective: 'Identify and prevent roasting defects',
    hints: [
      'Tipping: burnt tips from too much heat',
      'Scorching: dark patches from uneven heat',
      'Underdevelopment: grassy flavors from insufficient roasting'
    ],
    estimatedTime: 420,
    prerequisites: ['roast_profiling'],
    difficulty: 4
  },

  origin_specific: {
    id: 'origin_specific',
    category: 'advanced',
    title: 'Origin-Specific Roasting',
    description: 'Different coffee origins require different roasting approaches. Ethiopian beans need different treatment than Brazilian beans.',
    objective: 'Adapt roasting to bean origin characteristics',
    hints: [
      'African beans: preserve brightness and floral notes',
      'Central American: balance acidity and body',
      'South American: develop sweetness and chocolate notes'
    ],
    estimatedTime: 480,
    prerequisites: ['defect_identification'],
    difficulty: 4
  },

  // Mastery Steps
  cupping_evaluation: {
    id: 'cupping_evaluation',
    category: 'mastery',
    title: 'Professional Cupping',
    description: 'Learn to evaluate your roasts using professional cupping protocols. This helps you improve your roasting consistency.',
    objective: 'Conduct professional coffee cupping',
    hints: [
      'Use a 1:18 coffee to water ratio',
      'Break the crust at 4 minutes',
      'Evaluate aroma, flavor, acidity, body, and finish'
    ],
    estimatedTime: 900,
    prerequisites: ['origin_specific'],
    unlocks: ['advanced_blending'],
    difficulty: 5
  },

  blend_creation: {
    id: 'blend_creation',
    category: 'mastery',
    title: 'Creating Coffee Blends',
    description: 'Combine different roasted coffees to create unique blends. Balance different characteristics to achieve desired flavor profiles.',
    objective: 'Create a balanced coffee blend',
    hints: [
      'Start with a base coffee (60-70%)',
      'Add accent coffees for complexity',
      'Consider how different roast levels interact'
    ],
    estimatedTime: 720,
    prerequisites: ['cupping_evaluation'],
    difficulty: 5
  },

  production_scaling: {
    id: 'production_scaling',
    category: 'mastery',
    title: 'Production Scaling',
    description: 'Learn to scale your roasting operation. Understand how batch size affects roast profiles and quality consistency.',
    objective: 'Scale roasting operations efficiently',
    hints: [
      'Larger batches have more thermal mass',
      'Adjust profiles for different batch sizes',
      'Maintain quality consistency across batches'
    ],
    estimatedTime: 600,
    prerequisites: ['blend_creation'],
    difficulty: 5
  }
};

export const TUTORIAL_CATEGORIES = {
  introduction: {
    name: 'Introduction',
    description: 'Basic concepts and overview',
    color: '#4CAF50',
    estimatedTime: 135
  },
  basics: {
    name: 'Roasting Basics',
    description: 'Fundamental roasting techniques',
    color: '#2196F3',
    estimatedTime: 720
  },
  intermediate: {
    name: 'Intermediate Skills',
    description: 'Advanced control and recognition',
    color: '#FF9800',
    estimatedTime: 960
  },
  advanced: {
    name: 'Advanced Techniques',
    description: 'Professional-level skills',
    color: '#9C27B0',
    estimatedTime: 1500
  },
  mastery: {
    name: 'Master Roaster',
    description: 'Expert-level operations',
    color: '#F44336',
    estimatedTime: 2220
  }
};

export const TUTORIAL_PROGRESSION = {
  beginner: [
    'welcome',
    'beans_introduction',
    'equipment_overview',
    'first_roast',
    'temperature_control'
  ],
  intermediate: [
    'welcome',
    'equipment_overview',
    'timing_fundamentals',
    'crack_recognition',
    'flavor_development'
  ],
  experienced: [
    'equipment_overview',
    'roast_profiling',
    'defect_identification',
    'cupping_evaluation'
  ]
};

export const TUTORIAL_ACHIEVEMENTS = {
  first_roast: {
    id: 'first_roast_complete',
    title: 'First Roast Master',
    description: 'Completed your first coffee roast',
    icon: '☕',
    points: 100
  },
  perfect_timing: {
    id: 'perfect_timing',
    title: 'Perfect Timing',
    description: 'Achieved optimal roast timing',
    icon: '⏰',
    points: 200
  },
  flavor_expert: {
    id: 'flavor_expert',
    title: 'Flavor Expert',
    description: 'Mastered flavor development control',
    icon: '👃',
    points: 300
  },
  roast_master: {
    id: 'roast_master',
    title: 'Roast Master',
    description: 'Completed all tutorial categories',
    icon: '🏆',
    points: 1000
  }
};

// Helper functions
export function getTutorialStepById(id: string): TutorialStepData | undefined {
  return TUTORIAL_STEPS[id];
}

export function getTutorialStepsByCategory(category: string): TutorialStepData[] {
  return Object.values(TUTORIAL_STEPS).filter(step => step.category === category);
}

export function getProgressionSteps(level: 'beginner' | 'intermediate' | 'experienced'): TutorialStepData[] {
  const stepIds = TUTORIAL_PROGRESSION[level];
  return stepIds.map(id => TUTORIAL_STEPS[id]).filter(Boolean);
}

export function calculateTotalTime(stepIds: string[]): number {
  return stepIds.reduce((total, id) => {
    const step = TUTORIAL_STEPS[id];
    return total + (step?.estimatedTime || 0);
  }, 0);
}

export function getNextSteps(completedSteps: string[]): TutorialStepData[] {
  return Object.values(TUTORIAL_STEPS).filter(step => {
    // Check if prerequisites are met
    if (step.prerequisites) {
      return step.prerequisites.every(prereq => completedSteps.includes(prereq));
    }
    return !completedSteps.includes(step.id);
  });
}
