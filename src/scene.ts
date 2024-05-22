import * as PIXI from "pixi.js";
import { Camera } from "./camera";

type SceneMap = Record<string, () => void>;

const zoom = 10;

export class SceneManager {
  current: string | null = null;
  camera: Camera;

  constructor(
    public app: PIXI.Application,
    public scenes: SceneMap,
  ) {
    this.camera = new Camera({
      canvas: this.app.canvas,
      zoom,
    });
  }

  set(name: string) {
    if (this.current) {
      this.camera?.destroy();
    }

    this.camera = new Camera({
      canvas: this.app.canvas,
      zoom,
    });
    this.app.stage.addChild(this.camera);

    const scene = this.scenes[name];
    this.current = name;
    scene();
  }
}
