import Phaser from 'phaser';
// import { MusicPlayer } from '../components/MusicPlayer';
// import { SoundEffects } from '../components/SoundEffects';

export class AudioManager {
    // private scene: Phaser.Scene;
    // private musicPlayer: MusicPlayer;
    // private soundEffects: SoundEffects;

    constructor(scene: Phaser.Scene) {
        // this.scene = scene;
        // this.musicPlayer = new MusicPlayer(scene);
        // this.soundEffects = new SoundEffects(scene);
        console.log('AudioManager initialized for scene:', scene.scene.key);
        // Keep references but don't use them during testing
        console.log('AudioManager initialized (testing mode)');
    }

    playMusic(key: string, config?: Phaser.Types.Sound.SoundConfig) {
        // Temporarily disabled for testing
        console.log(`Would play music: ${key}`, config);
        // this.musicPlayer.playMusic(key, config);
    }

    stopMusic() {
        // Temporarily disabled for testing
        console.log('Would stop music');
        // this.musicPlayer.stopMusic();
    }

    playSound(key: string, config?: Phaser.Types.Sound.SoundConfig) {
        // Temporarily disabled for testing
        console.log(`Would play sound: ${key}`, config);
        // this.soundEffects.play(key, config);
    }

    adjustVolume(sound: Phaser.Sound.BaseSound, volume: number) {
        if ('setVolume' in sound) {
            (sound as any).setVolume(volume);
        }
    }
}