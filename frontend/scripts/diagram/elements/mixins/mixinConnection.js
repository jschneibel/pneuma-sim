import { SELECTION_BOX_PADDING } from "../../../constants.js";
import mixinBoundingArea from "./mixinBoundingArea.js";
import mixinDrawing from "./mixinDrawing.js";
import mixinRemoval from "./mixinRemoval.js";
import mixinSelection from "./mixinSelection.js";

export default function mixinConnection({
  element = {},
  start = { getPosition: () => ({ x: 0, y: 0 }) },
  end = { getPosition: () => ({ x: 0, y: 0 }) },
  vertices = [],
  color = "#cc6",
}) {
  element.getStart = () => start;
  element.getStartPosition = () => element.getStart().getPosition?.();
  element.setStart = function (newStart) {
    const oldStart = start;
    start = newStart;
    let alignedCoordinate; // 'x' or 'y' coordinate of adjacent vertex, aligned with start

    oldStart.removeConnection?.(element);
    newStart.addConnection?.(element);

    // TODO: Unbind adjacent vertex to stay aligned with oldStart.

    // Bind adjacent vertex to stay aligned with newStart.
    const existingSetPosition = newStart.setPosition;
    if (existingSetPosition) {
      newStart.setPosition = function (...args) {
        existingSetPosition(...args);

        const vertices = element.getVertices();

        if (vertices.length > 0) {
          if (!alignedCoordinate) {
            const oldStartPosition = oldStart.getPosition();
            const segmentX = Math.abs(vertices[0].x - oldStartPosition.x);
            const segmentY = Math.abs(vertices[0].y - oldStartPosition.y);

            if (segmentX < segmentY) {
              alignedCoordinate = "x";
            } else if (segmentX > segmentY) {
              alignedCoordinate = "y";
            }
          }

          vertices[0][alignedCoordinate] =
            newStart.getPosition()[alignedCoordinate];
        }
      };
    }
  };

  element.getEnd = () => end;
  element.getEndPosition = () => element.getEnd().getPosition?.();
  element.setEnd = function (newEnd) {
    const oldEnd = end;
    end = newEnd;
    let alignedCoordinate; // 'x' or 'y' coordinate of adjacent vertex, aligned with end

    oldEnd.removeConnection?.(element);
    newEnd.addConnection?.(element);

    // TODO: Unbind adjacent vertex to stay aligned with oldEnd.

    // Bind adjacent vertex to stay aligned with newEnd.
    const existingSetPosition = newEnd.setPosition;
    if (existingSetPosition) {
      newEnd.setPosition = function (...args) {
        existingSetPosition(...args);

        const vertices = element.getVertices();
        const oldEndPosition = oldEnd.getPosition();

        // If there are no vertices, create two in the middle.
        if (vertices.length === 0) {
          const startPosition = element.getStartPosition();

          const newVertex = {
            x: (startPosition.x + oldEndPosition.x) / 2,
            y: (startPosition.y + oldEndPosition.y) / 2,
          };

          // The { ...newVertex } syntax creates a shallow copy.
          vertices.push({ ...newVertex });
          vertices.push({ ...newVertex });
        }

        if (!alignedCoordinate) {
          const segmentX = Math.abs(
            vertices[vertices.length - 1].x - oldEndPosition.x
          );
          const segmentY = Math.abs(
            vertices[vertices.length - 1].y - oldEndPosition.y
          );

          if (segmentX < segmentY) {
            alignedCoordinate = "x";
          } else if (segmentX > segmentY) {
            alignedCoordinate = "y";
          }
        }

        vertices[vertices.length - 1][alignedCoordinate] =
          newEnd.getPosition()[alignedCoordinate];
      };
    }
  };

  // Note: This is not returning a copy.
  element.getVertices = () => vertices;
  element.setVertices = (newVertices) => (vertices = newVertices);

  element.getPath = function () {
    return [
      element.getStartPosition(),
      ...element.getVertices(),
      element.getEndPosition(),
    ];
  };

  mixinDrawing({
    element,
    draw,
  });

  mixinRemoval({
    element,
    remove,
  });

  mixinBoundingArea({
    element,
    getCustomArea: computeBoundingArea,
  });

  mixinSelection({
    element,
    getSelectionShape: element.getBoundingArea,
  });

  // Create binding during initialization.
  element.setStart(start);
  element.setEnd(end);

  function remove(diagram) {
    element.getStart().removeConnection?.(diagram, element);
    element.getEnd().removeConnection?.(diagram, element);
  }

  // in global coordinates
  function draw(ctx) {
    const startPosition = element.getStartPosition();
    const endPosition = element.getEndPosition();

    ctx.save();
    ctx.beginPath();
    ctx.strokeStyle = color;

    ctx.moveTo(startPosition.x, startPosition.y);

    element.getVertices().forEach(function (node) {
      ctx.lineTo(node.x, node.y);
    });

    ctx.lineTo(endPosition.x, endPosition.y);

    ctx.stroke();
    ctx.restore();
  }

  function computeBoundingArea() {
    const padding = SELECTION_BOX_PADDING;
    const path = element.getPath();
    const boundingArea = []; // The length of boundingArea will be 2*(path.length-1)

    let zero = { x: 0, y: 0 };
    boundingArea[0] = zero;
    boundingArea[path.length - 1] = zero;
    boundingArea[path.length] = zero;
    boundingArea[2 * (path.length - 1)] = zero;

    let directionA = {}; // direction from point i to i-1
    let directionB = {}; // direction from point i to i+1
    let crossProduct; // cross product of directionA x directionB

    // go along the path and create a vertex
    // on the right side of each path
    for (let i = 0; i < path.length; i++) {
      directionA.x = path[i - 1] ? Math.sign(path[i - 1].x - path[i].x) : 0;
      directionA.y = path[i - 1] ? Math.sign(path[i - 1].y - path[i].y) : 0;

      directionB.x = path[i + 1] ? Math.sign(path[i + 1].x - path[i].x) : 0;
      directionB.y = path[i + 1] ? Math.sign(path[i + 1].y - path[i].y) : 0;

      crossProduct = directionA.x * directionB.y - directionA.y * directionB.x;

      if (i === 0 || i === path.length - 1) {
        // at start and end

        // right side at point 0
        boundingArea[i] = {
          x:
            path[i].x +
            padding *
              (directionA.x - directionA.y - directionB.x + directionB.y),
          y:
            path[i].y +
            padding *
              (-directionA.x - directionA.y - directionB.x - directionB.y),
        };

        // left side on opposite side of point 0 (= [2 * (path.length - 1)] on boundingArea)
        boundingArea[2 * (path.length - 1) - i + 1] = {
          x:
            path[i].x +
            padding *
              (directionA.x + directionA.y - directionB.x - directionB.y),
          y:
            path[i].y +
            padding *
              (directionA.x - directionA.y + directionB.x - directionB.y),
        };
      } else {
        // at vertices

        // right side at point i
        boundingArea[i] = {
          x: path[i].x + crossProduct * (directionA.x + directionB.x) * padding,
          y: path[i].y + crossProduct * (directionA.y + directionB.y) * padding,
        };

        // left side on opposite side of point i (= [2 * (path.length - 1) - i] on boundingArea)
        boundingArea[2 * (path.length - 1) - i + 1] = {
          x: path[i].x - crossProduct * (directionA.x + directionB.x) * padding,
          y: path[i].y - crossProduct * (directionA.y + directionB.y) * padding,
        };
      }
    }

    return boundingArea;
  }
}
