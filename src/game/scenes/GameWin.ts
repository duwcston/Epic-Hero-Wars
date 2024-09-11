import { Scene } from 'phaser';

export class GameWin extends Scene {
    constructor() {
        super({ key: 'GameWin' });
    }

    create(): void {
        const width = this.cameras.main.width;
        const height = this.cameras.main.height;

        const overlay = this.add.rectangle(width / 2, height / 2, width, height, 0x000000, 1);
        overlay.alpha = 0.5;

        this.tweens.add({
            targets: overlay,
            alpha: 0.3,
            duration: 2000,
            ease: 'Power2'
        });

        // Display "Game Win" image
        this.add.image(width / 2, height / 2 - 50, 'light').setOrigin(0.5).setScale(4);
        this.add.image(width / 2, height / 2 - 50, 'victory').setOrigin(0.5);

        // // Display "Restart" button
        // const restartButton = this.add.text(width / 2, height / 2 + 10, 'Restart', {
        //     fontSize: '32px',
        //     color: '#ffffff',
        //     fontFamily: 'Font1'
        // }).setOrigin(0.5).setInteractive();

        // restartButton.on('pointerdown', () => {
        //     this.scene.start('Game');
        // });
    }
}
