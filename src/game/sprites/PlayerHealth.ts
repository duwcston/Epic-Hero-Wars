export class PlayerHealth {
    scene: Phaser.Scene;
    playerHealthBar: Phaser.GameObjects.Image;
    playerHealthEmpty: Phaser.GameObjects.Image;
    playerHealthFull: Phaser.GameObjects.Image;

    constructor(scene: Phaser.Scene) {
        this.scene = scene;
        this.createPlayerHealthBar();
    }

    private createPlayerHealthBar() {
        this.playerHealthBar = this.createHealthImage('health_frame');
        this.playerHealthEmpty = this.createHealthImage('health_empty');
        this.playerHealthFull = this.createHealthImage('health_full');
        this.updateHealthBarScale();

        this.scene.scale.on('resize', this.onResize, this);
    }

    private createHealthImage(texture: string): Phaser.GameObjects.Image {
        return this.scene.add.image(this.scene.scale.width / 4 + 15, 17, texture).setDepth(10);
    }

    private updateHealthBarScale() {
        const scale = this.scene.scale.width / 800;  // Adjust 800 to your desired reference width
        this.playerHealthBar.setScale(scale, 1);
        this.playerHealthEmpty.setScale(scale, 1);
        this.playerHealthFull.setScale(scale, 1);
    }

    private onResize() {
        this.updateHealthBarScale();
    }
}