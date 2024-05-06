import * as PIXI from "pixi.js";

type SceneMap = Record<string, (app: PIXI.Container) => void>;

const ZOOM = 10;

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

    const c = new PIXI.Container();
    c.scale.x = ZOOM;
    c.scale.y = ZOOM;
    this.app.stage.addChild(c);

    const scene = this.scenes[name];
    this.current = name;
    scene(c);
  }
}
