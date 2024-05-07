import * as PIXI from "pixi.js";
import { Ticker } from "pixi.js";

interface Options {
  canvas: PIXI.Application["canvas"];
  zoom?: number;
}

type NumberOrGetter = number | (() => number);

interface FollowOptions {
  minX?: NumberOrGetter;
  minY?: NumberOrGetter;
  maxX?: NumberOrGetter;
  maxY?: NumberOrGetter;
  offsetX?: NumberOrGetter;
  offsetY?: NumberOrGetter;
  /**
   * @example
   * smoothingX: (p, t) => {
   *   const d = (p - t) / 4; // Easing
   *   const px = 20; // Max speed
   *   return p - Math.min(Math.max(d, -px), px);
   * }
   */
  smoothingX?: (previous: number, target: number) => number;
  smoothingY?: (previous: number, target: number) => number;
  deadzone?: {
    top?: number;
    left?: number;
    bottom?: number;
    right?: number;
  };
}

function unwrapGetter(value?: NumberOrGetter): number | undefined {
  return typeof value === "function" ? value() : value;
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

      const minX = unwrapGetter(options?.minX);
      const minY = unwrapGetter(options?.minY);
      const maxX = unwrapGetter(options?.maxX);
      const maxY = unwrapGetter(options?.maxY);

      const offsetX = unwrapGetter(options?.offsetX) ?? 0;
      const offsetY = unwrapGetter(options?.offsetY) ?? 0;

      let x = -e.x * this.zoom + this.canvas.width / 2;
      let y = -e.y * this.zoom + this.canvas.height / 2;

      x += offsetX;
      y += offsetY;

      if (typeof options?.smoothingX === "function") {
        x = options.smoothingX(this.x, x);
      }
      if (typeof options?.smoothingY === "function") {
        y = options.smoothingY(this.y, y);
      }

      if (typeof minX === "number") x = Math.min(x, minX);
      if (typeof minY === "number") y = Math.min(y, minY);
      if (typeof maxX === "number") x = Math.max(x, maxX);
      if (typeof maxY === "number") y = Math.max(y, maxY);

      this.x = x;
      this.y = y;
    });
  }
}
