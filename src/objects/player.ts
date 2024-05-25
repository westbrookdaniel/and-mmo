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

  static async load() {
    const t = await PIXI.Assets.load("/assets/characters.json");
    t.textureSource.scaleMode = "nearest";
  }

  constructor(_obj: PlayerObject) {
    const c = this.container;

    c.addChild(
      new PIXI.Graphics().ellipse(0, 0.3, 1.6, 0.8).fill("rgba(0, 0, 0, 0.2)"),
    );

    const s = new PIXI.AnimatedSprite(
      new Array(2)
        .fill(null)
        .map((_, i) => PIXI.Texture.from(`characters (idle) ${i}.aseprite`)),
    );

    console.log(s);

    s.animationSpeed = 0.02;
    s.play();

    s.width = s.width / 4;
    s.height = s.height / 4;
    s.x = -s.width / 3;
    s.y = -s.height / 1.05;

    c.addChild(s);
  }
}
