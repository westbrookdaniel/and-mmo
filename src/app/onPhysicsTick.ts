import { applyBodyDiff, getObjectForBody } from "./util/net";
import { Creator } from "./util/creator";
import type { BodyDiff } from "../entities";

export const physicsCreator = new Creator(
  async (bodyId: string, bodyDiff: BodyDiff) => {
    const obj = await getObjectForBody(bodyId);

    applyBodyDiff(obj.body, bodyDiff);

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

    applyBodyDiff(obj.body, bodyDiff);
  });

  world.bodies.forEach((b) => {
    if (!physicsCreator.created.includes(b.id.toString())) {
      physicsCreator.remove(b.id);
    }
  });
}
