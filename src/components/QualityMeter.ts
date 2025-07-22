
import Phaser from 'phaser';

export class QualityMeter extends Phaser.GameObjects.Graphics {
    constructor(scene: Phaser.Scene, x: number, y: number) {
        super(scene, { x, y });
        scene.add.existing(this);
    }

    updateMeter(quality: number) {
        // Meter update logic here
    }
}
