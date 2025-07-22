import Phaser from 'phaser';
import { UITheme } from '../../styles/UITheme';

export class MainMenu extends Phaser.GameObjects.Container {
    constructor(scene: Phaser.Scene, x: number, y: number) {
        super(scene, x, y);
        scene.add.existing(this);

        const background = scene.add.rectangle(0, 0, scene.scale.width, scene.scale.height, 0x000000, 0.7);
        background.setOrigin(0, 0);
        this.add(background);

        const title = scene.add.text(scene.scale.width / 2, scene.scale.height * 0.2, 'Coffee Roaster Tycoon', {
            fontSize: '64px',
            color: UITheme.colors.text,
            fontFamily: UITheme.fonts.main
        });
        title.setOrigin(0.5);
        this.add(title);

        const startButton = scene.add.text(scene.scale.width / 2, scene.scale.height * 0.5, 'Start Game', {
            fontSize: '32px',
            color: UITheme.colors.text,
            fontFamily: UITheme.fonts.main
        });
        startButton.setOrigin(0.5);
        startButton.setInteractive();
        startButton.on('pointerdown', () => {
            console.log('Start Game clicked');
            // Transition to GameScene
        });
        this.add(startButton);

        const optionsButton = scene.add.text(scene.scale.width / 2, scene.scale.height * 0.6, 'Options', {
            fontSize: '32px',
            color: UITheme.colors.text,
            fontFamily: UITheme.fonts.main
        });
        optionsButton.setOrigin(0.5);
        optionsButton.setInteractive();
        optionsButton.on('pointerdown', () => {
            console.log('Options clicked');
            // Show options menu
        });
        this.add(optionsButton);
    }
}