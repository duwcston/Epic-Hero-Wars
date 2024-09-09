import { UnitEnemySpawner } from "../utils/UnitEnemySpawner";
import { Enemy } from "./Enemy";
import { EnemyHealth } from "./EnemyHealth";
import { UnitEnemy } from "./UnitEnemy";

interface IUnit extends Phaser.Physics.Arcade.Sprite {
    unitHealth: number;
}
export class Unit {
    scene: Phaser.Scene;
    unit: Phaser.Physics.Arcade.Sprite;
    enemy: Enemy;
    private static _unit: Unit;
    public unitGroup: Phaser.Physics.Arcade.Group;
    protected unitMaxHealth: number = 30;
    protected unitHealth: number = this.unitMaxHealth;
    protected unitDamage: number = 10;
    protected unitDamageOverlay: Phaser.GameObjects.Text;

    static get unit() {
        return this._unit;
    }

    constructor(scene: Phaser.Scene, enemy: Enemy) {
        Unit._unit = this;

        this.scene = scene;
        this.unitGroup = this.scene.physics.add.group({
            maxSize: 10,
            runChildUpdate: true
        });
        this.enemy = enemy;
    }

    protected unitInteraction() {
        this.scene.time.addEvent({
            delay: 500,
            callback: () => {
                const units = this.unitGroup.getChildren();
                units.forEach((unit) => {
                    if ((unit as IUnit).unitHealth > 0) {
                        if (unit && this.enemy.enemy) {
                            this.scene.physics.add.overlap(unit, UnitEnemySpawner.unitEnemySpawner.unitEnemyGroup, () => {
                                this.attackUnitEnemy(unit);
                            });
                            const distance = Phaser.Math.Distance.Between((unit as unknown as Phaser.Physics.Arcade.Sprite).x, (unit as unknown as Phaser.Physics.Arcade.Sprite).y, this.enemy.enemy.x, this.enemy.enemy.y);
                            if (distance < 100) {
                                this.attackEnemy(unit);
                            }
                            else {
                                (unit as unknown as Phaser.Physics.Arcade.Sprite).setFlip((unit as unknown as Phaser.Physics.Arcade.Sprite).x < this.enemy.enemy.x ? false : true, false);
                                this.followEnemy(unit, 100);
                            }
                        }
                        else {
                            (unit as unknown as Phaser.Physics.Arcade.Sprite).anims.play('walk', true);
                            (unit as unknown as Phaser.Physics.Arcade.Sprite).setFlip((unit as unknown as Phaser.Physics.Arcade.Sprite).x < this.enemy.enemy.x ? false : true, false);
                            this.followEnemy(unit, 100);
                        }
                    }
                });
            },
            loop: true
        });
    }

    private attackEnemy(unit: Phaser.GameObjects.GameObject) {
        (unit as unknown as Phaser.Physics.Arcade.Sprite).setVelocity(0);
        (unit as unknown as Phaser.Physics.Arcade.Sprite).anims.play('attack', true);
        this.scene.time.addEvent({
            delay: 500,
            callback: () => {
                if (this.enemy.enemy) {
                    EnemyHealth.enemyHealth.takeDamage(this.unitDamage);
                    this.showDamageOverlay();
                }
            },
            loop: false
        });
    }

    private attackUnitEnemy(unit: Phaser.GameObjects.GameObject) {
        (unit as unknown as Phaser.Physics.Arcade.Sprite).setVelocity(0);
        (unit as unknown as Phaser.Physics.Arcade.Sprite).anims.play('attack', true);
        this.scene.time.addEvent({
            delay: 500,
            callback: () => {
                UnitEnemySpawner.unitEnemySpawner.takeDamage(this.unitDamage, UnitEnemy.unitEnemy as unknown as Phaser.Physics.Arcade.Sprite);
            },
            loop: false
        });
    }

    private followEnemy(unit: Phaser.GameObjects.GameObject, speed: number) {
        this.scene.physics.moveToObject(unit, this.enemy.enemy as unknown as Phaser.Physics.Arcade.Sprite, speed);
    }

    private showDamageOverlay() {
        this.unitDamageOverlay = this.scene.add.text(this.enemy.enemy.x, this.enemy.enemy.y - 50, `${this.unitDamage}`, {
            fontSize: '24px',
            color: '#ff0000',
            stroke: '#000000',
            strokeThickness: 4,
        });

        this.scene.tweens.add({
            targets: this.unitDamageOverlay,
            y: this.enemy.enemy.y - 100,
            alpha: 0,
            duration: 1000,
            ease: 'Linear',
            onComplete: () => {
                this.unitDamageOverlay.destroy();
            }
        });
    }
}