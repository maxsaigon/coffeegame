import Phaser from 'phaser';

export class TemperatureController extends Phaser.GameObjects.Zone {
    private temperature: number = 20; // Ambient temperature
    private targetTemperature: number = 20;
    private heatingRate: number = 0.1; // Degrees per second

    constructor(scene: Phaser.Scene, x: number, y: number, width: number, height: number) {
        super(scene, x, y, width, height);
        scene.add.existing(this);
    }

    setTargetTemperature(target: number) {
        this.targetTemperature = target;
    }

    update(delta: number) {
        if (this.temperature < this.targetTemperature) {
            this.temperature += this.heatingRate * (delta / 1000);
        } else if (this.temperature > this.targetTemperature) {
            this.temperature -= this.heatingRate * (delta / 1000);
        }
    }

    getTemperature() {
        return this.temperature;
    }
}