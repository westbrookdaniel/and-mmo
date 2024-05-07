import { Ticker } from "pixi.js";
import { key } from "../key";
import { createBox } from "./box";

interface Options {
  x: number;
  y: number;
}

export function createPlayer({ x, y }: Options) {
  const { graphics, body } = createBox({
    width: 4,
    height: 4,
    x,
    y,
    fill: "green",
    body: {
      mass: 1,
      damping: 0.5,
      fixedRotation: true,
    },
  });

  Ticker.shared.add((time) => {
    if (graphics.destroyed) return time.destroy();
    const v = [0, 0];
    if (key.map.left) v[0] -= 1;
    if (key.map.right) v[0] += 1;
    body.applyImpulse(v);
  });

  key.on("up", () => {
    // TODO floor jump resetting
    body.applyImpulse([0, -20]);
  });

  return { graphics, body };
}
