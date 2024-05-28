import { BaseComponent } from "../base";
import * as PIXI from "pixi.js";

export class Render extends BaseComponent {
  container = new PIXI.Container();

  constructor(cb: (c: PIXI.Container) => void) {
    super();
    cb(this.container);
  }
}
