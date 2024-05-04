export interface Point {
  x: number;
  y: number;
}

export function randInt(min: number, max: number) {
  return Math.round((max - min) * Math.random()) + min;
}

export function angleTo(a: Point, b: Point) {
  return (Math.atan2(b.y - a.y, b.x - a.x) / Math.PI) * 180;
}

export function addInDir(a: Point, dir: number, dist: number) {
  return {
    x: a.x - dist * Math.cos((dir * Math.PI) / 180),
    y: a.y - dist * Math.sin((dir * Math.PI) / 180),
  };
}

export function angleDelta(a: number, b: number) {
  const diff = a - b;
  if (diff > 180) return diff - 360;
  return diff;
}
