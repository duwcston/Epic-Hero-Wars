import { Boot } from './scenes/Boot';
import { Game as MainGame } from './scenes/Game';
import { AUTO, Game } from 'phaser';
import { Preloader } from './scenes/Preloader';
import { MainMenu } from './scenes/MainMenu';
import { GameOver } from './scenes/GameOver';
import { GameWin } from './scenes/GameWin';
import 'phaser/plugins/spine/dist/SpinePlugin';

const ratio = Math.max(window.innerWidth / window.innerHeight, window.innerHeight / window.innerWidth)
const DEFAULT_HEIGHT = 756
const DEFAULT_WIDTH = ratio * DEFAULT_HEIGHT

const config: Phaser.Types.Core.GameConfig = {
    type: AUTO,
    parent: 'game-container',
    backgroundColor: '#1c1c1c',
    dom: {
        createContainer: true
    },
    scale: {
        mode: Phaser.Scale.FIT,
        autoCenter: Phaser.Scale.CENTER_BOTH,
        width: DEFAULT_WIDTH,
        height: DEFAULT_HEIGHT
    },
    physics: {
        default: 'arcade',
        arcade: {
            gravity: { x: 0, y: 0 },
            debug: false,
            fps: 60,
            fixedStep: true,
            overlapBias: 128,
        }
    },
    scene: [
        Boot,
        Preloader,
        MainMenu,
        MainGame,
        GameOver,
        GameWin
    ],
    plugins: {
        scene: [
            {
                key: 'SpinePlugin',
                plugin: window.SpinePlugin,
                mapping: 'spine'
            }
        ]
    }
};

const StartGame = (parent: string) => {

    return new Game({ ...config, parent });

}

export default StartGame;
