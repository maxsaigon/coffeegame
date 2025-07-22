import Phaser from 'phaser';
import { UITheme } from '../../styles/UITheme';

export class GameHUD extends Phaser.GameObjects.Container {
    private scoreText: Phaser.GameObjects.Text;
    private timeText: Phaser.GameObjects.Text;

    constructor(scene: Phaser.Scene, x: number, y: number) {
        super(scene, x, y);
        scene.add.existing(this);

        this.scoreText = scene.add.text(10, 10, 'Score: 0', { fontSize: '24px', color: UITheme.colors.text });
        this.add(this.scoreText);

        this.timeText = scene.add.text(scene.scale.width - 10, 10, 'Time: 0', { fontSize: '24px', color: UITheme.colors.text });
        this.timeText.setOrigin(1, 0);
        this.add(this.timeText);
    }

    updateScore(score: number) {
        this.scoreText.setText(`Score: ${score}`);
    }

    updateTime(time: number) {
        this.timeText.setText(`Time: ${Math.floor(time / 1000)}s`);
    }
}