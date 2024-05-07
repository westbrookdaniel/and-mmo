import * as PIXI from "pixi.js";
import { Camera } from "./camera";

type SceneMap = Record<string, (app: Camera) => void>;

export class SceneManager {
  current: string | null = null;
  camera: Camera | null = null;

  constructor(
    public app: PIXI.Application,
    public scenes: SceneMap,
  ) {}

  set(name: string) {
    if (this.current) {
      this.camera?.destroy();
    }

    this.camera = new Camera({
      canvas: this.app.canvas,
      zoom: 10,
    });
    this.app.stage.addChild(this.camera);

    const scene = this.scenes[name];
    this.current = name;
    scene(this.camera);
  }
}
