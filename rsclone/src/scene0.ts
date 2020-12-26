import * as Phaser from 'phaser';

const sceneConfig: Phaser.Types.Scenes.SettingsConfig = {
  active: false,
  visible: false,
  key: 'game',
};

export class Scene0 extends Phaser.Scene {
  private player: Phaser.Types.Physics.Arcade.SpriteWithDynamicBody;
  private objects: Phaser.Physics.Arcade.StaticGroup;
  private groundLayer: Phaser.Tilemaps.TilemapLayer;

  constructor() {
    super(sceneConfig);
  }
  public preload ()
  {
    this.load.tilemapTiledJSON('map', 'assets/world/bg.json', null)
    this.load.image('bg', 'assets/world/bg.png');
    this.load.atlas('playerWalk', 'assets/character/walk/playerWalk.png', 'assets/character/walk/playerWalk.json');
    this.load.atlas('playerIdle', 'assets/character/idle/playerIdle.png', 'assets/character/idle/playerIdle.json');
    this.load.atlas('playerJump', 'assets/character/jump/playerJump.png', 'assets/character/jump/playerJump.json');
    this.load.image('tree', 'assets/world/tree.png');
    this.load.image('house', 'assets/world/house.png');
    //this.load.image('ground', 'assets/world/ground.png');
  }

  public create() {
    const centerX = 840;
    const centerY = 525;

    const map = this.make.tilemap({ key: "map" });
    const tileset = map.addTilesetImage("bg", "bg");
    this.groundLayer = map.createLayer('Ground', tileset);
    this.groundLayer.setCollisionByProperty({ collides: true });

    const debugGraphics = this.add.graphics().setAlpha(0.75);
    this.groundLayer.renderDebug(debugGraphics, {
      tileColor: null, // Color of non-colliding tiles
      collidingTileColor: new Phaser.Display.Color(243, 134, 48, 255), // Color of colliding tiles
      faceColor: new Phaser.Display.Color(40, 39, 37, 255) // Color of colliding face edges
    });

    //this.add.image(centerX, centerY, 'bg');

    this.player = this.physics.add.sprite(400, 300, 'playerIdle');

    this.player.setBounce(0.02);
    this.player.setCollideWorldBounds(true);

    this.objects = this.physics.add.staticGroup();


    //this.objects.create(centerX + 200, centerY + 150, 'house').refreshBody();
    //this.objects.create(centerX, centerY + 410 , 'ground')

    this.physics.add.collider(this.player, this.objects);
    this.physics.add.collider(this.player, this.groundLayer);


    this.anims.create({
      key: 'walk',
      frames: this.anims.generateFrameNames('playerWalk', {
        start: 2, end: 8,
        prefix: '', suffix: '.png'
      }),
      frameRate: 11,
      repeat: -1
    });

    this.anims.create({
      key: 'idle',
      frames: this.anims.generateFrameNames('playerIdle', {
        start: 1, end: 8,
        prefix: '', suffix: '.png'
      }),
      frameRate: 6,
      repeat: -1
    });

    this.anims.create({
      key: 'jump',
      frames: this.anims.generateFrameNames('playerJump', {
        start: 1, end: 3,
        prefix: '', suffix: '.png'
      }),
      frameRate: 6,
      repeat: -1
    });

  }

  public update() {
    const cursors = this.input.keyboard.createCursorKeys();
    const speed = 400;


    if (cursors.left.isDown) {
      this.player.body.setVelocityX(-speed);
      if(this.player.body.touching.down) this.player.anims.play('walk', true);
      this.player.flipX = true;

    } else if (cursors.right.isDown) {

      this.player.body.setVelocityX(speed);
      if(this.player.body.touching.down) this.player.anims.play('walk', true);
      this.player.flipX = false;

    } else {
      if(this.player.body.touching.down) {
        this.player.anims.play('idle', true);
      }
      this.player.body.setVelocityX(0);

    }

    if (cursors.up.isDown) {// && this.player.body.touching.down
      this.player.body.setVelocityY(-speed * 3);
      this.player.anims.play('jump', true);
    }
  }
}
