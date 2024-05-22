import * as PIXI from "pixi.js";
import * as p2 from "p2-es";
import { GameObject } from "../util/object";

interface Options {
  width: number;
  height: number;
  color: string;
  body: p2.BodyOptions;
}

export class BoxObject extends GameObject<PIXI.Graphics> {
  constructor(id: string, { width, height, color, body }: Options) {
    super(
      id,
      new p2.Body(body),
      new PIXI.Graphics()
        .rect(-width / 2, -height / 2, width, height)
        .fill(color),
    );

    this.body.addShape(new p2.Box({ width, height }));

    this.update(() => {
      this.display.x = this.body.position[0];
      this.display.y = this.body.position[1];
      this.display.angle = this.body.angle;
    });
  }
}
