import { Unit } from "../sprites/Unit";
import { Enemy } from "../sprites/Enemy";

export class UnitSpawner extends Unit {
    unitSpawnerButton: Phaser.GameObjects.Image;
    background: Phaser.GameObjects.Image;
    cooldown: boolean;
    cooldownTime: number;
    cooldownText: Phaser.GameObjects.Text;
    skillOnCooldown: Phaser.GameObjects.Image;
    remainingCooldown: number;
    unitHealthBars: { unit: Phaser.Physics.Arcade.Sprite, healthBar: Phaser.GameObjects.Image }[] = [];

    constructor(scene: Phaser.Scene, enemy: Enemy, background: Phaser.GameObjects.Image) {
        super(scene, enemy);
        this.cooldown = false;
        this.background = background;
        this.cooldownTime = 2000;
        this.createUnitSpawnerButton();
        this.scene.events.on('update', this.updateUnitHealthBars, this);
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

        for (let i = 0; i < 2; i++) {
            this.unit = this.scene.physics.add.sprite(0, this.randomY(), 'unit').setDepth(10);
            this.unit.anims.play('walk');
            this.unitGroup.add(this.unit);
            this.unitHealth = this.unitMaxHealth;
            this.scene.physics.add.collider(this.unit, this.background, () => { });
            this.unitInteraction();
            this.startCooldown();

            // Create health bar for each unit and store it
            const healthBar = this.createUnitHealthBar(this.unit);
            this.unitHealthBars.push({ unit: this.unit, healthBar });
        }
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

    private createUnitHealthBar(unit: Phaser.Physics.Arcade.Sprite): Phaser.GameObjects.Image {
        return this.scene.add.image(unit.x, unit.y, 'health_full').setDepth(10).setScale(0.2, 0.4);
    }

    private updateUnitHealthBars() {
        // Update the position of each health bar to match its unit's position
        this.unitHealthBars.forEach(pair => {
            pair.healthBar.setPosition(pair.unit.x, pair.unit.y - 40);
        });
    }

    public takeDamage(damage: number, unit: Phaser.Physics.Arcade.Sprite) {
        this.unitHealth -= damage;

        if (this.unitHealth <= 0) {
            // Only affect the specific unit that took damage
            unit.anims.play('die', true);
            // Get the current anims
            if (unit.anims.currentAnim?.key === 'die') {
                this.unitHealthBars.forEach(bar => {
                    bar.healthBar.destroy();
                });
                unit.setVelocityX(0); // Stop the unit from moving
            }

            // Delay the destruction of this specific unit after the 'die' animation
            this.scene.time.addEvent({
                delay: 3000, // Longer delay for the 'die' animation
                callback: () => {
                    // unit.destroy();
                    this.unitGroup.remove(unit, true, true);
                },
                loop: false
            });
        }
    }
}