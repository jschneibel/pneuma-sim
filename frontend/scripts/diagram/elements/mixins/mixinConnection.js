import mixinDrawing from "./mixinDrawing.js";

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
    // TODO: Unbind adjacent vertex to stay aligned with newStart.
    const oldStart = start;
    start = newStart;

    let alignedCoordinate; // 'x' or 'y'

    // Bind adjacent vertex to stay aligned with newStart.
    const existingSetPosition = newStart.setPosition;
    if (existingSetPosition) {
      newStart.setPosition = function (...args) {
        existingSetPosition(...args);

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
    // TODO: Unbind adjacent vertex to stay aligned with newEnd.
    const oldEnd = end;
    end = newEnd;

    let alignedCoordinate; // 'x' or 'y'

    // Bind adjacent vertex to stay aligned with newEnd.
    const existingSetPosition = newEnd.setPosition;
    if (existingSetPosition) {
      newEnd.setPosition = function (...args) {
        existingSetPosition(...args);

        if (vertices.length > 0) {
          if (!alignedCoordinate) {
            const oldEndPosition = oldEnd.getPosition();
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
        }
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

  // Create binding during initialization.
  element.setStart(start);
  element.setEnd(end);

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
