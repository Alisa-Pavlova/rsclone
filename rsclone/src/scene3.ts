import * as Phaser from 'phaser';
import Player from './player';

const sceneConfig: Phaser.Types.Scenes.SettingsConfig = {
  active: false,
  visible: false,
  key: 'Scene3',
};

export default class Scene3 extends Phaser.Scene {
  private groundLayer: Phaser.Tilemaps.TilemapLayer;
  private player: Player;
  private boat: any;
  private boatSprite: any;

  constructor() {
    super(sceneConfig);
  }

  public create() {
    const map = this.make.tilemap({ key: 'map3' });
    const tileset = map.addTilesetImage('bg3', 'bg3');
    this.groundLayer = map.createLayer('Background', tileset);
    this.groundLayer.setCollisionByProperty({ collides: true });
    this.matter.world.convertTilemapLayer(this.groundLayer);
    this.matter.world.setBounds(0, 0, 1680, 1040);
    this.boat = this.matter.add.sprite(140, 990, 'boatCollides') as any;
    this.boat.setIgnoreGravity(true).setFixedRotation();
    this.boatSprite = this.add.sprite(140, 950, 'boat') as any;
    this.player = new Player(this, '', 150, 890);
  }

  public update() {
    const boatSpeed = 2;
    const boatVelocity = this.boat.body.velocity;

    if (this.boat.x < 1060) {
      this.boat.setVelocityX(boatSpeed);
    }

    if (
      Phaser.Geom.Intersects.RectangleToRectangle(
        this.boatSprite.getBounds(),
        this.player.player.getBounds(),
      )
    ) {
      this.player.player.setVelocityX(this.player.player.body.velocity.x + boatVelocity.x);
    }

    this.boatSprite.x = this.boat.x;
    this.boatSprite.y = this.boat.y - 50;

    if (boatVelocity.x > boatSpeed) this.boat.setVelocityX(boatSpeed - 2);
  }
}