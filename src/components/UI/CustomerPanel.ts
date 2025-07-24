import Phaser from 'phaser';
import { UITheme } from '../../styles/UITheme';

export class CustomerPanel extends Phaser.GameObjects.Container {
    private customerNameText: Phaser.GameObjects.Text;
    private customerOrderText: Phaser.GameObjects.Text;

    constructor(scene: Phaser.Scene, x: number, y: number) {
        super(scene, x, y);
        scene.add.existing(this);

        const panelBackground = scene.add.graphics();
        panelBackground.fillStyle(UITheme.colors.primary, 0.9);
        panelBackground.fillRoundedRect(0, 0, 400, 150, 10);
        panelBackground.lineStyle(2, UITheme.colors.secondary, 1);
        panelBackground.strokeRoundedRect(0, 0, 400, 150, 10);
        this.add(panelBackground);

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

        this.setPosition(scene.scale.width / 2 - 200, scene.scale.height - 170);
        this.setVisible(false);
    }

    updateCustomerInfo(name: string, order: string) {
        this.customerNameText.setText(`Customer: ${name}`);
        this.customerOrderText.setText(`Wants: ${order}`);
        this.setVisible(true);
    }

    hide() {
        this.setVisible(false);
    }
}
