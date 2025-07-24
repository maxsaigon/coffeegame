import Phaser from 'phaser';
import { UITheme } from '../../styles/UITheme';
import { SceneKeys } from '../../types/GameTypes';

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

        const startButton = this.createButton(scene.scale.width / 2, scene.scale.height * 0.5, 'Start Game', () => {
            console.log('Start Game clicked - transitioning to tutorial');
            scene.scene.start(SceneKeys.TUTORIAL);
        });
        this.add(startButton);

        const optionsButton = this.createButton(scene.scale.width / 2, scene.scale.height * 0.6, 'Options', () => {
            console.log('Options clicked - showing options menu');
            scene.scene.start(SceneKeys.ROASTING_LAB);
        });
        this.add(optionsButton);
    }

    private createButton(x: number, y: number, text: string, onClick: () => void): Phaser.GameObjects.Container {
        const button = this.scene.add.container(x, y);

        const buttonBackground = this.scene.add.graphics();
        buttonBackground.fillStyle(UITheme.colors.primary, 1);
        buttonBackground.fillRoundedRect(-100, -25, 200, 50, 10);
        button.add(buttonBackground);

        const buttonText = this.scene.add.text(0, 0, text, {
            fontSize: '24px',
            color: UITheme.colors.text,
            fontFamily: UITheme.fonts.main
        });
        buttonText.setOrigin(0.5);
        button.add(buttonText);

        button.setSize(200, 50);
        button.setInteractive({ useHandCursor: true });

        button.on('pointerover', () => {
            buttonBackground.clear();
            buttonBackground.fillStyle(UITheme.colors.secondary, 1);
            buttonBackground.fillRoundedRect(-100, -25, 200, 50, 10);
        });

        button.on('pointerout', () => {
            buttonBackground.clear();
            buttonBackground.fillStyle(UITheme.colors.primary, 1);
            buttonBackground.fillRoundedRect(-100, -25, 200, 50, 10);
        });

        button.on('pointerdown', onClick);

        return button;
    }
}
