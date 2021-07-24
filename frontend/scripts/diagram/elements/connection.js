import {
  ELECTRIC_CONTACT_COLOR,
  PNEUMATIC_CONTACT_COLOR,
} from "../../constants.js";

import {
  addVectors,
  computeLength,
  createOutwardUnitNormal,
  createPointBetweenAB,
  createVector,
  isPointLeftOfAB,
  findIntersectionBetweenLines,
} from "./utils/geometry.js";

import createBasicElement from "./utils/basicElement.js";

import mixinBoundingArea from "./mixins/mixinBoundingArea.js";
import mixinDrawing from "./mixins/mixinDrawing.js";
import mixinRemoval from "./mixins/mixinRemoval.js";
import mixinSelection from "./mixins/mixinSelection.js";
import mixinMedium from "./mixins/mixinMedium.js";

export default function createConnection({
  start = { getPosition: function () {} },
  end = { getPosition: function () {} },
  vertices = [],
  medium,
}) {
  const connection = createBasicElement("connection");

  let color;
  switch (medium) {
    case "electric":
      color = ELECTRIC_CONTACT_COLOR;
      break;
    case "pneumatic":
      color = PNEUMATIC_CONTACT_COLOR;
      break;
    default:
      color = "#555";
  }

  // setPosition functions from starts and ends that the
  // first/last vertex are or have been bound to for alignment.
  const startSetPositions = [];
  const endSetPositions = [];

  connection.getStart = () => start;
  connection.getStartPosition = () => connection.getStart().getPosition?.();
  connection.setStart = function (newStart) {
    const oldStart = start;
    start = newStart;

    const boundIndex =
      startSetPositions.push({
        unboundSetPosition: start.setPosition,
        isBound: true,
      }) - 1;

    oldStart.removeConnection?.(connection);
    // oldStart.setPosition = startSetPositions[boundIndex - 1].setPosition;
    if (boundIndex > 0) {
      startSetPositions[boundIndex - 1].isBound = false;
    }
    // oldStart.setPosition = unboundStartSetPosition;

    // TODO: Unbind adjacent vertex to stay aligned with oldStart.

    start.addConnection?.(connection);

    // Bind adjacent vertex to stay aligned with start.
    // const existingSetPosition = start.setPosition;
    // unboundStartSetPosition = start.setPosition;
    if (start.setPosition) {
      start.setPosition = function (...args) {
        if (!startSetPositions[boundIndex].isBound) {
          return startSetPositions[boundIndex].unboundSetPosition?.(...args);
        }

        const oldStartPosition = connection.getStartPosition();
        const returnValue = startSetPositions[boundIndex].unboundSetPosition?.(
          ...args
        );
        const newStartPosition = connection.getStartPosition();
        const endPosition = connection.getEndPosition();

        if (
          vertices.length === 0 &&
          newStartPosition.x !== endPosition.x &&
          newStartPosition.y !== endPosition.y
        ) {
          // If there are no vertices and the new connection
          // is not horizontal or vertical, create two vertices.
          vertices.push(createPointBetweenAB(oldStartPosition, endPosition));
          vertices.push(createPointBetweenAB(oldStartPosition, endPosition));
        }

        if (vertices.length > 0) {
          alignFirstVertex(oldStartPosition, newStartPosition);
        }

        return returnValue;
      };
    }
  };

  connection.getEnd = () => end;
  connection.getEndPosition = () => connection.getEnd().getPosition?.();
  connection.setEnd = function (newEnd) {
    const oldEnd = end;
    end = newEnd;

    const boundIndex =
      endSetPositions.push({
        unboundSetPosition: end.setPosition,
        isBound: true,
      }) - 1;

    oldEnd.removeConnection?.(connection);
    if (boundIndex > 0) {
      endSetPositions[boundIndex - 1].isBound = false;
    }
    // oldEnd.setPosition = unboundEndSetPosition;

    // TODO: Unbind adjacent vertex to stay aligned with oldEnd.

    end.addConnection?.(connection);

    // Bind adjacent vertex to stay aligned with end.
    if (end.setPosition) {
      end.setPosition = function (...args) {
        if (!endSetPositions[boundIndex].isBound) {
          return endSetPositions[boundIndex].unboundSetPosition?.(...args);
        }

        const oldEndPosition = connection.getEndPosition();
        const returnValue = endSetPositions[boundIndex].unboundSetPosition?.(
          ...args
        );
        const newEndPosition = connection.getEndPosition();
        const startPosition = connection.getStartPosition();

        if (
          vertices.length === 0 &&
          newEndPosition.x !== startPosition.x &&
          newEndPosition.y !== startPosition.y
        ) {
          // If there are no vertices and the new connection
          // is not horizontal or vertical, create two vertices.
          vertices.push(createPointBetweenAB(oldEndPosition, startPosition));
          vertices.push(createPointBetweenAB(oldEndPosition, startPosition));
        }

        if (vertices.length > 0) {
          alignLastVertex(oldEndPosition, newEndPosition);
        }

        return returnValue;
      };
    }
  };

  function alignFirstVertex(oldStartPosition, newStartPosition) {
    // The first vertex has to be aligned in a way to preserve
    // the slopes of the first two to line segments, i.e. the
    // first line segment has to be offset in parallel.

    const path = connection.getPath();
    const firstLineDirection = createVector(oldStartPosition, path[1]);
    const adjacentLine = {};

    if (path[1].x === path[2].x && path[1].y === path[2].y) {
      // If the two vertices are the same, align with right angle.
      adjacentLine.vertex1 = path[1];
      adjacentLine.vertex2 = addVectors(
        path[1],
        createOutwardUnitNormal({ vector: firstLineDirection })
      );
    } else {
      adjacentLine.vertex1 = path[1];
      adjacentLine.vertex2 = path[2];
    }

    if (firstLineDirection.x === 0 && firstLineDirection.y === 0) {
      // If the start position and first vertex are the same,
      // align with right angle to adjacent line.
      const normal = createOutwardUnitNormal(
        createVector(adjacentLine.vertex1, adjacentLine.vertex2)
      );

      firstLineDirection.x = normal.x;
      firstLineDirection.y = normal.y;
    }

    const offsetFirstLine = {
      vertex1: newStartPosition,
      vertex2: addVectors(newStartPosition, firstLineDirection),
    };

    const intersection = findIntersectionBetweenLines(
      offsetFirstLine,
      adjacentLine
    );

    if (intersection) {
      connection.getVertices()[0] = intersection;
    }
  }

  function alignLastVertex(oldEndPosition, newEndPosition) {
    // The last vertex has to be aligned in a way to preserve
    // the slopes of the last two to line segments, i.e. the
    // last line segment has to be offset in parallel.

    const path = connection.getPath();
    const lastVertex = path.length - 2;
    const lastLineDirection = createVector(oldEndPosition, path[lastVertex]);
    const adjacentLine = {};

    if (
      path[lastVertex].x === path[lastVertex - 1].x &&
      path[lastVertex].y === path[lastVertex - 1].y
    ) {
      // If the two vertices are the same, align with right angle.
      adjacentLine.vertex1 = path[lastVertex];
      adjacentLine.vertex2 = addVectors(
        path[lastVertex],
        createOutwardUnitNormal({ vector: lastLineDirection })
      );
    } else {
      adjacentLine.vertex1 = path[lastVertex];
      adjacentLine.vertex2 = path[lastVertex - 1];
    }

    if (lastLineDirection.x === 0 && lastLineDirection.y === 0) {
      // If the start position and first vertex are the same,
      // align with right angle to adjacent line.
      const normal = createOutwardUnitNormal(
        createVector(adjacentLine.vertex1, adjacentLine.vertex2)
      );

      lastLineDirection.x = normal.x;
      lastLineDirection.y = normal.y;
    }

    const offsetLastLine = {
      vertex1: newEndPosition,
      vertex2: addVectors(newEndPosition, lastLineDirection),
    };

    const intersection = findIntersectionBetweenLines(
      offsetLastLine,
      adjacentLine
    );

    if (intersection) {
      connection.getVertices()[vertices.length - 1] = intersection;
    }
  }

  // Note: This is not returning a copy.
  connection.getVertices = () => vertices;
  connection.setVertices = (newVertices) => (vertices = newVertices);

  connection.getPath = function () {
    return [
      connection.getStartPosition(),
      ...connection.getVertices(),
      connection.getEndPosition(),
    ];
  };

  connection.createJunction = function (diagram, position) {
    // Find point on path that is closest to the given position.
    const path = connection.getPath();

    const junctionCandidates = [];
    for (let i = 0; i < path.length - 1; i++) {
      const edge = { vertex1: path[i], vertex2: path[i + 1] };
      edge.vector = createVector(edge.vertex1, edge.vertex2);
      edge.normal = {
        x: -edge.vector.y,
        y: edge.vector.x,
      };

      const normalLine = {
        vertex1: position,
        vertex2: addVectors(edge.normal, position),
      };

      const intersection = findIntersectionBetweenLines(edge, normalLine);

      let isIntersectionOnEdge = intersection
        ? intersection.x >= Math.min(edge.vertex1.x, edge.vertex2.x) &&
          intersection.x <= Math.max(edge.vertex1.x, edge.vertex2.x) &&
          intersection.y >= Math.min(edge.vertex1.y, edge.vertex2.y) &&
          intersection.y <= Math.max(edge.vertex1.y, edge.vertex2.y)
        : false;

      if (isIntersectionOnEdge) {
        const distanceToEdge = computeLength(
          createVector(position, intersection)
        );

        junctionCandidates.push({
          position: intersection,
          distance: distanceToEdge,
          i: i,
        });
      }
    }

    junctionCandidates.sort(function (candidateA, candidateB) {
      return Math.sign(candidateA.distance - candidateB.distance);
    });

    // Store properties of this connection.
    // TODO: Copy connection instead (to preserve other, unknown properties).
    //  Problem: Can the scope of other mixins be copied?
    const start = connection.getStart();
    const end = connection.getEnd();
    const vertices = connection.getVertices();

    // Add new connections first and only then delete existing connection,
    // so that junctions at start/end of existing connection don't get deleted.
    const newConnection1 = diagram.add.connection({
      start,
      vertices: vertices.slice(0, junctionCandidates[0].i),
      medium,
    });

    const newConnection2 = diagram.add.connection({
      end,
      vertices: vertices.slice(junctionCandidates[0].i, vertices.length),
      medium,
    });

    connection.remove(diagram);

    // Add junction after the new connections so it gets drawn on top.
    const junction = diagram.add.junction({
      position: junctionCandidates[0].position,
      medium,
    });
    const junctionContact = junction.getContactsByMedium(medium)[0];

    newConnection1.setEnd(junctionContact);
    newConnection2.setStart(junctionContact);

    return junction;
  };

  mixinMedium({
    element: connection,
    medium,
  });

  mixinDrawing({
    element: connection,
    draw,
  });

  mixinRemoval({
    element: connection,
    remove,
  });

  mixinBoundingArea({
    element: connection,
    getCustomArea: createCustomArea,
  });

  mixinSelection({
    element: connection,
    getSelectionShape: connection.getBoundingArea,
  });

  // Create binding during initialization.
  connection.setStart(start);
  connection.setEnd(end);
  simplifyVertices(); // Remove unneeded vertices.

  function remove(diagram) {
    startSetPositions[startSetPositions.length - 1].isBound = false;
    endSetPositions[endSetPositions.length - 1].isBound = false;

    // if (element.getStart().getConnections().indexOf(element) > -1) {
    connection.getStart().removeConnection?.(diagram, connection);
    // }

    // if (element.getEnd().getConnections().indexOf(element) > -1){
    connection.getEnd().removeConnection?.(diagram, connection);
    // }
  }

  // in global coordinates
  function draw(ctx) {
    const startPosition = connection.getStartPosition();
    const endPosition = connection.getEndPosition();

    if (startPosition && endPosition) {
      ctx.save();
      ctx.beginPath();
      ctx.strokeStyle = color;

      ctx.moveTo(startPosition.x, startPosition.y);

      connection.getVertices().forEach(function (node) {
        ctx.lineTo(node.x, node.y);
      });

      ctx.lineTo(endPosition.x, endPosition.y);

      ctx.stroke();
      ctx.restore();
    }
  }

  function createCustomArea() {
    // Create a polygon that goes 'around' the connection (with zero area).
    return [...connection.getPath(), ...connection.getPath().reverse()];
  }

  function simplifyVertices() {
    const path = connection.getPath();

    if (
      connection.getStartPosition() &&
      connection.getEndPosition() &&
      path.length > 2
    ) {
      for (let i = 1; i < path.length - 1; i++) {
        if (isPointLeftOfAB(path[i], path[i - 1], path[i + 1]) === 0) {
          // If three points are in a line, delete the second one.
          path.splice(i, 1);
        }
      }

      connection.setVertices(path.slice(1, -1));
    }
  }

  return connection;
}
