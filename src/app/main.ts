import * as PIXI from "pixi.js";
import { io, Socket } from "socket.io-client";
import { KeyManager } from "./util/key";
import { SceneManager } from "./util/scene";
import { Application } from "pixi.js";
import * as p2 from "p2-es";
import { onPhysicsTick } from "./onPhysicsTick";
import { renderBodies } from "./renderBodies";

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
    onPhysicsTick(objects);
    lastTick = objects;
  });

  app.ticker.add(() => {
    renderBodies(lastTick.map((t) => t[0]));
  });

  // setTimeout(() => scene.set("game"), 2000);
}
