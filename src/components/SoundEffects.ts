import Phaser from 'phaser';

export class SoundEffects {
    private scene: Phaser.Scene;

    constructor(scene: Phaser.Scene) {
        this.scene = scene;
    }

    play(key: string, config?: Phaser.Types.Sound.SoundConfig) {
        this.scene.sound.play(key, config);
    }

    playRoastingSound() {
        this.play('roastingSound');
    }

    playCustomerArriveSound() {
        this.play('customerArrive');
    }
}