// import {
//   GEOMETRIC_ANGLE_TOLERANCE,
//   GEOMETRIC_TOLERANCE,
// } from "../../../constants.js";

import { createVector, addVectors, subtractVectors } from "./geometry.js";

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

// function createVector(point1 = { x, y }, point2 = { x, y }) {
//   return subtractVectors(point2, point1);
// }

//   if (Math.abs(vector.x) < GEOMETRIC_TOLERANCE) vector.x = 0;
//   if (Math.abs(vector.y) < GEOMETRIC_TOLERANCE) vector.y = 0;

//   return vector;
// }

// export function createPointBetweenAB(a = { x, y }, b = { x, y }) {
//   return {
//     x: (a.x + b.x) / 2,
//     y: (a.y + b.y) / 2,
//   };
// }

// export function computeLength(vector = { x, y }) {
//   const length = Math.sqrt(vector.x * vector.x + vector.y * vector.y);

//   if (length < GEOMETRIC_TOLERANCE) {
//     return 0;
//   } else {
//     return length;
//   }
// }

// // Returns null if the two lines are parallel or on the same line.
// export function findIntersectionBetweenLines(
//   line1 = { vertex1, vertex2 },
//   line2 = { vertex1, vertex2 }
// ) {
//   if (!line1.vector) line1.vector = createVector(line1.vertex1, line1.vertex2);
//   if (!line2.vector) line2.vector = createVector(line2.vertex1, line2.vertex2);

//   const a = line1.vertex1;
//   const vector1 = line1.vector;

//   const c = line2.vertex1;
//   const vector2 = line2.vector;

//   // Equivalent to slope1 = slope2 for parallel lines (then denominator = 0).
//   const denominator = vector2.y * vector1.x - vector2.x * vector1.y;

//   // Directed angle from vector1 to vector2 (counter-clockwise).
//   let angle =
//     Math.atan2(vector2.y, vector2.x) - Math.atan2(vector1.y, vector1.x);
//   angle = angle < 0 ? angle + 2 * Math.PI : angle; // Normalize to range [0,2*PI).
//   const acuteAngle = angle > Math.PI ? angle - Math.PI : angle; // Get the acute angle.

//   if (denominator === 0 || acuteAngle < GEOMETRIC_ANGLE_TOLERANCE) {
//     // The two lines are parallel or on the same line.
//     return null;
//   }

//   // t1 describes how far along line1 the intersection lies (0: on A, 1: on B).
//   const t1 = (vector2.x * (a.y - c.y) - vector2.y * (a.x - c.x)) / denominator;

//   return {
//     x: a.x + t1 * vector1.x,
//     y: a.y + t1 * vector1.y,
//   };
// }

// export function offsetEdgeByVector(
//   edge = { vertex1, vertex2, length },
//   vector = { x, y }
// ) {
//   if (!edge.vector) edge.vector = createVector(edge.vertex1, edge.vertex2);
//   if (!edge.length) edge.length = computeLength(edge.vector);

//   const offsetVertex1 = {
//     x: edge.vertex1.x + vector.x,
//     y: edge.vertex1.y + vector.y,
//   };

//   const offsetVertex2 = {
//     x: edge.vertex2.x + vector.x,
//     y: edge.vertex2.y + vector.y,
//   };

//   return {
//     vertex1: offsetVertex1,
//     vertex2: offsetVertex2,
//     vector: edge.vector,
//     length: edge.length,
//   };
// }

// // 'Outward' is to the left.
// export function createOutwardUnitNormal(
//   edge = { vector, length },
//   isClockwise = true
// ) {
//   if (!edge.length) {
//     edge.length = computeLength(edge.vector);
//   }

//   return {
//     x: (-isClockwise * edge.vector.y) / edge.length,
//     y: (isClockwise * edge.vector.x) / edge.length,
//   };
// }

// // Returns 0 if the polygon has no orientation
// // (e.g. a perfect 8-shape or a zero-area polygon).
// export function isPolygonClockwise(polygon) {
//   let sum = 0;

//   for (let i = 0; i < polygon.length; i++) {
//     let next = (i + 1) % polygon.length;
//     // Sum twice the area between x axis and edge i,next.
//     sum += (polygon[next].x - polygon[i].x) * (polygon[next].y + polygon[i].y);
//   }

//   return Math.sign(sum);
// }

// // Returns >0 if point is on the left of vector a to b,
// // =0 if point is on the line through a and b,
// // <0 if point is on the right of vector a to b.
// // TODO: Incorporate geometric tolerance.
// export function isPointLeftOfAB(point, a, b) {
//   return (b.x - a.x) * (point.y - a.y) - (point.x - a.x) * (b.y - a.y);
// }

// export function isPositionInPolygon(position, polygon) {
//   let windingNumber = 0;

//   for (const [i, vertexI] of polygon.entries()) {
//     const j = i + 1;
//     const vertexJ = polygon[j % polygon.length];

//     if (vertexI.y <= position.y) {
//       if (
//         vertexJ.y > position.y &&
//         isPointLeftOfAB(position, vertexI, vertexJ) > 0
//       ) {
//         windingNumber += 1; // I to J is crossing from bottom into the first quadrant.
//       }
//     } else if (
//       vertexJ.y <= position.y &&
//       isPointLeftOfAB(position, vertexI, vertexJ) < 0
//     ) {
//       windingNumber -= 1; // I to J is crossing from top in the fourth quadrant.
//     }
//   }

//   return windingNumber !== 0;
// }