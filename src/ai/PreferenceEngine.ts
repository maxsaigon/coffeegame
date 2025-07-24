import Phaser from 'phaser';

export interface CustomerPreferences {
    roast: string;
    flavor: string;
    strength: number; // 0.1-1.0
    sweetness: number; // 0.1-1.0
    acidity: number; // 0.1-1.0
    lastUpdated: number; // timestamp
    evolutionRate: number; // how fast preferences change
}

export interface PreferenceHistory {
    timestamp: number;
    satisfactionScore: number; // 0-100
    coffeeServed: {
        roast: string;
        flavor: string;
        quality: number;
    };
}

export class PreferenceEngine {
    private preferences: CustomerPreferences;
    private history: PreferenceHistory[] = [];
    
    constructor(initialPreferences?: Partial<CustomerPreferences>) {
        this.preferences = this.generateInitialPreferences(initialPreferences);
    }

    private generateInitialPreferences(initial?: Partial<CustomerPreferences>): CustomerPreferences {
        const roasts = ['light', 'medium', 'dark'];
        const flavors = ['fruity', 'floral', 'spicy', 'bitter', 'sweet', 'chocolatey', 'nutty'];
        
        return {
            roast: initial?.roast || Phaser.Utils.Array.GetRandom(roasts),
            flavor: initial?.flavor || Phaser.Utils.Array.GetRandom(flavors),
            strength: initial?.strength || Phaser.Math.FloatBetween(0.3, 0.9),
            sweetness: initial?.sweetness || Phaser.Math.FloatBetween(0.2, 0.8),
            acidity: initial?.acidity || Phaser.Math.FloatBetween(0.1, 0.7),
            lastUpdated: Date.now(),
            evolutionRate: initial?.evolutionRate || Phaser.Math.FloatBetween(0.01, 0.05)
        };
    }

    /**
     * Update preferences based on satisfaction with served coffee
     */
    public updatePreferencesFromExperience(
        coffeeServed: { roast: string; flavor: string; quality: number },
        satisfactionScore: number
    ): void {
        // Record this interaction
        this.history.push({
            timestamp: Date.now(),
            satisfactionScore,
            coffeeServed
        });

        // Keep only last 20 interactions for performance
        if (this.history.length > 20) {
            this.history.shift();
        }

        // Update preferences based on satisfaction
        if (satisfactionScore > 70) {
            // High satisfaction - move preferences towards this coffee
            this.evolvePrefencesTowards(coffeeServed, this.preferences.evolutionRate);
        } else if (satisfactionScore < 40) {
            // Low satisfaction - move preferences away from this coffee
            this.evolvePreferencesAway(coffeeServed, this.preferences.evolutionRate);
        }

        this.preferences.lastUpdated = Date.now();
    }

    /**
     * Natural preference drift over time (seasonal changes, mood, etc.)
     */
    public naturalEvolution(): void {
        const daysSinceUpdate = (Date.now() - this.preferences.lastUpdated) / (1000 * 60 * 60 * 24);
        
        if (daysSinceUpdate > 7) { // Weekly natural changes
            const driftAmount = 0.01; // Small natural drift
            
            this.preferences.strength = Phaser.Math.Clamp(
                this.preferences.strength + Phaser.Math.FloatBetween(-driftAmount, driftAmount),
                0.1, 1.0
            );
            
            this.preferences.sweetness = Phaser.Math.Clamp(
                this.preferences.sweetness + Phaser.Math.FloatBetween(-driftAmount, driftAmount),
                0.1, 1.0
            );
            
            this.preferences.acidity = Phaser.Math.Clamp(
                this.preferences.acidity + Phaser.Math.FloatBetween(-driftAmount, driftAmount),
                0.1, 1.0
            );

            // Occasionally change roast preference
            if (Math.random() < 0.1) {
                const roasts = ['light', 'medium', 'dark'];
                const currentIndex = roasts.indexOf(this.preferences.roast);
                const direction = Math.random() < 0.5 ? -1 : 1;
                const newIndex = Phaser.Math.Clamp(currentIndex + direction, 0, roasts.length - 1);
                this.preferences.roast = roasts[newIndex];
            }

            this.preferences.lastUpdated = Date.now();
        }
    }

    private evolvePrefencesTowards(target: { roast: string; flavor: string; quality: number }, rate: number): void {
        // Move towards preferred roast
        const roasts = ['light', 'medium', 'dark'];
        const currentRoastIndex = roasts.indexOf(this.preferences.roast);
        const targetRoastIndex = roasts.indexOf(target.roast);
        
        if (currentRoastIndex !== targetRoastIndex && Math.random() < rate * 2) {
            const direction = targetRoastIndex > currentRoastIndex ? 1 : -1;
            const newIndex = Phaser.Math.Clamp(currentRoastIndex + direction, 0, roasts.length - 1);
            this.preferences.roast = roasts[newIndex];
        }

        // Evolve flavor preference
        if (target.flavor !== this.preferences.flavor && Math.random() < rate) {
            this.preferences.flavor = target.flavor;
        }

        // Adjust numerical preferences based on quality
        const qualityMultiplier = target.quality / 100;
        const adjustment = rate * qualityMultiplier;

        this.preferences.strength = Phaser.Math.Clamp(
            this.preferences.strength + Phaser.Math.FloatBetween(-adjustment, adjustment),
            0.1, 1.0
        );
    }

    private evolvePreferencesAway(avoid: { roast: string; flavor: string; quality: number }, rate: number): void {
        // Move away from disliked roast
        const roasts = ['light', 'medium', 'dark'];
        const currentRoastIndex = roasts.indexOf(this.preferences.roast);
        const avoidRoastIndex = roasts.indexOf(avoid.roast);
        
        if (currentRoastIndex === avoidRoastIndex && Math.random() < rate) {
            const direction = Math.random() < 0.5 ? -1 : 1;
            const newIndex = Phaser.Math.Clamp(currentRoastIndex + direction, 0, roasts.length - 1);
            this.preferences.roast = roasts[newIndex];
        }

        // Change flavor if really disliked
        if (avoid.flavor === this.preferences.flavor && Math.random() < rate * 0.5) {
            const flavors = ['fruity', 'floral', 'spicy', 'bitter', 'sweet', 'chocolatey', 'nutty'];
            const availableFlavors = flavors.filter(f => f !== avoid.flavor);
            this.preferences.flavor = Phaser.Utils.Array.GetRandom(availableFlavors);
        }
    }

    /**
     * Get current preferences
     */
    public getPreferences(): CustomerPreferences {
        this.naturalEvolution(); // Check for natural changes
        return { ...this.preferences };
    }

    /**
     * Get preference history for analysis
     */
    public getHistory(): PreferenceHistory[] {
        return [...this.history];
    }

    /**
     * Calculate satisfaction for a given coffee
     */
    public calculateSatisfaction(coffee: { roast: string; flavor: string; quality: number }): number {
        let satisfaction = 50; // Base satisfaction

        // Roast preference match
        const roasts = ['light', 'medium', 'dark'];
        const preferredRoastIndex = roasts.indexOf(this.preferences.roast);
        const coffeeRoastIndex = roasts.indexOf(coffee.roast);
        const roastDifference = Math.abs(preferredRoastIndex - coffeeRoastIndex);
        satisfaction += (3 - roastDifference) * 10; // 30, 20, 10, 0 points

        // Flavor preference match
        if (coffee.flavor === this.preferences.flavor) {
            satisfaction += 25;
        } else {
            satisfaction -= 10;
        }

        // Quality impact
        satisfaction += (coffee.quality - 50) * 0.5; // Quality contributes up to ±25 points

        return Phaser.Math.Clamp(satisfaction, 0, 100);
    }

    /**
     * Export preferences for saving
     */
    public serialize(): string {
        return JSON.stringify({
            preferences: this.preferences,
            history: this.history
        });
    }

    /**
     * Load preferences from saved data
     */
    public deserialize(data: string): void {
        try {
            const parsed = JSON.parse(data);
            this.preferences = parsed.preferences;
            this.history = parsed.history || [];
        } catch (error) {
            console.warn('Failed to deserialize preferences, using defaults');
        }
    }
}