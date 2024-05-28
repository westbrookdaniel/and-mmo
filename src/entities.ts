import { Body } from "./components/body";
import * as p2 from "p2-es";
import type { BaseEntity } from "./base";

export interface BodyDiff {
  position: number[];
  angle?: number;
  velocity?: number[];
  angularVelocity?: number;
}

export class Entities {
  // Map from bodyId to Object
  private objMap: Record<number, BaseEntity> = {};
  private updaters: Record<string, (d: number) => void> = {};

  add(key: string, cb: (d: number) => void) {
    this.updaters[key] = cb;
  }

  remove(key: string) {
    delete this.updaters[key];
  }

  constructor(private world: p2.World) {}

  getObject(bodyId: number): BaseEntity | null {
    return this.objMap[bodyId] ?? null;
  }

  update(delta: number) {
    Object.values(this.updaters).forEach((u) => u(delta));
  }

  addObject(ent: BaseEntity, bodyDiff: BodyDiff) {
    // TODO is having this body stuff here the way to go?
    const body = ent.component(Body)?.body;
    if (!body) return () => {};

    this.objMap[body.id] = ent;

    Object.entries(bodyDiff).forEach(([key, val]) => {
      (body as any)[key] = val;
    });

    this.world.addBody(body);

    return () => {
      this.world.removeBody(body);
      delete this.objMap[body.id];
    };
  }
}
