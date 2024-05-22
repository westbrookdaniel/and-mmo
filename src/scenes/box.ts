import * as PIXI from "pixi.js";
import { Ticker } from "pixi.js";
import * as p2 from "p2-es";
import { toDeg } from "../util/rad";

interface Options {
  width: number;
  height: number;
  x: number;
  y: number;
  rotation?: number;
  fill: string;
  body?: Omit<p2.BodyOptions, "position" | "angle">;
}

export function createBox({
  width,
  height,
  x,
  y,
  fill,
  rotation,
  body,
}: Options) {
  const g = new PIXI.Graphics();
  g.rect(-width / 2, -height / 2, width, height);
  g.fill(fill);

  g.x = x;
  g.y = y;
  g.rotation = rotation ?? 0;

  const b = new p2.Body({
    position: [g.x, g.y],
    angle: toDeg(g.rotation),
    ...body,
  });
  b.addShape(new p2.Box({ width, height }));
  world.addBody(b);

  Ticker.shared.add((time) => {
    if (g.destroyed) return time.destroy();
    g.x = b.position[0];
    g.y = b.position[1];
    g.angle = b.angle;
  });

  g.on("removed", () => {
    world.removeBody(b);
  });

  scene.camera.addChild(g);

  return { body: b, graphics: g };
}
