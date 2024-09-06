export class Player {
    scene: Phaser.Scene;
    background: Phaser.GameObjects.Image;
    player: SpineGameObject;

    constructor(scene: Phaser.Scene, background: Phaser.GameObjects.Image) {
        this.scene = scene;
        this.background = background
        this._createPlayerImage(0, this.scene.scale.height / 2 + 85);
    }

    private _createPlayerImage(x: number, y: number) {
        this.player = this.scene.add.spine(x + 150, y, 'michael');
        this.player.setScale(0.3);
        this.player.addAnimation(0, 'idle', true, 0);

        this.scene.physics.add.existing(this.player as unknown as Phaser.Physics.Arcade.Image);

        const body = this.player.body as Phaser.Physics.Arcade.Body;
        body.setSize(600, 600);
        body.setOffset(400, 50);
        body.setCollideWorldBounds(true);
        body.setGravity(0, 300);
        this.scene.physics.add.collider(this.player as unknown as Phaser.Physics.Arcade.Image, this.background, () => { });
    }
}