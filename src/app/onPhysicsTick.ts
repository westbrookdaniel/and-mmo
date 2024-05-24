import * as p2 from "p2-es";
import { emitForData } from "./util";
import { Creator } from "./util/creator";
import type { BodyDiff } from "../entities";

const creator = new Creator(async (bodyId: string, bodyDiff: BodyDiff) => {
  // TODO we're double fetching this here and renderBodies
  const data = await emitForData("data", bodyId);
  if (!data) throw new Error("No data for body");

  const body = new p2.Body({
    id: parseInt(bodyId),
    ...bodyDiff,
    ...data.bodyOptions,
  });
  const shape = new p2.Box({ width: data.width, height: data.height });
  body.addShape(shape);
  world.addBody(body);

  return {
    data: body,
    destroy: () => world.removeBody(body),
  };
});

export function onPhysicsTick(objects: any[]) {
  objects.forEach(async ([bodyId, bodyDiff]: any) => {
    creator.create(bodyId, bodyDiff);

    const body = creator.get(bodyId);
    if (!body) return;
    Object.entries(bodyDiff).forEach(([key, val]) => {
      (body as any)[key] = val;
    });
  });

  world.bodies.forEach((b) => {
    if (!creator.created.includes(b.id.toString())) {
      creator.remove(b.id);
    }
  });
}
