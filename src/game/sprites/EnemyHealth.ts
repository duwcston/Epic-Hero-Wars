export class EnemyHealth {
    scene: Phaser.Scene;
    enemyHealthFrame: Phaser.GameObjects.Image;
    enemyHealthEmpty: Phaser.GameObjects.Image;
    enemyHealthBar: Phaser.GameObjects.Image;

    constructor(scene: Phaser.Scene) {
        this.scene = scene;
        this.createEnemyHealthBar();
    }

    private createEnemyHealthBar() {
        this.enemyHealthFrame = this.createEnemyHealthImage('health_frame');
        this.enemyHealthEmpty = this.createEnemyHealthImage('health_empty');
        this.enemyHealthBar = this.createEnemyHealthImage('health2_full');
        this.updateEnemyHealthBarScale();

        this.scene.scale.on('resize', this.onResize, this);
    }

    private createEnemyHealthImage(texture: string): Phaser.GameObjects.Image {
        return this.scene.add.image(this.scene.scale.width / 4 * 3 - 15, 17, texture).setDepth(10);
    }

    private updateEnemyHealthBarScale() {
        const scale = this.scene.scale.width / 800;  // Adjust 800 to your desired reference width
        this.enemyHealthFrame.setScale(scale, 1);
        this.enemyHealthEmpty.setScale(scale, 1);
        this.enemyHealthBar.setScale(scale, 1);
    }

    private onResize() {
        this.updateEnemyHealthBarScale();
    }

}