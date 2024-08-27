import { Player } from './Player';
export class PlayerSkill {
    scene: Phaser.Scene;
    player: Player;
    playerSkillI1: Phaser.GameObjects.Image;
    playerSkillI2: Phaser.GameObjects.Image;
    playerSkillI3: Phaser.GameObjects.Image;
    playerSkillI4: Phaser.GameObjects.Image;
    playerSkillOn: Phaser.GameObjects.Image;
    playerSkillDisable: Phaser.GameObjects.Image;

    constructor(scene: Phaser.Scene, player: Player) {
        this.scene = scene;
        this.player = player;
        this.createSkill();
        this.setupSkillInput();
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
        this.playerSkillI1.setInteractive().on('pointerdown', () => this.playSkillAnimation('attack'));
        this.playerSkillI2.setInteractive().on('pointerdown', () => this.playSkillAnimation('skill1'));
        this.playerSkillI3.setInteractive().on('pointerdown', () => this.playSkillAnimation('skill2'));
        this.playerSkillI4.setInteractive().on('pointerdown', () => this.playSkillAnimation('skill4'));
    }

    private playSkillAnimation(skill: string) {
        this.player.player.setAnimation(0, skill, false, true);
        this.player.player.addAnimation(0, 'idle', true);
    }
}
