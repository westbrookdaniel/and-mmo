import * as PIXI from "pixi.js";
import { BaseComponent } from "../base.js";

type Options = Record<
  string,
  {
    textures: string[];
    speed: number;
    /** defaults to false */
    loop?: boolean;
  }
>;

export class SpriteChanger extends BaseComponent {
  sprite: PIXI.AnimatedSprite;
  spriteMap: Record<string, PIXI.AnimatedSprite> = {};

  change(type: string, onEnd?: string) {
    const t = this.spriteMap[type];
    this.sprite.textures = t.textures;
    this.sprite.animationSpeed = t.animationSpeed;
    this.sprite.loop = t.loop ?? false;
    this.sprite.onComplete = () => {
      this.change(onEnd ?? "idle");
    };
    this.sprite.play();
  }

  constructor(init: string, opts: Options) {
    super();

    Object.entries(opts).map(([key, value]) => {
      const s = new PIXI.AnimatedSprite(
        value.textures.map((t) => PIXI.Texture.from(t)),
      );
      s.animationSpeed = value.speed;
      s.loop = value.loop ?? false;
      this.spriteMap[key] = s;
    });

    this.sprite = new PIXI.AnimatedSprite([
      PIXI.Texture.from(opts[init].textures[0]),
    ]);
    this.change(init);
  }
}
