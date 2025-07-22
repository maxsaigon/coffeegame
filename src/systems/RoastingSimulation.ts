import Phaser from 'phaser';
import { TemperatureController } from '../components/TemperatureController';
import { CoffeeChemistry } from '../utils/CoffeeChemistry';

export class RoastingSimulation {
    private scene: Phaser.Scene;
    private temperatureController: TemperatureController;
    private roastTime: number = 0;

    constructor(scene: Phaser.Scene) {
        this.scene = scene;
        this.temperatureController = new TemperatureController(scene, 0, 0, 0, 0);
    }

    start() {
        this.roastTime = 0;
    }

    update(time: number, delta: number) {
        this.temperatureController.update(delta);
        this.roastTime += delta;

        const temperature = this.temperatureController.getTemperature();
        const flavor = CoffeeChemistry.calculateFlavor(temperature, this.roastTime);

        // Emit events or update game state with new flavor profile
        this.scene.events.emit('flavorUpdate', flavor);
    }

    setTargetTemperature(target: number) {
        this.temperatureController.setTargetTemperature(target);
    }
}