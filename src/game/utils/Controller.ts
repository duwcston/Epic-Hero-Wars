import { Player } from "../sprites/Player";

export class Controller {
    scene: Phaser.Scene;
    player: Player;
    arrowLeft: Phaser.GameObjects.Image;
    arrowRight: Phaser.GameObjects.Image;
    moveable: boolean = true;

    constructor(scene: Phaser.Scene, player: Player) {
        this.scene = scene;
        this.player = player;
        this.arrowLeft = this.scene.add.image(60, this.scene.scale.height - 80, 'arrow_left').setScale(0.9).setDepth(10).setInteractive();
        this.arrowRight = this.scene.add.image(45 + this.arrowLeft.width, this.scene.scale.height - 80, 'arrow_left').setScale(0.9).setDepth(10).setFlipX(true).setInteractive();
        this.scene.input.on('pointerdown', this._moveSpine, this);
    }

    private _moveSpine(pointer: Phaser.Input.Pointer) {
        const playerSprite = this.player.player;
        const distance = Math.abs(playerSprite.x - pointer.x);
        const speed = 150;
        const duration = (distance / speed) * 1000;

        if (this.moveable) {
            if (pointer.x > playerSprite.x) {
                this._flipSpine(playerSprite, false, 0.3);
                (playerSprite.body as Phaser.Physics.Arcade.Body).setVelocity(speed, 0);
            } else {
                this._flipSpine(playerSprite, true, 0.3);
                (playerSprite.body as Phaser.Physics.Arcade.Body).setVelocity(-speed, 0);
            }
            playerSprite.setAnimation(0, 'walk', true);
            this.scene.tweens.add({
                targets: playerSprite,
                x: pointer.x,
                ease: 'Linear',
                duration: duration,
                onUpdate: () => {
                    this._updateSpineBodySize(playerSprite);
                },
                onComplete: () => {
                    (playerSprite.body as Phaser.Physics.Arcade.Body).setVelocity(0);
                    playerSprite.setAnimation(0, 'idle', true);
                }
            });
        }
    }

    public unclickable(pointer: Phaser.Input.Pointer) {
        if (pointer.y > this.scene.scale.height * 3 / 4) {
            this.moveable = false;
        }
        else {
            this.moveable = true;
        }
    }

    private _flipSpine(spine: SpineGameObject, flip: boolean, scale: number) {
        const body = spine.body as Phaser.Physics.Arcade.Body;
        body.setSize(spine.width - 500, spine.height - 100);
        spine.scaleX = flip ? -scale : scale;

        if (flip) {
            body.setOffset(spine.width - body.width, body.offset.y);
        }
        else {
            body.setOffset(500, 100);
            body.setSize(spine.width - 500, spine.height - 100);
        }
    }

    private _updateSpineBodySize(spine: SpineGameObject) {
        const body = spine.body as Phaser.Physics.Arcade.Body;
        body.setSize(spine.width - 600, spine.height - 100);
    }
}
