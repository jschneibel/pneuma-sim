export function createVector(point1 = { x, y }, point2 = { x, y }) {
  return subtractVectors(point2, point1);
}

export function addVectors(vector1 = { x, y }, vector2 = { x, y }) {
  return {
    x: vector1.x + vector2.x,
    y: vector1.y + vector2.y,
  };
}

export function subtractVectors(vector1 = { x, y }, vector2 = { x, y }) {
  return {
    x: vector1.x - vector2.x,
    y: vector1.y - vector2.y,
  };
}

export function createPointBetweenAB(a = { x, y }, b = { x, y }) {
  return {
    x: (a.x + b.x) / 2,
    y: (a.y + b.y) / 2,
  };
}

export function computeLength(vector = { x, y }) {
  return Math.sqrt(vector.x * vector.x + vector.y * vector.y);
}

// Returns null if the two lines are parallel or on the same line.
export function findIntersectionBetweenLines(
  line1 = { vertex1, vertex2 },
  line2 = { vertex1, vertex2 }
) {
  if (!line1.vector) line1.vector = createVector(line1.vertex1, line1.vertex2);
  if (!line2.vector) line2.vector = createVector(line2.vertex1, line2.vertex2);

  const a = line1.vertex1;
  const vector1 = line1.vector;

  const c = line2.vertex1;
  const vector2 = line2.vector;

  const denominator = vector2.y * vector1.x - vector2.x * vector1.y;

  if (denominator === 0) {
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

export function offsetEdgeByVector(
  edge = { vertex1, vertex2, length },
  vector = { x, y }
) {
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

// 'Outward' is to the left.
export function createOutwardUnitNormal(
  edge = { vector, length },
  isClockwise = true
) {
  if (!edge.length) {
    edge.length = computeLength(edge.vector);
  }

  return {
    x: (-isClockwise * edge.vector.y) / edge.length,
    y: (isClockwise * edge.vector.x) / edge.length,
  };
}

// Returns 0 if the polygon has no orientation
// (e.g. a perfect 8-shape or a zero-area polygon).
export function isPolygonClockwise(polygon) {
  let sum = 0;

  for (let i = 0; i < polygon.length; i++) {
    let next = (i + 1) % polygon.length;
    // Sum twice the area between x axis and edge i,next.
    sum += (polygon[next].x - polygon[i].x) * (polygon[next].y + polygon[i].y);
  }

  return Math.sign(sum);
}

// Returns >0 if point is on the left of vector a to b,
// =0 if point is on the line through a and b,
// <0 if point is on the right of vector a to b.
export function isPointLeftOfAB(point, a, b) {
  return (b.x - a.x) * (point.y - a.y) - (point.x - a.x) * (b.y - a.y);
}

export function isPositionInPolygon(position, polygon) {
  let windingNumber = 0;

  polygon.forEach((vertexI, i) => {
    const vertexJ = polygon[(i + 1) % polygon.length];

    if (vertexI.y <= position.y) {
      if (
        vertexJ.y > position.y &&
        isPointLeftOfAB(position, vertexI, vertexJ) > 0
      ) {
        windingNumber += 1; // I to J is crossing from bottom into the first quadrant.
      }
    } else if (
      vertexJ.y <= position.y &&
      isPointLeftOfAB(position, vertexI, vertexJ) < 0
    ) {
      windingNumber -= 1; // I to J is crossing from top in the fourth quadrant.
    }
  });

  return windingNumber !== 0;
}
