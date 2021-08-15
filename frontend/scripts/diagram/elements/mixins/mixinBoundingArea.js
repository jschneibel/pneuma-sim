import { BOUNDING_AREA_PADDING } from "../../../constants.js";
import {
  createOutwardUnitNormal,
  findIntersectionBetweenLines,
  offsetEdgeByVector,
  isPolygonClockwise,
  isPointInPolygon,
  computeLength,
} from "../utils/geometry.js";

export default function mixinBoundingArea({
  element,
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

    return isPointInPolygon(position, globalBoundingArea);
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

  extendedEdge.length = computeLength(extendedEdge.vector);

  return extendedEdge;
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
    let length = computeLength(vector12);

    // Add edge unless it's zero length
    if (vertex1.x !== vertex2.x || vertex1.y !== vertex2.y) {
      const edge = {
        vertex1,
        vertex2,
        vector: vector12,
        length,
      };

      const outwardUnitNormal = createOutwardUnitNormal(edge, isClockwise);

      const offsetVector = {
        x: padding * outwardUnitNormal.x,
        y: padding * outwardUnitNormal.y,
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
