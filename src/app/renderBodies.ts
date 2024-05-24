import * as PIXI from "pixi.js";
import { emitForData } from "./util";
import { Creator } from "./util/creator";

const creator = new Creator(async (bodyId: string) => {
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

export function renderBodies(lastTick: any[]) {
  world.bodies.forEach(async (b) => {
    const last = lastTick.find((l) => l[0] === b.id);
    if (!last) return;
    const [bodyId] = last;

    creator.create(bodyId);

    const g = creator.get(bodyId);
    if (!g) return;
    g.x = b.position[0];
    g.y = b.position[1];
    g.rotation = b.angle;
  });

  const used = lastTick.map((l) => l[0].toString());
  creator.created.forEach((k) => {
    if (!used.includes(k)) {
      creator.remove(k);
    }
  });
}
