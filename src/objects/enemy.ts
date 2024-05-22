import { BoxObject } from "./box";

interface Options {
  x: number;
  y: number;
}

export class EnemyObject extends BoxObject {
  constructor(id: string, { x, y }: Options) {
    super(id, {
      width: 4,
      height: 4,
      color: "orange",
      body: {
        position: [x, y],
        mass: 1,
        damping: 0.5,
        fixedRotation: true,
      },
    });

    this.update(() => {
      const v = [0, 0];

      // TODO some GameObject store
      // TODO basic ai

      this.body.applyImpulse(v);
    });
  }
}
