import { PreferenceEngine } from './PreferenceEngine';
import type { CustomerPreferences } from './PreferenceEngine';
import { PersonalityTraits } from './PersonalityTraits';
import { DialogueSystem } from '../components/DialogueSystem';
import { CoffeeChemistry, type FlavorProfile } from '../utils/CoffeeChemistry';

export interface InteractionHistory {
    timestamp: number;
    playerAction: string; // 'served_coffee', 'ignored', 'chat', 'recommendation'
    playerResponse: string; // what the player did
    customerSatisfaction: number; // 0-100
    gameContext: {
        gameTime: number;
        customerMood: string;
        shopBusyness: number; // 0-1
    };
}

export interface LearningMetrics {
    playerSkillLevel: number; // 0-100 - how good player is at making coffee
    playerSpeed: number; // average time to serve
    playerAttentiveness: number; // how often player responds to cues
    playerMemory: number; // remembers previous customer preferences
    adaptationRate: number; // how fast customer adapts to player
}

export class CustomerAI {
    private preferenceEngine: PreferenceEngine;
    private personalityTraits: PersonalityTraits;
    private dialogueSystem: DialogueSystem;
    
    // Learning system
    private interactionHistory: InteractionHistory[] = [];
    private learningMetrics: LearningMetrics;
    private customerId: string;
    private visitCount: number = 0;
    private loyaltyLevel: number = 50; // 0-100
    
    // Behavioral adaptation
    private patience: number = 50; // 0-100, learned from player speed
    private trustLevel: number = 50; // 0-100, learned from player consistency
    private communicationStyle: 'brief' | 'chatty' | 'adaptive' = 'adaptive';

    constructor(_scene: Phaser.Scene, dialogueSystem: DialogueSystem, customerId?: string) {
        this.customerId = customerId || this.generateCustomerId();
        this.preferenceEngine = new PreferenceEngine();
        this.personalityTraits = new PersonalityTraits();
        this.dialogueSystem = dialogueSystem;
        
        this.learningMetrics = {
            playerSkillLevel: 50,
            playerSpeed: 50,
            playerAttentiveness: 50,
            playerMemory: 50,
            adaptationRate: 0.05 // 5% adaptation per interaction
        };
        
        this.loadLearningData();
    }

    /**
     * Main update loop with learning behavior
     */
    update(gameContext: { gameTime: number; shopBusyness: number }): void {
        this.visitCount++;
        
        // Adapt behavior based on learned player patterns
        this.adaptBehaviorToPlayer();
        
        // Generate dialogue based on learning
        const dialogue = this.generateAdaptiveDialogue(gameContext);
        this.dialogueSystem.showDialogue(dialogue);
        
        // Update patience based on shop busyness and learned player speed
        this.updatePatience(gameContext.shopBusyness);
    }

    /**
     * Learn from player interaction
     */
    public recordInteraction(
        action: string, 
        response: string, 
        satisfaction: number,
        gameContext: { gameTime: number; customerMood: string; shopBusyness: number }
    ): void {
        const interaction: InteractionHistory = {
            timestamp: Date.now(),
            playerAction: action,
            playerResponse: response,
            customerSatisfaction: satisfaction,
            gameContext
        };

        this.interactionHistory.push(interaction);
        
        // Keep only last 50 interactions for performance
        if (this.interactionHistory.length > 50) {
            this.interactionHistory.shift();
        }

        // Update learning metrics
        this.updateLearningMetrics(interaction);
        
        // Update preferences based on satisfaction
        if (action === 'served_coffee') {
            const coffeeData = this.parseCoffeeFromResponse(response);
            this.preferenceEngine.updatePreferencesFromExperience(coffeeData, satisfaction);
        }

        // Update loyalty
        this.updateLoyalty(satisfaction);
        
        // Save learning data
        this.saveLearningData();
    }

    /**
     * Adapt behavior based on learned player patterns
     */
    private adaptBehaviorToPlayer(): void {
        const recentInteractions = this.interactionHistory.slice(-10); // Last 10 interactions
        
        if (recentInteractions.length < 3) return; // Need some data first

        // Adapt patience based on player speed
        const avgPlayerSpeed = this.calculateAveragePlayerSpeed(recentInteractions);
        if (avgPlayerSpeed > this.learningMetrics.playerSpeed) {
            this.patience = Math.max(this.patience - 2, 10); // Become less patient
        } else {
            this.patience = Math.min(this.patience + 1, 100); // Become more patient
        }

        // Adapt trust based on consistency
        const consistencyScore = this.calculatePlayerConsistency(recentInteractions);
        this.trustLevel = Math.max(0, Math.min(100, this.trustLevel + (consistencyScore - 50) * 0.1));

        // Adapt communication style
        if (this.learningMetrics.playerAttentiveness > 70) {
            this.communicationStyle = 'chatty'; // Player pays attention, can be more talkative
        } else if (this.learningMetrics.playerAttentiveness < 30) {
            this.communicationStyle = 'brief'; // Player seems busy, be concise
        } else {
            this.communicationStyle = 'adaptive';
        }
    }

    /**
     * Generate dialogue that adapts to player behavior
     */
    private generateAdaptiveDialogue(gameContext: { gameTime: number; shopBusyness: number }): string {
        const preferences = this.preferenceEngine.getPreferences();
        const traits = this.personalityTraits.getTraits();
        const isReturnCustomer = this.visitCount > 1;
        
        let dialogue = '';

        // Returning customer recognition (if player has good memory)
        if (isReturnCustomer && this.learningMetrics.playerMemory > 60) {
            dialogue += this.generateRecognitionDialogue();
        }

        // Main order based on communication style
        const baseOrder = `${preferences.roast} roast with ${preferences.flavor} flavor`;
        
        switch (this.communicationStyle) {
            case 'brief':
                dialogue += isReturnCustomer ? `The usual. ${baseOrder}.` : `${baseOrder}.`;
                break;
                
            case 'chatty':
                if (traits.includes('friendly')) {
                    dialogue += `Hi there! ${isReturnCustomer ? "Great to see you again! " : ""}I'm in the mood for something special today. How about a ${baseOrder}? I trust your expertise!`;
                } else {
                    dialogue += `I'd like a ${baseOrder}. ${this.generateSmallTalk()}`;
                }
                break;
                
            case 'adaptive':
            default:
                if (this.trustLevel > 70) {
                    dialogue += `I'll have my ${baseOrder}, and surprise me with something you think I'd like!`;
                } else {
                    dialogue += `I'd like a ${baseOrder}, exactly as I ordered.`;
                }
                break;
        }

        // Add patience indicators if player is slow
        if (this.learningMetrics.playerSpeed < 30 && gameContext.shopBusyness > 0.7) {
            dialogue += ` And I'm in a bit of a hurry today!`;
        }

        return dialogue;
    }

    private generateRecognitionDialogue(): string {
        const recognitionPhrases = [
            "Oh, it's you again! ",
            "Nice to see a familiar face! ",
            "You remember my order, right? ",
            "Back for more of your excellent coffee! "
        ];
        
        if (this.loyaltyLevel > 70) {
            return Phaser.Utils.Array.GetRandom(recognitionPhrases);
        }
        
        return "";
    }

    private generateSmallTalk(): string {
        const smallTalk = [
            "Busy day today?",
            "Weather's been nice lately.",
            "How's business?",
            "This place always smells amazing.",
            "You're getting good at this!"
        ];
        
        return Phaser.Utils.Array.GetRandom(smallTalk);
    }

    /**
     * Update learning metrics based on interaction
     */
    private updateLearningMetrics(interaction: InteractionHistory): void {
        const rate = this.learningMetrics.adaptationRate;
        
        // Update skill assessment based on satisfaction
        const skillDelta = (interaction.customerSatisfaction - 50) * rate;
        this.learningMetrics.playerSkillLevel = Phaser.Math.Clamp(
            this.learningMetrics.playerSkillLevel + skillDelta, 0, 100
        );

        // Update attentiveness (did player respond appropriately?)
        if (interaction.playerAction !== 'ignored') {
            this.learningMetrics.playerAttentiveness = Math.min(100, 
                this.learningMetrics.playerAttentiveness + rate * 10
            );
        } else {
            this.learningMetrics.playerAttentiveness = Math.max(0,
                this.learningMetrics.playerAttentiveness - rate * 20
            );
        }

        // Update memory (does player remember preferences?)
        if (this.visitCount > 1 && interaction.customerSatisfaction > 70) {
            this.learningMetrics.playerMemory = Math.min(100,
                this.learningMetrics.playerMemory + rate * 5
            );
        }
    }

    private calculateAveragePlayerSpeed(interactions: InteractionHistory[]): number {
        // This would typically measure time between order and delivery
        // For now, return a mock value based on satisfaction correlation
        const avgSatisfaction = interactions.reduce((sum, i) => sum + i.customerSatisfaction, 0) / interactions.length;
        return avgSatisfaction; // Higher satisfaction often correlates with appropriate speed
    }

    private calculatePlayerConsistency(interactions: InteractionHistory[]): number {
        // Measure how consistent player satisfaction scores are
        if (interactions.length < 2) return 50;
        
        const satisfactionScores = interactions.map(i => i.customerSatisfaction);
        const avg = satisfactionScores.reduce((sum, score) => sum + score, 0) / satisfactionScores.length;
        const variance = satisfactionScores.reduce((sum, score) => sum + Math.pow(score - avg, 2), 0) / satisfactionScores.length;
        
        // Lower variance = higher consistency
        return Math.max(0, 100 - variance);
    }

    private updatePatience(shopBusyness: number): void {
        // More patient when shop is busy, less when it's quiet
        const businessFactor = (1 - shopBusyness) * 10; // 0-10 patience reduction when not busy
        this.patience = Math.max(10, this.patience - businessFactor * 0.1);
    }

    private updateLoyalty(satisfaction: number): void {
        const loyaltyChange = (satisfaction - 50) * 0.2; // ±10 loyalty per extreme satisfaction
        this.loyaltyLevel = Phaser.Math.Clamp(this.loyaltyLevel + loyaltyChange, 0, 100);
    }

    private parseCoffeeFromResponse(_response: string): { roast: string; flavor: string; quality: number } {
        // Mock parsing - in real game this would parse actual coffee data
        return {
            roast: 'medium', // would extract from response
            flavor: 'balanced', // would extract from response
            quality: 75 // would calculate from roasting data
        };
    }

    private generateCustomerId(): string {
        return 'customer_' + Math.random().toString(36).substr(2, 9);
    }

    /**
     * Save learning data to persistent storage
     */
    private saveLearningData(): void {
        const data = {
            customerId: this.customerId,
            learningMetrics: this.learningMetrics,
            interactionHistory: this.interactionHistory.slice(-20), // Save last 20 interactions
            visitCount: this.visitCount,
            loyaltyLevel: this.loyaltyLevel,
            patience: this.patience,
            trustLevel: this.trustLevel,
            communicationStyle: this.communicationStyle,
            preferences: this.preferenceEngine.serialize()
        };

        localStorage.setItem(`customer_ai_${this.customerId}`, JSON.stringify(data));
    }

    /**
     * Load learning data from persistent storage
     */
    private loadLearningData(): void {
        try {
            const saved = localStorage.getItem(`customer_ai_${this.customerId}`);
            if (saved) {
                const data = JSON.parse(saved);
                this.learningMetrics = data.learningMetrics || this.learningMetrics;
                this.interactionHistory = data.interactionHistory || [];
                this.visitCount = data.visitCount || 0;
                this.loyaltyLevel = data.loyaltyLevel || 50;
                this.patience = data.patience || 50;
                this.trustLevel = data.trustLevel || 50;
                this.communicationStyle = data.communicationStyle || 'adaptive';
                
                if (data.preferences) {
                    this.preferenceEngine.deserialize(data.preferences);
                }
            }
        } catch (error) {
            console.warn('Failed to load customer AI data:', error);
        }
    }

    /**
     * Evaluate served coffee using sophisticated chemistry analysis
     */
    public evaluateCoffeeChemistry(
        temperature: number,
        roastTime: number,
        beanType: string = 'arabica'
    ): {
        satisfaction: number;
        feedback: string;
        chemicalAnalysis: string;
    } {
        const flavorProfile = CoffeeChemistry.calculateFlavorProfile(temperature, roastTime, beanType);
        const scaScore = CoffeeChemistry.calculateSCAScore(flavorProfile);
        const analysis = CoffeeChemistry.getEducationalAnalysis(flavorProfile, temperature, roastTime);
        
        // Get customer preferences for comparison
        const preferences = this.preferenceEngine.getPreferences();
        
        // Calculate satisfaction based on how well the coffee matches preferences
        const satisfaction = this.calculateChemistrySatisfaction(flavorProfile, preferences, scaScore);
        
        // Generate chemistry-informed feedback
        const feedback = this.generateChemistryFeedback(flavorProfile, preferences, satisfaction);
        
        return {
            satisfaction,
            feedback,
            chemicalAnalysis: analysis
        };
    }

    /**
     * Calculate satisfaction based on chemistry and preferences
     */
    private calculateChemistrySatisfaction(
        profile: FlavorProfile,
        preferences: CustomerPreferences,
        scaScore: number
    ): number {
        let satisfaction = 0;
        
        // Base satisfaction from SCA score (professional quality assessment)
        satisfaction += (scaScore / 100) * 40; // 40% weight for overall quality
        
        // Preference matching (40% weight)
        const preferenceMatch = (
            this.calculateAttributeMatch(profile.acidity, preferences.acidity * 10) +
            this.calculateAttributeMatch(profile.sweetness, preferences.sweetness * 10) +
            this.calculateAttributeMatch(profile.body, 5) + // Default body preference
            this.calculateAttributeMatch(profile.bitterness, 5) // Default bitterness preference
        ) / 4;
        satisfaction += preferenceMatch * 40;
        
        // Personality-based modifiers (20% weight)
        const personalityTraits = this.personalityTraits.getCurrentTraits();
        
        // Get trait intensity helper function
        const getTraitIntensity = (traitName: string): number => {
            const trait = personalityTraits.find(t => t.name === traitName);
            return trait ? trait.intensity : 0;
        };
        
        // Adventurous customers appreciate complexity
        if (getTraitIntensity('adventurous') > 0.7 && profile.complexity > 7) {
            satisfaction += 10;
        }
        
        // Picky customers want high balance
        if (getTraitIntensity('picky') > 0.7 && profile.balance < 6) {
            satisfaction -= 15;
        }
        
        // Patient customers appreciate subtle flavors
        if (getTraitIntensity('patient') > 0.7 && profile.balance > 7) {
            satisfaction += 5;
        }
        
        return Math.max(0, Math.min(100, satisfaction));
    }

    /**
     * Calculate how well a flavor attribute matches preferences
     */
    private calculateAttributeMatch(actualValue: number, preferredValue: number): number {
        const difference = Math.abs(actualValue - preferredValue);
        // Perfect match = 100, difference of 5 = 50, difference of 10 = 0
        return Math.max(0, 100 - (difference * 10));
    }

    /**
     * Generate chemistry-informed feedback
     */
    private generateChemistryFeedback(
        profile: FlavorProfile,
        preferences: CustomerPreferences,
        satisfaction: number
    ): string {
        const personalityTraits = this.personalityTraits.getCurrentTraits();
        const getTraitIntensity = (traitName: string): number => {
            const trait = personalityTraits.find(t => t.name === traitName);
            return trait ? trait.intensity : 0;
        };
        
        let feedback = "";
        
        if (satisfaction > 80) {
            feedback = this.generatePositiveChemistryFeedback(profile, getTraitIntensity);
        } else if (satisfaction > 60) {
            feedback = this.generateNeutralChemistryFeedback(profile, preferences);
        } else {
            feedback = this.generateCriticalChemistryFeedback(profile, preferences, getTraitIntensity);
        }
        
        // Add personality-specific chemistry comments
        if (getTraitIntensity('knowledgeable') > 0.7) {
            feedback += this.addTechnicalChemistryComment(profile);
        }
        
        return feedback;
    }

    private generatePositiveChemistryFeedback(
        profile: FlavorProfile,
        getTraitIntensity: (name: string) => number
    ): string {
        const compliments = [];
        
        if (profile.balance > 8) {
            compliments.push("Perfect balance of flavors!");
        }
        if (profile.complexity > 7) {
            compliments.push("Such complex flavor notes!");
        }
        if (profile.acidity > 7 && profile.sweetness > 6) {
            compliments.push("Beautiful bright acidity with sweet undertones!");
        }
        if (profile.aroma > 8) {
            compliments.push("The aroma is absolutely divine!");
        }
        
        let feedback = compliments.length > 0 
            ? Phaser.Utils.Array.GetRandom(compliments)
            : "This coffee is excellent!";
            
        if (getTraitIntensity('expressive') > 0.7) {
            feedback += " You really know your craft!";
        }
        
        return feedback;
    }

    private generateNeutralChemistryFeedback(
        profile: FlavorProfile,
        preferences: CustomerPreferences
    ): string {
        const comments = [];
        
        // Identify what's close to preferences (using scaled values)
        if (Math.abs(profile.acidity - (preferences.acidity * 10)) < 2) {
            comments.push("The acidity level is just right");
        }
        if (Math.abs(profile.sweetness - (preferences.sweetness * 10)) < 2) {
            comments.push("Nice sweetness");
        }
        // Default body comparison since preferences don't have body
        if (profile.body > 6 && profile.body < 8) {
            comments.push("Good body");
        }
        
        return comments.length > 0
            ? comments.join(", ") + ". "
            : "This is decent coffee. ";
    }

    private generateCriticalChemistryFeedback(
        profile: FlavorProfile,
        preferences: CustomerPreferences,
        getTraitIntensity: (name: string) => number
    ): string {
        const issues = [];
        
        if (profile.balance < 4) {
            issues.push("flavors seem unbalanced");
        }
        // Use default values since preferences don't have bitterness
        if (profile.bitterness > 8) {
            issues.push("too bitter for my taste");
        }
        if (profile.acidity > (preferences.acidity * 10) + 3) {
            issues.push("too acidic");
        }
        if (profile.acidity < (preferences.acidity * 10) - 3) {
            issues.push("lacks acidity");
        }
        if (profile.sweetness < (preferences.sweetness * 10) - 2) {
            issues.push("could use more sweetness");
        }
        
        let feedback = issues.length > 0
            ? "This coffee is " + issues.join(" and ") + "."
            : "This coffee doesn't quite hit the mark.";
            
        if (getTraitIntensity('picky') > 0.7) {
            feedback += " I'm quite particular about my coffee.";
        }
        
        return feedback;
    }

    private addTechnicalChemistryComment(profile: FlavorProfile): string {
        const technical = [];
        
        if (profile.complexity > 7) {
            technical.push(" I can taste the Maillard reaction compounds.");
        }
        if (profile.acidity > 7) {
            technical.push(" Good chlorogenic acid retention.");
        }
        if (profile.sweetness > 7) {
            technical.push(" Nice caramelization development.");
        }
        if (profile.balance > 8) {
            technical.push(" The chemistry is spot-on.");
        }
        
        return technical.length > 0 ? Phaser.Utils.Array.GetRandom(technical) : "";
    }

    /**
     * Learn from chemistry-based coffee experiences
     */
    public learnFromChemicalExperience(
        flavorProfile: FlavorProfile,
        satisfaction: number,
        roastingData: { temperature: number; time: number; beanType: string }
    ): void {
        // Update preferences using existing method
        const coffeeData = {
            roast: roastingData.temperature > 210 ? 'dark' : roastingData.temperature > 180 ? 'medium' : 'light',
            flavor: 'complex', // Based on chemistry
            quality: satisfaction / 10
        };
        this.preferenceEngine.updatePreferencesFromExperience(coffeeData, satisfaction);
        
        // Adaptive personality changes based on chemistry appreciation
        const adaptationTriggers = [];
        
        if (flavorProfile.complexity > 7 && satisfaction > 80) {
            adaptationTriggers.push({
                trait: 'adventurous' as const,
                change: 0.1,
                reason: 'Appreciated complex flavor chemistry'
            });
        }
        
        if (flavorProfile.balance > 8 && satisfaction > 80) {
            adaptationTriggers.push({
                trait: 'knowledgeable' as const,
                change: 0.05,
                reason: 'Recognized excellent balance'
            });
        }
        
        if (satisfaction < 40) {
            adaptationTriggers.push({
                trait: 'picky' as const,
                change: 0.05,
                reason: 'Dissatisfied with coffee quality'
            });
        }
        
        // Record detailed interaction for learning
        this.recordInteraction('served_chemical_coffee', 
            `${roastingData.beanType} roasted at ${roastingData.temperature}°C for ${roastingData.time}s`, 
            satisfaction,
            {
                gameTime: Date.now() - this.visitCount * 60000, // Estimated game time
                customerMood: satisfaction > 70 ? 'pleased' : satisfaction > 40 ? 'neutral' : 'disappointed',
                shopBusyness: 0.5 // Default value
            }
        );
    }

    /**
     * Get chemistry-informed preferences for roasting guidance
     */
    public getChemistryGuidance(): {
        preferredProfile: FlavorProfile;
        roastingTips: string[];
        personalityInsights: string[];
    } {
        const preferences = this.preferenceEngine.getPreferences();
        const traits = this.personalityTraits.getCurrentTraits();
        const getTraitIntensity = (traitName: string): number => {
            const trait = traits.find(t => t.name === traitName);
            return trait ? trait.intensity : 0;
        };
        
        const preferredProfile: FlavorProfile = {
            acidity: preferences.acidity * 10, // Scale to 0-10
            sweetness: preferences.sweetness * 10, // Scale to 0-10
            body: 6, // Default medium body
            bitterness: 5, // Default moderate bitterness
            aroma: 7, // Most customers appreciate good aroma
            aftertaste: 6,
            balance: 7,
            complexity: getTraitIntensity('adventurous') > 0.5 ? 8 : 6
        };
        
        const roastingTips = this.generateRoastingTips(preferredProfile, getTraitIntensity);
        const personalityInsights = this.generatePersonalityInsights(getTraitIntensity);
        
        return {
            preferredProfile,
            roastingTips,
            personalityInsights
        };
    }

    private generateRoastingTips(profile: FlavorProfile, getTraitIntensity: (name: string) => number): string[] {
        const tips = [];
        
        if (profile.acidity > 7) {
            tips.push("Keep roast temperature below 200°C to preserve acidity");
        }
        if (profile.sweetness > 7) {
            tips.push("Allow adequate Maillard phase development (150-180°C)");
        }
        if (profile.body > 7) {
            tips.push("Extend development phase for fuller body");
        }
        if (getTraitIntensity('adventurous') > 0.7) {
            tips.push("Customer appreciates complex roast profiles");
        }
        if (getTraitIntensity('picky') > 0.7) {
            tips.push("Ensure excellent balance - customer is very discerning");
        }
        
        return tips;
    }

    private generatePersonalityInsights(getTraitIntensity: (name: string) => number): string[] {
        const insights = [];
        
        if (getTraitIntensity('knowledgeable') > 0.7) {
            insights.push("Customer has technical knowledge of coffee chemistry");
        }
        if (getTraitIntensity('adventurous') > 0.7) {
            insights.push("Open to trying unique and complex flavor profiles");
        }
        if (getTraitIntensity('picky') > 0.7) {
            insights.push("Has very specific quality standards");
        }
        if (getTraitIntensity('patient') > 0.7) {
            insights.push("Appreciates careful, methodical roasting");
        }
        if (getTraitIntensity('expressive') > 0.7) {
            insights.push("Will provide detailed feedback on coffee quality");
        }
        
        return insights;
    }

    /**
     * Get customer analytics for debugging/balancing
     */
    public getAnalytics(): {
        customerId: string;
        visitCount: number;
        loyaltyLevel: number;
        learningMetrics: LearningMetrics;
        preferences: CustomerPreferences;
    } {
        return {
            customerId: this.customerId,
            visitCount: this.visitCount,
            loyaltyLevel: this.loyaltyLevel,
            learningMetrics: { ...this.learningMetrics },
            preferences: this.preferenceEngine.getPreferences()
        };
    }

    /**
     * Reset learning data (for testing or new game+)
     */
    public resetLearning(): void {
        this.interactionHistory = [];
        this.visitCount = 0;
        this.loyaltyLevel = 50;
        this.patience = 50;
        this.trustLevel = 50;
        this.communicationStyle = 'adaptive';
        this.learningMetrics = {
            playerSkillLevel: 50,
            playerSpeed: 50,
            playerAttentiveness: 50,
            playerMemory: 50,
            adaptationRate: 0.05
        };
        localStorage.removeItem(`customer_ai_${this.customerId}`);
    }
}