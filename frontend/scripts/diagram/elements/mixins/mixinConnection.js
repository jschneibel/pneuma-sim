import {
  addVectors,
  computeLength,
  createPointBetweenAB,
  createVector,
  findIntersectionBetweenLines,
} from "../utils/geometry.js";
import mixinBoundingArea from "./mixinBoundingArea.js";
import mixinDrawing from "./mixinDrawing.js";
import mixinRemoval from "./mixinRemoval.js";
import mixinSelection from "./mixinSelection.js";

export default function mixinConnection({
  element = {},
  start = { getPosition: function () {} },
  end = { getPosition: function () {} },
  vertices = [],
  color = "#cc6",
}) {
  element.getStart = () => start;
  element.getStartPosition = () => element.getStart().getPosition?.();
  element.setStart = function (newStart) {
    const oldStart = start;
    const oldStartPosition = start.getPosition();
    const endPosition = end.getPosition();

    start = newStart;
    const startPosition = element.getStartPosition();

    oldStart.removeConnection?.(element);
    start.addConnection?.(element);

    // TODO: Unbind adjacent vertex to stay aligned with oldStart.

    // Bind adjacent vertex to stay aligned with start.
    const existingSetPosition = start.setPosition;
    if (existingSetPosition) {
      start.setPosition = function (...args) {
        const oldStartPosition = element.getStartPosition();
        existingSetPosition(...args);
        const newStartPosition = element.getStartPosition();

        alignFirstVertex(oldStartPosition, newStartPosition);
      };
    }

    // function simplifyVertices() {
    //   const path = element.getPath();

    //   for (let i = 1; i < path.length - 1; i++) {
    //     if (isPointLeftOfAB(path[i], path[i - 1], path[i + 1]) === 0) {
    //       // If three points are in a line, delete the second one.
    //       path.splice(i, 1);
    //     }
    //   }
    // }

    element.getEnd = () => end;
    element.getEndPosition = () => element.getEnd().getPosition?.();
    element.setEnd = function (newEnd) {
      const oldEnd = end;
      const oldEndPosition = end.getPosition();
      const startPosition = start.getPosition();

      end = newEnd;
      const endPosition = element.getEndPosition();

      oldEnd.removeConnection?.(element);
      end.addConnection?.(element);

      // TODO: Unbind adjacent vertex to stay aligned with oldEnd.

      // Bind adjacent vertex to stay aligned with end.
      const existingSetPosition = end.setPosition;
      if (existingSetPosition) {
        end.setPosition = function (...args) {
          const oldEndPosition = element.getEndPosition();
          existingSetPosition(...args);
          const newEndPosition = element.getEndPosition();

          alignLastVertex(oldEndPosition, newEndPosition);
        };
      }
    };

    function alignFirstVertex(oldStartPosition, newStartPosition) {
      const path = element.getPath();

      if (vertices.length > 0) {
        // If there is at least one vertex, then the first vertex
        // has to be aligned in a way to preserve the slopes of the
        // first two to line segments, i.e. the first line segment
        // has to be offset in parallel.

        const firstLineDirection = createVector(oldStartPosition, path[1]);
        const offsetFirstLine = {
          vertex1: newStartPosition,
          vertex2: addVectors(newStartPosition, firstLineDirection),
        };
        const adjacentLine = {
          vertex1: path[1],
          vertex2: path[2],
        };

        const intersection = findIntersectionBetweenLines(
          offsetFirstLine,
          adjacentLine
        );

        if (intersection) {
          element.getVertices()[0] = intersection;
        }
      }
    }

    function alignLastVertex(oldEndPosition, newEndPosition) {
      const path = element.getPath();

      if (vertices.length > 0) {
        // If there is at least one vertex, then the last vertex
        // has to be aligned in a way to preserve the slopes of the
        // last two to line segments, i.e. the last line segment
        // has to be offset in parallel.

        const lastVertex = path.length - 2;
        const lastLineDirection = createVector(
          oldEndPosition,
          path[lastVertex]
        );
        const offsetLastLine = {
          vertex1: newEndPosition,
          vertex2: addVectors(newEndPosition, lastLineDirection),
        };
        const adjacentLine = {
          vertex1: path[lastVertex],
          vertex2: path[lastVertex - 1],
        };

        const intersection = findIntersectionBetweenLines(
          offsetLastLine,
          adjacentLine
        );

        if (intersection) {
          element.getVertices()[vertices.length - 1] = intersection;
        }
      }
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

  element.createJunction = function (diagram, position) {
    // Find point on path that is closest to the given position.
    const path = element.getPath();

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

      let isIntersectionOnEdge =
        intersection.x >= Math.min(edge.vertex1.x, edge.vertex2.x) &&
        intersection.x <= Math.max(edge.vertex1.x, edge.vertex2.x) &&
        intersection.y >= Math.min(edge.vertex1.y, edge.vertex2.y) &&
        intersection.y <= Math.max(edge.vertex1.y, edge.vertex2.y);

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
    const start = element.getStart();
    const end = element.getEnd();
    const vertices = element.getVertices();

    // Add new connections first and only then delete existing connection,
    // so that junctions at start/end of existing connection don't get deleted.
    const newConnection1 = diagram.add["wire"]({
      start,
      vertices: vertices.slice(0, junctionCandidates[0].i),
    });

    const newConnection2 = diagram.add["wire"]({
      end,
      vertices: vertices.slice(junctionCandidates[0].i, vertices.length),
    });

    element.remove(diagram);

    // Add junction after the wires so it gets drawn on top.
    const junction = diagram.add["wireJunction"]({
      position: junctionCandidates[0].position,
    });
    const junctionContact = junction.getElectricContacts()[0];

    newConnection1.setEnd(junctionContact);
    newConnection2.setStart(junctionContact);

    return junction;
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
    getCustomArea: createCustomArea,
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

  function createCustomArea() {
    // Create a polygon that goes 'around' the wire (with zero area).
    return [...element.getPath(), ...element.getPath().reverse()];
  }
}
