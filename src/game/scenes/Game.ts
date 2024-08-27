import { EventBus } from '../EventBus';
import { Scene } from 'phaser';
import { Player } from '../sprites/Player';
import { Enemy } from '../sprites/Enemy';
import { Controller } from '../utils/Controller';
import { PlayerHealth } from '../sprites/PlayerHealth';
import { EnemyHealth } from '../sprites/EnemyHealth';
import { Border } from '../utils/Border';
import { UnitSpawner } from '../utils/UnitSpawner';
import { PlayerSkill } from '../sprites/PlayerSkill';
import { Unit } from '../sprites/Unit';

export class Game extends Scene {
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
    controller: Controller;
    playerHealth: PlayerHealth;
    enemyHealth: EnemyHealth;
    unitSpawner: UnitSpawner;
    playerSkill: PlayerSkill;
    unit: Unit;

    constructor() {
        super('Game');
    }

    create() {
        const { width, height } = this.sys.game.config;

        this.camera = this.cameras.main;

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
        // this.topCutLeft = this.add.image(0 - 15, -20, 'top_cut_left')
        //     .setScale(0.8)
        //     .setOrigin(0, 0);
        // this.topCutRight = this.add.image(width as number + 15, -20, 'top_cut_right')
        //     .setScale(0.8)
        //     .setOrigin(1, 0);
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
        this.playerSkill = new PlayerSkill(this, this.player);

        this.enemy = new Enemy(this, this.background);
        this.enemyHealth = new EnemyHealth(this);

        this.controller = new Controller(this, this.player);
        this.unitSpawner = new UnitSpawner(this, this.enemy);
        this.unit = new Unit(this, this.enemy);

        EventBus.emit('current-scene-ready', this);
    }

    update() {
        this.controller.unclickable(this.input.activePointer);
    }
}
