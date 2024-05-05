import { Body } from "./body";

export function isColliding(a: Body, b: Body) {
  if (
    a.bottom < b.top ||
    a.top > b.bottom ||
    a.right < b.left ||
    a.left > b.right
  ) {
    return false;
  }
  return true;
}

// TODO should this be configurable
const STICKY_THRESHOLD = 0.0004;

export function resolveCollison(a: Body, b: Body) {
  const dx = (b.midX - a.midX) / b.halfWidth;
  const dy = (b.midY - a.midY) / b.halfHeight;

  const absDX = Math.abs(dx);
  const absDY = Math.abs(dy);

  // TODO should this threshold be configurable
  if (Math.abs(absDX - absDY) < 0.1) {
    if (dx < 0) {
      a.x = b.right;
    } else {
      a.x = b.left - a.width;
    }

    if (dy < 0) {
      a.y = b.bottom;
    } else {
      a.y = b.top - a.height;
    }

    // TODO remove randomness
    if (Math.random() < 0.5) {
      a.vel.x = -a.vel.x * b.bounce;
      if (Math.abs(a.vel.x) < STICKY_THRESHOLD) {
        a.vel.x = 0;
      }
    } else {
      a.vel.y = -a.vel.y * b.bounce;
      if (Math.abs(a.vel.y) < STICKY_THRESHOLD) {
        a.vel.y = 0;
      }
    }
  } else if (absDX > absDY) {
    if (dx < 0) {
      a.x = b.right;
    } else {
      a.x = b.left - a.width;
    }

    a.vel.x = -a.vel.x * b.bounce;

    if (Math.abs(a.vel.x) < STICKY_THRESHOLD) {
      a.vel.x = 0;
    }
  } else {
    if (dy < 0) {
      a.y = b.bottom;
    } else {
      a.y = b.top - a.height;
    }

    a.vel.y = -a.vel.y * b.bounce;
    if (Math.abs(a.vel.y) < STICKY_THRESHOLD) {
      a.vel.y = 0;
    }
  }
}
