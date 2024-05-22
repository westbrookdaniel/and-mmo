import * as PIXI from "pixi.js";
import { Ticker } from "pixi.js";

interface Options {
  canvas: PIXI.Application["canvas"];
  zoom?: number;
}

interface FollowOptions {
  minX?: number;
  minY?: number;
  maxX?: number;
  maxY?: number;
  offsetX?: number;
  offsetY?: number;
}

export class Camera extends PIXI.Container {
  canvas: PIXI.Application["canvas"];
  zoom: number;

  private ticker = new Ticker();

  constructor(options: Options) {
    super();
    this.ticker.start();
    this.canvas = options.canvas;
    this.scale.x = options.zoom ?? 1;
    this.scale.y = options.zoom ?? 1;
    this.zoom = options.zoom ?? 1;
  }

  follow(e: PIXI.Container, options?: FollowOptions) {
    if (e.parent !== this) throw new Error("Must be child of the Camera");

    this.ticker.add((time) => {
      if (this.destroyed) return time.destroy();

      const minX = options?.minX;
      const minY = options?.minY;
      const maxX = options?.maxX;
      const maxY = options?.maxY;

      const offsetX = options?.offsetX ?? 0;
      const offsetY = options?.offsetY ?? 0;

      let x = -e.x * this.zoom + this.canvas.width / 2;
      let y = -e.y * this.zoom + this.canvas.height / 2;

      x += offsetX;
      y += offsetY;

      if (typeof minX === "number") x = Math.min(x, minX);
      if (typeof minY === "number") y = Math.min(y, minY);
      if (typeof maxX === "number") x = Math.max(x, maxX);
      if (typeof maxY === "number") y = Math.max(y, maxY);

      this.x = x;
      this.y = y;
    });
  }
}
