/**
 * @file Unit tests for ./geometry.js.
 * @author Jonathan Schneibel
 */

import {
  GEOMETRIC_ANGLE_TOLERANCE,
  GEOMETRIC_TOLERANCE,
} from "../../../constants.js";

import {
  createVector,
  addVectors,
  subtractVectors,
  createPointBetweenAB,
  computeLength,
  findIntersectionBetweenLines,
  offsetEdgeByVector,
  createOutwardUnitNormal,
  isPolygonClockwise,
  isPointLeftOfAB,
  isPointInPolygon,
} from "./geometry.js";

const a = { x: 5, y: -4 };
const b = { x: 3, y: -2 };
const bUndefinedY = { x: 3 };
const bUndefinedY2 = { x: 3, y: undefined };
const bNan = { x: 3, y: NaN };
const bNull = { x: 3, y: null };
const bString = { x: 3, y: "-2" };

test("addVectors", () => {
  const sum = { x: 8, y: -6 };
  const sumOnlyX = { x: 8, y: -4 };
  const sumNan = { x: 8, y: NaN };
  const sumString = { x: 8, y: "-4-2" };

  expect(addVectors(a, b)).toStrictEqual(sum);
  expect(addVectors(a, bUndefinedY)).toStrictEqual(sumNan);
  expect(addVectors(a, bUndefinedY2)).toStrictEqual(sumNan);
  expect(addVectors(a, bNan)).toStrictEqual(sumNan);
  expect(addVectors(a, bNull)).toStrictEqual(sumOnlyX);
  expect(addVectors(a, bString)).toStrictEqual(sumString);
  expect(() => addVectors(a, undefined)).toThrowError();
  expect(a).toStrictEqual({ x: 5, y: -4 });
  expect(b).toStrictEqual({ x: 3, y: -2 });
});

test("subtractVectors", () => {
  const diff = { x: 2, y: -2 };
  const diffOnlyX = { x: 2, y: -4 };
  const diffNan = { x: 2, y: NaN };
  const diffString = { x: 2, y: -2 };
  const almostA = { x: a.x + 0.99 * GEOMETRIC_TOLERANCE, y: a.y };

  expect(subtractVectors(a, b)).toStrictEqual(diff);
  expect(subtractVectors(a, bUndefinedY)).toStrictEqual(diffNan);
  expect(subtractVectors(a, bUndefinedY2)).toStrictEqual(diffNan);
  expect(subtractVectors(a, bNan)).toStrictEqual(diffNan);
  expect(subtractVectors(a, bNull)).toStrictEqual(diffOnlyX);
  expect(subtractVectors(a, bString)).toStrictEqual(diffString);
  expect(subtractVectors(a, almostA)).toStrictEqual({ x: 0, y: 0 });
  expect(() => subtractVectors(a, undefined)).toThrowError();
  expect(a).toStrictEqual({ x: 5, y: -4 });
  expect(b).toStrictEqual({ x: 3, y: -2 });
});

test("createVector", () => {
  expect(createVector(a, b)).toStrictEqual(subtractVectors(b, a));
});

test("createPointBetweenAB", () => {
  expect(createPointBetweenAB(a, b)).toStrictEqual({ x: 4, y: -3 });
});

test("computeLength", () => {
  expect(computeLength(a)).toBe(6.4031242374328485);

  const tooShortVector = { x: 0.99 * GEOMETRIC_TOLERANCE, y: 0 };
  expect(computeLength(tooShortVector)).toBe(0);
});

test("findIntersectionBetweenLines", () => {
  const line1 = { vertex1: { x: 0, y: 0 }, vertex2: { x: 10, y: 0 } };
  const line2 = { vertex1: { x: 5, y: 5 }, vertex2: { x: 10, y: -5 } };

  expect(findIntersectionBetweenLines(line1, line2)).toStrictEqual({
    x: 7.5,
    y: 0,
  });

  const line3 = {
    vertex1: { x: 0, y: 0 },
    vertex2: { x: 10, y: 0.99 * 10 * Math.atan(GEOMETRIC_ANGLE_TOLERANCE) },
  };

  expect(findIntersectionBetweenLines(line1, line3)).toBe(null);
});

test("offsetEdgeByVector", () => {
  const line = { vertex1: { x: 5, y: 5 }, vertex2: { x: 10, y: -5 } };

  expect(offsetEdgeByVector(line, a)).toStrictEqual({
    vertex1: { x: 10, y: 1 },
    vertex2: { x: 15, y: -9 },
    vector: { x: 5, y: -10 },
    length: 11.180339887498949,
  });
});

test("createOutwardUnitNormal", () => {
  const edge = { vector: { x: -5, y: -5 } };
  expect(createOutwardUnitNormal(edge, true)).toStrictEqual({
    x: 1 / Math.sqrt(2),
    y: -1 / Math.sqrt(2),
  });
  expect(createOutwardUnitNormal(edge, false)).toStrictEqual({
    x: -1 / Math.sqrt(2),
    y: 1 / Math.sqrt(2),
  });
});

const clockwiseSquare = [
  { x: 1, y: 1 },
  { x: 1, y: -1 },
  { x: -1, y: -1 },
  { x: -1, y: 1 },
];

const counterclockwiseSquare = [
  { x: 1, y: 1 },
  { x: -1, y: 1 },
  { x: -1, y: -1 },
  { x: 1, y: -1 },
];

const figure8 = [
  { x: 1, y: 1 },
  { x: 1, y: -1 },
  { x: -1, y: 1 },
  { x: -1, y: -1 },
];

const line = [
  { x: 0, y: 0 },
  { x: 1, y: 1 },
];

test("isPolygonClockwise", () => {
  expect(isPolygonClockwise(clockwiseSquare)).toBe(1);
  expect(isPolygonClockwise(counterclockwiseSquare)).toBe(-1);
  expect(isPolygonClockwise(figure8)).toBe(0);
  expect(isPolygonClockwise(line)).toBe(0);
});

test("isPointLeftOfAB", () => {
  const a = { x: 0, y: -1 };
  const b = { x: 1, y: 1 };
  const pointLeftOfAB = { x: 0, y: 0 };
  const pointOnAB = { x: 0.5, y: 0 };

  expect(isPointLeftOfAB(pointLeftOfAB, a, b)).toBe(1);
  expect(isPointLeftOfAB(pointLeftOfAB, b, a)).toBe(-1);

  expect(isPointLeftOfAB(pointOnAB, a, b)).toBe(0);
  expect(isPointLeftOfAB(pointOnAB, b, a)).toBe(0);
});

test("isPointInPolygon", () => {
  expect(isPointInPolygon({ x: 0, y: 0 }, clockwiseSquare)).toBe(true);
  expect(isPointInPolygon({ x: -1, y: 0 }, clockwiseSquare)).toBe(true);
  expect(isPointInPolygon({ x: -2, y: 0 }, clockwiseSquare)).toBe(false);

  expect(isPointInPolygon({ x: -0.5, y: 0 }, figure8)).toBe(true);
  expect(isPointInPolygon({ x: 0, y: 0 }, figure8)).toBe(true);
  expect(isPointInPolygon({ x: -2, y: 0 }, figure8)).toBe(false);
});
