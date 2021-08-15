/**
 * @file This file provides utility functions to solve common geometric tasks.
 * @author Jonathan Schneibel
 * @module
 */

import {
  GEOMETRIC_ANGLE_TOLERANCE,
  GEOMETRIC_TOLERANCE,
} from "../../../constants.js";

/**
 * Returns a vector that points from point1 to point2. Equivalent to calling
 * {@link subtractVectors subtractVectors(point2, point1)}. Doesn't check for
 * undefined, null or NaN values.
 *
 * @param {{ x: number, y: number }} point1
 * @param {{ x: number, y: number }} point2
 * @returns {{ x: number, y: number }} Vector from point1 to point2.
 */
export function createVector(point1, point2) {
  return subtractVectors(point2, point1);
}

/**
 * Returns a vector that is the sum of two vectors. Doesn't check for undefined,
 * null or NaN values.
 *
 * @param {{ x: number, y: number }} vector1
 * @param {{ x: number, y: number }} vector2
 * @returns {{ x: number, y: number }} Vector sum of vector1 and vector2.
 */
export function addVectors(vector1, vector2) {
  return {
    x: vector1.x + vector2.x,
    y: vector1.y + vector2.y,
  };
}

/**
 * Returns a vector that is the difference of two vectors, i.e. vector1 -
 * vector2. If the resulting x or y coordinates are smaller than
 * {@link GEOMETRIC_ANGLE_TOLERANCE}, then they will be set to 0. Doesn't check
 * for undefined, null or NaN values.
 *
 * @param {{ x: number, y: number }} vector1
 * @param {{ x: number, y: number }} vector2
 * @returns {{ x: number, y: number }} Vector difference of vector1 and vector2.
 */
export function subtractVectors(vector1, vector2) {
  const vector = {
    x: vector1.x - vector2.x,
    y: vector1.y - vector2.y,
  };

  if (Math.abs(vector.x) < GEOMETRIC_TOLERANCE) vector.x = 0;
  if (Math.abs(vector.y) < GEOMETRIC_TOLERANCE) vector.y = 0;

  return vector;
}

/**
 * Returns a point that lies in the middle between a and b. Doesn't check for
 * undefined, null or NaN values.
 *
 * @param {{ x: number, y: number }} a
 * @param {{ x: number, y: number }} b
 * @returns {{ x: number, y: number }} Point that lies in the middle between a and b.
 */
export function createPointBetweenAB(a, b) {
  return {
    x: (a.x + b.x) / 2,
    y: (a.y + b.y) / 2,
  };
}

/**
 * Returns the length of a given vector. Returns 0 if the length is smaller than
 * {@link GEOMETRIC_TOLERANCE}. Doesn't check for undefined, null or NaN values.
 *
 * @param {{ x: number, y: number }} vector
 * @returns {number} Length of the vector.
 */
export function computeLength(vector) {
  const length = Math.sqrt(vector.x * vector.x + vector.y * vector.y);

  if (length < GEOMETRIC_TOLERANCE) {
    return 0;
  } else {
    return length;
  }
}

/**
 * Returns the point where line1 and line2 intersect, or null if they are
 * parallel. The lines are considered parallel if the acute angle between them
 * is less than {@link GEOMETRIC_ANGLE_TOLERANCE}. Doesn't check for undefined,
 * null or NaN values.
 *
 * @param {{
 *   vertex1: { x: number, y: number },
 *   vertex2: { x: number, y: number },
 *   vector: { x: number, y: number } | undefined
 * }} line1
 * @param {{
 *   vertex1: { x: number, y: number },
 *   vertex2: { x: number, y: number },
 *   vector: { x: number, y: number } | undefined
 * }} line2
 * @returns {{ x: number, y: number } | null} Point where the lines intersect,
 *   or null if the lines are parallel.
 */
export function findIntersectionBetweenLines(line1, line2) {
  if (!line1.vector) line1.vector = createVector(line1.vertex1, line1.vertex2);
  if (!line2.vector) line2.vector = createVector(line2.vertex1, line2.vertex2);

  const a = line1.vertex1;
  const vector1 = line1.vector;

  const c = line2.vertex1;
  const vector2 = line2.vector;

  // Equivalent to slope1 = slope2 for parallel lines (then denominator = 0).
  const denominator = vector2.y * vector1.x - vector2.x * vector1.y;

  // Directed angle from vector1 to vector2 (counter-clockwise).
  let angle =
    Math.atan2(vector2.y, vector2.x) - Math.atan2(vector1.y, vector1.x);
  angle = angle < 0 ? angle + 2 * Math.PI : angle; // Normalize to range [0,2*PI).
  const acuteAngle = angle > Math.PI ? angle - Math.PI : angle; // Get the acute angle.

  if (denominator === 0 || acuteAngle < GEOMETRIC_ANGLE_TOLERANCE) {
    // The two lines are parallel or on the same line.
    return null;
  }

  // t1 describes how far along line1 the intersection lies (0: on A, 1: on B).
  const t1 = (vector2.x * (a.y - c.y) - vector2.y * (a.x - c.x)) / denominator;

  return {
    x: a.x + t1 * vector1.x,
    y: a.y + t1 * vector1.y,
  };
}

/**
 * Returns a new edge that has the same direction and length as the given edge,
 * but is translated by the given vector. Doesn't check for undefined, null or
 * NaN values.
 *
 * @param {{
 *   vertex1: { x: number, y: number },
 *   vertex2: { x: number, y: number },
 *   vector: { x: number, y: number } | undefined,
 *   length: number | undefined
 * }} edge
 * @param {{ x: number, y: number }} vector
 * @returns {{
 *   vertex1: { x: number, y: number },
 *   vertex2: { x: number, y: number },
 *   vector: { x: number, y: number },
 *   length: number
 * }}
 *   New edge after translation by the given vector.
 */
export function offsetEdgeByVector(edge, vector) {
  if (!edge.vector) edge.vector = createVector(edge.vertex1, edge.vertex2);
  if (!edge.length) edge.length = computeLength(edge.vector);

  const offsetVertex1 = {
    x: edge.vertex1.x + vector.x,
    y: edge.vertex1.y + vector.y,
  };

  const offsetVertex2 = {
    x: edge.vertex2.x + vector.x,
    y: edge.vertex2.y + vector.y,
  };

  return {
    vertex1: offsetVertex1,
    vertex2: offsetVertex2,
    vector: edge.vector,
    length: edge.length,
  };
}

/**
 * Returns a new vector with length 1 that is normal to the given edge and
 * pointing outward from any polygon the edge is part of. I.e. if isClockwise =
 * true, 'outward' is to the left of the edge. Doesn't check for undefined, null
 * or NaN values.
 *
 * @param {{ vector: { x: number, y: number }, length: number | undefined }} edge
 * @param {boolean} isClockwise
 * @returns {{ x: number, y: number }} Unit vector normal to the given edge.
 */
export function createOutwardUnitNormal(edge, isClockwise = true) {
  if (!edge.length) {
    edge.length = computeLength(edge.vector);
  }

  const sign = isClockwise ? 1 : -1;

  return {
    x: (-sign * edge.vector.y) / edge.length,
    y: (sign * edge.vector.x) / edge.length,
  };
}

/**
 * Calculates whether the given polygon is defined in a clockwise or
 * counterclockwise direction. Returns 0 if the polygon has no orientation (e.g.
 * a perfect 8-shape or a zero-area polygon). Doesn't check for undefined, null
 * or NaN values.
 *
 * @param {Array.<{ x: number, y: number }>} polygon Polygon given as an array of vertices.
 * @returns {number} 1 if the polygon is clockwise, -1 if counterclockwise, and
 *   0 if without orientation.
 */
export function isPolygonClockwise(polygon) {
  let sum = 0;

  for (let i = 0; i < polygon.length; i++) {
    let next = (i + 1) % polygon.length;
    // Sum twice the area between x axis and edge i,next.
    sum += (polygon[next].x - polygon[i].x) * (polygon[next].y + polygon[i].y);
  }

  return Math.sign(sum);
}

/**
 * Calculates whether a given point is on the left, right, or on a line through
 * a and b. Doesn't check for undefined, null or NaN values.
 *
 * @param {{ x: number, y: number }} point
 * @param {{ x: number, y: number }} a
 * @param {{ x: number, y: number }} b
 * @returns {number} Returns 1 if the given point is on the left
 *   of vector from a to b; returns 0 if the given point is on the line through
 *   a and b; returns -1 if the given point is on the right of
 *   vector a to b.
 */
export function isPointLeftOfAB(point, a, b) {
  return Math.sign(
    (b.x - a.x) * (point.y - a.y) - (point.x - a.x) * (b.y - a.y)
  );
}

/**
 * Determines whether a given point is in a given polygon.
 * If the point is right on the polygon boundary, the point is considered to be
 * within the polygon. Doesn't check for undefined, null or NaN values.
 *
 * @param {{ x: number, y: number }} point
 * @param {Array.<{ x: number, y: number }>} polygon Polygon given as an array of vertices.
 * @returns {boolean} Returns true if the point is within the given polygon.
 */
export function isPointInPolygon(point, polygon) {
  let windingNumber = 0;

  for (const [i, vertexI] of polygon.entries()) {
    const j = i + 1;
    const vertexJ = polygon[j % polygon.length];

    if (vertexI.y <= point.y) {
      if (vertexJ.y > point.y && isPointLeftOfAB(point, vertexI, vertexJ) > 0) {
        windingNumber += 1; // I to J is crossing from bottom into the first quadrant.
      }
    } else if (
      vertexJ.y <= point.y &&
      isPointLeftOfAB(point, vertexI, vertexJ) < 0
    ) {
      windingNumber -= 1; // I to J is crossing from top in the fourth quadrant.
    }
  }

  return windingNumber !== 0;
}
