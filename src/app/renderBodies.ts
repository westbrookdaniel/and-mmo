import * as PIXI from "pixi.js";
import { emitForData } from "./util";
import { Creator } from "./util/creator";

const creator = new Creator(async (bodyId: string) => {
  // TODO we're double fetching this here and onPhysicsTick
  const data = await emitForData("data", parseInt(bodyId));
  if (!data) throw new Error("No data for body");

  const g = new PIXI.Graphics()
    .rect(-data.width / 2, -data.height / 2, data.width, data.height)
    .fill(data.color);
  scene.camera.addChild(g);

  // if (data.id === socket.id) {
  //   scene.camera.follow(g, {
  //     minX: 0,
  //     minY: 0,
  //     maxY: 0,
  //   });
  // }

  return {
    data: g,
    destroy: () => g.destroy(),
  };
});

export function renderBodies(bodyIds: number[]) {
  world.bodies.forEach(async (b) => {
    const bodyId = bodyIds.find((id) => id === b.id);
    if (!bodyId) return;

    creator.create(bodyId);

    const g = creator.get(bodyId);
    if (!g) return;
    g.x = b.position[0];
    g.y = b.position[1];
    g.rotation = b.angle;
  });

  const used = bodyIds.map((id) => id.toString());
  creator.created.forEach((k) => {
    if (!used.includes(k)) {
      creator.remove(k);
    }
  });
}
