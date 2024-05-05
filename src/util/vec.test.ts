import { expect, describe, test } from "vitest";
import * as Vec from "./vec";
import * as Rad from "./rad";

describe("vec", () => {
  const origin = { x: 0, y: 0 };

  test("add", () => {
    expect(Vec.add(origin, { x: 1, y: 1 })).toEqual({ x: 1, y: 1 });
    expect(Vec.add({ x: 2, y: 4 }, { x: 1, y: 1 })).toEqual({ x: 3, y: 5 });
  });

  test("sub", () => {
    expect(Vec.sub(origin, { x: 1, y: 1 })).toEqual({ x: -1, y: -1 });
    expect(Vec.sub({ x: 2, y: 4 }, { x: 1, y: 1 })).toEqual({ x: 1, y: 3 });
  });

  test("scale", () => {
    expect(Vec.scale(origin, 2)).toEqual(origin);
    expect(Vec.scale({ x: 2, y: 4 }, 3)).toEqual({ x: 6, y: 12 });
  });

  test("dot", () => {
    expect(Vec.dot(origin, { x: 1, y: 1 })).toEqual(0);
    expect(Vec.dot({ x: 2, y: 4 }, { x: 1, y: 1 })).toEqual(6);
  });

  test("cross", () => {
    expect(Vec.cross(origin, { x: 1, y: 1 })).toEqual(0);
    expect(Vec.cross({ x: 2, y: 4 }, { x: 1, y: 1 })).toEqual(-2);
  });

  test("length", () => {
    expect(Vec.length({ x: 0, y: 3 })).toEqual(3);
    expect(Vec.length({ x: 2, y: 6 })).toEqual(6.324555397033691);
  });

  test("rotate", () => {
    expect(
      Vec.rotate({
        toRotate: { x: 2, y: 4 },
        angle: Rad.toRad(90),
        anchor: origin,
      }),
    ).toEqual({ x: -4, y: 2 });
  });

  test("direction", () => {
    expect(
      Vec.direction({
        tail: origin,
        head: { x: 1, y: 1 },
      }),
    ).toEqual(Rad.toRad(-135));
    expect(
      Vec.direction({
        tail: { x: 1, y: 1 },
        head: origin,
      }),
    ).toEqual(Rad.toRad(45));
    expect(
      Vec.direction({
        head: { x: 1, y: 1 },
      }),
    ).toEqual(Rad.toRad(-135));
  });
});
