import * as PIXI from "pixi.js";
import { Camera } from "./camera";

type SceneMap = Record<string, (app: Camera) => void>;

export class SceneManager {
  current: string | null = null;

  constructor(
    public app: PIXI.Application,
    public scenes: SceneMap,
  ) {}

  set(name: string) {
    if (this.current) {
      this.app.stage.removeChildren();
    }

    const c = new Camera({
      canvas: this.app.canvas,
      zoom: 10,
    });
    this.app.stage.addChild(c);

    const scene = this.scenes[name];
    this.current = name;
    scene(c);
  }
}
