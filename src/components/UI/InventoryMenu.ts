import Phaser from 'phaser';
import { UITheme } from '../../styles/UITheme';

export class InventoryMenu extends Phaser.GameObjects.Container {
    constructor(scene: Phaser.Scene, x: number, y: number) {
        super(scene, x, y);
        scene.add.existing(this);

        const background = scene.add.rectangle(0, 0, 300, 400, 0x000000, 0.8);
        background.setOrigin(0, 0);
        this.add(background);

        const title = scene.add.text(150, 20, 'Inventory', {
            fontSize: '32px',
            color: UITheme.colors.text,
            fontFamily: UITheme.fonts.main
        });
        title.setOrigin(0.5);
        this.add(title);

        // Add inventory items here

        this.setPosition(scene.scale.width - 300, 0);
        this.setVisible(false);
    }

    toggleVisibility() {
        this.setVisible(!this.visible);
    }
}