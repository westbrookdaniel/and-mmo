import { emitForData } from "./util";
import { Creator } from "./util/creator";
import type { BodyDiff } from "../entities";
import { Objects } from "../objects";

export const physicsCreator = new Creator(
  async (bodyId: string, bodyDiff: BodyDiff) => {
    const data = await emitForData("object", bodyId);
    const O: any = Objects.find((o) => o.type === data.name);
    if (!data || !O) throw new Error("Something went wrong");

    const obj = new O(...data.args);
    obj.body.id = parseInt(bodyId);

    Object.entries(bodyDiff).forEach(([key, val]) => {
      (obj.body as any)[key] = val;
    });

    world.addBody(obj.body);

    return {
      data: obj,
      destroy: () => world.removeBody(obj.body),
    };
  },
);

export function onPhysicsTick(objects: any[]) {
  objects.forEach(async ([bodyId, bodyDiff]: any) => {
    physicsCreator.create(bodyId, bodyDiff);

    const obj = physicsCreator.get(bodyId);
    if (!obj) return;

    Object.entries(bodyDiff).forEach(([key, val]) => {
      (obj.body as any)[key] = val;
    });
  });

  world.bodies.forEach((b) => {
    if (!physicsCreator.created.includes(b.id.toString())) {
      physicsCreator.remove(b.id);
    }
  });
}
