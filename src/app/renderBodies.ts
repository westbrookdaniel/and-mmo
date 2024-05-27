import { Creator } from "./util/creator";
import * as p2 from "p2-es";
import { getRenderForBody } from "./util/net";
import { RenderOptions } from "../objects/components/renderOptions";

const renderCreator = new Creator(async (bodyId: string, b: p2.Body) => {
  const ren = getRenderForBody(bodyId);

  // Update positions pre add to ensure no jitter
  ren.container.x = b.position[0];
  ren.container.y = b.position[1];

  if (!ren.component(RenderOptions)?.options.fixed) {
    ren.container.rotation = b.angle;
  }

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

    if (!r.component(RenderOptions)?.options.fixed) {
      r.container.rotation = b.angle;
    }
  });

  const used = bodyIds.map((id) => id.toString());
  renderCreator.created.forEach((k) => {
    if (!used.includes(k)) {
      renderCreator.remove(k);
    }
  });
}
