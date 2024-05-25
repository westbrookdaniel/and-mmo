import { Creator } from "./util/creator";
import { physicsCreator } from "./onPhysicsTick";
import * as p2 from "p2-es";
import * as PIXI from "pixi.js";

const renderDebugCreator = new Creator(async (bodyId: string, b: p2.Body) => {
  const obj = physicsCreator.get(bodyId);

  const c = new PIXI.Container();
  c.zIndex = 9999999;

  obj.body.shapes.forEach((s: any) => {
    // Just render from the name for now
    const name = s.constructor.name;
    if (name === "Box") {
      c.addChild(
        new PIXI.Graphics()
          .rect(-s.width / 2, -s.height / 2, s.width, s.height)
          .stroke({ width: 0.1, color: "lime" }),
      );
    }
    if (name === "Circle") {
      c.addChild(
        new PIXI.Graphics()
          .circle(0, 0, s.radius)
          .stroke({ width: 0.1, color: "lime" }),
      );
    }
  });

  // Update positions pre add to ensure no jump
  c.x = b.position[0];
  c.y = b.position[1];
  c.rotation = b.angle;

  scene.camera.addChild(c);

  // if (data.id === socket.id) {
  //   scene.camera.follow(g, {
  //     minX: 0,
  //     minY: 0,
  //     maxY: 0,
  //   });
  // }

  return {
    data: c,
    destroy: () => c.destroy(),
  };
});

export function renderDebugBodies(bodyIds: number[]) {
  world.bodies.forEach(async (b) => {
    const bodyId = bodyIds.find((id) => id === b.id);
    if (!bodyId) return;

    renderDebugCreator.create(bodyId, b);

    const c = renderDebugCreator.get(bodyId);
    if (!c) return;
    c.x = b.position[0];
    c.y = b.position[1];
    c.rotation = b.angle;
  });

  const used = bodyIds.map((id) => id.toString());
  renderDebugCreator.created.forEach((k) => {
    if (!used.includes(k)) {
      renderDebugCreator.remove(k);
    }
  });
}
