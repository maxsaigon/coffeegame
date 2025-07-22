import Phaser from 'phaser';
import { UITheme } from '../../styles/UITheme';

export class CustomerPanel extends Phaser.GameObjects.Container {
    private customerNameText: Phaser.GameObjects.Text;
    private customerOrderText: Phaser.GameObjects.Text;

    constructor(scene: Phaser.Scene, x: number, y: number) {
        super(scene, x, y);
        scene.add.existing(this);

        const background = scene.add.rectangle(0, 0, 400, 150, 0x000000, 0.8);
        background.setOrigin(0, 0);
        this.add(background);

        this.customerNameText = scene.add.text(20, 20, 'Customer Name:', {
            fontSize: '24px',
            color: UITheme.colors.text,
            fontFamily: UITheme.fonts.main
        });
        this.add(this.customerNameText);

        this.customerOrderText = scene.add.text(20, 60, 'Order:', {
            fontSize: '20px',
            color: UITheme.colors.text,
            fontFamily: UITheme.fonts.main
        });
        this.add(this.customerOrderText);

        this.setPosition(scene.scale.width / 2 - 200, scene.scale.height - 150);
        this.setVisible(false);
    }

    updateCustomerInfo(name: string, order: string) {
        this.customerNameText.setText(`Customer Name: ${name}`);
        this.customerOrderText.setText(`Order: ${order}`);
        this.setVisible(true);
    }

    hide() {
        this.setVisible(false);
    }
}