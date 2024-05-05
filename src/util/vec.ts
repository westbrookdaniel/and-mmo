export interface Vector {
  x: number;
  y: number;
}

export function zero(): Vector {
  return { x: 0, y: 0 };
}

export function add(a: Vector, b: Vector): Vector {
  return { x: a.x + b.x, y: a.y + b.y };
}

export function sub(a: Vector, b: Vector): Vector {
  return { x: a.x - b.x, y: a.y - b.y };
}

export function scale(a: Vector, s: number): Vector {
  return { x: a.x * s, y: a.y * s };
}

export function dot(a: Vector, b: Vector): number {
  return a.x * b.x + a.y * b.y;
}

export function cross(a: Vector, b: Vector): number {
  return a.x * b.y - a.y * b.x;
}

export function length(v: Vector): number {
  return Math.fround(Math.sqrt(v.x * v.x + v.y * v.y));
}

/**
 * In radians
 * If no tail provided will assume it is { x: 0, y: 0 }
 */
export function direction({
  head,
  tail = { x: 0, y: 0 },
}: {
  head: Vector;
  tail?: Vector;
}): number {
  const y = tail.y - head.y;
  const x = tail.x - head.x;
  return (Math.atan2(y, x) / Math.PI) * Math.PI;
}

/** In radians */
export function rotate({
  toRotate,
  angle,
  anchor,
}: {
  toRotate: Vector;
  angle: number;
  anchor: Vector;
}): Vector {
  const x = toRotate.x - anchor.x;
  const y = toRotate.y - anchor.y;
  const c = Math.cos(angle);
  const s = Math.sin(angle);
  return {
    x: Math.fround(anchor.x + (x * c - y * s)),
    y: Math.fround(anchor.y + (x * s + y * c)),
  };
}
