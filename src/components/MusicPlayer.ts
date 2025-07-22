
import Phaser from 'phaser';

export class MusicPlayer {
    private scene: Phaser.Scene;
    private currentMusic: Phaser.Sound.BaseSound | null = null;

    constructor(scene: Phaser.Scene) {
        this.scene = scene;
    }

    playMusic(key: string, config?: Phaser.Types.Sound.SoundConfig) {
        if (this.currentMusic) {
            this.currentMusic.stop();
        }
        this.currentMusic = this.scene.sound.add(key, config);
        this.currentMusic.play();
    }

    stopMusic() {
        if (this.currentMusic) {
            this.currentMusic.stop();
            this.currentMusic = null;
        }
    }
}
