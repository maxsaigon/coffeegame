export class PreferenceEngine {
    private preferences: { roast: string, flavor: string };

    constructor() {
        this.preferences = this.generateRandomPreferences();
    }

    private generateRandomPreferences(): { roast: string, flavor: string } {
        const roasts = ['light', 'medium', 'dark'];
        const flavors = ['fruity', 'floral', 'spicy', 'bitter', 'sweet'];
        return {
            roast: Phaser.Utils.Array.GetRandom(roasts),
            flavor: Phaser.Utils.Array.GetRandom(flavors)
        };
    }

    getPreferences(): { roast: string, flavor: string } {
        return this.preferences;
    }
}