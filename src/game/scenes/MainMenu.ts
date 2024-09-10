import { EventBus } from '../EventBus';
import { Scene } from 'phaser';
import { Player } from '../sprites/Player';
import { Enemy } from '../sprites/Enemy';
import { PlayerHealth } from '../sprites/PlayerHealth';
import { EnemyHealth } from '../sprites/EnemyHealth';
import { Border } from '../utils/Border';
import { Controller } from '../utils/Controller';
import { PlayerSkill } from '../sprites/PlayerSkill';
import { EnemySkill } from '../sprites/EnemySkill';
import { UnitSpawner } from '../utils/UnitSpawner';

export class MainMenu extends Scene {
    camera: Phaser.Cameras.Scene2D.Camera;
    background: Phaser.GameObjects.Image;
    sky: Phaser.GameObjects.Image;
    bottomLeft: Phaser.GameObjects.Image;
    bottomRight: Phaser.GameObjects.Image;
    bottomMid: Phaser.GameObjects.Image;
    topCutLeft: Phaser.GameObjects.Image;
    topCutRight: Phaser.GameObjects.Image;
    topCutMid: Phaser.GameObjects.Image;
    avatarFrameLeft: Phaser.GameObjects.Image;
    avatarFrameRight: Phaser.GameObjects.Image;
    athenaIcon: Phaser.GameObjects.Image;
    michaelIcon: Phaser.GameObjects.Image;
    characterName: Phaser.GameObjects.Text;

    border: Border;
    player: Player;
    enemy: Enemy;
    playerHealth: PlayerHealth;
    enemyHealth: EnemyHealth;
    controller: Controller;
    playerSkill: PlayerSkill;
    enemySkill: EnemySkill;
    unitSpawner: UnitSpawner;

    constructor() {
        super('MainMenu');
    }

    create() {
        const { width, height } = this.sys.game.config;

        this.camera = this.cameras.main;

        const overlay = this.add.rectangle(width as number / 2, height as number / 2, width as number, height as number, 0x000000, 0.5).setDepth(20);
        overlay.alpha = 0;

        this.tweens.add({
            targets: overlay,
            alpha: 0.5,
            duration: 2000,
            ease: 'Power2'
        });

        this.sky = this.add.image(width as number / 2, 90, 'sky').setScale(2.6, 1);
        this.background = this.physics.add.image(width as number / 2, height as number / 2, 'background')
            .setScale(1.5, 1.2)
            .setOffset(0, height as number / 2 + 40)
            .setImmovable(true);

        this.bottomLeft = this.add.image(0, height as number, 'bottom_left')
            .setScale(0.7)
            .setOrigin(0, 1)
            .setDepth(1);
        this.bottomRight = this.add.image(width as number, height as number, 'bottom_right')
            .setScale(0.8, 0.7)
            .setOrigin(1, 1)
            .setDepth(1);
        this.bottomMid = this.add.image(width as number / 2, height as number, 'bottom_mid')
            .setScale(5, 0.7)
            .setOrigin(0.5, 1)
            .setScrollFactor(0);
        this.topCutMid = this.add.image(width as number / 2, 0, 'top_cut_mid')
            .setScale(4, 0.7)
            .setOrigin(0.5, 0)
            .setScrollFactor(0);

        this.avatarFrameLeft = this.add.image(40, 45, 'avatar_frame_left').setScale(0.7).setDepth(10);
        this.michaelIcon = this.add.image(40, 45, 'michael-icon').setScale(0.7);
        this.characterName = this.add.text(90, 40, 'Archangel Michael', { fontSize: '12px', color: '#ffff00' });

        this.avatarFrameRight = this.add.image(width as number - 40, 45, 'avatar_frame_right').setScale(0.7).setDepth(10);
        this.athenaIcon = this.add.image(width as number - 40, 45, 'athena-icon').setScale(0.7).setFlipX(true);
        this.characterName = this.add.text(width as number - 130, 40, 'Athena', { fontSize: '12px', color: '#ffff00' });

        this.border = new Border(this);

        this.player = new Player(this, this.background);
        this.playerHealth = new PlayerHealth(this);

        this.enemy = new Enemy(this, this.background);
        this.enemyHealth = new EnemyHealth(this);

        this.controller = new Controller(this, this.player);
        this.playerSkill = new PlayerSkill(this, this.player, this.enemy, this.enemyHealth);
        this.unitSpawner = new UnitSpawner(this, this.enemy, this.background);

        const startButton = this.add.text(width as number / 2, height as number / 2 - 50, 'Tap to start', {
            fontSize: '48px',
            color: '#ffffff',
            fontFamily: 'Font1'
        }).setOrigin(0.5).setInteractive().setDepth(2);

        this.tweens.add({
            targets: startButton,
            alpha: 0,
            duration: 700,
            yoyo: true,
            repeat: -1
        });

        this.input.on('pointerdown', () => {
            this.scene.start('Game');
        });


        EventBus.emit('current-scene-ready', this);
    }

    update() {
    }
}
