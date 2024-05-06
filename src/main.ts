import * as PIXI from "pixi.js";
import * as p2 from "p2-es";
import { key } from "./key";
import { SceneManager } from "./scene";
import { Application } from "pixi.js";
import { createPlayer } from "./scenes/player";
import { createBox } from "./scenes/box";

const app = new Application();
await app.init({ resizeTo: window });
document.body.appendChild(app.canvas);
// @ts-expect-error
globalThis.__PIXI_APP__ = app;

declare global {
  var world: p2.World;
}
globalThis.world = new p2.World({ gravity: [0, 5] });
app.ticker.add((t) => world.step(1 / 60, t.deltaMS, 10));

const scene = new SceneManager(app, { preload, game });
scene.set("preload");

async function preload() {
  key.set([
    { alias: "left", keys: ["a", "A", "ArrowLeft"] },
    { alias: "right", keys: ["d", "D", "ArrowRight"] },
    { alias: "up", keys: ["w", "W", "ArrowUp"] },
    { alias: "down", keys: ["s", "S", "ArrowDown"] },
  ]);

  scene.set("game");
}

async function game(c: PIXI.Container) {
  const bg = new PIXI.Graphics();
  bg.rect(0, 0, screen.width, screen.height);
  bg.fill("#4a3426");
  c.addChild(bg);

  const player = createPlayer();
  c.addChild(player.graphics);

  const floor = createBox({
    width: 80,
    height: 1,
    x: 60,
    y: 60,
    fill: "#222",
    body: { mass: 0 },
  });
  c.addChild(floor.graphics);
}
