import { UnitEnemy } from "../sprites/UnitEnemy";
import { Player } from "../sprites/Player";

interface IUnitEnemySpawner extends Phaser.Physics.Arcade.Sprite {
    unitEnemyHealth: number;
    unitEnemyHealthBar: Phaser.GameObjects.Graphics;
}

export class UnitEnemySpawner extends UnitEnemy {
    background: Phaser.GameObjects.Image;
    cooldown: boolean;
    cooldownTime: number;
    remainingCooldown: number;
    private _unitEnemyCounter: number = 0;
    private static _unitEnemySpawner: UnitEnemySpawner;

    static get unitEnemySpawner() {
        return this._unitEnemySpawner;
    }

    constructor(scene: Phaser.Scene, player: Player, background: Phaser.GameObjects.Image, cooldownTime: number = 3000) {
        super(scene, player);

        UnitEnemySpawner._unitEnemySpawner = this;

        this.background = background;
        this.cooldownTime = cooldownTime;
        this.startSpawningEnemies(); // Automatically start the spawning process
        this.scene.events.on('update', this.updateUnitEnemyHealthBarsPosition, this);  // Listen to the update event
    }

    private randomY() {
        return Phaser.Math.Between(this.scene.scale.height / 2 - 30, this.scene.scale.height / 2 + 100);
    }

    // Automatically spawns enemies at regular intervals
    private startSpawningEnemies() {
        const spawner = this.scene.time.addEvent({
            delay: this.cooldownTime, // Delay between spawns
            callback: () => {
                if (!this.cooldown) {
                    this.spawnEnemies();
                    this.startCooldown(); // Start cooldown after spawning
                }
                if (this._unitEnemyCounter >= 10) {
                    spawner.remove(); // Stop spawning after 10 units
                }
            },
            loop: true // Repeats the spawning indefinitely
        });
    }

    // Spawns 2 player units
    private spawnEnemies() {
        this.unitEnemy = this.scene.physics.add.sprite(this.scene.scale.width, this.randomY(), 'unit'); // Spawn player units
        this.unitEnemy.setFlipX(true);
        this.unitEnemy.anims.play('walk');
        (this.unitEnemy as IUnitEnemySpawner).unitEnemyHealth = this.unitEnemyMaxHealth;
        this.unitEnemyGroup.add(this.unitEnemy);
        this.scene.physics.add.collider(this.unitEnemy, this.background, () => { });
        this.unitEnemyInteraction(); // Handle interaction with players

        // Assign the health bar directly to the unitEnemy
        (this.unitEnemy as IUnitEnemySpawner).unitEnemyHealthBar = this.createUnitEnemyHealthBar(this.unitEnemy);
        this._unitEnemyCounter += 1;
    }

    private startCooldown() {
        this.cooldown = true;
        this.remainingCooldown = this.cooldownTime;

        this.scene.time.addEvent({
            delay: 1000, // Update cooldown every second
            callback: () => {
                this.remainingCooldown -= 1000;
                if (this.remainingCooldown <= 0) {
                    this.cooldown = false;
                }
            },
            repeat: this.cooldownTime / 1000 - 1
        });
    }

    // Creates a health bar for the specific unitEnemy
    private createUnitEnemyHealthBar(unitEnemy: Phaser.Physics.Arcade.Sprite): Phaser.GameObjects.Graphics {
        const healthBar = this.scene.add.graphics();
        const barWidth = 50;
        const barHeight = 5;
        const healthRatio = this.unitEnemyHealth / this.unitEnemyMaxHealth;
        // healthBar.fillRect(unitEnemy.x - barWidth / 2, unitEnemy.y - 40, barWidth, barHeight);

        healthBar.fillStyle(0xffff00); // Current health (green)
        healthBar.fillRect(unitEnemy.x - barWidth / 2, unitEnemy.y - 40, barWidth * healthRatio, barHeight);

        return healthBar;
    }

    // Updates the position and visual status of the health bar
    private updateUnitEnemyHealthBarsPosition() {
        // Update the position of the health bar
        this.unitEnemyGroup.getChildren().forEach((value: Phaser.GameObjects.GameObject) => {
            const unitEnemy = value as Phaser.Physics.Arcade.Sprite & IUnitEnemySpawner;
            this.updateUnitEnemyHealthBar(unitEnemy);
        });
    }

    private updateUnitEnemyHealthBar(unitEnemy: Phaser.Physics.Arcade.Sprite) {
        const healthRatio = this.unitEnemyHealth / this.unitEnemyMaxHealth;
        const barWidth = 50;
        const barHeight = 5;

        // Clear the previous health bar
        (unitEnemy as IUnitEnemySpawner).unitEnemyHealthBar.clear();

        // Draw the new health bar
        (unitEnemy as IUnitEnemySpawner).unitEnemyHealthBar.fillStyle(0xffff00);
        (unitEnemy as IUnitEnemySpawner).unitEnemyHealthBar.fillRect(unitEnemy.x - barWidth / 2, unitEnemy.y - 40, barWidth * healthRatio, barHeight);
    }

    // Apply damage and update health
    public takeDamage(damage: number, unitEnemy: Phaser.Physics.Arcade.Sprite) {
        (unitEnemy as IUnitEnemySpawner).unitEnemyHealth = Phaser.Math.Clamp(this.unitEnemyHealth - damage, 0, this.unitEnemyMaxHealth); // Clamp health between 0 and max
        (unitEnemy as IUnitEnemySpawner).unitEnemyHealth = (unitEnemy as IUnitEnemySpawner).unitEnemyHealth - damage;
        if ((unitEnemy as IUnitEnemySpawner).unitEnemyHealth <= 0) {
            unitEnemy.anims.play('die', true);
            this.scene.physics.world.remove(unitEnemy.body); // Remove physics body
            if (unitEnemy.anims.currentAnim?.key === 'die') {
                (unitEnemy as IUnitEnemySpawner).unitEnemyHealthBar.destroy(); // Destroy the health bar on death
                unitEnemy.setVelocityX(0); // Stop the unit from moving
            }

            this.scene.time.addEvent({
                delay: 500, // Longer delay for the 'die' animation
                callback: () => {
                    this.unitEnemyGroup.remove(unitEnemy, true, true);
                    this._unitEnemyCounter--;
                },
                loop: false
            });
        }

        // Update health bar after taking damage
        // this.updateUnitEnemyHealthBar(unitEnemy);
    }
}
