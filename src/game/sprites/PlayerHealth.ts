export class PlayerHealth {
    scene: Phaser.Scene;
    playerHealthBar: Phaser.GameObjects.Image;
    playerHealthEmpty: Phaser.GameObjects.Image;
    playerHealthFull: Phaser.GameObjects.Image;
    private static _playerHealth: PlayerHealth;
    private _playerMaxHealth: number = 96300;
    private _playerHealth: number = this._playerMaxHealth;
    private _playerHealthText: Phaser.GameObjects.Text;

    static get playerHealth() {
        return PlayerHealth._playerHealth;
    }

    constructor(scene: Phaser.Scene) {
        PlayerHealth._playerHealth = this;
        this.scene = scene;
        this.createPlayerHealthBar();
        this.createPlayerHealthText();
    }

    get playerHealth() {
        return this._playerHealth;
    }

    get playerMaxHealth() {
        return this._playerMaxHealth;
    }

    get playerHealthText() {
        return this._playerHealthText;
    }

    private createPlayerHealthBar() {
        this.playerHealthBar = this.createHealthImage('health_frame');
        this.playerHealthEmpty = this.createHealthImage('health_empty');
        this.playerHealthFull = this.createHealthImage('health_full');
        this.updateHealthBarScale();

        this.scene.scale.on('resize', this.onResize, this);
    }

    private createHealthImage(texture: string): Phaser.GameObjects.Image {
        return this.scene.add.image(this.scene.scale.width / 4 + 15, 17, texture).setDepth(10);
    }

    private updateHealthBarScale() {
        const scale = this.scene.scale.width / 800;  // Adjust 800 to your desired reference width
        this.playerHealthBar.setScale(scale, 1);
        this.playerHealthEmpty.setScale(scale, 1);
        this.playerHealthFull.setScale(scale, 1);
    }

    private onResize() {
        this.updateHealthBarScale();
    }

    private createPlayerHealthText() {
        this._playerHealthText = this.scene.add.text(this.scene.scale.width / 4, 5, `${this._playerHealth}`, {
            fontSize: '16px',
            align: 'center',
            fontFamily: 'Font1',
            color: '#ffffff',
            stroke: '#000000',
            strokeThickness: 6,
        }).setDepth(10);
    }

    public playerTakeDamage(damage: number) {
        if (damage > 0) {
            this._playerHealth -= damage;
            if (this._playerHealth < 0) this._playerHealth = 0;
            this._playerHealthText.setText(`${this._playerHealth}`);
            const damagePercentage = damage / this._playerHealth;
            this.playerHealthFull.width = this.playerHealthFull.width - (this.playerHealthFull.width * damagePercentage);
            this.playerHealthFull.setCrop(0, 0, this.playerHealthFull.width, this.playerHealthFull.height);
        }
    }
}