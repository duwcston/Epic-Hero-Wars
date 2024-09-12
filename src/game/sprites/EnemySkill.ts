import { Enemy } from "./Enemy";
import { Player } from "./Player";
import { PlayerHealth } from "./PlayerHealth";
import { Unit } from "./Unit";
import { UnitSpawner } from "../utils/UnitSpawner";
import { EnemyHealth } from "./EnemyHealth";

export class EnemySkill {
    scene: Phaser.Scene;
    enemy: Enemy;
    player: Player;
    playerHealth: PlayerHealth;
    enemyHealth: EnemyHealth;
    speed: number;
    enemyIsCastingSkill: boolean = false;
    unit: Unit;
    unitSpawner: UnitSpawner;

    constructor(scene: Phaser.Scene, enemy: Enemy, player: Player, playerHealth: PlayerHealth, unit: Unit, unitSpawner: UnitSpawner, enemyHealth: EnemyHealth) {
        this.scene = scene;
        this.enemy = enemy;
        this.player = player;
        this.playerHealth = playerHealth;
        this.unit = unit;
        this.unitSpawner = unitSpawner;
        this.enemyHealth = enemyHealth
        this.startAI();
    }

    public startAI() {
        this._action();
    }

    private _action() {
        if (this.enemyIsCastingSkill) {
            (this.enemy.enemy.body as Phaser.Physics.Arcade.Body).setVelocityX(0);
            return;
        }
        console.log('randomly move');
        this._randomlyMove();
    }

    private _randomlyMove() {
        const body = this.enemy.enemy.body as Phaser.Physics.Arcade.Body;

        this.speed = Phaser.Math.Between(100, 200);
        body.setVelocityX(this.player.player.x > this.enemy.enemy.x ? this.speed : -this.speed);
        this.scene.physics.moveToObject(this.enemy.enemy as unknown as Phaser.Physics.Arcade.Image, this.player.player as unknown as Phaser.Physics.Arcade.Image, this.speed);
        const moveDuration = Phaser.Math.Between(1000, 2000);

        this.enemy.enemy.setAnimation(0, 'walk', true);

        if (this.player.player.x > this.enemy.enemy.x) {
            this._flipSpine(false, 1);
        } else {
            this._flipSpine(true, 1);
        }

        this.scene.time.addEvent({
            delay: moveDuration,
            callback: () => {
                body.setVelocityX(0);
                this.enemy.enemy.setAnimation(0, 'idle', true);

                this.scene.time.addEvent({
                    delay: Phaser.Math.Between(3000, 5000),
                    callback: () => {
                        if (Phaser.Math.Between(0, 1) === 0) {
                            console.log('randomly cast skill');
                            this._randomlyCastSkill();
                            // this.scene.time.addEvent({
                            //     delay: 2000,
                            //     callback: () => {
                            //         this._action();
                            //     }
                            // });
                            // this._action();
                        } else {
                            this._action();
                        }
                    }
                });
            }
        });
    }

    private _flipSpine(flip: boolean, scale: number) {
        const body = this.enemy.enemy.body as Phaser.Physics.Arcade.Body;
        body.setSize(150, 150);
        this.enemy.enemy.scaleX = flip ? -scale : scale;

        if (flip) {
            body.setOffset(200, 50);
        } else {
            body.setOffset(50, 50);
        }
    }

    private _randomlyCastSkill() {
        const skills = ['attack', 'skill2'];
        const randomSkill = Phaser.Utils.Array.GetRandom(skills);
        this.enemy.enemy.setAnimation(0, randomSkill, false);
        this.enemyIsCastingSkill = true;
    
        if (randomSkill === 'attack') {
            if (this.enemy.enemy.x > this.player.player.x) {
                this._flipSpine(true, 1);
            } else {
                this._flipSpine(false, 1);
            }
            this._shootFireballContinuously(3, 500);
    
            this.scene.time.addEvent({
                delay: 2500,
                callback: () => {
                    this._endSkillCast();
                }
            });
        }
    
        if (randomSkill === 'skill2') {
            this.skill2();
    
            this.scene.time.addEvent({
                delay: 2500,
                callback: () => {
                    this._endSkillCast();
                }
            });
        }
    }
    
    private _endSkillCast() {
        this.enemyIsCastingSkill = false;
        this.enemy.enemy.setAnimation(0, 'idle', true);
        this.scene.time.addEvent({
            delay: 2000,
            callback: () => {
                this._action();
            }
        });
        // Add any additional logic here to ensure the enemy can perform actions again
    }

    private _shootFireballContinuously(count: number, interval: number) {
        let shotsFired = 0;

        const shootEvent = this.scene.time.addEvent({
            delay: interval,
            callback: () => {
                this._shootFireball();
                shotsFired++;

                if (shotsFired >= count) {
                    shootEvent.remove();
                }
            },
            repeat: count - 1
        });
    }

    private _shootFireball() {
        const fireball = this.scene.physics.add.sprite(this.enemy.enemy.x, this.enemy.enemy.y - 100, 'attack_shoot')
            .setScale(0.5)
            .setDepth(20);
        if (this.enemy.enemy.x > this.player.player.x) {
            // this._flipSpine(true, 1);
            fireball.setVelocityX(-500);
        }
        else {
            // this._flipSpine(false, 1);
            fireball.setVelocityX(500);
        }

        this.scene.physics.add.overlap(fireball, this.player.player as unknown as Phaser.Physics.Arcade.Image, () => {
            this.playerHealth.playerTakeDamage(1000);
            fireball.destroy();
        });

        this.scene.physics.add.overlap(fireball, this.unitSpawner.unitGroup as unknown as Phaser.Physics.Arcade.Image, this.handleUnitOverlap, undefined, this);

        const explodeFireball = () => {
            fireball.destroy();
            const explosion = this.scene.add.sprite(fireball.x, fireball.y, 'attack_explode')
                .setDepth(20);

            const explosionHitbox = this.scene.add.rectangle(explosion.x, explosion.y, 100, 100);
            this.scene.physics.add.existing(explosionHitbox);

            this.scene.time.addEvent({
                delay: 100,
                callback: () => {
                    explosionHitbox.destroy();
                    explosion.destroy();
                }
            });

            this.scene.physics.add.overlap(explosionHitbox, this.player.player as unknown as Phaser.Physics.Arcade.Image, () => {
                this.playerHealth.playerTakeDamage(2000);
            });

            this.scene.physics.add.overlap(explosionHitbox, this.unitSpawner.unitGroup as unknown as Phaser.Physics.Arcade.Image, this.handleUnitOverlap, undefined, this);
        };

        this.scene.time.addEvent({
            delay: 1000,
            callback: () => {
                explodeFireball();
            }
        });
    }

    private skill2() {
        const skill2 = this.scene.physics.add.sprite(this.enemy.enemy.x, this.enemy.enemy.y - 100, 'skill2')
            .setScale(0.5)
            .setDepth(20);
        if (this.enemy.enemy.x > this.player.player.x) {
            this._flipSpine(true, 1);
            skill2.setVelocityX(-400);
        }
        else {
            this._flipSpine(false, 1);
            skill2.setVelocityX(400);
        }
        skill2.anims.play('skill2');

        this.scene.physics.add.overlap(skill2, this.player.player as unknown as Phaser.Physics.Arcade.Image, () => {
            this.playerHealth.playerTakeDamage(10000);
            skill2.destroy();
        });

        this.scene.physics.add.overlap(skill2, this.unitSpawner.unitGroup as unknown as Phaser.Physics.Arcade.Image, this.handleUnitOverlap, undefined, this);

        this.scene.time.addEvent({
            delay: 2000,
            callback: () => {
                skill2.destroy();
            }
        });
    }

    private handleUnitOverlap(_explosionHitbox: Phaser.GameObjects.GameObject, unit: Unit) {
        this.unitSpawner.takeDamage(100, unit as unknown as Phaser.Physics.Arcade.Sprite);
    }
}
