export class PersonalityTraits {
    private traits: string[];

    constructor() {
        this.traits = this.generateRandomTraits();
    }

    private generateRandomTraits(): string[] {
        const possibleTraits = ['friendly', 'grumpy', 'picky', 'adventurous', 'loyal'];
        const numTraits = Phaser.Math.Between(1, 3);
        return Phaser.Utils.Array.Shuffle(possibleTraits).slice(0, numTraits);
    }

    getTraits(): string[] {
        return this.traits;
    }
}