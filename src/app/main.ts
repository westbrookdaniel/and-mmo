import * as PIXI from "pixi.js";
import { io, Socket } from "socket.io-client";
import { KeyManager } from "./util/key";
import { SceneManager } from "./util/scene";
import { Application } from "pixi.js";

const app = new Application();
// @ts-expect-error
globalThis.__PIXI_APP__ = app;

declare global {
  var scene: SceneManager;
  var key: KeyManager;
  var socket: Socket;
}

app.init({ resizeTo: window }).then(() => {
  document.body.appendChild(app.canvas);

  globalThis.scene = new SceneManager(app, { preload, game });
  globalThis.key = new KeyManager();

  globalThis.socket = io(
    import.meta.env.NODE_ENV === "production"
      ? window.location.origin
      : "http://localhost:4000",
  );

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

  const bodies: Record<number, PIXI.Graphics> = {};

  socket.on("tick", (objects) => {
    const using: string[] = [];

    objects.forEach(([bodyId, data, x, y, angle]: any) => {
      if (!bodies[bodyId]) {
        const g = new PIXI.Graphics()
          .rect(-data.width / 2, -data.height / 2, data.width, data.height)
          .fill(data.color);
        scene.camera.addChild(g);
        bodies[bodyId] = g;

        // if (data.id === socket.id) {
        //   scene.camera.follow(g, {
        //     minX: 0,
        //     minY: 0,
        //     maxY: 0,
        //   });
        // }
      }

      const body = bodies[bodyId];
      body.x = x;
      body.y = y;
      body.rotation = angle;

      using.push(bodyId.toString());
    });

    // TODO Diff to remove
    Object.keys(bodies).forEach((k) => {
      if (!using.includes(k.toString())) {
        bodies[k as any].destroy();
        delete bodies[k as any];
      }
    });
  });

  // setTimeout(() => scene.set("game"), 2000);
}
