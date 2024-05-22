import * as p2 from "p2-es";
import * as PIXI from "pixi.js";

export class GameObject<D extends PIXI.Container> {
  constructor(
    public id: string,
    public body: p2.Body,
    public display: D,
  ) {
    world.addBody(this.body);
    this.display.on("removed", () => {
      world.removeBody(this.body);
    });
    scene.camera.addChild(this.display);
  }

  update(cb: (time: PIXI.Ticker) => void) {
    cb(PIXI.Ticker.shared);
    PIXI.Ticker.shared.add((time) => {
      if (this.display.destroyed) return time.destroy();
      cb(time);
    });
  }
}
