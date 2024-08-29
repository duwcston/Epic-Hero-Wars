import { Enemy } from "./Enemy";
import { EnemyHealth } from "./EnemyHealth";
export class Unit {
    scene: Phaser.Scene;
    unit: Phaser.Physics.Arcade.Sprite;
    enemy: Enemy;
    protected unitGroup: Phaser.Physics.Arcade.Group;
    protected unitMaxHealth: number = 100;
    protected unitHealth: number = this.unitMaxHealth;
    protected unitDamage: number = 10;

    constructor(scene: Phaser.Scene, enemy: Enemy) {
        this.scene = scene;
        this.unitGroup = this.scene.physics.add.group();
        this.enemy = enemy;
    }

    protected unitInteraction() {
        this.scene.time.addEvent({
            delay: 500,
            callback: () => {
                const units = this.unitGroup.getChildren();
                units.forEach((unit) => {
                    if (unit && this.enemy.enemy) {
                        const distance = Phaser.Math.Distance.Between((unit as unknown as Phaser.Physics.Arcade.Sprite).x, (unit as unknown as Phaser.Physics.Arcade.Sprite).y, this.enemy.enemy.x, this.enemy.enemy.y);
                        if (distance < 100) {
                            this.attackEnemy(unit);
                        }
                        else {
                            this.followEnemy(unit, 100);
                        }
                    }
                });
            },
            loop: true
        });
    }

    protected attackEnemy(unit: Phaser.GameObjects.GameObject) {
        (unit as unknown as Phaser.Physics.Arcade.Sprite).setVelocity(0);
        (unit as unknown as Phaser.Physics.Arcade.Sprite).anims.play('attack', true);
        this.scene.time.addEvent({
            delay: 500,
            callback: () => {
                if (this.enemy.enemy) {
                    EnemyHealth.enemyHealth.takeDamage(this.unitDamage);
                }
            },
            loop: false
        });
    }

    protected followEnemy(unit: Phaser.GameObjects.GameObject, speed: number) {
        this.scene.physics.moveToObject(unit, this.enemy.enemy as unknown as Phaser.Physics.Arcade.Sprite, speed);
    }
}