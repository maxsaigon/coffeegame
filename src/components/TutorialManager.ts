/**
 * Tutorial Manager
 * Manages the flow and logic of the coffee roasting tutorial
 */

import Phaser from 'phaser';

export interface TutorialStep {
  id: string;
  title: string;
  description: string;
  target?: string; // Element to highlight
  action?: string; // Required action to complete
  condition?: () => boolean; // Completion condition
  duration?: number; // Auto-advance after duration (ms)
  skippable?: boolean;
}

export class TutorialManager extends Phaser.Events.EventEmitter {
  private scene: any; // TutorialScene - avoiding circular dependency
  private currentStepIndex: number = 0;
  private steps: TutorialStep[] = [];
  private isActive: boolean = false;
  private stepStartTime: number = 0;
  
  // Tutorial state tracking
  private playerActions: Map<string, boolean> = new Map();
  private completedSteps: Set<string> = new Set();
  
  constructor(scene: any) { // TutorialScene - avoiding circular dependency
    super();
    this.scene = scene;
  }

  public startTutorial(steps: TutorialStep[]): void {
    this.steps = steps;
    this.currentStepIndex = 0;
    this.isActive = true;
    this.playerActions.clear();
    this.completedSteps.clear();
    
    console.log(`Starting tutorial with ${steps.length} steps`);
    this.executeCurrentStep();
  }

  public getTutorialSteps(experienceLevel: string): TutorialStep[] {
    switch (experienceLevel) {
      case 'beginner':
        return this.getBeginnerSteps();
      case 'intermediate':
        return this.getIntermediateSteps();
      case 'experienced':
        return this.getExperiencedSteps();
      default:
        return this.getBeginnerSteps();
    }
  }

  private getBeginnerSteps(): TutorialStep[] {
    return [
      {
        id: 'welcome',
        title: 'Welcome to Coffee Roasting!',
        description: 'Let\'s learn the basics of coffee roasting. Coffee roasting is both an art and a science.',
        duration: 4000,
        skippable: true
      },
      {
        id: 'beans_introduction',
        title: 'Meet Your Coffee Beans',
        description: 'These are green coffee beans. They need to be roasted to develop flavor and aroma.',
        target: 'beans',
        duration: 3000
      },
      {
        id: 'drum_introduction',
        title: 'The Roasting Drum',
        description: 'This is your roasting drum. It heats and rotates the beans for even roasting.',
        target: 'drum',
        duration: 3000
      },
      {
        id: 'add_beans',
        title: 'Add Beans to Drum',
        description: 'Click on a bean and drag it to the roasting drum to add it.',
        target: 'beans',
        action: 'add_bean_to_drum',
        condition: () => this.scene.getRoastingDrum().getBeanCount() > 0
      },
      {
        id: 'start_heating',
        title: 'Start Heating',
        description: 'Click on the roasting drum to start heating. Watch the temperature rise!',
        target: 'drum',
        action: 'start_heating',
        condition: () => this.scene.getRoastingDrum().isCurrentlyRoasting()
      },
      {
        id: 'watch_roasting',
        title: 'Watch the Roasting Process',
        description: 'Notice how the beans change color as they roast. Listen for the "first crack" sound!',
        duration: 8000
      },
      {
        id: 'stop_roasting',
        title: 'Stop Roasting',
        description: 'Click the drum again to stop roasting when the beans reach your desired color.',
        action: 'stop_roasting',
        condition: () => !this.scene.getRoastingDrum().isCurrentlyRoasting()
      },
      {
        id: 'congratulations',
        title: 'Congratulations!',
        description: 'You\'ve completed your first roast! Practice with different timings to discover new flavors.',
        duration: 4000
      }
    ];
  }

  private getIntermediateSteps(): TutorialStep[] {
    return [
      {
        id: 'welcome_intermediate',
        title: 'Welcome Back!',
        description: 'Let\'s explore advanced roasting techniques and flavor development.',
        duration: 3000
      },
      {
        id: 'temperature_control',
        title: 'Temperature Control',
        description: 'Different temperatures create different flavor profiles. Experiment with heat settings.',
        target: 'drum',
        duration: 4000
      },
      {
        id: 'roast_timing',
        title: 'Timing is Everything',
        description: 'The roast time affects acidity, body, and flavor balance. Try different durations.',
        duration: 4000
      },
      {
        id: 'practice_roast',
        title: 'Practice Roast',
        description: 'Try roasting these beans with precise temperature and timing control.',
        action: 'complete_roast',
        condition: () => this.hasCompletedRoast()
      },
      {
        id: 'advanced_complete',
        title: 'Advanced Techniques Learned',
        description: 'You\'re ready for more complex roasting challenges!',
        duration: 3000
      }
    ];
  }

  private getExperiencedSteps(): TutorialStep[] {
    return [
      {
        id: 'expert_welcome',
        title: 'Expert Mode',
        description: 'Quick overview of the game interface and advanced features.',
        duration: 2000
      },
      {
        id: 'quality_system',
        title: 'Quality Assessment',
        description: 'The game uses professional cupping standards for quality evaluation.',
        duration: 3000
      },
      {
        id: 'customer_system',
        title: 'Customer Preferences',
        description: 'Each customer has unique taste preferences and quality expectations.',
        duration: 3000
      },
      {
        id: 'expert_complete',
        title: 'Ready to Master',
        description: 'You\'re all set! Go create amazing coffee experiences.',
        duration: 2000
      }
    ];
  }

  private executeCurrentStep(): void {
    if (this.currentStepIndex >= this.steps.length) {
      this.completeTutorial();
      return;
    }

    const step = this.steps[this.currentStepIndex];
    this.stepStartTime = Date.now();
    
    console.log(`Executing step: ${step.id} - ${step.title}`);
    
    // Emit highlight event if target specified
    if (step.target) {
      const target = this.getTargetElement(step.target);
      this.emit('highlight', target, step.description);
    }
    
    // Show step message
    this.scene.showMessage(`${step.title}: ${step.description}`);
    
    // Set up auto-advance if duration specified
    if (step.duration && !step.condition) {
      this.scene.time.delayedCall(step.duration, () => {
        this.completeCurrentStep();
      });
    }
    
    // Set up action tracking if action required
    if (step.action) {
      this.trackAction(step.action);
    }
  }

  private getTargetElement(target: string): any {
    switch (target) {
      case 'beans':
        return this.scene.getTutorialBeans()[0] || { x: 320, y: 450 };
      case 'drum':
        return this.scene.getRoastingDrum() || { x: 400, y: 350 };
      default:
        return { x: 400, y: 300 };
    }
  }

  private trackAction(action: string): void {
    // Set up event listeners based on action type
    switch (action) {
      case 'add_bean_to_drum':
        this.trackBeanAddition();
        break;
      case 'start_heating':
        this.trackHeatingStart();
        break;
      case 'stop_roasting':
        this.trackRoastingStop();
        break;
      case 'complete_roast':
        this.trackRoastCompletion();
        break;
    }
  }

  private trackBeanAddition(): void {
    // Monitor drum for bean addition
    const checkBeans = () => {
      if (this.scene.getRoastingDrum().getBeanCount() > 0) {
        this.playerActions.set('add_bean_to_drum', true);
        this.checkStepCompletion();
      } else {
        this.scene.time.delayedCall(100, checkBeans);
      }
    };
    checkBeans();
  }

  private trackHeatingStart(): void {
    const checkHeating = () => {
      if (this.scene.getRoastingDrum().isCurrentlyRoasting()) {
        this.playerActions.set('start_heating', true);
        this.checkStepCompletion();
      } else {
        this.scene.time.delayedCall(100, checkHeating);
      }
    };
    checkHeating();
  }

  private trackRoastingStop(): void {
    const checkStopped = () => {
      if (!this.scene.getRoastingDrum().isCurrentlyRoasting()) {
        this.playerActions.set('stop_roasting', true);
        this.checkStepCompletion();
      } else {
        this.scene.time.delayedCall(100, checkStopped);
      }
    };
    checkStopped();
  }

  private trackRoastCompletion(): void {
    const checkCompletion = () => {
      if (this.hasCompletedRoast()) {
        this.playerActions.set('complete_roast', true);
        this.checkStepCompletion();
      } else {
        this.scene.time.delayedCall(100, checkCompletion);
      }
    };
    checkCompletion();
  }

  private hasCompletedRoast(): boolean {
    const drum = this.scene.getRoastingDrum();
    return drum.getBeanCount() > 0 && drum.getAverageRoastLevel() > 0.3;
  }

  private checkStepCompletion(): void {
    const step = this.steps[this.currentStepIndex];
    
    if (step.condition && step.condition()) {
      this.completeCurrentStep();
    } else if (step.action && this.playerActions.get(step.action)) {
      this.completeCurrentStep();
    }
  }

  public completeCurrentStep(): void {
    const step = this.steps[this.currentStepIndex];
    this.completedSteps.add(step.id);
    
    this.emit('stepComplete', {
      step: step,
      stepIndex: this.currentStepIndex,
      timeSpent: Date.now() - this.stepStartTime
    });
    
    this.currentStepIndex++;
    
    // Small delay before next step
    this.scene.time.delayedCall(500, () => {
      this.executeCurrentStep();
    });
  }

  private completeTutorial(): void {
    this.isActive = false;
    console.log('Tutorial completed!');
    
    this.emit('tutorialComplete', {
      totalSteps: this.steps.length,
      completedSteps: this.completedSteps.size,
      totalTime: Date.now() - this.stepStartTime
    });
  }

  public skipToStep(stepIndex: number): void {
    if (stepIndex >= 0 && stepIndex < this.steps.length) {
      this.currentStepIndex = stepIndex;
      this.executeCurrentStep();
    }
  }

  public skipTutorial(): void {
    this.isActive = false;
    this.completeTutorial();
  }

  public getTotalSteps(): number {
    return this.steps.length;
  }

  public getCurrentStepIndex(): number {
    return this.currentStepIndex;
  }

  public isTutorialActive(): boolean {
    return this.isActive;
  }

  public getCompletedSteps(): string[] {
    return Array.from(this.completedSteps);
  }

  public update(): void {
    if (!this.isActive) return;
    
    // Check for step completion conditions
    this.checkStepCompletion();
    
    // Handle any periodic tutorial logic
    const currentStep = this.steps[this.currentStepIndex];
    if (currentStep?.duration) {
      const elapsed = Date.now() - this.stepStartTime;
      if (elapsed >= currentStep.duration && !currentStep.condition) {
        this.completeCurrentStep();
      }
    }
  }

  public destroy(): void {
    this.isActive = false;
    this.removeAllListeners();
  }
}
