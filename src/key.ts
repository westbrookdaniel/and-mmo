import * as PIXI from "pixi.js";

export interface KeymapEntry {
  alias: string;
  keys: string[];
}

export class KeyManager {
  private entries: KeymapEntry[] = [];
  mouse = { x: 0, y: 0 };
  map = new Map<string, boolean>();

  constructor(private app: PIXI.Application) {
    app.stage.eventMode = "static";
    app.stage.hitArea = app.screen;
  }

  private onKey(key: string, pressed: boolean) {
    this.entries.forEach((entry) => {
      if (entry.alias === "mouse" || entry.alias === "set") return;
      if (entry.keys.includes(key)) this.map.set(entry.alias, pressed);
    });
  }

  set(entries: KeymapEntry[]) {
    if (this.entries.length === 0) {
      this.app.stage.on("mousemove", (e) => {
        this.mouse.x = e.global.x;
        this.mouse.y = e.global.y;
      });

      document.addEventListener("keydown", (e) => this.onKey(e.key, true));
      document.addEventListener("keyup", (e) => this.onKey(e.key, false));
    }
    entries.push(...entries);
  }
}
