import { BoxObject } from "./box";

interface Options {
  x: number;
  y: number;
}

export class PlayerObject extends BoxObject {
  constructor(id: string, { x, y }: Options) {
    super(id, {
      width: 4,
      height: 4,
      color: "green",
      body: {
        position: [x, y],
        mass: 1,
        damping: 0.5,
        fixedRotation: true,
      },
    });

    this.update(() => {
      const v = [0, 0];
      if (key.map.left) v[0] -= 1;
      if (key.map.right) v[0] += 1;
      this.body.applyImpulse(v);
    });

    key.on("up", () => {
      // TODO floor jump resetting
      this.body.applyImpulse([0, -20]);
    });
  }
}
