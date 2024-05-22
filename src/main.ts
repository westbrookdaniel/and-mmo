import * as PIXI from "pixi.js";
import * as p2 from "p2-es";
import { KeyManager } from "./util/key";
import { SceneManager } from "./util/scene";
import { Application } from "pixi.js";
import { PlayerObject } from "./objects/player";
import { BoxObject } from "./objects/box";
import { EnemyObject } from "./objects/enemy";

const app = new Application();
// @ts-expect-error
globalThis.__PIXI_APP__ = app;

declare global {
  var world: p2.World;
  var scene: SceneManager;
  var key: KeyManager;
}

app.init({ resizeTo: window }).then(() => {
  document.body.appendChild(app.canvas);

  globalThis.key = new KeyManager();
  globalThis.world = new p2.World({ gravity: [0, 5] });
  globalThis.scene = new SceneManager(app, { preload, game });

  app.ticker.add((t) => world.step(1 / 60, t.deltaMS, 10));

  scene.set("preload");
});

async function preload() {
  key.set([
    { alias: "left", keys: ["a", "A", "ArrowLeft"] },
    { alias: "right", keys: ["d", "D", "ArrowRight"] },
    { alias: "up", keys: ["w", "W", "ArrowUp", " "] },
    { alias: "down", keys: ["s", "S", "ArrowDown"] },
  ]);

  scene.set("game");
}

async function game() {
  const bg = new PIXI.Graphics();
  bg.rect(0, 0, 150, 90);
  bg.fill("#4a3426");
  scene.camera.addChild(bg);

  const player = new PlayerObject("player", {
    x: 30,
    y: 20,
  });

  scene.camera.follow(player.display, {
    minX: 0,
    minY: 0,
    maxY: 0,
    offsetY: 100,
  });

  new BoxObject("floor", {
    width: 90,
    height: 1,
    color: "#222",
    body: {
      position: [60, 40],
      mass: 0,
    },
  });

  new EnemyObject("enemy", {
    x: 80,
    y: 20,
  });

  // TODO a lil physics push over to check rotation works
  // TODO scale game size to screen?

  // setTimeout(() => scene.set("game"), 2000);
}
