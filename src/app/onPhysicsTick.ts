import * as p2 from "p2-es";
import { emitForData } from "./util";
import { Creator } from "./util/creator";

const creator = new Creator(
  async (
    bodyId: string,
    pos: p2.Vec2,
    angle: number,
    vel: p2.Vec2,
    angVel: number,
  ) => {
    // TODO we're double fetching this here and renderBodies
    const data = await emitForData("data", bodyId);
    if (!data) throw new Error("No data for body");

    const body = new p2.Body({
      id: parseInt(bodyId),
      position: pos,
      angle,
      velocity: vel,
      angularVelocity: angVel,
      ...data.bodyOptions,
    });
    const shape = new p2.Box({ width: data.width, height: data.height });
    body.addShape(shape);
    world.addBody(body);

    return {
      data: body,
      destroy: () => world.removeBody(body),
    };
  },
);

export function onPhysicsTick(objects: any[]) {
  objects.forEach(async ([bodyId, pos, angle, vel, angVel]: any) => {
    creator.create(bodyId, pos, angle, vel, angVel);

    const body = creator.get(bodyId);
    if (!body) return;
    body.position = pos;
    body.angle = angle;
    body.velocity = vel;
    body.angularVelocity = angVel;
  });

  world.bodies.forEach((b) => {
    if (!creator.created.includes(b.id.toString())) {
      creator.remove(b.id);
    }
  });
}
