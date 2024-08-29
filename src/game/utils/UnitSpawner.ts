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

    constructor(scene: Phaser.Scene, enemy: Enemy, background: Phaser.GameObjects.Image) {
        super(scene, enemy);
        this.cooldown = false;
        this.background = background;
        this.cooldownTime = 2000;
        this.createUnitSpawnerButton();
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

    protected spawnUnit() {
        if (this.cooldown) {
            return;
        }

        for (let i = 0; i < 2; i++) {
            this.unit = this.scene.physics.add.sprite(0, this.randomY(), 'unit').setDepth(10);
            this.unit.anims.play('walk');
            this.unitGroup.add(this.unit);
            this.scene.physics.add.collider(this.unit, this.background, () => { });
            this.unitInteraction();
            this.startCooldown();
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
}