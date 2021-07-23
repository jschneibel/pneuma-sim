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
  // Coordinate of adjacent vertex aligned with end ('x' or 'y').
  let alignedFirstVertexCoordinate;
  let alignedLastVertexCoordinate;

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

    let a;
    let b;
    const vertices = element.getVertices();
    if (vertices.length === 0) {
      a = endPosition;
      b = oldStartPosition || startPosition;

      if (a.x !== startPosition.x && a.y !== startPosition.y) {
        // If there are no vertices and the new line from start to end is
        // not horizontal or vertical, create two vertices in the middle
        // of the previous line.
        vertices.push(createPointBetweenAB(a, b), createPointBetweenAB(a, b));
      }
    } else {
      a = vertices[0];
      // b = oldEndPosition || endPosition;
      b = startPosition;
    }

    // Check if the new line is (mostly) horizontal or vertical.
    alignedFirstVertexCoordinate =
      Math.abs(b.x - a.x) >= Math.abs(b.y - a.y) ? "y" : "x";

    // Align if necessary
    if (vertices.length !== 0) {
      // alignFirstVertex(alignedFirstVertexCoordinate);
    }

    // TODO: Unbind adjacent vertex to stay aligned with oldStart.

    // Bind adjacent vertex to stay aligned with start.
    const existingSetPosition = start.setPosition;
    if (existingSetPosition) {
      start.setPosition = function (...args) {
        let a = element.getEndPosition();
        let b = element.getStartPosition(); // Before existingSetPosition!

        existingSetPosition(...args);

        const startPosition = element.getStartPosition();

        if (vertices.length === 0) {
          if (a.x !== startPosition.x && a.y != startPosition.y) {
            // If there are no vertices and the new line from start to end is
            // not horizontal or vertical, create two vertices in the middle
            // of the previous line.
            vertices.push(
              createPointBetweenAB(a, b),
              createPointBetweenAB(a, b)
            );
          }
        } else {
          a = vertices[0];
        }

        // Check if the new line is (mostly) horizontal or vertical.
        alignedFirstVertexCoordinate =
          Math.abs(b.x - a.x) >= Math.abs(b.y - a.y) ? "y" : "x";

        // Align if necessary
        if (vertices.length !== 0) {
          alignFirstVertex(alignedFirstVertexCoordinate);
        }
      };
    }
  };

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

    let a;
    let b;
    const vertices = element.getVertices();
    if (vertices.length === 0) {
      a = startPosition;
      b = oldEndPosition || endPosition;

      if (a.x !== endPosition.x && a.y !== endPosition.y) {
        // If there are no vertices and the new line from start to end is
        // not horizontal or vertical, create two vertices in the middle
        // of the previous line.
        vertices.push(createPointBetweenAB(a, b), createPointBetweenAB(a, b));
      }
    } else {
      a = vertices[vertices.length - 1];
      // b = oldEndPosition || endPosition;
      b = endPosition;
    }

    // Check if the new line is (mostly) horizontal or vertical.
    alignedLastVertexCoordinate =
      Math.abs(b.x - a.x) >= Math.abs(b.y - a.y) ? "y" : "x";

    // Align if necessary
    if (vertices.length !== 0) {
      // alignLastVertex(alignedLastVertexCoordinate);
    }

    // TODO: Unbind adjacent vertex to stay aligned with oldEnd.

    // Bind adjacent vertex to stay aligned with end.
    const existingSetPosition = end.setPosition;
    if (existingSetPosition) {
      end.setPosition = function (...args) {
        let a = element.getStartPosition();
        let b = element.getEndPosition(); // Before existingSetPosition!

        existingSetPosition(...args);

        const endPosition = element.getEndPosition();

        if (vertices.length === 0) {
          if (a.x !== endPosition.x && a.y !== endPosition.y) {
            // If there are no vertices and the new line from start to end is
            // not horizontal or vertical, create two vertices in the middle
            // of the previous line.
            vertices.push(
              createPointBetweenAB(a, b),
              createPointBetweenAB(a, b)
            );
          }
        } else {
          a = vertices[vertices.length - 1];
        }

        // Check if the new line is (mostly) horizontal or vertical.
        alignedLastVertexCoordinate =
          Math.abs(b.x - a.x) >= Math.abs(b.y - a.y) ? "y" : "x";

        // Align if necessary
        if (vertices.length !== 0) {
          alignLastVertex(alignedLastVertexCoordinate);
        }
      };
    }
  };

  function alignFirstVertex(alignedCoordinate) {
    const unalignedCoordinate = alignedCoordinate === "x" ? "y" : "x";

    vertices[0] = {
      [alignedCoordinate]: start.getPosition()[alignedCoordinate],
      [unalignedCoordinate]: vertices[0][unalignedCoordinate],
    };
  }

  function alignLastVertex(alignedCoordinate) {
    const unalignedCoordinate = alignedCoordinate === "x" ? "y" : "x";

    let last = vertices.length - 1;
    vertices[last] = {
      [alignedCoordinate]: end.getPosition()[alignedCoordinate],
      [unalignedCoordinate]: vertices[last][unalignedCoordinate],
    };
  }

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
