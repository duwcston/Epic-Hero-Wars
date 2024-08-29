import { Controller } from '../utils/Controller';
import { Player } from './Player';
import { Enemy } from './Enemy';
import { EnemyHealth } from './EnemyHealth';

export class PlayerSkill {
    scene: Phaser.Scene;
    player: Player;
    enemy: Enemy;
    enemyHealth: EnemyHealth;
    playerSkillI1: Phaser.GameObjects.Image;
    playerSkillI2: Phaser.GameObjects.Image;
    playerSkillI3: Phaser.GameObjects.Image;
    playerSkillI4: Phaser.GameObjects.Image;
    hitbox: Phaser.Types.Physics.Arcade.ImageWithDynamicBody; // Create each hitbox for each skill
    damageOverlay: Phaser.GameObjects.Text;

    private static _playerSkill: PlayerSkill;
    private _isDoingSkill: boolean = false;
    private _attackDamage: number = 1553;
    private _skill1Damage: number = 2500;
    private _skill2Damage: number = 1153;
    private _skill4Damage: number = 1800;
    private _hitEnemy: boolean = false;

    static get playerSkill() {
        return this._playerSkill;
    }

    constructor(scene: Phaser.Scene, player: Player, enemy: Enemy, enemyHealth: EnemyHealth) {
        PlayerSkill._playerSkill = this;

        this.scene = scene;
        this.player = player;
        this.enemy = enemy;
        this.enemyHealth = enemyHealth;
        this.createSkill();
        this.setupSkillInput();
    }

    get isDoingSkill() {
        return this._isDoingSkill;
    }

    set isDoingSkill(value: boolean) {
        this._isDoingSkill = value;
    }

    get attackDamage() {
        return this._attackDamage;
    }

    get skill1Damage() {
        return this._skill1Damage;
    }

    get skill2Damage() {
        return this._skill2Damage;
    }

    get skill4Damage() {
        return this._skill4Damage;
    }

    get hitEnemy() {
        return this._hitEnemy;
    }

    private createSkill() {
        this.playerSkillI1 = this.scene.add.image(this.scene.scale.width - 140, this.scene.scale.height - 125, 'michael_s1')
            .setDepth(10)
            .setScale(0.55);
        this.playerSkillI2 = this.scene.add.image(this.scene.scale.width - 60, this.scene.scale.height - 125, 'michael_s2')
            .setDepth(10)
            .setScale(0.55);
        this.playerSkillI3 = this.scene.add.image(this.scene.scale.width - 140, this.scene.scale.height - 50, 'michael_s3')
            .setDepth(10)
            .setScale(0.55);
        this.playerSkillI4 = this.scene.add.image(this.scene.scale.width - 60, this.scene.scale.height - 50, 'michael_s4')
            .setDepth(10)
            .setScale(0.55);
    }

    private setupSkillInput() {
        this.playerSkillI1.setInteractive().on('pointerdown', () => this.playSkillAnimation('attack')); // 300
        this.playerSkillI2.setInteractive().on('pointerdown', () => this.playSkillAnimation('skill1')); // 800
        this.playerSkillI3.setInteractive().on('pointerdown', () => this.playSkillAnimation('skill2')); // 1000
        this.playerSkillI4.setInteractive().on('pointerdown', () => this.playSkillAnimation('skill4')); // 1500
    }

    private playSkillAnimation(skill: string) {
        this.disablePlayerMovement();
        this.disableSkillButtons();
        this._isDoingSkill = true;
        this.player.player.setAnimation(0, skill, false, true);

        // Define delay times for each skill
        const skillDelays: { [key: string]: number } = {
            'attack': 300,
            'skill1': 800,
            'skill2': 1000,
            'skill4': 1500
        };

        const delay = skillDelays[skill] || 0; // Default to 0 if skill not found

        this.scene.time.delayedCall(delay, () => {
            this.createHitbox(skill);
            this.updateHitboxPosition(skill);
            this.hitbox.body.enable = true;
            this.scene.physics.world.add(this.hitbox.body);

            this.scene.time.delayedCall(100, () => {
                this.hitbox.body.enable = false;
                this.scene.physics.world.remove(this.hitbox.body);
                this.hitbox.destroy();
            });

            // Disable and remove the hitbox after some time
            this.scene.time.delayedCall(800, () => {
                // this.hitbox.body.enable = false;
                // this.scene.physics.world.remove(this.hitbox.body);
                // this.hitbox.destroy();
                this.enablePlayerMovement();
                this.enableSkillButtons();
                this._isDoingSkill = false;
            });
        });
        this.player.player.addAnimation(0, 'idle', true);
    }

    private createHitbox(skill: string) {
        const baseX = 0;
        const baseY = 0;
        let width = 50;
        let height = 50;
        let color = 0xffffff;
        const alpha = 0.5;

        switch (skill) {
            case 'attack':
                width = 370;
                height = 50;
                color = 0xff0000; // Red for attack
                this.hitbox = this.scene.add.rectangle(baseX, baseY, width, height, color, alpha) as unknown as Phaser.Types.Physics.Arcade.ImageWithDynamicBody;
                this.scene.physics.add.existing(this.hitbox);
                this.hitbox.setVisible(true);
                this.hitbox.body.enable = true;

                // Set a timer to create a new hitbox and remove the previous one
                this.scene.time.delayedCall(500, () => {
                    this.hitbox.destroy();
                    const newWidth = 350;
                    const newHeight = 50;
                    const newColor = 0xff00ff; // Magenta for the new hitbox
                    this.hitbox = this.scene.add.rectangle(baseX + 50, baseY + 50, newWidth, newHeight, newColor, alpha) as unknown as Phaser.Types.Physics.Arcade.ImageWithDynamicBody;
                    this.scene.physics.add.existing(this.hitbox);
                    this.hitbox.setVisible(true);
                    this.hitbox.body.enable = true;
                    this.updateHitboxPosition('attack_phase2');
                });
                break;
            case 'skill1':
                width = 700;
                height = 50;
                color = 0x00ff00; // Green for skill1
                this.hitbox = this.scene.add.rectangle(baseX, baseY, width, height, color, alpha) as unknown as Phaser.Types.Physics.Arcade.ImageWithDynamicBody;
                break;
            case 'skill2':
                width = 150;
                height = 100;
                color = 0x0000ff; // Blue for skill2
                this.hitbox = this.scene.add.rectangle(baseX, baseY, width, height, color, alpha) as unknown as Phaser.Types.Physics.Arcade.ImageWithDynamicBody;
                break;
            case 'skill4':
                width = 100;
                height = 100;
                color = 0xffff00; // Yellow for skill4
                this.hitbox = this.scene.add.rectangle(baseX, baseY, width, height, color, alpha) as unknown as Phaser.Types.Physics.Arcade.ImageWithDynamicBody;
                break;
            default:
                break;
        }
        this.scene.physics.add.existing(this.hitbox);
        this.hitbox.setVisible(true);
        this.hitbox.body.enable = true;

        // Set hitbox overlap callback
        this.scene.physics.add.overlap(this.hitbox, this.enemy.enemy as unknown as Phaser.GameObjects.GameObject, this.handleHitboxEnemyOverlap, undefined, this);
    }

    private updateHitboxPosition(skill: string) {
        let offsetX = 0;
        let offsetY = 0;
        switch (skill) {
            case 'attack':
                offsetX = this.player.player.scaleX > 0 ? 300 : -300;
                offsetY = -80;
                break;
            case 'attack_phase2':
                offsetX = this.player.player.scaleX > 0 ? 320 : -320;
                offsetY = -10;
                break;
            case 'skill1':
                offsetX = this.player.player.scaleX > 0 ? 400 : -400;
                offsetY = -25;
                break;
            case 'skill2':
                offsetX = this.player.player.scaleX > 0 ? 550 : -550;
                offsetY = -50;
                break;
            case 'skill4':
                offsetX = this.player.player.scaleX > 0 ? 130 : -130;
                offsetY = -50
                break;
            default:
                break;
        }

        this.hitbox.setPosition(
            this.player.player.x + offsetX,
            this.player.player.y + offsetY,
        );
    }

    private disablePlayerMovement() {
        // Implement logic to disable player movement controls
        (this.player.player.body as unknown as Phaser.Physics.Arcade.Body).moves = false;
        Controller.playerController.clickable = false;
    }

    private enablePlayerMovement() {
        // Implement logic to enable player movement controls
        (this.player.player.body as unknown as Phaser.Physics.Arcade.Body).moves = true;
        Controller.playerController.clickable = true;
    }

    private disableSkillButtons() {
        // Disable interactive state of skill buttons
        this.playerSkillI1.disableInteractive().setTint(0x999999);
        this.playerSkillI2.disableInteractive().setTint(0x999999);
        this.playerSkillI3.disableInteractive().setTint(0x999999);
        this.playerSkillI4.disableInteractive().setTint(0x999999);
    }

    private enableSkillButtons() {
        // Enable interactive state of skill buttons
        this.playerSkillI1.setInteractive().clearTint();
        this.playerSkillI2.setInteractive().clearTint();
        this.playerSkillI3.setInteractive().clearTint();
        this.playerSkillI4.setInteractive().clearTint();
    }

    // Fix this to handle the skill damage
    private handleHitboxEnemyOverlap(hitbox: Phaser.Types.Physics.Arcade.ImageWithDynamicBody, enemy: Enemy, skill: string) {
        if (!this._hitEnemy) {
            this._hitEnemy = true;
            this.applyDamage(skill);
            this.showDamageOverlay(skill);
        }
    }

    private applyDamage(skill: string) {
        // Apply damage to the enemy based on the skill used
        switch (skill) {
            case 'attack':
                EnemyHealth.enemyHealth.takeDamage(this._attackDamage);
                break;
            case 'skill1':
                EnemyHealth.enemyHealth.takeDamage(this._skill1Damage);
                break;
            case 'skill2':
                EnemyHealth.enemyHealth.takeDamage(this._skill2Damage);
                break;
            case 'skill4':
                EnemyHealth.enemyHealth.takeDamage(this._skill4Damage);
                break;
            default:
                break;
        }
    }

    private showDamageOverlay(skill: string) {
        this.damageOverlay = this.scene.add.text(this.enemy.enemy.x, this.enemy.enemy.y - 200, `this._${skill}Damage`.toString(), {
            fontSize: '24px',
            color: '#ff0000',
            stroke: '#000000',
            strokeThickness: 4,
        }).setOrigin(0.5, 0.5).setDepth(10);

        // Fade out the overlay after a short period
        this.scene.tweens.add({
            targets: this.damageOverlay,
            alpha: 0,
            duration: 500,
            onComplete: () => {
                this._hitEnemy = false; // Reset for future overlaps
            },
        });
    }
}
