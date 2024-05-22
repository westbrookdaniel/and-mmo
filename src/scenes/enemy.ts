import { Ticker } from "pixi.js";
import { createBox } from "./box";

interface Options {
  x: number;
  y: number;
}

export function createEnemy({ x, y }: Options) {
  const { graphics, body } = createBox({
    width: 4,
    height: 4,
    x,
    y,
    fill: "orange",
    body: {
      mass: 1,
      damping: 0.5,
      fixedRotation: true,
    },
  });

  Ticker.shared.add((time) => {
    if (graphics.destroyed) return time.destroy();
    const v = [0, 0];

    // TODO some GameObject class and store

    body.applyImpulse(v);
  });

  return { graphics, body };
}
