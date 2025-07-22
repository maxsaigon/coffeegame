import Phaser from 'phaser';

export class DialogueSystem extends Phaser.GameObjects.Zone {
    private dialogueText: Phaser.GameObjects.Text;

    constructor(scene: Phaser.Scene, x: number, y: number, width: number, height: number) {
        super(scene, x, y, width, height);
        scene.add.existing(this);

        this.dialogueText = scene.add.text(x, y, '', { color: '#ffffff', fontSize: '16px' });
        this.dialogueText.setOrigin(0.5);
        this.dialogueText.setWordWrapWidth(width);
        this.dialogueText.setVisible(false);
    }

    showDialogue(text: string) {
        this.dialogueText.setText(text);
        this.dialogueText.setVisible(true);
        this.scene.time.delayedCall(3000, () => {
            this.dialogueText.setVisible(false);
        });
    }
}