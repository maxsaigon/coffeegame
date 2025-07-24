// Types for sophisticated coffee chemistry simulation
export interface ChemicalCompound {
    name: string;
    concentration: number; // mg/kg
    temperature_threshold: number; // °C
    formation_rate: number; // rate of formation per second
    degradation_rate: number; // rate of degradation per second
    flavor_impact: FlavorImpact;
    health_effects?: string[];
}

export interface FlavorImpact {
    acidity: number; // -1 to 1
    sweetness: number; // -1 to 1
    body: number; // -1 to 1
    bitterness: number; // -1 to 1
    aroma_intensity: number; // 0 to 1
    aftertaste_duration: number; // seconds
}

export interface FlavorProfile {
    acidity: number; // 0-10 scale
    sweetness: number; // 0-10 scale
    body: number; // 0-10 scale
    bitterness: number; // 0-10 scale
    aroma: number; // 0-10 scale
    aftertaste: number; // 0-10 scale
    balance: number; // 0-10 scale (calculated)
    complexity: number; // 0-10 scale (calculated)
}

export interface RoastingPhase {
    name: string;
    temperature_range: [number, number]; // [min, max] in °C
    duration_range: [number, number]; // [min, max] in seconds
    dominant_reactions: string[];
    key_compounds_formed: string[];
}

export interface QualityMetrics {
    sca_score: number; // 0-100 SCA cupping score
    defects: string[];
    uniformity: number; // 0-1
    moisture_content: number; // percentage
    density: number; // g/cm³
    color_value: number; // Agtron scale
}

export class CoffeeChemistry {
    private static readonly COMPOUNDS: Record<string, ChemicalCompound> = {
        chlorogenic_acid: {
            name: "Chlorogenic Acid",
            concentration: 0,
            temperature_threshold: 140,
            formation_rate: 0.5,
            degradation_rate: 0.8,
            flavor_impact: {
                acidity: 0.8,
                sweetness: -0.2,
                body: 0.3,
                bitterness: 0.4,
                aroma_intensity: 0.2,
                aftertaste_duration: 15
            },
            health_effects: ["antioxidant", "metabolism_boost"]
        },
        quinides: {
            name: "Quinides",
            concentration: 0,
            temperature_threshold: 180,
            formation_rate: 1.2,
            degradation_rate: 0.3,
            flavor_impact: {
                acidity: -0.4,
                sweetness: -0.1,
                body: 0.6,
                bitterness: 0.7,
                aroma_intensity: 0.4,
                aftertaste_duration: 25
            }
        },
        maillard_products: {
            name: "Maillard Reaction Products",
            concentration: 0,
            temperature_threshold: 150,
            formation_rate: 0.8,
            degradation_rate: 0.2,
            flavor_impact: {
                acidity: -0.2,
                sweetness: 0.6,
                body: 0.8,
                bitterness: 0.1,
                aroma_intensity: 0.9,
                aftertaste_duration: 20
            }
        },
        caramelization_products: {
            name: "Caramelization Products",
            concentration: 0,
            temperature_threshold: 170,
            formation_rate: 0.6,
            degradation_rate: 0.4,
            flavor_impact: {
                acidity: -0.3,
                sweetness: 0.9,
                body: 0.4,
                bitterness: -0.2,
                aroma_intensity: 0.7,
                aftertaste_duration: 18
            }
        },
        pyrazines: {
            name: "Pyrazines",
            concentration: 0,
            temperature_threshold: 200,
            formation_rate: 1.0,
            degradation_rate: 0.5,
            flavor_impact: {
                acidity: -0.1,
                sweetness: 0.2,
                body: 0.3,
                bitterness: 0.2,
                aroma_intensity: 0.8,
                aftertaste_duration: 12
            }
        },
        furans: {
            name: "Furans",
            concentration: 0,
            temperature_threshold: 160,
            formation_rate: 0.7,
            degradation_rate: 0.6,
            flavor_impact: {
                acidity: 0.1,
                sweetness: 0.4,
                body: 0.2,
                bitterness: 0.1,
                aroma_intensity: 0.6,
                aftertaste_duration: 10
            }
        },
        caffeine: {
            name: "Caffeine",
            concentration: 12000, // Initial concentration in green beans
            temperature_threshold: 240,
            formation_rate: 0,
            degradation_rate: 0.1,
            flavor_impact: {
                acidity: 0.1,
                sweetness: -0.1,
                body: 0.2,
                bitterness: 0.8,
                aroma_intensity: 0.1,
                aftertaste_duration: 30
            },
            health_effects: ["stimulant", "alertness"]
        }
    };

    private static readonly ROASTING_PHASES: RoastingPhase[] = [
        {
            name: "Drying Phase",
            temperature_range: [80, 160],
            duration_range: [240, 480],
            dominant_reactions: ["moisture_evaporation", "protein_denaturation"],
            key_compounds_formed: ["aldehydes", "organic_acids"]
        },
        {
            name: "Maillard Phase",
            temperature_range: [140, 200],
            duration_range: [180, 360],
            dominant_reactions: ["maillard_reaction", "strecker_degradation"],
            key_compounds_formed: ["maillard_products", "pyrazines", "furans"]
        },
        {
            name: "Development Phase",
            temperature_range: [180, 230],
            duration_range: [60, 180],
            dominant_reactions: ["caramelization", "pyrolysis"],
            key_compounds_formed: ["caramelization_products", "quinides"]
        }
    ];

    /**
     * Calculate sophisticated flavor profile based on realistic chemistry
     */
    static calculateFlavorProfile(
        temperature: number,
        time: number,
        beanType: string = "arabica",
        initialMoisture: number = 12
    ): FlavorProfile {
        const compounds = this.simulateChemicalReactions(temperature, time, initialMoisture);
        const profile = this.compoundsToFlavorProfile(compounds);
        
        // Apply bean type modifications
        this.applyBeanTypeModifications(profile, beanType);
        
        // Calculate derived metrics
        profile.balance = this.calculateBalance(profile);
        profile.complexity = this.calculateComplexity(compounds);
        
        return profile;
    }

    /**
     * Simulate chemical reactions during roasting
     */
    private static simulateChemicalReactions(
        temperature: number,
        time: number,
        moisture: number
    ): Record<string, ChemicalCompound> {
        const compounds = JSON.parse(JSON.stringify(this.COMPOUNDS));
        
        // Simulate time-based reactions
        const timeSteps = Math.floor(time / 10); // 10-second intervals
        
        for (let step = 0; step < timeSteps; step++) {
            const currentTemp = temperature; // Simplified - could implement temperature ramp
            
            Object.keys(compounds).forEach(key => {
                const compound = compounds[key];
                
                if (currentTemp >= compound.temperature_threshold) {
                    // Formation reaction
                    const moistureEffect = key === 'maillard_products' ? (1 - moisture / 100) : 1;
                    const formation = compound.formation_rate * 10 * moistureEffect;
                    compound.concentration += formation;
                    
                    // Temperature acceleration
                    const tempEffect = Math.min(2.0, currentTemp / compound.temperature_threshold);
                    compound.concentration *= tempEffect;
                }
                
                // Degradation (some compounds break down at high temps)
                if (currentTemp > compound.temperature_threshold + 50) {
                    const degradation = compound.degradation_rate * 10;
                    compound.concentration = Math.max(0, compound.concentration - degradation);
                }
            });
        }
        
        return compounds;
    }

    /**
     * Convert chemical compounds to sensory flavor profile
     */
    private static compoundsToFlavorProfile(
        compounds: Record<string, ChemicalCompound>
    ): FlavorProfile {
        let acidity = 5, sweetness = 5, body = 5, bitterness = 5;
        let aroma = 5, aftertaste = 5;
        
        Object.values(compounds).forEach(compound => {
            const intensity = Math.min(1, compound.concentration / 1000);
            
            acidity += compound.flavor_impact.acidity * intensity * 2;
            sweetness += compound.flavor_impact.sweetness * intensity * 2;
            body += compound.flavor_impact.body * intensity * 2;
            bitterness += compound.flavor_impact.bitterness * intensity * 2;
            aroma += compound.flavor_impact.aroma_intensity * intensity * 2;
            aftertaste += (compound.flavor_impact.aftertaste_duration / 30) * intensity;
        });
        
        return {
            acidity: Math.max(0, Math.min(10, acidity)),
            sweetness: Math.max(0, Math.min(10, sweetness)),
            body: Math.max(0, Math.min(10, body)),
            bitterness: Math.max(0, Math.min(10, bitterness)),
            aroma: Math.max(0, Math.min(10, aroma)),
            aftertaste: Math.max(0, Math.min(10, aftertaste)),
            balance: 0, // Calculated later
            complexity: 0 // Calculated later
        };
    }

    /**
     * Apply bean-specific modifications to flavor profile
     */
    private static applyBeanTypeModifications(profile: FlavorProfile, beanType: string): void {
        switch (beanType.toLowerCase()) {
            case 'arabica':
                profile.acidity *= 1.2;
                profile.sweetness *= 1.1;
                profile.bitterness *= 0.9;
                break;
            case 'robusta':
                profile.bitterness *= 1.4;
                profile.body *= 1.2;
                profile.acidity *= 0.8;
                break;
            case 'liberica':
                profile.body *= 1.3;
                profile.aroma *= 1.2;
                profile.sweetness *= 0.9;
                break;
            case 'excelsa':
                profile.acidity *= 1.1;
                profile.aroma *= 1.3;
                profile.aftertaste *= 1.2;
                break;
        }
    }

    /**
     * Calculate flavor balance (how well components work together)
     */
    private static calculateBalance(profile: FlavorProfile): number {
        const ideal = { acidity: 6.5, sweetness: 6.0, body: 6.5, bitterness: 5.5 };
        
        const deviations = [
            Math.abs(profile.acidity - ideal.acidity),
            Math.abs(profile.sweetness - ideal.sweetness),
            Math.abs(profile.body - ideal.body),
            Math.abs(profile.bitterness - ideal.bitterness)
        ];
        
        const avgDeviation = deviations.reduce((a, b) => a + b) / deviations.length;
        return Math.max(0, 10 - avgDeviation);
    }

    /**
     * Calculate complexity based on compound diversity
     */
    private static calculateComplexity(compounds: Record<string, ChemicalCompound>): number {
        const activeCompounds = Object.values(compounds).filter(c => c.concentration > 10);
        const diversity = activeCompounds.length / Object.keys(compounds).length;
        
        const concentrationVariance = this.calculateVariance(
            activeCompounds.map(c => c.concentration)
        );
        
        return Math.min(10, diversity * 5 + Math.min(5, concentrationVariance / 1000));
    }

    /**
     * Calculate SCA cupping score based on flavor profile
     */
    static calculateSCAScore(profile: FlavorProfile, defects: string[] = []): number {
        let score = 0;
        
        // Fragrance/Aroma (15 points)
        score += (profile.aroma / 10) * 15;
        
        // Flavor (15 points)
        const flavorScore = (profile.sweetness + profile.acidity + profile.body) / 3;
        score += (flavorScore / 10) * 15;
        
        // Aftertaste (15 points)
        score += (profile.aftertaste / 10) * 15;
        
        // Acidity (15 points)
        score += (profile.acidity / 10) * 15;
        
        // Body (15 points)
        score += (profile.body / 10) * 15;
        
        // Balance (15 points)
        score += (profile.balance / 10) * 15;
        
        // Overall (10 points)
        score += (profile.complexity / 10) * 10;
        
        // Deduct for defects
        const defectPenalty = defects.length * 2;
        score = Math.max(0, score - defectPenalty);
        
        return Math.round(score);
    }

    /**
     * Get roasting phase information for current temperature
     */
    static getCurrentRoastingPhase(temperature: number): RoastingPhase | null {
        for (const phase of this.ROASTING_PHASES) {
            if (temperature >= phase.temperature_range[0] && 
                temperature <= phase.temperature_range[1]) {
                return phase;
            }
        }
        return null;
    }

    /**
     * Get educational analysis of the roasting process
     */
    static getEducationalAnalysis(
        profile: FlavorProfile,
        temperature: number,
        time: number
    ): string {
        const phase = this.getCurrentRoastingPhase(temperature);
        const scaScore = this.calculateSCAScore(profile);
        
        let analysis = `Coffee Analysis:\n`;
        analysis += `SCA Score: ${scaScore}/100\n`;
        analysis += `Current Phase: ${phase?.name || 'Unknown'}\n`;
        analysis += `Roast Time: ${Math.round(time)}s\n\n`;
        
        analysis += `Flavor Profile:\n`;
        analysis += `• Acidity: ${profile.acidity.toFixed(1)}/10 `;
        analysis += profile.acidity > 7 ? "(Bright)" : profile.acidity < 4 ? "(Flat)" : "(Balanced)";
        analysis += `\n• Sweetness: ${profile.sweetness.toFixed(1)}/10 `;
        analysis += profile.sweetness > 7 ? "(Sweet)" : profile.sweetness < 4 ? "(Lacking)" : "(Moderate)";
        analysis += `\n• Body: ${profile.body.toFixed(1)}/10 `;
        analysis += profile.body > 7 ? "(Full)" : profile.body < 4 ? "(Light)" : "(Medium)";
        analysis += `\n• Bitterness: ${profile.bitterness.toFixed(1)}/10 `;
        analysis += profile.bitterness > 7 ? "(Strong)" : profile.bitterness < 3 ? "(Mild)" : "(Present)";
        analysis += `\n• Balance: ${profile.balance.toFixed(1)}/10\n`;
        analysis += `• Complexity: ${profile.complexity.toFixed(1)}/10\n\n`;
        
        // Time-based recommendations
        if (time < 300) {
            analysis += `⚠️ Short roast time - may result in underdeveloped flavors\n`;
        } else if (time > 900) {
            analysis += `⚠️ Long roast time - risk of over-extraction and dullness\n`;
        }
        
        if (phase) {
            analysis += `Active Reactions: ${phase.dominant_reactions.join(", ")}\n`;
            analysis += `Key Compounds: ${phase.key_compounds_formed.join(", ")}\n`;
        }
        
        return analysis;
    }

    /**
     * Utility method for calculating variance
     */
    private static calculateVariance(values: number[]): number {
        if (values.length === 0) return 0;
        const mean = values.reduce((a, b) => a + b) / values.length;
        const variance = values.reduce((acc, val) => acc + Math.pow(val - mean, 2), 0) / values.length;
        return variance;
    }

    /**
     * Legacy method for backward compatibility
     */
    static calculateFlavor(temperature: number, time: number) {
        const profile = this.calculateFlavorProfile(temperature, time);
        return {
            acidity: profile.acidity / 10,
            sweetness: profile.sweetness / 10,
            body: profile.body / 10,
            bitterness: profile.bitterness / 10
        };
    }
}