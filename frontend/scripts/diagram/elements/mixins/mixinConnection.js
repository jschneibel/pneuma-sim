import mixinDrawing from "./mixinDrawing.js";
import mixinRemove from "./mixinRemoval.js";

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

  mixinDrawing({
    element,
    getElementPosition: () => ({ x: 0, y: 0 }), // so we can draw in global coordinates
    draw,
  });

  mixinRemove({
    element,
    remove,
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
}
