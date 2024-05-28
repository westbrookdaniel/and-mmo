import { applyBodyDiff, getObjectForBody } from "./util/net";
import { Creator } from "./util/creator";
import type { BodyDiff } from "../entities";
import { Body } from "../components/body";

export const physicsCreator = new Creator(
  async (bodyId: string, bodyDiff: BodyDiff) => {
    const obj = await getObjectForBody(bodyId);

    const body = obj.component(Body)!.body;

    applyBodyDiff(body, bodyDiff);

    world.addBody(body);

    return {
      data: obj,
      destroy: () => world.removeBody(body),
    };
  },
);

export function onPhysicsTick(objects: any[]) {
  objects.forEach(async ([bodyId, bodyDiff]: any) => {
    physicsCreator.create(bodyId, bodyDiff);

    const obj = physicsCreator.get(bodyId);
    if (!obj) return;

    const body = obj.component(Body)!.body;

    applyBodyDiff(body, bodyDiff);
  });

  world.bodies.forEach((b) => {
    if (!physicsCreator.created.includes(b.id.toString())) {
      physicsCreator.remove(b.id);
    }
  });
}
