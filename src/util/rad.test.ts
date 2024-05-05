import { expect, describe, test } from "vitest";
import * as Rad from "./rad";

describe("rad", () => {
  const _90 = 1.5707963267948966;
  const _45 = 0.7853981633974483;

  test("toRad", () => {
    expect(Rad.toRad(90)).toEqual(_90);
    expect(Rad.toRad(45)).toEqual(_45);
  });

  test("toDeg", () => {
    expect(Rad.toDeg(_90)).toEqual(90);
    expect(Rad.toDeg(_45)).toEqual(45);
  });
});
