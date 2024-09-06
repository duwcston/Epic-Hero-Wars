import { UnitEnemy } from "../sprites/UnitEnemy";
import { Player } from "../sprites/Player";

export class UnitEnemySpawner extends UnitEnemy {
    background: Phaser.GameObjects.Image;
    cooldown: boolean;
    cooldownTime: number;
    remainingCooldown: number;
    unitEnemyHealthBars: { unitEnemy: Phaser.Physics.Arcade.Sprite, healthBar: Phaser.GameObjects.Image }[] = [];
    private _unitEnemyCounter: number = 0;

    constructor(scene: Phaser.Scene, player: Player, background: Phaser.GameObjects.Image, cooldownTime: number = 3000) {
        super(scene, player);
        this.background = background;
        this.cooldownTime = cooldownTime;
        this.startSpawningEnemies(); // Automatically start the spawning process
        this.scene.events.on('update', this.updateUnitEnemyHealthBars, this);  // Listen to the update event
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
        // for (let i = 0; i < 2; i++) {
        this.unitEnemy = this.scene.physics.add.sprite(this.scene.scale.width, this.randomY(), 'unit'); // Spawn player units
        this.unitEnemy.setFlipX(true);
        this.unitEnemy.anims.play('walk');
        this.unitEnemyGroup.add(this.unitEnemy);
        this.unitEnemyHealth = this.unitEnemyMaxHealth;
        this.scene.physics.add.collider(this.unitEnemy, this.background, () => { });
        this.unitEnemyInteraction(); // Handle interaction with players

        const healthBar = this.createUnitEnemyHealthBar(this.unitEnemy);
        this.unitEnemyHealthBars.push({ unitEnemy: this.unitEnemy, healthBar });
        // }
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

    private createUnitEnemyHealthBar(unit: Phaser.Physics.Arcade.Sprite): Phaser.GameObjects.Image {
        return this.scene.add.image(unit.x, unit.y, 'health2_full').setDepth(10).setScale(0.2, 0.4);
    }

    private updateUnitEnemyHealthBars() {
        // Update the position of each health bar to match its unit's position
        this.unitEnemyHealthBars.forEach(pair => {
            pair.healthBar.setPosition(pair.unitEnemy.x, pair.unitEnemy.y - 40);
        });
    }

    public takeDamage(damage: number, unitEnemy: Phaser.Physics.Arcade.Sprite) {
        this.unitEnemyHealth -= damage;

        if (this.unitEnemyHealth <= 0) {
            // Only affect the specific unit that took damage
            unitEnemy.anims.play('die', true);
            // Get the current anims
            if (unitEnemy.anims.currentAnim?.key === 'die') {
                this.unitEnemyHealthBars.forEach(bar => {
                    bar.healthBar.destroy();
                });
                unitEnemy.setVelocityX(0); // Stop the unit from moving
            }

            // Delay the destruction of this specific unit after the 'die' animation
            this.scene.time.addEvent({
                delay: 3000, // Longer delay for the 'die' animation
                callback: () => {
                    // unitEnemy.destroy();
                    this.unitEnemyGroup.remove(unitEnemy, true, true);
                    this._unitEnemyCounter--;
                },
                loop: false
            });
        }
    }

}
