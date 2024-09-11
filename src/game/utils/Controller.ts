import { PLAYER_SPEED } from "../enums/Constant";
import { Player } from "../sprites/Player";
import { PlayerSkill } from "../sprites/PlayerSkill";

export class Controller {
    scene: Phaser.Scene;
    player: Player;
    arrowLeft: Phaser.GameObjects.Image;
    arrowLeftOn: Phaser.GameObjects.Image;
    arrowRight: Phaser.GameObjects.Image;
    arrowRightOn: Phaser.GameObjects.Image;
    private static _playerController: Controller;
    private _clickable: boolean;
    private _currentTween: Phaser.Tweens.Tween;

    static get playerController() {
        return this._playerController;
    }

    constructor(scene: Phaser.Scene, player: Player) {
        Controller._playerController = this;

        this.scene = scene;
        this.player = player;
        this.arrowLeft = this.scene.add.image(60, this.scene.scale.height - 80, 'arrow_left').setScale(0.9).setDepth(10).setInteractive();
        this.arrowRight = this.scene.add.image(45 + this.arrowLeft.width, this.scene.scale.height - 80, 'arrow_left').setScale(0.9).setDepth(10).setFlipX(true).setInteractive();

        // Add event listeners for arrow buttons
        this.arrowLeft.on('pointerdown', () => {
            this._moveLeft();
            this.arrowLeftOn = this.scene.add.image(this.arrowLeft.x, this.arrowLeft.y, 'arrow_left_on').setScale(0.9).setDepth(10);
        }, this);
        this.arrowLeft.on('pointerup', () => {
            this.arrowLeftOn.destroy();
            // this.scene.add.image(this.arrowLeft.x, this.arrowLeft.y, 'arrow_left').setScale(0.9).setDepth(10);
        }, this);
        this.arrowRight.on('pointerdown', () => {
            this._moveRight()
            this.arrowRightOn = this.scene.add.image(this.arrowRight.x, this.arrowRight.y, 'arrow_left_on').setScale(0.9).setDepth(10).setFlipX(true);
        }, this);
        this.arrowRight.on('pointerup', () => {
            this.arrowRightOn.destroy();
            // this.scene.add.image(this.arrowRight.x, this.arrowRight.y, 'arrow_left').setScale(0.9).setDepth(10).setFlipX(true);
        }, this);
        this.scene.input.on('pointerdown', this._moveSpine, this);
    }

    get clickable() {
        return this._clickable;
    }

    set clickable(value: boolean) {
        this._clickable = value;
    }

    public unclickable(pointer: Phaser.Input.Pointer) {
        if (pointer.y > this.scene.scale.height * 3 / 4) {
            this._clickable = false;
        }
        else {
            this._clickable = true;
        }
    }

    private _moveSpine(pointer: Phaser.Input.Pointer) {
        const playerSprite = this.player.player;
        const distance = Math.abs(playerSprite.x - pointer.x);
        const speed = PLAYER_SPEED;
        const duration = (distance / speed) * 1000;
    
        if (!PlayerSkill.playerSkill.isDoingSkill && this._clickable) {
            if (this._currentTween) {
                this._currentTween.stop();  // Stop any existing tween
            }
    
            if (pointer.x > playerSprite.x) {
                this._flipSpine(playerSprite, false, 0.3);
                (playerSprite.body as Phaser.Physics.Arcade.Body).setVelocity(speed, 0);
            } else {
                this._flipSpine(playerSprite, true, 0.3);
                (playerSprite.body as Phaser.Physics.Arcade.Body).setVelocity(-speed, 0);
            }
            playerSprite.setAnimation(0, 'walk', true);
            this._currentTween = this.scene.tweens.add({
                targets: playerSprite,
                x: pointer.x,
                ease: 'Linear',
                duration: duration,
                onUpdate: () => {
                    if (PlayerSkill.playerSkill.isDoingSkill) {
                        (playerSprite.body as Phaser.Physics.Arcade.Body).setVelocity(0);
                        this._currentTween.stop();
                    }
                },
                onComplete: () => {
                    (playerSprite.body as Phaser.Physics.Arcade.Body).setVelocity(0);
                    playerSprite.setAnimation(0, 'idle', true);
                }
            });
        }
    }
    
    private _moveLeft() {
        const playerSprite = this.player.player;
        const speed = PLAYER_SPEED;
    
        if (!PlayerSkill.playerSkill.isDoingSkill) {
            if (this._currentTween) {
                this._currentTween.stop();  // Stop any existing tween
            }
    
            this._flipSpine(playerSprite, true, 0.3);
            (playerSprite.body as Phaser.Physics.Arcade.Body).setVelocity(-speed, 0);
            playerSprite.setAnimation(0, 'walk', true);
    
            this._currentTween = this.scene.tweens.add({
                targets: playerSprite,
                x: playerSprite.x - 100, 
                ease: 'Linear',
                duration: 1000,
                onUpdate: () => {
                    if (PlayerSkill.playerSkill.isDoingSkill) {
                        (playerSprite.body as Phaser.Physics.Arcade.Body).setVelocity(0);
                        this._currentTween.stop();
                    }
                },
                onComplete: () => {
                    (playerSprite.body as Phaser.Physics.Arcade.Body).setVelocity(0);
                    playerSprite.setAnimation(0, 'idle', true);
                }
            });
        }
    }
    
    private _moveRight() {
        const playerSprite = this.player.player;
        const speed = PLAYER_SPEED;
    
        if (!PlayerSkill.playerSkill.isDoingSkill) {
            if (this._currentTween) {
                this._currentTween.stop();  // Stop any existing tween
            }
    
            this._flipSpine(playerSprite, false, 0.3);
            (playerSprite.body as Phaser.Physics.Arcade.Body).setVelocity(speed, 0);
            playerSprite.setAnimation(0, 'walk', true);
    
            this._currentTween = this.scene.tweens.add({
                targets: playerSprite,
                x: playerSprite.x + 100,  
                ease: 'Linear',
                duration: 1000,
                onUpdate: () => {
                    if (PlayerSkill.playerSkill.isDoingSkill) {
                        (playerSprite.body as Phaser.Physics.Arcade.Body).setVelocity(0);
                        this._currentTween.stop();
                    }
                },
                onComplete: () => {
                    (playerSprite.body as Phaser.Physics.Arcade.Body).setVelocity(0);
                    playerSprite.setAnimation(0, 'idle', true);
                }
            });
        }
    }

    private _flipSpine(spine: SpineGameObject, flip: boolean, scale: number) {
        const body = spine.body as Phaser.Physics.Arcade.Body;
        spine.scaleX = flip ? -scale : scale;

        if (flip) {
            body.setOffset(950, 100);
        }
        else {
            body.setOffset(450, 100);
        }
    }
}
