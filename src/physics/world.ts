import { Body } from "./body";
import { isColliding, resolveCollison } from "./collision";

// TODO make this configurable
const GRAVITY_X = 0;
const GRAVITY_Y = 0;

const FIXED_STEP = 1 / 60;

export class World {
  private bodies: Body[] = [];
  private total = 0;
  private last = performance.now();

  constructor() {
    requestAnimationFrame(this.step.bind(this));
  }

  add(body: Body) {
    this.bodies.push(body);
  }

  clear() {
    this.bodies = [];
  }

  private step(ms: number) {
    const elapsedTime = ms - this.last;
    this.last = ms;
    this.total += elapsedTime;
    while (this.total >= FIXED_STEP) {
      this.simulate(FIXED_STEP);
      this.total -= FIXED_STEP;
    }
    requestAnimationFrame(this.step.bind(this));
  }

  private simulate(ms: number) {
    const gx = GRAVITY_X * ms;
    const gy = GRAVITY_Y * ms;
    const bodies = this.bodies;

    for (var i = 0, length = bodies.length; i < length; i++) {
      const body = bodies[i];

      switch (body.type) {
        case "dynamic":
          body.vel.x += body.acc.x * ms + gx;
          body.vel.y += body.acc.y * ms + gy;
          body.x += body.vel.x * ms;
          body.y += body.vel.y * ms;
          break;
        case "kinematic":
          body.vel.x += body.acc.x * ms;
          body.vel.y += body.acc.y * ms;
          body.x += body.vel.x * ms;
          body.y += body.vel.y * ms;
          break;
      }

      // TODO optimise this with broad phase collision
      for (var i = 0, length = bodies.length; i < length; i++) {
        const other = bodies[i];

        if (body !== other && isColliding(body, other)) {
          resolveCollison(body, other);
        }
      }
    }
  }
}
