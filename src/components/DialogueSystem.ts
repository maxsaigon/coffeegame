
import Phaser from 'phaser';

export class DialogueSystem extends Phaser.GameObjects.Zone {
    constructor(scene: Phaser.Scene, x: number, y: number, width: number, height: number) {
        super(scene, x, y, width, height);
        scene.add.existing(this);
    }

    showDialogue(text: string) {
        // Dialogue display logic here
    }
}
