import Phaser from 'phaser';

export class QualityMeter extends Phaser.GameObjects.Graphics {
    private score: number = 0;
    private maxScore: number = 10;

    constructor(scene: Phaser.Scene, x: number, y: number) {
        super(scene, { x, y });
        scene.add.existing(this);
        this.drawMeter();
    }

    updateMeter(quality: number) {
        this.score = Phaser.Math.Clamp(quality, 0, this.maxScore);
        this.drawMeter();
    }

    private drawMeter() {
        this.clear();
        const width = 100;
        const height = 20;
        const fillWidth = (this.score / this.maxScore) * width;

        // Background
        this.fillStyle(0x333333, 1);
        this.fillRect(0, 0, width, height);

        // Fill
        this.fillStyle(0x00ff00, 1); // Green for good quality
        this.fillRect(0, 0, fillWidth, height);

        // Border
        this.lineStyle(2, 0xffffff, 1);
        this.strokeRect(0, 0, width, height);
    }
}