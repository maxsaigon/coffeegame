
export class AudioUtils {
    static adjustVolume(sound: Phaser.Sound.BaseSound, volume: number) {
        sound.setVolume(volume);
    }
}
