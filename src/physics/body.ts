import * as Vec from "../util/vec";

type BodyType = "static" | "dynamic" | "kinematic";
type SolverType = "elastic";

export type Options = {
  type: BodyType;
  width: number;
  height: number;
};

export class Body {
  type: BodyType;
  solver: SolverType = "elastic";

  x = 0;
  y = 0;
  width: number;
  height: number;
  vel = Vec.zero();
  acc = Vec.zero();
  bounce: number = 0.2;

  constructor({ type, width, height }: Options) {
    this.type = type;
    this.width = width;
    this.height = height;
  }

  get halfWidth() {
    return this.width / 2;
  }
  get halfHeight() {
    return this.height / 2;
  }
  get midX() {
    return this.halfWidth + this.x;
  }
  get midY() {
    return this.halfHeight + this.y;
  }
  get top() {
    return this.y;
  }
  get left() {
    return this.x;
  }
  get right() {
    return this.x + this.width;
  }
  get bottom() {
    return this.y + this.height;
  }
}
