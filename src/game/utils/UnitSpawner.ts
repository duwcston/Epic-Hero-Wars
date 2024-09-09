import { Unit } from "../sprites/Unit";
import { Enemy } from "../sprites/Enemy";

interface IUnitSpawner extends Phaser.Physics.Arcade.Sprite {
    unitHealth: number;
    unitHealthBar: Phaser.GameObjects.Graphics;
}

export class UnitSpawner extends Unit {
    unitSpawnerButton: Phaser.GameObjects.Image;
    background: Phaser.GameObjects.Image;
    cooldown: boolean;
    cooldownTime: number;
    cooldownText: Phaser.GameObjects.Text;
    skillOnCooldown: Phaser.GameObjects.Image;
    remainingCooldown: number;
    private static _unitSpawner: UnitSpawner;

    static get unitSpawner() {
        return this._unitSpawner;
    }

    constructor(scene: Phaser.Scene, enemy: Enemy, background: Phaser.GameObjects.Image) {
        super(scene, enemy);

        UnitSpawner._unitSpawner = this;

        this.cooldown = false;
        this.background = background;
        this.cooldownTime = 5000;
        this.createUnitSpawnerButton();
        this.scene.events.on('update', this.updateUnitHealthBarsPosition, this);
    }

    private createUnitSpawnerButton() {
        this.unitSpawnerButton = this.scene.add.image(250, 650, 'unit-icon')
            .setDepth(10)
            .setScale(0.5);
        this.unitSpawnerButton.setInteractive();
        this.unitSpawnerButton.on('pointerdown', this.spawnUnit, this);
        this.createCooldownText();
    }

    private randomY() {
        return Phaser.Math.Between(this.scene.scale.height / 2 - 30, this.scene.scale.height / 2 + 100);
    }

    private spawnUnit() {
        if (this.cooldown) {
            return;
        }

        // for (let i = 0; i < 2; i++) {
        this.unit = this.scene.physics.add.sprite(0, this.randomY(), 'unit').setDepth(10);
        this.unit.anims.play('walk');
        this.unitGroup.add(this.unit);
        (this.unit as IUnitSpawner).unitHealth = this.unitMaxHealth;
        this.scene.physics.add.collider(this.unit, this.background, () => { });
        this.unitInteraction();
        this.startCooldown();

        // Create health bar for each unit and store it
        (this.unit as IUnitSpawner).unitHealthBar = this.createUnitHealthBar(this.unit);
        // }
    }

    private startCooldown() {
        this.cooldown = true;
        this.unitSpawnerButton.setTint(0x999999);
        this.remainingCooldown = this.cooldownTime + 1000;

        const cooldownInterval = this.scene.time.addEvent({
            delay: 10,
            callback: this.updateCooldown,
            callbackScope: this,
            loop: true
        });

        this.scene.time.delayedCall(this.cooldownTime, () => {
            this.cooldown = false;
            this.unitSpawnerButton.clearTint();
            this.cooldownText.setText('');
            cooldownInterval.remove(false);
        });
    }

    private createCooldownText() {
        this.cooldownText = this.scene.add.text(250, 650, '', {
            fontSize: '20px',
            color: '#ffffff',
            fontStyle: 'bold'
        }).setOrigin(0.5).setDepth(10);
    }

    private updateCooldown() {
        this.remainingCooldown -= 10;
        const displayTime = (this.remainingCooldown / 1000).toFixed(1);

        this.cooldownText.setText(displayTime);

        if (this.remainingCooldown <= 0) {
            this.cooldownText.setText('');
        }
    }

    private createUnitHealthBar(unit: Phaser.Physics.Arcade.Sprite): Phaser.GameObjects.Graphics {
        const healthBar = this.scene.add.graphics();
        const barWidth = 50;
        const barHeight = 5;
        const healthRatio = this.unitHealth / this.unitMaxHealth;

        healthBar.fillStyle(0xff0000);
        healthBar.fillRect(unit.x - barWidth / 2, unit.y - 40, barWidth * healthRatio, barHeight);

        return healthBar;
    }

    private updateUnitHealthBarsPosition() {
        // Update the position of the health bar
        this.unitGroup.getChildren().forEach((value: Phaser.GameObjects.GameObject) => {
            const unit = value as Phaser.Physics.Arcade.Sprite & IUnitSpawner;
            this.updateUnitHealthBar(unit);
        });
    }

    private updateUnitHealthBar(unit: Phaser.Physics.Arcade.Sprite) {
        const healthRatio = this.unitHealth / this.unitMaxHealth;
        const barWidth = 50;
        const barHeight = 5;

        // Clear the previous health bar
        (unit as IUnitSpawner).unitHealthBar.clear();

        // Draw the new health bar
        (unit as IUnitSpawner).unitHealthBar.fillStyle(0xff0000);
        (unit as IUnitSpawner).unitHealthBar.fillRect(unit.x - barWidth / 2, unit.y - 40, barWidth * healthRatio, barHeight);
    }

    public takeDamage(damage: number, unit: Phaser.Physics.Arcade.Sprite) {
        (unit as IUnitSpawner).unitHealth = Phaser.Math.Clamp(this.unitHealth - damage, 0, this.unitMaxHealth); // Clamp health between 0 and max
        (unit as IUnitSpawner).unitHealth = (unit as IUnitSpawner).unitHealth - damage;
        if ((unit as IUnitSpawner).unitHealth <= 0) {
            unit.anims.play('die', true);
            this.scene.physics.world.remove(unit.body); // Remove physics body
            if (unit.anims.currentAnim?.key === 'die') {
                (unit as IUnitSpawner).unitHealthBar.destroy(); // Destroy the health bar on death
                unit.setVelocityX(0); // Stop the unit from moving
                unit.setActive(false);
            }

            this.scene.time.addEvent({
                delay: 500, // Longer delay for the 'die' animation
                callback: () => {
                    this.unitGroup.remove(unit, true, true);
                },
                loop: false
            });
        }

        // Update health bar after taking damage
        // this.updateUnitHealthBar(unit);
    }
}