import * as p2 from "p2-es";

export interface Data {
  id: string;
  color: string;
  width: number;
  height: number;
  bodyOptions: Partial<p2.BodyOptions>;
}

export interface BodyDiff {
  position: number[];
  angle?: number;
  velocity?: number[];
  angularVelocity?: number;
}

export class Entities {
  private dataMap: Record<number, Data> = {};

  // TODO move this to private and added internally
  updaters: Record<string, (d: number) => void> = {};

  constructor(private world: p2.World) {}

  getData(bodyId: number): Data | null {
    return this.dataMap[bodyId] ?? null;
  }

  update(delta: number) {
    Object.values(this.updaters).forEach((u) => u(delta));
  }

  // TODO swap this to private and wrap in a class and creators
  // like new Player > entities.add(Player) .. or Wall
  createBody(data: Data, bodyDiff: BodyDiff) {
    const body = new p2.Body({
      ...bodyDiff,
      ...data.bodyOptions,
    });

    const shape = new p2.Box({
      width: data.width,
      height: data.height,
    });

    body.addShape(shape);
    this.dataMap[body.id] = data;
    this.world.addBody(body);

    return {
      destroy: () => {
        this.world.removeBody(body);
        delete this.dataMap[body.id];
      },
      body,
    };
  }
}
