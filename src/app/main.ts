import * as PIXI from "pixi.js";
import { io, Socket } from "socket.io-client";
import { KeyManager } from "./util/key";
import { SceneManager } from "./util/scene";
import { Application } from "pixi.js";
import * as p2 from "p2-es";

const app = new Application();
// @ts-expect-error
globalThis.__PIXI_APP__ = app;

declare global {
  var scene: SceneManager;
  var key: KeyManager;
  var socket: Socket;
  var world: p2.World;
}

app.init({ resizeTo: window }).then(() => {
  document.body.appendChild(app.canvas);

  globalThis.scene = new SceneManager(app, { preload, game });
  globalThis.key = new KeyManager();

  globalThis.socket = io(
    import.meta.env.MODE === "development"
      ? "http://localhost:4000"
      : window.location.origin,
  );

  globalThis.world = new p2.World({ gravity: [0, 0] });

  const step = 1 / 60;
  function tick(delta: number) {
    world.step(step, delta, 10);
    requestAnimationFrame(tick);
  }
  tick(step);

  scene.set("preload");
});

async function preload() {
  key.set([
    { alias: "left", keys: ["a", "A", "ArrowLeft"] },
    { alias: "right", keys: ["d", "D", "ArrowRight"] },
    { alias: "up", keys: ["w", "W", "ArrowUp"] },
    { alias: "down", keys: ["s", "S", "ArrowDown"] },
  ]);

  scene.set("game");
}

async function game() {
  const bg = new PIXI.Graphics();
  bg.rect(0, 0, 150, 90);
  bg.fill("#333");
  scene.camera.addChild(bg);

  let lastTick: any[] = [];
  socket.on("tick", (objects) => {
    const using: string[] = [];

    // Client Physics and Sync
    // TODO combine server/client body/size/color configs in data request and not every tick
    objects.forEach(([bodyId, data, pos, angle, vel, angVel]: any) => {
      if (!world.bodies.find((b) => b.id === bodyId)) {
        const body = new p2.Body({
          position: pos,
          mass: 1,
          damping: 0.7,
          fixedRotation: false,
          angle,
          id: bodyId,
        });
        const shape = new p2.Box({ width: data.width, height: data.height });
        body.addShape(shape);
        world.addBody(body);
      }

      const body = world.bodies.find((b) => b.id === bodyId);
      if (body) {
        body.position = pos;
        body.angle = angle;
        body.velocity = vel;
        body.angularVelocity = angVel;
      }

      using.push(bodyId.toString());
    });

    world.bodies.forEach((b) => {
      if (!using.includes(b.id.toString())) {
        world.removeBody(b);
      }
    });

    lastTick = objects;
  });

  // Client Rendering
  const existing: Record<number, PIXI.Graphics> = {};
  app.ticker.add(() => {
    const using: string[] = [];

    // TODO combine server/client body/size/color configs in data request and not every tick
    world.bodies.forEach((b) => {
      const last = lastTick.find((l) => l[0] === b.id);
      if (!last) return;
      const [bodyId, data] = last;
      if (!existing[bodyId]) {
        const g = new PIXI.Graphics()
          .rect(-data.width / 2, -data.height / 2, data.width, data.height)
          .fill(data.color);
        scene.camera.addChild(g);

        existing[bodyId] = g;

        // if (data.id === socket.id) {
        //   scene.camera.follow(g, {
        //     minX: 0,
        //     minY: 0,
        //     maxY: 0,
        //   });
        // }
      }

      const g = existing[bodyId];
      g.x = b.position[0];
      g.y = b.position[1];
      g.rotation = b.angle;

      using.push(bodyId.toString());
    });

    Object.keys(existing).forEach((k) => {
      if (!using.includes(k.toString())) {
        existing[k as any].destroy();
        delete existing[k as any];
      }
    });
  });

  // setTimeout(() => scene.set("game"), 2000);
}
