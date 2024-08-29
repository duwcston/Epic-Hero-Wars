export class EnemyHealth {
    scene: Phaser.Scene;
    enemyHealthFrame: Phaser.GameObjects.Image;
    enemyHealthEmpty: Phaser.GameObjects.Image;
    enemyHealthBar: Phaser.GameObjects.Image;
    private static _enemyHealth: EnemyHealth;
    private _enemyMaxHealth: number = 57000;
    private _enemyHealth: number = this._enemyMaxHealth;
    private _enemyHealthText: Phaser.GameObjects.Text;

    static get enemyHealth() {
        return EnemyHealth._enemyHealth;
    }

    constructor(scene: Phaser.Scene) {
        EnemyHealth._enemyHealth = this;
        this.scene = scene;
        this.createEnemyHealthBar();
        this.createEnemyHealthText();
    }

    get enemyHealth() {
        return this._enemyHealth;
    }

    get enemyMaxHealth() {
        return this._enemyMaxHealth;
    }

    get enemyHealthText() {
        return this._enemyHealthText;
    }

    // Fix the display of the enemy health bar
    public takeDamage(damage: number) {
        if (damage > 0) {
            this._enemyHealth -= damage;
            if (this._enemyHealth < 0) this._enemyHealth = 0;
            this._enemyHealthText.setText(`${this._enemyHealth}`);
            const newScaleX = this._enemyHealth / this._enemyMaxHealth;
            
            this.enemyHealthBar.setOrigin(0, 0.5);
            this.scene.tweens.add({
                targets: this.enemyHealthBar,
                scaleX: newScaleX,
                duration: 300,
                ease: 'Power2',
            });
        }
    }    

    private createEnemyHealthBar() {
        this.enemyHealthFrame = this.createEnemyHealthImage('health_frame');
        this.enemyHealthEmpty = this.createEnemyHealthImage('health_empty');
        this.enemyHealthBar = this.createEnemyHealthImage('health2_full');
        this.updateEnemyHealthBarScale();

        this.scene.scale.on('resize', this.onResize, this);
    }

    private createEnemyHealthImage(texture: string): Phaser.GameObjects.Image {
        return this.scene.add.image(this.scene.scale.width / 4 * 3 - 15, 17, texture).setDepth(10);
    }

    private updateEnemyHealthBarScale() {
        const scale = this.scene.scale.width / 800;  // Adjust 800 to your desired reference width
        this.enemyHealthFrame.setScale(scale, 1);
        this.enemyHealthEmpty.setScale(scale, 1);
        this.enemyHealthBar.setScale(scale, 1);
    }

    private onResize() {
        this.updateEnemyHealthBarScale();
    }

    private createEnemyHealthText() {
        this._enemyHealthText = this.scene.add.text(this.scene.scale.width / 4 * 3, 5, `${this._enemyHealth}`, {
            fontSize: '16px',
            align: 'center',
            fontFamily: 'Font1',
            color: '#ffffff',
            stroke: '#000000',
            strokeThickness: 6,
        }).setDepth(10);
    }
}