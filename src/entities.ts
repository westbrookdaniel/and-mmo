import * as p2 from "p2-es";
import type { BaseObject } from "./objects";

export interface BodyDiff {
  position: number[];
  angle?: number;
  velocity?: number[];
  angularVelocity?: number;
}

export class Entities {
  // Map from bodyId to Object
  private objMap: Record<number, BaseObject> = {};
  private updaters: Record<string, (d: number) => void> = {};

  add(key: string, cb: (d: number) => void) {
    this.updaters[key] = cb;
  }

  remove(key: string) {
    delete this.updaters[key];
  }

  constructor(private world: p2.World) {}

  getObject(bodyId: number): BaseObject | null {
    return this.objMap[bodyId] ?? null;
  }

  update(delta: number) {
    Object.values(this.updaters).forEach((u) => u(delta));
  }

  addObject(obj: BaseObject, bodyDiff: BodyDiff) {
    Object.entries(bodyDiff).forEach(([key, val]) => {
      (obj.body as any)[key] = val;
    });

    this.objMap[obj.body.id] = obj;
    this.world.addBody(obj.body);

    return () => {
      this.world.removeBody(obj.body);
      delete this.objMap[obj.body.id];
    };
  }
}
