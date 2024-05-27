import * as PIXI from "pixi.js";
import * as p2 from "p2-es";
import { SpriteChanger } from "./components/spriteChanger.js";

export class PlayerObject {
  body: p2.Body;

  constructor(public id: string) {
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
    return this.id;
  }
}

// TODO move this to just be Component[] (better for finding and detecting component types)
// Same for above?
export class PlayerRender {
  opts = { fixed: true };
  container = new PIXI.Container();

  sprite = new SpriteChanger("idle", {
    idle: {
      textures: new Array(2)
        .fill(null)
        .map((_, i) => `characters (idle) ${i}.aseprite`),
      speed: 0.02,
      loop: true,
    },
    attack: {
      textures: new Array(6)
        .fill(null)
        .map((_, i) => `characters (attack) ${i}.aseprite`),
      speed: 0.3,
    },
  });

  static async load() {
    const t = await PIXI.Assets.load("/assets/characters.json");
    t.textureSource.scaleMode = "nearest";
  }

  constructor(_obj: PlayerObject) {
    const c = this.container;

    c.addChild(
      new PIXI.Graphics().ellipse(0, 0.3, 1.6, 0.8).fill("rgba(0, 0, 0, 0.2)"),
    );

    const s = this.sprite.sprite;

    s.width = s.width / 4;
    s.height = s.height / 4;
    s.x = -s.width / 3;
    s.y = -s.height / 1.05;

    c.addChild(s);
  }
}
