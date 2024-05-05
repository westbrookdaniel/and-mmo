import * as PIXI from "pixi.js";
import { KeyManager } from "./key";
import { SceneManager } from "./scene";
import { Application } from "pixi.js";
import * as Vec from "./util/vec";
import * as Rad from "./util/rad";

const app = new Application();
await app.init({ resizeTo: window });
document.body.appendChild(app.canvas);
// @ts-expect-error
globalThis.__PIXI_APP__ = app;

const scene = new SceneManager(app, { preload, game });
const key = new KeyManager(app);
scene.set("preload");

async function preload() {
  key.set([
    { alias: "left", keys: ["a", "A", "ArrowLeft"] },
    { alias: "right", keys: ["d", "D", "ArrowRight"] },
    { alias: "up", keys: ["w", "W", "ArrowUp"] },
    { alias: "down", keys: ["s", "S", "ArrowDown"] },
  ]);

  await PIXI.Assets.load([
    { alias: "helmet", src: "/assets/helmet.png" },
    { alias: "ak47", src: "/assets/ak47.png" },
    { alias: "zombie", src: "/assets/zombie.png" },
  ]);

  scene.set("game");
}

async function game(app: PIXI.Application) {
  const bg = new PIXI.Graphics();
  bg.rect(0, 0, screen.width, screen.height);
  bg.fill("#4a3426");
  app.stage.addChild(bg);

  const player = new PIXI.Container();
  player.x = 300;
  player.y = 300;

  const gun = PIXI.Sprite.from("ak47");
  const helmet = PIXI.Sprite.from("helmet");

  gun.x = -helmet.width / 2 + 4;
  gun.y = -helmet.height / 2 - 20;
  player.addChild(gun);

  helmet.x = -helmet.width / 2;
  helmet.y = -helmet.height / 2;
  player.addChild(helmet);

  app.stage.addChild(player);

  app.ticker.add(() => {
    const dir = Vec.direction({ head: key.mouse, tail: player });
    player.rotation = dir - Rad.toRad(90);
  });
}
