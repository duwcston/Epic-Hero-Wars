export class PlayerSkill {
    scene: Phaser.Scene;
    playerSkillFrame1: Phaser.GameObjects.Image;
    playerSkillFrame2: Phaser.GameObjects.Image;
    playerSkillFrame3: Phaser.GameObjects.Image;
    playerSkillFrame4: Phaser.GameObjects.Image;
    playerSkillOn: Phaser.GameObjects.Image;
    playerSkillDisable: Phaser.GameObjects.Image;

    emptyFrameL1: Phaser.GameObjects.Image;
    emptyFrameL2: Phaser.GameObjects.Image;
    emptyFrameL3: Phaser.GameObjects.Image;
    emptyFrameL4: Phaser.GameObjects.Image;
    emptyFrameL5: Phaser.GameObjects.Image;
    emptyFrameL6: Phaser.GameObjects.Image;

    emptyFrameR1: Phaser.GameObjects.Image;
    emptyFrameR2: Phaser.GameObjects.Image;
    emptyFrameR3: Phaser.GameObjects.Image;
    emptyFrameR4: Phaser.GameObjects.Image;
    emptyFrameR5: Phaser.GameObjects.Image;
    emptyFrameR6: Phaser.GameObjects.Image;

    constructor(scene: Phaser.Scene) {
        this.scene = scene;
        this.createSkillBorder();
        this.createEmptyLeftBorder();
        this.createEmptyRightBorder();
    }

    private createSkillBorder() {
        this.playerSkillFrame1 = this.scene.add.image(this.scene.scale.width - 140, this.scene.scale.height - 125, 'skill_frame')
            .setDepth(10)
            .setScale(0.55);
        this.playerSkillFrame2 = this.scene.add.image(this.scene.scale.width - 60, this.scene.scale.height - 125, 'skill_frame')
            .setDepth(10)
            .setScale(0.55);
        this.playerSkillFrame3 = this.scene.add.image(this.scene.scale.width - 140, this.scene.scale.height - 50, 'skill_frame')
            .setDepth(10)
            .setScale(0.55);
        this.playerSkillFrame4 = this.scene.add.image(this.scene.scale.width - 60, this.scene.scale.height - 50, 'skill_frame')
            .setDepth(10)
            .setScale(0.55);
    }

    private createEmptyLeftBorder() {
        this.emptyFrameL1 = this.scene.add.image(250, 650, 'unit_frame')
            .setDepth(10)
            .setScale(0.4);
        this.emptyFrameL2 = this.scene.add.image(310, 650, 'unit_frame')
            .setDepth(10)
            .setScale(0.4);
        this.emptyFrameL3 = this.scene.add.image(370, 650, 'unit_frame')
            .setDepth(10)
            .setScale(0.4);
        this.emptyFrameL4 = this.scene.add.image(250, 710, 'unit_frame')
            .setDepth(10)
            .setScale(0.4);
        this.emptyFrameL5 = this.scene.add.image(310, 710, 'unit_frame')
            .setDepth(10)
            .setScale(0.4);
        this.emptyFrameL6 = this.scene.add.image(370, 710, 'unit_frame')
            .setDepth(10)
            .setScale(0.4);
    }

    private createEmptyRightBorder() {
        this.emptyFrameR1 = this.scene.add.image(this.scene.scale.width - 250, 640, 'unit_frame')
            .setDepth(10)
            .setScale(0.25)
            .setScrollFactor(0, 0);
        this.emptyFrameR2 = this.scene.add.image(this.scene.scale.width - 210, 640, 'unit_frame')
            .setDepth(10)
            .setScale(0.25)
            .setScrollFactor(0, 0);
        this.emptyFrameR3 = this.scene.add.image(this.scene.scale.width - 250, 680, 'unit_frame')
            .setDepth(10)
            .setScale(0.25)
            .setScrollFactor(0, 0);
        this.emptyFrameR4 = this.scene.add.image(this.scene.scale.width - 210, 680, 'unit_frame')
            .setDepth(10)
            .setScale(0.25)
            .setScrollFactor(0, 0);
        this.emptyFrameR5 = this.scene.add.image(this.scene.scale.width - 250, 720, 'unit_frame')
            .setDepth(10)
            .setScale(0.25)
            .setScrollFactor(0, 0);
        this.emptyFrameR6 = this.scene.add.image(this.scene.scale.width - 210, 720, 'unit_frame')
            .setDepth(10)
            .setScale(0.25)
            .setScrollFactor(0, 0);
    }
}