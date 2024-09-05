import { Player } from "./Player";
export class Enemy {
    scene: Phaser.Scene;
    background: Phaser.GameObjects.Image;
    enemy: SpineGameObject;
    player: Player;
    speed: number;
    enemyIsCastingSkill: boolean = false;

    constructor(scene: Phaser.Scene, background: Phaser.GameObjects.Image, player: Player) {
        this.scene = scene;
        this.background = background;
        this.player = player;
        this._createEnemyImage(this.scene.scale.width, this.scene.scale.height / 2 + 85);
        this.startAI();
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

    public _flipSpine(spine: SpineGameObject, flip: boolean, scale: number) {
        const body = spine.body as Phaser.Physics.Arcade.Body;
        body.setSize(spine.width - 100, spine.height - 0);
        spine.scaleX = flip ? -scale : scale;

        if (flip) {
            body.setOffset(spine.width - body.width, body.offset.y);
        } else {
            body.setOffset(100, 0);
            body.setSize(spine.width - 100, spine.height - 0);
        }
    }

    private startAI() {
        this._action();
    }

    private _action() {
        if (this.enemyIsCastingSkill) {
            (this.enemy.body as Phaser.Physics.Arcade.Body).setVelocityX(0);
            return;
        }
        this._randomlyMove();
    }

    private _randomlyMove() {
        const body = this.enemy.body as Phaser.Physics.Arcade.Body;

        this.speed = Phaser.Math.Between(100, 200);
        this.scene.physics.moveToObject(this.enemy as unknown as Phaser.Physics.Arcade.Image, this.player.player as unknown as Phaser.Physics.Arcade.Image, this.speed);
        const moveDuration = Phaser.Math.Between(1000, 2000);

        this.enemy.setAnimation(0, 'walk', true);

        // Schedule stopping after moving for the specified duration
        this.scene.time.addEvent({
            delay: moveDuration,
            callback: () => {
                body.setVelocityX(0);
                this.enemy.setAnimation(0, 'idle', true);


                if (this.player.player.x > this.enemy.x) {
                    this._flipSpine(this.enemy, false, 1);
                }
                else {
                    this._flipSpine(this.enemy, true, 1);
                }

                // After stopping, either move again or cast a skill
                this.scene.time.addEvent({
                    delay: Phaser.Math.Between(3000, 5000),
                    callback: () => {
                        if (Phaser.Math.Between(0, 1) === 0) {
                            this._randomlyCastSkill(() => {
                                this._action();
                            });
                        } else {
                            this._action(); // Continue moving
                        }
                    }
                });
            }
        });
    }

    protected _randomlyCastSkill(onComplete: () => void) {
        const skills = ['attack', 'skill2', 'skill3', 'skill4'];
        const randomSkill = Phaser.Utils.Array.GetRandom(skills);
        this.enemy.setAnimation(0, randomSkill, false);
        this.enemy.addAnimation(0, 'idle', true, 0);
        const skillDuration = 10000;

        this.scene.time.addEvent({
            delay: skillDuration,
            callback: () => {
                // this._updateSpineBodySize(this.enemy);
                this.enemy.setAnimation(0, 'idle', true);
                onComplete();
            }
        });
    }
}
