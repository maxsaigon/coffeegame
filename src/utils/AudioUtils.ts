
export class AudioUtils {
    static adjustVolume(sound: Phaser.Sound.BaseSound, volume: number) {
        if ('setVolume' in sound) {
            (sound as any).setVolume(volume);
        }
    }
}
