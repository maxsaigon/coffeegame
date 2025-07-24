/**
 * Chemistry Analytics Panel - Advanced Coffee Chemistry Visualization
 * Provides detailed scientific analysis of coffee chemistry for educational purposes
 */

import Phaser from 'phaser';
import type { FlavorProfile } from '../utils/CoffeeChemistry';

export interface ChemistryData {
    temperature: number;
    time: number;
    beanType: string;
    flavorProfile: FlavorProfile;
    scaScore: number;
    analysis: string;
}

export class ChemistryAnalyticsPanel {
    private scene: Phaser.Scene;
    private panel: Phaser.GameObjects.Container | null = null;
    private isVisible: boolean = false;

    constructor(scene: Phaser.Scene) {
        this.scene = scene;
    }

    /**
     * Show detailed chemistry analytics panel
     */
    public showAnalytics(data: ChemistryData): void {
        this.hideAnalytics(); // Clear any existing panel
        
        this.panel = this.createAnalyticsPanel(data);
        this.isVisible = true;
    }

    /**
     * Hide the analytics panel
     */
    public hideAnalytics(): void {
        if (this.panel) {
            this.panel.destroy();
            this.panel = null;
        }
        this.isVisible = false;
    }

    /**
     * Toggle panel visibility
     */
    public toggleAnalytics(data?: ChemistryData): void {
        if (this.isVisible) {
            this.hideAnalytics();
        } else if (data) {
            this.showAnalytics(data);
        }
    }

    /**
     * Create the comprehensive analytics panel
     */
    private createAnalyticsPanel(data: ChemistryData): Phaser.GameObjects.Container {
        const panel = this.scene.add.container(0, 0);
        
        // Semi-transparent background overlay
        const overlay = this.scene.add.rectangle(
            this.scene.scale.width / 2, 
            this.scene.scale.height / 2, 
            this.scene.scale.width, 
            this.scene.scale.height, 
            0x000000, 
            0.7
        );
        overlay.setInteractive();
        overlay.on('pointerdown', () => this.hideAnalytics());
        panel.add(overlay);

        // Main panel background
        const panelBg = this.scene.add.rectangle(
            this.scene.scale.width / 2,
            this.scene.scale.height / 2,
            Math.min(900, this.scene.scale.width - 40),
            Math.min(600, this.scene.scale.height - 40),
            0x2c1810,
            0.95
        );
        panelBg.setStrokeStyle(3, 0xd4af37);
        panel.add(panelBg);

        // Title
        const title = this.scene.add.text(
            this.scene.scale.width / 2,
            this.scene.scale.height / 2 - 270,
            '☕ Coffee Chemistry Analytics',
            {
                fontSize: '28px',
                color: '#d4af37',
                fontStyle: 'bold'
            }
        ).setOrigin(0.5);
        panel.add(title);

        // Roasting Parameters Section
        this.addRoastingParameters(panel, data);
        
        // Flavor Profile Visualization
        this.addFlavorProfileChart(panel, data.flavorProfile);
        
        // Chemical Compounds Analysis
        this.addChemicalCompounds(panel, data);
        
        // SCA Quality Score
        this.addQualityScore(panel, data.scaScore);
        
        // Scientific Analysis
        this.addScientificAnalysis(panel, data.analysis);
        
        // Close button
        this.addCloseButton(panel);

        return panel;
    }

    /**
     * Add roasting parameters display
     */
    private addRoastingParameters(panel: Phaser.GameObjects.Container, data: ChemistryData): void {
        const startY = this.scene.scale.height / 2 - 230;
        
        // Section title
        const sectionTitle = this.scene.add.text(
            this.scene.scale.width / 2 - 400,
            startY,
            '🔥 Roasting Parameters',
            { fontSize: '18px', color: '#ff9800', fontStyle: 'bold' }
        );
        panel.add(sectionTitle);

        // Parameters
        const params = [
            `Temperature: ${data.temperature}°C`,
            `Time: ${Math.round(data.time / 60)}m ${data.time % 60}s`,
            `Bean Type: ${data.beanType}`,
            `Roast Level: ${this.getRoastLevel(data.temperature)}`
        ];

        params.forEach((param, index) => {
            const paramText = this.scene.add.text(
                this.scene.scale.width / 2 - 380,
                startY + 25 + (index * 20),
                param,
                { fontSize: '14px', color: '#ffffff' }
            );
            panel.add(paramText);
        });
    }

    /**
     * Add flavor profile visualization chart
     */
    private addFlavorProfileChart(panel: Phaser.GameObjects.Container, profile: FlavorProfile): void {
        const startX = this.scene.scale.width / 2 - 200;
        const startY = this.scene.scale.height / 2 - 120;
        
        // Section title
        const sectionTitle = this.scene.add.text(
            startX,
            startY - 30,
            '📊 Flavor Profile Analysis',
            { fontSize: '18px', color: '#4caf50', fontStyle: 'bold' }
        );
        panel.add(sectionTitle);

        // Flavor attributes
        const attributes = [
            { name: 'Acidity', value: profile.acidity, color: 0xffeb3b },
            { name: 'Sweetness', value: profile.sweetness, color: 0xff9800 },
            { name: 'Body', value: profile.body, color: 0x8bc34a },
            { name: 'Bitterness', value: profile.bitterness, color: 0x795548 },
            { name: 'Aroma', value: profile.aroma, color: 0xe91e63 },
            { name: 'Balance', value: profile.balance, color: 0x9c27b0 }
        ];

        attributes.forEach((attr, index) => {
            const y = startY + (index * 35);
            
            // Attribute name
            const nameText = this.scene.add.text(
                startX,
                y,
                attr.name,
                { fontSize: '14px', color: '#ffffff' }
            );
            panel.add(nameText);

            // Progress bar background
            const barBg = this.scene.add.rectangle(
                startX + 100,
                y + 7,
                200,
                12,
                0x444444
            );
            panel.add(barBg);

            // Progress bar fill
            const barWidth = (attr.value / 10) * 200;
            const barFill = this.scene.add.rectangle(
                startX + 100 - (200 - barWidth) / 2,
                y + 7,
                barWidth,
                12,
                attr.color
            );
            panel.add(barFill);

            // Value text
            const valueText = this.scene.add.text(
                startX + 320,
                y,
                `${attr.value.toFixed(1)}/10`,
                { fontSize: '12px', color: '#ffffff' }
            );
            panel.add(valueText);
        });
    }

    /**
     * Add chemical compounds analysis
     */
    private addChemicalCompounds(panel: Phaser.GameObjects.Container, data: ChemistryData): void {
        const startX = this.scene.scale.width / 2 + 100;
        const startY = this.scene.scale.height / 2 - 120;
        
        // Section title
        const sectionTitle = this.scene.add.text(
            startX,
            startY - 30,
            '🧪 Active Chemical Compounds',
            { fontSize: '18px', color: '#2196f3', fontStyle: 'bold' }
        );
        panel.add(sectionTitle);

        // Simulate compound formation based on temperature and time
        const compounds = this.getActiveCompounds(data.temperature, data.time);
        
        compounds.forEach((compound, index) => {
            const y = startY + (index * 25);
            
            // Compound name
            const nameText = this.scene.add.text(
                startX,
                y,
                compound.name,
                { fontSize: '12px', color: '#ffffff' }
            );
            panel.add(nameText);

            // Formation indicator
            const indicator = this.scene.add.circle(
                startX + 180,
                y + 6,
                4,
                compound.active ? 0x4caf50 : 0x757575
            );
            panel.add(indicator);

            // Concentration level
            if (compound.active) {
                const concentrationText = this.scene.add.text(
                    startX + 200,
                    y,
                    `${compound.concentration}%`,
                    { fontSize: '11px', color: '#4caf50' }
                );
                panel.add(concentrationText);
            }
        });
    }

    /**
     * Add SCA quality score display
     */
    private addQualityScore(panel: Phaser.GameObjects.Container, scaScore: number): void {
        const centerX = this.scene.scale.width / 2;
        const centerY = this.scene.scale.height / 2 + 120;
        
        // Section title
        const sectionTitle = this.scene.add.text(
            centerX,
            centerY - 40,
            '🏆 SCA Quality Assessment',
            { fontSize: '18px', color: '#ffc107', fontStyle: 'bold' }
        ).setOrigin(0.5);
        panel.add(sectionTitle);

        // Circular score display
        const scoreCircle = this.scene.add.circle(centerX, centerY + 10, 35, 0x1976d2);
        panel.add(scoreCircle);

        const scoreText = this.scene.add.text(
            centerX,
            centerY + 10,
            scaScore.toString(),
            { fontSize: '24px', color: '#ffffff', fontStyle: 'bold' }
        ).setOrigin(0.5);
        panel.add(scoreText);

        const maxScoreText = this.scene.add.text(
            centerX,
            centerY + 50,
            '/100',
            { fontSize: '14px', color: '#ffffff' }
        ).setOrigin(0.5);
        panel.add(maxScoreText);

        // Quality grade
        const grade = this.getQualityGrade(scaScore);
        const gradeText = this.scene.add.text(
            centerX,
            centerY + 70,
            grade,
            { fontSize: '16px', color: this.getGradeColor(scaScore), fontStyle: 'bold' }
        ).setOrigin(0.5);
        panel.add(gradeText);
    }

    /**
     * Add scientific analysis text
     */
    private addScientificAnalysis(panel: Phaser.GameObjects.Container, analysis: string): void {
        const startX = this.scene.scale.width / 2 - 420;
        const startY = this.scene.scale.height / 2 + 180;
        
        // Section title
        const sectionTitle = this.scene.add.text(
            startX,
            startY,
            '🔬 Scientific Analysis',
            { fontSize: '18px', color: '#e91e63', fontStyle: 'bold' }
        );
        panel.add(sectionTitle);

        // Analysis text (first few lines only for space)
        const analysisLines = analysis.split('\n').slice(0, 6);
        const analysisText = this.scene.add.text(
            startX,
            startY + 25,
            analysisLines.join('\n'),
            { 
                fontSize: '12px', 
                color: '#ffffff',
                wordWrap: { width: 840 }
            }
        );
        panel.add(analysisText);
    }

    /**
     * Add close button
     */
    private addCloseButton(panel: Phaser.GameObjects.Container): void {
        const closeBtn = this.scene.add.text(
            this.scene.scale.width / 2 + 400,
            this.scene.scale.height / 2 - 270,
            '✕',
            { fontSize: '24px', color: '#ff5722', fontStyle: 'bold' }
        ).setOrigin(0.5);
        
        closeBtn.setInteractive({ useHandCursor: true });
        closeBtn.on('pointerdown', () => this.hideAnalytics());
        closeBtn.on('pointerover', () => closeBtn.setScale(1.2));
        closeBtn.on('pointerout', () => closeBtn.setScale(1));
        
        panel.add(closeBtn);
    }

    /**
     * Get roast level based on temperature
     */
    private getRoastLevel(temperature: number): string {
        if (temperature < 190) return 'Light';
        if (temperature < 210) return 'Medium-Light';
        if (temperature < 220) return 'Medium';
        if (temperature < 230) return 'Medium-Dark';
        return 'Dark';
    }

    /**
     * Get active compounds based on roasting conditions
     */
    private getActiveCompounds(temperature: number, time: number): Array<{
        name: string;
        active: boolean;
        concentration: number;
    }> {
        return [
            {
                name: 'Chlorogenic Acid',
                active: temperature > 140,
                concentration: Math.max(0, 100 - (temperature - 140) * 0.5)
            },
            {
                name: 'Maillard Products',
                active: temperature > 150 && time > 300,
                concentration: Math.min(100, (temperature - 150) * 2 + (time - 300) * 0.1)
            },
            {
                name: 'Caramelization',
                active: temperature > 170,
                concentration: Math.min(100, (temperature - 170) * 1.5)
            },
            {
                name: 'Pyrazines',
                active: temperature > 200,
                concentration: Math.min(100, (temperature - 200) * 3)
            },
            {
                name: 'Quinides',
                active: temperature > 180 && time > 400,
                concentration: Math.min(100, (temperature - 180) * 2)
            },
            {
                name: 'Furans',
                active: temperature > 160,
                concentration: Math.min(100, (temperature - 160) * 2.5)
            }
        ];
    }

    /**
     * Get quality grade from SCA score
     */
    private getQualityGrade(score: number): string {
        if (score >= 90) return 'Outstanding';
        if (score >= 85) return 'Excellent';
        if (score >= 80) return 'Very Good';
        if (score >= 70) return 'Good';
        if (score >= 60) return 'Fair';
        return 'Poor';
    }

    /**
     * Get color for quality grade
     */
    private getGradeColor(score: number): string {
        if (score >= 85) return '#4caf50'; // Green
        if (score >= 75) return '#8bc34a'; // Light Green
        if (score >= 65) return '#ffeb3b'; // Yellow
        if (score >= 55) return '#ff9800'; // Orange
        return '#f44336'; // Red
    }

    /**
     * Check if panel is currently visible
     */
    public get visible(): boolean {
        return this.isVisible;
    }
}
