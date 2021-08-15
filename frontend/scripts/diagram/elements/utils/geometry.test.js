// import {
//   GEOMETRIC_ANGLE_TOLERANCE,
//   GEOMETRIC_TOLERANCE,
// } from "../../../constants.js";

import {
  createVector,
  addVectors,
  subtractVectors,
  createPointBetweenAB,
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
});

test("subtractVectors", () => {
  const diff = { x: 2, y: -2 };
  const diffOnlyX = { x: 2, y: -4 };
  const diffNan = { x: 2, y: NaN };
  const diffString = { x: 2, y: -2 };

  expect(subtractVectors(a, b)).toStrictEqual(diff);
  expect(subtractVectors(a, bUndefinedY)).toStrictEqual(diffNan);
  expect(subtractVectors(a, bUndefinedY2)).toStrictEqual(diffNan);
  expect(subtractVectors(a, bNan)).toStrictEqual(diffNan);
  expect(subtractVectors(a, bNull)).toStrictEqual(diffOnlyX);
  expect(subtractVectors(a, bString)).toStrictEqual(diffString);
  expect(() => subtractVectors(a, undefined)).toThrowError();
});

test("createVector", () => {
  expect(createVector(a, b)).toStrictEqual(subtractVectors(b, a));
});

test("createPointBetweenAB", () => {
  expect(createPointBetweenAB(a, b)).toStrictEqual({ x: 4, y: -3 });
});
