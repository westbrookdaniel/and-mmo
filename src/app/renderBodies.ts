import { Creator } from "./util/creator";
import { Renders } from "../objects";
import { physicsCreator } from "./onPhysicsTick";
import * as p2 from "p2-es";

const renderCreator = new Creator(async (bodyId: string, b: p2.Body) => {
  const obj = physicsCreator.get(bodyId);
  const R: any = Renders.find((o) => o.type === obj.type);
  if (!R) throw new Error("Something went wrong");

  const ren = new R(obj);

  // Update positions pre add to ensure no jump
  ren.container.x = b.position[0];
  ren.container.y = b.position[1];
  if (!ren.opts.fixed) ren.container.rotation = b.angle;

  scene.camera.addChild(ren.container);

  // if (data.id === socket.id) {
  //   scene.camera.follow(g, {
  //     minX: 0,
  //     minY: 0,
  //     maxY: 0,
  //   });
  // }

  return {
    data: ren,
    destroy: () => ren.container.destroy(),
  };
});

export function renderBodies(bodyIds: number[]) {
  world.bodies.forEach(async (b) => {
    const bodyId = bodyIds.find((id) => id === b.id);
    if (!bodyId) return;

    renderCreator.create(bodyId, b);

    const r = renderCreator.get(bodyId);
    if (!r) return;
    r.container.x = b.position[0];
    r.container.y = b.position[1];
    r.container.zIndex = b.position[1];
    if (!r.opts.fixed) r.container.rotation = b.angle;
  });

  const used = bodyIds.map((id) => id.toString());
  renderCreator.created.forEach((k) => {
    if (!used.includes(k)) {
      renderCreator.remove(k);
    }
  });
}
