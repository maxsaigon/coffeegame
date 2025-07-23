import { PreferenceEngine } from './PreferenceEngine';
import { PersonalityTraits } from './PersonalityTraits';
import { DialogueSystem } from '../components/DialogueSystem';

export class CustomerAI {
    private preferenceEngine: PreferenceEngine;
    private personalityTraits: PersonalityTraits;
    private dialogueSystem: DialogueSystem;

    constructor(_scene: Phaser.Scene, dialogueSystem: DialogueSystem) {
        this.preferenceEngine = new PreferenceEngine();
        this.personalityTraits = new PersonalityTraits();
        this.dialogueSystem = dialogueSystem;
    }

    update() {
        // Example AI behavior: customer requests coffee based on preferences
        const preferences = this.preferenceEngine.getPreferences();
        const traits = this.personalityTraits.getTraits();

        let dialogue = `I would like a ${preferences.roast} roast with a ${preferences.flavor} flavor.`;

        if (traits.includes('grumpy')) {
            dialogue = `Hmph. I suppose I'll take a ${preferences.roast} roast with a ${preferences.flavor} flavor. Don't mess it up.`;
        } else if (traits.includes('friendly')) {
            dialogue = `Hello! I'd love a ${preferences.roast} roast with a ${preferences.flavor} flavor, please!`;
        }

        this.dialogueSystem.showDialogue(dialogue);
    }
}