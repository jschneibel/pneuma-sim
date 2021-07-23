import { BOUNDING_AREA_PADDING } from "../../../constants.js";

export default function mixinBoundingArea({
  element = {},
  getOrigin = () => ({ x: 0, y: 0 }),
  getElementDimensions = function () {}, // For simple rectangles.
  getCustomArea = () => [], // Polygon for custom shapes (without padding).
}) {
  element.setBoundingArea = function ({
    getOrigin: newGetOrigin,
    getElementDimensions: newGetElementDimensions,
    getCustomArea: newGetCustomArea,
  }) {
    if (newGetOrigin) getOrigin = newGetOrigin;
    if (newGetElementDimensions) getElementDimensions = newGetElementDimensions;
    if (newGetCustomArea) getCustomArea = newGetCustomArea;
  };

  // Returns bounding area in relative coordinates.
  element.getBoundingArea = function () {
    if (getCustomArea().length > 2) {
      // case custom shape
      return createPaddedPolygon(getCustomArea(), BOUNDING_AREA_PADDING);
    } else {
      // case rectangle
      const { width, height } = getElementDimensions();
      return [
        {
          x: -BOUNDING_AREA_PADDING,
          y: -BOUNDING_AREA_PADDING,
        },
        {
          x: BOUNDING_AREA_PADDING + width,
          y: -BOUNDING_AREA_PADDING,
        },
        {
          x: BOUNDING_AREA_PADDING + width,
          y: BOUNDING_AREA_PADDING + height,
        },
        {
          x: -BOUNDING_AREA_PADDING,
          y: BOUNDING_AREA_PADDING + height,
        },
      ];
    }
  };

  // Position in global coordinates.
  element.isPositionWithinBoundingArea = function (position = { x, y }) {
    const origin = getOrigin();
    const globalBoundingArea = element.getBoundingArea().map(function (vertex) {
      return {
        x: origin.x + vertex.x,
        y: origin.y + vertex.y,
      };
    });

    return isPositionInPolygon(position, globalBoundingArea);
  };
}

// Returns >0 if point is on the left of vector a to b,
// =0 if point is on the line through a and b,
// <0 if point is on the right of vector a to b.
function isPointLeftOfAB(point, a, b) {
  return (b.x - a.x) * (point.y - a.y) - (point.x - a.x) * (b.y - a.y);
}

function isPositionInPolygon(position, polygon) {
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

// Returns 0 if the polygon has no orientation
// (e.g. a perfect 8-shape or a zero-area polygon).
function isPolygonClockwise(polygon) {
  let sum = 0;

  for (let i = 0; i < polygon.length; i++) {
    let next = (i + 1) % polygon.length;
    // Sum twice the area between x axis and edge i,next.
    sum += (polygon[next].x - polygon[i].x) * (polygon[next].y + polygon[i].y);
  }

  return Math.sign(sum);
}

function createOutwardEdgeNormal(edge, isClockwise) {
  return {
    x: (-isClockwise * edge.vector.y) / edge.length,
    y: (isClockwise * edge.vector.x) / edge.length,
  };
}

function offsetEdgeByVector(edge, vector) {
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

function extendEdgeByPadding(edge, padding) {
  const unitVector = {
    x: edge.vector.x / edge.length,
    y: edge.vector.y / edge.length,
  };

  const extendedEdge = {};

  extendedEdge.vertex1 = {
    x: edge.vertex1.x - unitVector.x * padding,
    y: edge.vertex1.y - unitVector.y * padding,
  };

  extendedEdge.vertex2 = {
    x: edge.vertex2.x + unitVector.x * padding,
    y: edge.vertex2.y + unitVector.y * padding,
  };

  extendedEdge.vector = {
    x: extendedEdge.vertex2.x - extendedEdge.vertex1.x,
    y: extendedEdge.vertex2.y - extendedEdge.vertex1.y,
  };

  extendedEdge.length = Math.sqrt(
    extendedEdge.vector.x * extendedEdge.vector.x +
      extendedEdge.vector.y * extendedEdge.vector.y
  );

  return extendedEdge;
}

// Returns null if the two lines are parallel or on the same line.
function findIntersectionBetweenLines(line1, line2) {
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

function createPaddedPolygon(polygon, padding) {
  let isClockwise = isPolygonClockwise(polygon) || 1;

  // Offset each edge of the polygon outward by the padding amount
  // and extend them on each end by the padding amount.
  const offsetAndExtendedEdges = [];
  for (let i = 0; i < polygon.length; i++) {
    let vertex1 = polygon[i];
    let vertex2 = polygon[(i + 1) % polygon.length];
    let vector12 = {
      x: vertex2.x - vertex1.x,
      y: vertex2.y - vertex1.y,
    };
    let length = Math.sqrt(vector12.x * vector12.x + vector12.y * vector12.y);

    // Add edge unless it's zero length
    if (vertex1.x !== vertex2.x || vertex1.y !== vertex2.y) {
      const edge = {
        vertex1,
        vertex2,
        vector: vector12,
        length,
      };

      const outwardNormal = createOutwardEdgeNormal(edge, isClockwise);

      const offsetVector = {
        x: padding * outwardNormal.x,
        y: padding * outwardNormal.y,
      };

      const offsetAndExtendedEdge = extendEdgeByPadding(
        offsetEdgeByVector(edge, offsetVector),
        padding
      );

      offsetAndExtendedEdges.push(offsetAndExtendedEdge);
    }
  }

  const paddedPolygon = [];
  for (let i = 0; i < offsetAndExtendedEdges.length; i++) {
    const thisEdge = offsetAndExtendedEdges[i];
    const nextEdge =
      offsetAndExtendedEdges[(i + 1) % offsetAndExtendedEdges.length];

    const intersection = findIntersectionBetweenLines(thisEdge, nextEdge);

    if (intersection) {
      // If this edge and the next intersect,
      // add the intersection as a vertex to the padded polygon.
      paddedPolygon.push(intersection);
    } else {
      // If this edge and the next don't intersect,
      // add the two middle ends as vertices to the padded polygon.
      paddedPolygon.push(thisEdge.vertex2, nextEdge.vertex1);
    }
  }

  return paddedPolygon;
}
