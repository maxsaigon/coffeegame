/**
 * Customer Learning Integration
 * Connects the learning AI system with the game
 */

import { CustomerAI } from '../ai/CustomerAI';
import { DialogueSystem } from './DialogueSystem';

export interface GameInteractionEvent {
    type: 'coffee_served' | 'order_taken' | 'customer_ignored' | 'recommendation_given';
    customerID: string;
    data: {
        coffeeQuality?: number;
        responseTime?: number;
        customerSatisfaction?: number;
        coffeeDetails?: {
            roast: string;
            flavor: string;
            temperature: number;
            quality: number;
        };
    };
    gameContext: {
        gameTime: number;
        shopBusyness: number;
        playerLevel: number;
    };
}

export class CustomerLearningManager {
    private activeCustomers: Map<string, CustomerAI> = new Map();
    private dialogueSystem: DialogueSystem;
    private scene: Phaser.Scene;
    
    // Global learning metrics
    private globalPlayerMetrics = {
        totalCustomersServed: 0,
        averageSatisfaction: 50,
        averageServiceTime: 60, // seconds
        specialtyRecognition: 0, // how often player remembers repeat customers
    };

    constructor(scene: Phaser.Scene) {
        this.scene = scene;
        this.dialogueSystem = new DialogueSystem(scene, 400, 100, 300, 100);
        this.loadGlobalMetrics();
    }

    /**
     * Create or retrieve a customer AI instance
     */
    public getCustomerAI(customerID: string, isNewCustomer: boolean = false): CustomerAI {
        if (!this.activeCustomers.has(customerID) || isNewCustomer) {
            const customerAI = new CustomerAI(this.scene, this.dialogueSystem, customerID);
            this.activeCustomers.set(customerID, customerAI);
        }
        
        return this.activeCustomers.get(customerID)!;
    }

    /**
     * Process a game interaction and update AI learning
     */
    public processInteraction(event: GameInteractionEvent): void {
        const customerAI = this.getCustomerAI(event.customerID);
        
        // Calculate satisfaction based on event
        const satisfaction = this.calculateSatisfaction(event);
        
        // Record the interaction for AI learning
        customerAI.recordInteraction(
            event.type,
            this.serializeEventData(event.data),
            satisfaction,
            {
                gameTime: event.gameContext.gameTime,
                customerMood: this.inferCustomerMood(satisfaction),
                shopBusyness: event.gameContext.shopBusyness
            }
        );

        // Update global metrics
        this.updateGlobalMetrics(event, satisfaction);
        
        console.log(`Customer ${event.customerID} interaction recorded:`, {
            type: event.type,
            satisfaction: satisfaction,
            loyaltyLevel: customerAI.getAnalytics().loyaltyLevel
        });
    }

    /**
     * Calculate customer satisfaction from game event
     */
    private calculateSatisfaction(event: GameInteractionEvent): number {
        let satisfaction = 50; // Base satisfaction
        
        switch (event.type) {
            case 'coffee_served':
                // Quality is the primary factor
                if (event.data.coffeeQuality) {
                    satisfaction = event.data.coffeeQuality;
                }
                
                // Speed bonus/penalty
                if (event.data.responseTime) {
                    if (event.data.responseTime < 30) {
                        satisfaction += 10; // Quick service bonus
                    } else if (event.data.responseTime > 120) {
                        satisfaction -= 20; // Slow service penalty
                    }
                }
                
                // Shop busyness context
                if (event.gameContext.shopBusyness > 0.8 && event.data.responseTime && event.data.responseTime < 60) {
                    satisfaction += 15; // Impressive service during rush
                }
                break;
                
            case 'order_taken':
                satisfaction = 60; // Neutral positive for taking order
                if (event.data.responseTime && event.data.responseTime < 10) {
                    satisfaction += 10; // Quick acknowledgment
                }
                break;
                
            case 'customer_ignored':
                satisfaction = 20; // Very negative
                if (event.gameContext.shopBusyness > 0.7) {
                    satisfaction = 30; // Slightly less negative if busy
                }
                break;
                
            case 'recommendation_given':
                satisfaction = 70; // Positive for engagement
                // Bonus if recommendation matches preferences
                // (would need preference matching logic)
                break;
        }
        
        return Phaser.Math.Clamp(satisfaction, 0, 100);
    }

    private inferCustomerMood(satisfaction: number): string {
        if (satisfaction > 80) return 'delighted';
        if (satisfaction > 60) return 'happy';
        if (satisfaction > 40) return 'neutral';
        if (satisfaction > 20) return 'disappointed';
        return 'angry';
    }

    private serializeEventData(data: GameInteractionEvent['data']): string {
        return JSON.stringify(data);
    }

    private updateGlobalMetrics(event: GameInteractionEvent, satisfaction: number): void {
        // Update running averages
        this.globalPlayerMetrics.totalCustomersServed++;
        
        const weight = 1 / this.globalPlayerMetrics.totalCustomersServed;
        this.globalPlayerMetrics.averageSatisfaction = 
            this.globalPlayerMetrics.averageSatisfaction * (1 - weight) + satisfaction * weight;
            
        if (event.data.responseTime) {
            this.globalPlayerMetrics.averageServiceTime = 
                this.globalPlayerMetrics.averageServiceTime * (1 - weight) + event.data.responseTime * weight;
        }

        // Check for specialty recognition (return customers getting good service)
        const customerAI = this.activeCustomers.get(event.customerID);
        if (customerAI && customerAI.getAnalytics().visitCount > 1 && satisfaction > 70) {
            this.globalPlayerMetrics.specialtyRecognition += 0.1;
        }

        this.saveGlobalMetrics();
    }

    /**
     * Get analytics for all customers
     */
    public getAllCustomerAnalytics(): Array<{
        customerId: string;
        visitCount: number;
        loyaltyLevel: number;
        preferences: any;
        learningMetrics: any;
    }> {
        const analytics: any[] = [];
        
        this.activeCustomers.forEach((customerAI, id) => {
            const customerAnalytics = customerAI.getAnalytics();
            analytics.push({
                customerId: id,
                visitCount: customerAnalytics.visitCount,
                loyaltyLevel: customerAnalytics.loyaltyLevel,
                preferences: customerAnalytics.preferences,
                learningMetrics: customerAnalytics.learningMetrics
            });
        });
        
        return analytics;
    }

    /**
     * Get global player performance metrics
     */
    public getGlobalMetrics(): typeof this.globalPlayerMetrics {
        return { ...this.globalPlayerMetrics };
    }

    /**
     * Generate insights for player feedback
     */
    public generatePlayerInsights(): {
        strengths: string[];
        improvements: string[];
        loyalCustomers: string[];
        recommendations: string[];
    } {
        const insights = {
            strengths: [] as string[],
            improvements: [] as string[],
            loyalCustomers: [] as string[],
            recommendations: [] as string[]
        };

        // Analyze performance
        if (this.globalPlayerMetrics.averageSatisfaction > 75) {
            insights.strengths.push("Excellent customer satisfaction!");
        }
        
        if (this.globalPlayerMetrics.averageServiceTime < 45) {
            insights.strengths.push("Quick and efficient service");
        }
        
        if (this.globalPlayerMetrics.specialtyRecognition > 5) {
            insights.strengths.push("Great at remembering regular customers");
        }

        // Suggest improvements
        if (this.globalPlayerMetrics.averageSatisfaction < 50) {
            insights.improvements.push("Focus on coffee quality and consistency");
        }
        
        if (this.globalPlayerMetrics.averageServiceTime > 90) {
            insights.improvements.push("Try to serve customers more quickly");
        }

        // Find loyal customers
        this.activeCustomers.forEach((customerAI, id) => {
            const analytics = customerAI.getAnalytics();
            if (analytics.loyaltyLevel > 80 && analytics.visitCount > 3) {
                insights.loyalCustomers.push(id);
            }
        });

        // Generate recommendations
        if (insights.loyalCustomers.length > 0) {
            insights.recommendations.push("You have loyal customers! Consider special offers for regulars.");
        }
        
        if (this.globalPlayerMetrics.averageSatisfaction > 70 && this.globalPlayerMetrics.totalCustomersServed > 20) {
            insights.recommendations.push("You're ready for more challenging customers and complex orders!");
        }

        return insights;
    }

    private saveGlobalMetrics(): void {
        localStorage.setItem('coffee_game_global_metrics', JSON.stringify(this.globalPlayerMetrics));
    }

    private loadGlobalMetrics(): void {
        try {
            const saved = localStorage.getItem('coffee_game_global_metrics');
            if (saved) {
                this.globalPlayerMetrics = { ...this.globalPlayerMetrics, ...JSON.parse(saved) };
            }
        } catch (error) {
            console.warn('Failed to load global metrics:', error);
        }
    }

    /**
     * Reset all learning data (for new game or testing)
     */
    public resetAllLearning(): void {
        this.activeCustomers.forEach(customerAI => customerAI.resetLearning());
        this.activeCustomers.clear();
        this.globalPlayerMetrics = {
            totalCustomersServed: 0,
            averageSatisfaction: 50,
            averageServiceTime: 60,
            specialtyRecognition: 0,
        };
        localStorage.removeItem('coffee_game_global_metrics');
    }

    /**
     * Cleanup when scene is destroyed
     */
    public destroy(): void {
        this.activeCustomers.clear();
        this.saveGlobalMetrics();
    }
}
