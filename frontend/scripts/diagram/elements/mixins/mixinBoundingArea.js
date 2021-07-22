import { SELECTION_BOX_PADDING } from "../../../constants.js";

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
      return getCustomArea();
    } else {
      // case rectangle
      const { width, height } = getElementDimensions();
      return [
        {
          x: -SELECTION_BOX_PADDING,
          y: -SELECTION_BOX_PADDING,
        },
        {
          x: SELECTION_BOX_PADDING + width,
          y: -SELECTION_BOX_PADDING,
        },
        {
          x: SELECTION_BOX_PADDING + width,
          y: SELECTION_BOX_PADDING + height,
        },
        {
          x: -SELECTION_BOX_PADDING,
          y: SELECTION_BOX_PADDING + height,
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

function isPositionInPolygon(position, polygon) {
  let windingNumber = 0;

  polygon.forEach((vertexI, i) => {
    const vertexJ = polygon[(i + 1) % polygon.length];

    if (vertexI.y <= position.y) {
      if (
        vertexJ.y > position.y &&
        isLeftOfAB(position, vertexI, vertexJ) > 0
      ) {
        windingNumber += 1; // I to J is crossing from bottom into the first quadrant.
      }
    } else if (
      vertexJ.y <= position.y &&
      isLeftOfAB(position, vertexI, vertexJ) < 0
    ) {
      windingNumber -= 1; // I to J is crossing from top in the fourth quadrant.
    }
  });

  return windingNumber !== 0;
}

// Returns >0 if position is on the left of line through a to b,
// =0 if position is on the line through a to b,
// <0 if position is on the right of line through a to b.
function isLeftOfAB(position, a, b) {
  return (b.x - a.x) * (position.y - a.y) - (position.x - a.x) * (b.y - a.y);
}
