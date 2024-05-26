import * as PIXI from "pixi.js";
import * as p2 from "p2-es";

export class PlayerObject {
  static type = "Player";
  type = "Player";

  body: p2.Body;

  constructor(
    public id: string,
    // TODO move this to be user data or something
    public color: string,
  ) {
    this.body = new p2.Body({
      mass: 1,
      damping: 0.7,
      fixedRotation: false,
    });

    const shape = new p2.Circle({
      radius: 1,
    });

    this.body.addShape(shape);
  }

  args() {
    return [this.id, this.color];
  }
}

export class PlayerRender {
  static type = "Player";
  type = "Player";

  // TODO standardise this
  opts = { fixed: true };
  container = new PIXI.Container();

  private s: PIXI.AnimatedSprite;
  spriteMap: Record<string, PIXI.AnimatedSprite> = {};

  static async load() {
    const t = await PIXI.Assets.load("/assets/characters.json");
    t.textureSource.scaleMode = "nearest";
  }

  sprite(type: string, onEnd?: string) {
    const t = this.spriteMap[type];
    this.s.textures = t.textures;
    this.s.animationSpeed = t.animationSpeed;
    this.s.loop = t.loop;
    this.s.onComplete = () => {
      this.sprite(onEnd ?? "idle");
    };
    this.s.play();
  }

  constructor(_obj: PlayerObject) {
    const c = this.container;

    // Shadow
    c.addChild(
      new PIXI.Graphics().ellipse(0, 0.3, 1.6, 0.8).fill("rgba(0, 0, 0, 0.2)"),
    );

    // Idle sprite
    const idle = new PIXI.AnimatedSprite(
      new Array(2)
        .fill(null)
        .map((_, i) => PIXI.Texture.from(`characters (idle) ${i}.aseprite`)),
    );
    idle.animationSpeed = 0.02;

    // Attack sprite
    const attack = new PIXI.AnimatedSprite(
      new Array(6)
        .fill(null)
        .map((_, i) => PIXI.Texture.from(`characters (attack) ${i}.aseprite`)),
    );
    attack.animationSpeed = 0.3;
    attack.loop = false;

    // Sprite setup
    this.spriteMap = {
      idle,
      attack,
    };
    this.s = new PIXI.AnimatedSprite([
      PIXI.Texture.from("characters (idle) 0.aseprite"),
    ]);
    this.sprite("idle");

    // Size/position setup
    this.s.width = this.s.width / 4;
    this.s.height = this.s.height / 4;
    this.s.x = -this.s.width / 3;
    this.s.y = -this.s.height / 1.05;

    c.addChild(this.s);
  }
}
