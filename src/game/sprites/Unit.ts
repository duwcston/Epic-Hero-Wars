import { Enemy } from "./Enemy";
export class Unit {
    scene: Phaser.Scene;
    unit: Phaser.Physics.Arcade.Sprite;
    enemy: Enemy;
    protected unitGroup: Phaser.Physics.Arcade.Group;

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
                        const distance = Phaser.Math.Distance.Between(unit.x, unit.y, this.enemy.enemy.x, this.enemy.enemy.y);
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
    }

    protected followEnemy(unit: Phaser.GameObjects.GameObject, speed: number) {
        this.scene.physics.moveToObject(unit, this.enemy.enemy as unknown as Phaser.Physics.Arcade.Sprite, speed);
    }
}