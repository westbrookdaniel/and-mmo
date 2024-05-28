import { Creator } from "./util/creator";
import * as p2 from "p2-es";
import { getRenderForBody } from "./util/net";
import { RenderOptions } from "../components/renderOptions";
import { Render } from "../components/render";

const renderCreator = new Creator(async (bodyId: string, b: p2.Body) => {
  const ren = getRenderForBody(bodyId);

  const container = ren.component(Render)!.container;

  // Update positions pre add to ensure no jitter
  container.x = b.position[0];
  container.y = b.position[1];

  if (!ren.component(RenderOptions)?.options.fixed) {
    container.rotation = b.angle;
  }

  scene.camera.addChild(container);

  // if (data.id === socket.id) {
  //   scene.camera.follow(g, {
  //     minX: 0,
  //     minY: 0,
  //     maxY: 0,
  //   });
  // }

  return {
    data: ren,
    destroy: () => container.destroy(),
  };
});

export function renderBodies(bodyIds: number[]) {
  world.bodies.forEach(async (b) => {
    const bodyId = bodyIds.find((id) => id === b.id);
    if (!bodyId) return;

    renderCreator.create(bodyId, b);

    const r = renderCreator.get(bodyId);
    if (!r) return;

    const container = r.component(Render)!.container;

    container.x = b.position[0];
    container.y = b.position[1];
    container.zIndex = b.position[1];

    if (!r.component(RenderOptions)?.options.fixed) {
      container.rotation = b.angle;
    }

    r.update();
  });

  const used = bodyIds.map((id) => id.toString());
  renderCreator.created.forEach((k) => {
    if (!used.includes(k)) {
      renderCreator.remove(k);
    }
  });
}
