import * as PIXI from "pixi.js";
import { KeyManager } from "./key";
import { SceneManager } from "./scene";
import { Application } from "pixi.js";
import * as Vec from "./util/vec";
import * as Rad from "./util/rad";
import { World } from "./physics/world";
import { Body } from "./physics/body";

const app = new Application();
await app.init({ resizeTo: window });
document.body.appendChild(app.canvas);
// @ts-expect-error
globalThis.__PIXI_APP__ = app;

const scene = new SceneManager(app, { preload, game });
const key = new KeyManager(app);
const world = new World();
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
  const body = new Body({
    type: "kinematic",
    width: player.width,
    height: player.height,
  });
  body.x = player.x;
  body.y = player.y;
  app.ticker.add(() => {
    player.x = body.x;
    player.y = body.y;
  });
  world.add(body);
  body.acc.x = 0.001;

  const wall = new PIXI.Graphics();
  wall.rect(0, 0, 10, 400);
  wall.fill("#222222");
  wall.x = 700;
  wall.y = 100;
  const wallBody = new Body({
    type: "kinematic",
    width: wall.width,
    height: wall.height,
  });
  wallBody.x = wall.x;
  wallBody.y = wall.y;
  app.ticker.add(() => {
    wall.x = wallBody.x;
    wall.y = wallBody.y;
  });
  world.add(wallBody);
  app.stage.addChild(wall);

  app.ticker.add(() => {
    const dir = Vec.direction({ head: key.mouse, tail: player });
    player.rotation = dir - Rad.toRad(90);
  });
}
