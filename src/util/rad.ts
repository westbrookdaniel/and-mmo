/** Converts angle from degrees to radians */
export function toRad(deg: number): number {
  return deg * (Math.PI / 180);
}

/** Converts angle from radians to degrees */
export function toDeg(deg: number): number {
  return deg * (180 / Math.PI);
}
