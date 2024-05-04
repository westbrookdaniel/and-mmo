import * as PIXI from "pixi.js";
import { KeyManager } from "./key";
import { SceneManager } from "./scene";
import { Application } from "pixi.js";
import { angleDelta, angleTo } from "./math";

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

  const helmet = PIXI.Sprite.from("helmet");
  helmet.x = -helmet.width / 2;
  helmet.y = -helmet.height / 2;
  player.addChild(helmet);

  const gun = PIXI.Sprite.from("ak47");
  gun.x = -helmet.width / 2 - 20;
  gun.y = -helmet.height / 2 - 30;
  player.addChild(gun);

  app.stage.addChild(player);

  app.ticker.add(() => {
    // Look at mouse
    const newAngle = angleTo(key.mouse, player);
    const delta = angleDelta(newAngle, player.angle);
    if (Math.sign(delta) > 5) {
      player.angle += Math.sign(delta) * 0.1;
    }
  });
}
