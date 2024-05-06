import { Ticker } from "pixi.js";
import { key } from "../key";
import { createBox } from "./box";

export function createPlayer() {
  const { graphics, body } = createBox({
    width: 4,
    height: 4,
    x: 30,
    y: 50,
    fill: "green",
    body: {
      mass: 1,
      damping: 0.5,
      fixedRotation: true,
    },
  });

  Ticker.shared.add(() => {
    const v = [0, 0];
    if (key.map.left) v[0] -= 1;
    if (key.map.right) v[0] += 1;
    body.applyImpulse(v);
  });

  key.on("up", () => {
    body.applyImpulse([0, -20]);
  });

  return { graphics, body };
}
