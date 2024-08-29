import { EnemyAI } from "./EnemyAI";

export class Enemy extends EnemyAI {
    scene: Phaser.Scene;
    background: Phaser.GameObjects.Image;
    enemy: SpineGameObject;

    constructor(scene: Phaser.Scene, background: Phaser.GameObjects.Image) {
        super();

        this.scene = scene;
        this.background = background
        this._createEnemyImage(this.scene.scale.width, this.scene.scale.height / 2 + 85);
    }

    private _createEnemyImage(x: number, y: number) {
        this.enemy = this.scene.add.spine(x, y, 'athena');
        this.scene.physics.add.existing(this.enemy as unknown as Phaser.Physics.Arcade.Image);
        this._flipSpine(this.enemy, true, 1);
        this.enemy.addAnimation(0, 'idle', true, 0);
        const body = this.enemy.body as Phaser.Physics.Arcade.Body;
        body.setCollideWorldBounds(true);
        body.setGravityY(300);

        this.scene.physics.add.collider(this.enemy as unknown as Phaser.Physics.Arcade.Image, this.background, () => {

        });
    }

    private _flipSpine(spine: SpineGameObject, flip: boolean, scale: number) {
        const body = spine.body as Phaser.Physics.Arcade.Body;
        body.setSize(spine.width - 50, spine.height - 25);
        spine.scaleX = flip ? -scale : scale;

        if (flip) {
            body.setOffset(spine.width, body.offset.y + 25);
        }
        else {
            body.setOffset(0, body.offset.y + 25);
        }
    }
}