import { Scene } from 'phaser';

export class Preloader extends Scene {
    constructor() {
        super('Preloader');
    }

    init() {
        const { width, height } = this.sys.game.config;

        this.add.image(width as number / 2, height as number / 2, 'sky');
        this.add.image(width as number / 2, height as number / 2, 'background');

        //  A simple progress bar. This is the outline of the bar.
        this.add.rectangle(width as number / 2, height as number / 2, 468, 32).setStrokeStyle(1, 0xffffff);

        //  This is the progress bar itself. It will increase in size from the left based on the % of progress.
        const bar = this.add.rectangle(width as number / 2 - 230, height as number / 2, 4, 28, 0xffffff);

        //  Use the 'progress' event emitted by the LoaderPlugin to update the loading bar
        this.load.on('progress', (progress: number) => {

            //  Update the progress bar (our bar is 464px wide, so 100% = 464px)
            bar.width = 4 + (460 * progress);

        });
    }

    preload() {
        // Load UI

        // Frames
        this.load.setPath('assets/UI/frames/');
        this.load.image('bottom_left', 'bottom_left.png');
        this.load.image('bottom_right', 'bottom_right.png');
        this.load.image('bottom_mid', 'bottom_mid.png');
        this.load.image('top_cut_left', 'top_cut_left.png');
        this.load.image('top_cut_right', 'top_cut_right.png');
        this.load.image('top_cut_mid', 'top_cut_mid.png');
        this.load.image('avatar_frame_left', 'avatar_frame_left.png');
        this.load.image('avatar_frame_right', 'avatar_frame_right.png');

        // Icons
        this.load.setPath('assets/UI/icons/');
        this.load.image('athena-icon', 'athena.png');
        this.load.image('michael-icon', 'michael.png');
        this.load.image('unit-icon', 'unit.png');
        this.load.image('michael_s1', 'michael_s1.png');
        this.load.image('michael_s2', 'michael_s2.png');
        this.load.image('michael_s3', 'michael_s3.png');
        this.load.image('michael_s4', 'michael_s4.png');

        // Load Spine
        this.load.setPath('assets/spine');
        this.load.spine('michael', 'michael/michael.json', 'michael/michael.atlas');
        this.load.spine('athena', 'athena/athena.json', 'athena/athena.atlas');
        this.load.atlas('unit', 'unit/unit.png', 'unit/unit.json');

        // Load Borders
        this.load.setPath('assets/UI/borders/');
        this.load.image('skill_frame', '4.png');
        this.load.image('unit_frame', '0.png');

        // Load Buttons
        this.load.setPath('assets/UI/buttons/');
        this.load.image('arrow_left', 'arrow_left.png');
        this.load.image('arrow_left_on', 'arrow_left_on.png');
        this.load.image('health_frame', 'health_frame.png');
        this.load.image('health_empty', 'health_empty.png');
        this.load.image('health_full', 'health_full.png');
        this.load.image('health2_full', 'health2_full.png');
        this.load.image('install_button', 'install_button.png');
        this.load.image('install_button_on', 'install_button_on.png');
    }

    create() {
        // Unit animations
        this.anims.create({
            key: 'walk',
            frames: this.anims.generateFrameNames('unit', { prefix: 'walk', start: 1, end: 6, suffix: '-0' }),
            frameRate: 10,
            repeat: -1
        });

        this.anims.create({
            key: 'attack',
            frames: this.anims.generateFrameNames('unit', { prefix: 'attack', start: 1, end: 5, suffix: '-0' }),
            frameRate: 10,
            repeat: -1
        });

        this.anims.create({
            key: 'die',
            frames: this.anims.generateFrameNames('unit', { prefix: 'die', start: 1, end: 2, suffix: '-0' }),
            frameRate: 10,
            repeat: 0
        });

        //  Move to the MainMenu. You could also swap this for a Scene Transition, such as a camera fade.
        // this.scene.start('MainMenu');
        this.scene.start('Game');
    }
}
