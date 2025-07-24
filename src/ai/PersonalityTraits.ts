import Phaser from 'phaser';

export interface PersonalityTrait {
    name: string;
    intensity: number; // 0.1-1.0 - how strong this trait is
    stability: number; // 0.1-1.0 - how resistant to change
    opposites: string[]; // traits that conflict with this one
    synergies: string[]; // traits that enhance this one
}

export interface PersonalityProfile {
    coreTraits: Map<string, PersonalityTrait>;
    moodModifiers: Map<string, number>; // temporary mood effects
    adaptationHistory: Array<{
        timestamp: number;
        trigger: string;
        change: string;
        intensity: number;
    }>;
    lastUpdate: number;
}

export interface PersonalityContext {
    timeOfDay: 'morning' | 'afternoon' | 'evening';
    weather: 'sunny' | 'rainy' | 'cloudy';
    socialSetting: 'alone' | 'with_friends' | 'business';
    stress_level: number; // 0-1
    caffeine_need: number; // 0-1
}

export class PersonalityTraits {
    private profile: PersonalityProfile;
    private baseTraitDefinitions: Map<string, Omit<PersonalityTrait, 'intensity'>> = new Map();
    
    constructor(initialTraits?: string[]) {
        this.initializeTraitDefinitions();
        this.profile = this.generatePersonalityProfile(initialTraits);
    }

    private initializeTraitDefinitions(): void {
        this.baseTraitDefinitions = new Map([
            ['friendly', {
                name: 'friendly',
                stability: 0.8,
                opposites: ['grumpy', 'antisocial', 'impatient'],
                synergies: ['chatty', 'loyal', 'trusting']
            }],
            ['grumpy', {
                name: 'grumpy',
                stability: 0.6,
                opposites: ['friendly', 'cheerful', 'optimistic'],
                synergies: ['impatient', 'critical', 'perfectionist']
            }],
            ['picky', {
                name: 'picky',
                stability: 0.9,
                opposites: ['adventurous', 'easygoing'],
                synergies: ['perfectionist', 'critical', 'quality_focused']
            }],
            ['adventurous', {
                name: 'adventurous',
                stability: 0.7,
                opposites: ['picky', 'conservative', 'cautious'],
                synergies: ['curious', 'open_minded', 'experimental']
            }],
            ['loyal', {
                name: 'loyal',
                stability: 0.95,
                opposites: ['fickle', 'exploring'],
                synergies: ['trusting', 'consistent', 'friendly']
            }],
            ['impatient', {
                name: 'impatient',
                stability: 0.4,
                opposites: ['patient', 'calm', 'relaxed'],
                synergies: ['busy', 'stressed', 'grumpy']
            }],
            ['perfectionist', {
                name: 'perfectionist',
                stability: 0.85,
                opposites: ['easygoing', 'casual'],
                synergies: ['picky', 'critical', 'quality_focused']
            }],
            ['chatty', {
                name: 'chatty',
                stability: 0.6,
                opposites: ['quiet', 'reserved', 'shy'],
                synergies: ['friendly', 'social', 'expressive']
            }],
            ['curious', {
                name: 'curious',
                stability: 0.7,
                opposites: ['disinterested', 'routine_focused'],
                synergies: ['adventurous', 'learning_oriented', 'questioning']
            }],
            ['stressed', {
                name: 'stressed',
                stability: 0.3, // highly variable
                opposites: ['relaxed', 'calm', 'peaceful'],
                synergies: ['impatient', 'irritable', 'rushed']
            }]
        ]);
    }

    private generatePersonalityProfile(initialTraits?: string[]): PersonalityProfile {
        const profile: PersonalityProfile = {
            coreTraits: new Map(),
            moodModifiers: new Map(),
            adaptationHistory: [],
            lastUpdate: Date.now()
        };

        // Generate core traits
        const traitsToUse = initialTraits || this.selectRandomTraits();
        
        for (const traitName of traitsToUse) {
            const baseTrait = this.baseTraitDefinitions.get(traitName);
            if (baseTrait) {
                profile.coreTraits.set(traitName, {
                    ...baseTrait,
                    intensity: Phaser.Math.FloatBetween(0.3, 0.9)
                });
            }
        }

        // Ensure personality consistency
        this.resolveTraitConflicts(profile);
        
        return profile;
    }

    private selectRandomTraits(): string[] {
        const availableTraits = Array.from(this.baseTraitDefinitions.keys());
        const numTraits = Phaser.Math.Between(2, 4);
        return Phaser.Utils.Array.Shuffle(availableTraits).slice(0, numTraits);
    }

    private resolveTraitConflicts(profile: PersonalityProfile): void {
        const traits = Array.from(profile.coreTraits.values());
        
        for (const trait of traits) {
            for (const oppositeName of trait.opposites) {
                const opposite = profile.coreTraits.get(oppositeName);
                if (opposite) {
                    // Reduce intensity of weaker conflicting trait
                    if (trait.intensity > opposite.intensity) {
                        opposite.intensity *= 0.6;
                    } else {
                        trait.intensity *= 0.6;
                    }
                }
            }
            
            // Enhance synergistic traits
            for (const synergyName of trait.synergies) {
                const synergy = profile.coreTraits.get(synergyName);
                if (synergy) {
                    synergy.intensity = Math.min(1.0, synergy.intensity * 1.2);
                }
            }
        }
    }

    /**
     * Adapt personality based on repeated interactions
     */
    public adaptPersonality(
        trigger: string, 
        playerBehavior: 'positive' | 'negative' | 'neutral',
        intensity: number = 0.1
    ): void {
        const now = Date.now();
        const daysSinceUpdate = (now - this.profile.lastUpdate) / (1000 * 60 * 60 * 24);
        
        // Only allow adaptation if enough time has passed
        if (daysSinceUpdate < 1) return;

        let changes: string[] = [];

        switch (trigger) {
            case 'consistently_good_service':
                if (playerBehavior === 'positive') {
                    this.strengthenTrait('loyal', intensity);
                    this.strengthenTrait('friendly', intensity * 0.7);
                    this.weakenTrait('grumpy', intensity);
                    changes.push('Became more loyal and friendly');
                }
                break;
                
            case 'consistently_poor_service':
                if (playerBehavior === 'negative') {
                    this.strengthenTrait('grumpy', intensity);
                    this.strengthenTrait('impatient', intensity * 0.8);
                    this.weakenTrait('loyal', intensity);
                    this.weakenTrait('friendly', intensity * 0.6);
                    changes.push('Became more grumpy and impatient');
                }
                break;
                
            case 'ignored_repeatedly':
                this.strengthenTrait('impatient', intensity * 1.5);
                this.strengthenTrait('grumpy', intensity);
                changes.push('Became very impatient from being ignored');
                break;
                
            case 'perfect_memory_service':
                this.strengthenTrait('loyal', intensity * 1.3);
                this.strengthenTrait('trusting', intensity);
                changes.push('Developed strong loyalty from personalized service');
                break;
                
            case 'introduced_to_new_flavors':
                if (playerBehavior === 'positive') {
                    this.strengthenTrait('adventurous', intensity);
                    this.weakenTrait('picky', intensity * 0.5);
                    changes.push('Became more adventurous with coffee choices');
                }
                break;
        }

        // Record adaptation
        if (changes.length > 0) {
            this.profile.adaptationHistory.push({
                timestamp: now,
                trigger,
                change: changes.join(', '),
                intensity
            });
            
            this.profile.lastUpdate = now;
            
            // Keep only last 20 adaptations
            if (this.profile.adaptationHistory.length > 20) {
                this.profile.adaptationHistory.shift();
            }
        }
    }

    /**
     * Apply contextual mood modifiers
     */
    public applyContext(context: PersonalityContext): void {
        this.profile.moodModifiers.clear();
        
        // Time of day effects
        switch (context.timeOfDay) {
            case 'morning':
                if (context.caffeine_need > 0.7) {
                    this.profile.moodModifiers.set('grumpy', 0.3);
                    this.profile.moodModifiers.set('impatient', 0.4);
                }
                break;
            case 'afternoon':
                this.profile.moodModifiers.set('social', 0.2);
                break;
            case 'evening':
                this.profile.moodModifiers.set('relaxed', 0.3);
                break;
        }

        // Weather effects
        if (context.weather === 'rainy') {
            this.profile.moodModifiers.set('grumpy', 0.2);
            this.profile.moodModifiers.set('comfort_seeking', 0.4);
        }

        // Stress effects
        if (context.stress_level > 0.6) {
            this.profile.moodModifiers.set('impatient', context.stress_level * 0.5);
            this.profile.moodModifiers.set('grumpy', context.stress_level * 0.3);
        }
    }

    private strengthenTrait(traitName: string, amount: number): void {
        const existing = this.profile.coreTraits.get(traitName);
        if (existing) {
            existing.intensity = Math.min(1.0, existing.intensity + amount);
        } else {
            // Add new trait if it doesn't exist
            const baseTrait = this.baseTraitDefinitions.get(traitName);
            if (baseTrait) {
                this.profile.coreTraits.set(traitName, {
                    ...baseTrait,
                    intensity: Math.min(1.0, amount * 2) // Start stronger for new traits
                });
            }
        }
    }

    private weakenTrait(traitName: string, amount: number): void {
        const existing = this.profile.coreTraits.get(traitName);
        if (existing) {
            existing.intensity = Math.max(0.1, existing.intensity - amount);
            
            // Remove trait if it becomes too weak
            if (existing.intensity < 0.2) {
                this.profile.coreTraits.delete(traitName);
            }
        }
    }

    /**
     * Get effective trait intensity (core + mood modifiers)
     */
    public getEffectiveTraitIntensity(traitName: string): number {
        const baseTrait = this.profile.coreTraits.get(traitName);
        const moodModifier = this.profile.moodModifiers.get(traitName) || 0;
        
        const baseIntensity = baseTrait ? baseTrait.intensity : 0;
        return Math.min(1.0, baseIntensity + moodModifier);
    }

    /**
     * Get all current traits with effective intensities
     */
    public getCurrentTraits(): Array<{ name: string; intensity: number; source: 'core' | 'mood' | 'both' }> {
        const traits = new Map<string, { intensity: number; source: 'core' | 'mood' | 'both' }>();
        
        // Add core traits
        this.profile.coreTraits.forEach((trait, name) => {
            traits.set(name, { intensity: trait.intensity, source: 'core' });
        });
        
        // Add/modify with mood modifiers
        this.profile.moodModifiers.forEach((modifier, name) => {
            const existing = traits.get(name);
            if (existing) {
                existing.intensity = Math.min(1.0, existing.intensity + modifier);
                existing.source = 'both';
            } else {
                traits.set(name, { intensity: modifier, source: 'mood' });
            }
        });
        
        return Array.from(traits.entries()).map(([name, data]) => ({
            name,
            intensity: data.intensity,
            source: data.source
        }));
    }

    /**
     * Get dominant traits (intensity > 0.5)
     */
    public getDominantTraits(): string[] {
        return this.getCurrentTraits()
            .filter(trait => trait.intensity > 0.5)
            .sort((a, b) => b.intensity - a.intensity)
            .map(trait => trait.name);
    }

    /**
     * Get legacy simple traits array for backwards compatibility
     */
    public getTraits(): string[] {
        return this.getDominantTraits();
    }

    /**
     * Get personality adaptation history
     */
    public getAdaptationHistory(): Array<{
        timestamp: number;
        trigger: string;
        change: string;
        intensity: number;
    }> {
        return [...this.profile.adaptationHistory];
    }

    /**
     * Serialize personality for saving
     */
    public serialize(): string {
        const data = {
            coreTraits: Array.from(this.profile.coreTraits.entries()),
            adaptationHistory: this.profile.adaptationHistory,
            lastUpdate: this.profile.lastUpdate
        };
        return JSON.stringify(data);
    }

    /**
     * Load personality from saved data
     */
    public deserialize(data: string): void {
        try {
            const parsed = JSON.parse(data);
            
            this.profile.coreTraits.clear();
            for (const [name, trait] of parsed.coreTraits) {
                this.profile.coreTraits.set(name, trait);
            }
            
            this.profile.adaptationHistory = parsed.adaptationHistory || [];
            this.profile.lastUpdate = parsed.lastUpdate || Date.now();
            
        } catch (error) {
            console.warn('Failed to deserialize personality traits:', error);
        }
    }
}