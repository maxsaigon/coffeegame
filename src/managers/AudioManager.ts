import Phaser from 'phaser';
import { MusicPlayer } from '../components/MusicPlayer';
import { SoundEffects } from '../components/SoundEffects';

export class AudioManager {
    private musicPlayer: MusicPlayer;
    private soundEffects: SoundEffects;

    constructor(scene: Phaser.Scene) {
        this.musicPlayer = new MusicPlayer(scene);
        this.soundEffects = new SoundEffects(scene);
    }

    playMusic(key: string, config?: Phaser.Types.Sound.SoundConfig) {
        this.musicPlayer.playMusic(key, config);
    }

    stopMusic() {
        this.musicPlayer.stopMusic();
    }

    playSound(key: string, config?: Phaser.Types.Sound.SoundConfig) {
        this.soundEffects.play(key, config);
    }

    adjustVolume(sound: Phaser.Sound.BaseSound, volume: number) {
        if ('setVolume' in sound) {
            (sound as any).setVolume(volume);
        }
    }
}