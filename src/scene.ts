import * as PIXI from "pixi.js";

type SceneMap = Record<string, (app: PIXI.Application) => void>;

export class SceneManager {
  scenes: SceneMap;
  current: string | null = null;
  width: number = window.innerWidth;
  height: number = window.innerHeight;

  constructor(
    private app: PIXI.Application,
    scenes: SceneMap,
  ) {
    this.scenes = scenes;
  }

  set(name: string) {
    if (this.current) {
      this.app.stage.removeChildren();
    }

    const scene = this.scenes[name];
    this.current = name;
    scene(this.app);
  }
}
