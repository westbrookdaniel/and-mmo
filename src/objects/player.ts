import * as PIXI from "pixi.js";
import * as p2 from "p2-es";
import { SpriteChanger } from "../components/spriteChanger";
import { RenderOptions } from "../components/renderOptions";
import { Body } from "../components/body";
import { Render } from "../components/render";
import { BaseEntity } from "../base";

export class Player extends BaseEntity {
  static async preload() {
    const t = await PIXI.Assets.load("/assets/characters.json");
    t.textureSource.scaleMode = "nearest";
  }

  // TODO make some only some components only run on client/server
  // maybe have component have a "run on server, run on client, sections?

  components = [
    new Body(() => {
      const body = new p2.Body({
        mass: 1,
        damping: 0.7,
        fixedRotation: false,
      });

      const shape = new p2.Circle({
        radius: 1,
      });

      body.addShape(shape);

      return body;
    }),

    new SpriteChanger("idle", {
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
    }),

    new Render((c) => {
      c.addChild(
        new PIXI.Graphics()
          .ellipse(0, 0.3, 1.6, 0.8)
          .fill("rgba(0, 0, 0, 0.2)"),
      );

      const s = this.component(SpriteChanger)!.sprite;

      s.scale = 0.25;
      s.x = -s.width / 3;
      s.y = -s.height / 1.05;

      c.addChild(s);
    }),

    new RenderOptions({ fixed: true }),
  ];

  constructor(id: string) {
    super(id);
  }

  update() {
    const sprite = this.component(SpriteChanger)!.sprite;
    const body = this.component(Body)!.body;

    if (body.velocity[0] < 0) {
      sprite.scale.x = -0.25;
      sprite.x = sprite.width / 3;
    } else {
      sprite.scale.x = 0.25;
      sprite.x = -sprite.width / 3;
    }
  }
}
