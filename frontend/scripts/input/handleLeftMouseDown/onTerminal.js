import { getTransformedMousePosition } from "../utils/mousePosition.js";
import {
  findTerminalAtPosition,
  findElementsAtPosition,
} from "../utils/findAtPosition.js";
import {
  snapToRightAngle,
  snapAlongAxisToCoordinates,
} from "../utils/snapping.js";
import drawRules from "../../canvas/components/drawRules.js";
import { isPointLeftOfAB } from "../../diagram/elements/utils/geometry.js";

export default function checkAndHandleLeftMouseDownOnTerminal(
  invokedListenerFn,
  canvas,
  ctx,
  diagram,
  mouseDownPosition
) {
  const terminalUnderMouse = findTerminalAtPosition(diagram, mouseDownPosition);

  if (!terminalUnderMouse || terminalUnderMouse.isActive()) {
    return false;
  } else {
    // If an inactive terminal is under the mouse...
    const medium = terminalUnderMouse.getMedium();
    const start = terminalUnderMouse;

    diagram.unselectAll();

    const connection = diagram.add.connection({
      start,
      end: { getPosition: start.getPosition },
      medium,
    });

    let lastAddedVertex = start.getPosition();
    let mousePosition = mouseDownPosition;
    const snappingCoordinates = findInactiveTerminalsAndConnectionVertices(
      diagram,
      medium
    );

    startListenersForConnectionCreation();

    ctx.draw();
    return true;

    function startListenersForConnectionCreation() {
      // Enable listeners specific to connection creation:
      document.addEventListener(
        "mousemove",
        handleMouseMoveDuringConnectionCreation
      );
      canvas.addEventListener(
        "mousedown",
        handleLeftMouseDownDuringConnectionCreation
      );
      document.addEventListener(
        "keydown",
        handleKeyDownDuringConnectionCreation
      );

      // Disable selecting elements etc. on left down:
      canvas.removeEventListener("mousedown", invokedListenerFn);
    }

    function stopListenersForConnectionCreation() {
      // Disable listeners specific to connection creation:
      document.removeEventListener(
        "mousemove",
        handleMouseMoveDuringConnectionCreation
      );
      canvas.removeEventListener(
        "mousedown",
        handleLeftMouseDownDuringConnectionCreation
      );
      document.removeEventListener(
        "keydown",
        handleKeyDownDuringConnectionCreation
      );

      // Re-enable selecting elements etc. on left mousedown:
      canvas.addEventListener("mousedown", invokedListenerFn);
    }

    function handleMouseMoveDuringConnectionCreation(event) {
      mousePosition = getTransformedMousePosition(event, canvas, ctx);

      const { position: positionSnappedToRightAngle, axis } = snapToRightAngle(
        lastAddedVertex,
        mousePosition
      );

      const { snappedPosition, snapped } = snapAlongAxisToCoordinates(
        positionSnappedToRightAngle,
        snappingCoordinates,
        axis
      );

      connection.setEnd({ getPosition: () => snappedPosition });

      if (snapped) {
        ctx.draw(function () {
          drawRules(canvas, ctx, { [axis]: snappedPosition[axis] });
        });
      } else {
        ctx.draw();
      }
    }

    function handleLeftMouseDownDuringConnectionCreation(event) {
      if (event.button !== 0) return; // Only handle left mouse down.

      mousePosition = getTransformedMousePosition(event, canvas, ctx);

      const { position: positionSnappedToRightAngle, axis } = snapToRightAngle(
        lastAddedVertex,
        mousePosition // mousePosition is updated in handleMouseMoveDuringConnectionCreation.
      );

      const { snappedPosition } = snapAlongAxisToCoordinates(
        positionSnappedToRightAngle,
        snappingCoordinates,
        axis
      );

      const terminalAtSnappedPosition = findTerminalAtPosition(
        diagram,
        snappedPosition,
        medium
      );

      if (terminalAtSnappedPosition && !terminalAtSnappedPosition.isActive()) {
        // If there is an inactive terminal at the snapped position...
        connection.setEnd(terminalAtSnappedPosition);
        stopListenersForConnectionCreation();
        ctx.draw();
        return;
      }

      const connectionsAtSnappedPosition = findElementsAtPosition(
        diagram,
        snappedPosition,
        "connection"
      ).filter((connection) => connection.getMedium() === medium);

      // Ignore connection that is currently being created.
      const thisConnectionIndex =
        connectionsAtSnappedPosition.indexOf(connection);
      if (thisConnectionIndex >= 0) {
        connectionsAtSnappedPosition.splice(thisConnectionIndex, 1);
      }

      if (connectionsAtSnappedPosition.length > 0) {
        // If there is a connection at the snapped position...
        const connectionAtSnappedPosition = connectionsAtSnappedPosition[0];

        const junction = connectionAtSnappedPosition.createJunction(
          diagram,
          snappedPosition
        );

        connection.setEnd(junction.getTerminals()[0]); // A junction has only 1 terminal.
        stopListenersForConnectionCreation();
        ctx.draw();
        return;
      }

      // If the snapped position is in empty area...
      const newVertex = snappedPosition;
      const path = connection.getPath();
      const vertices = connection.getVertices();

      if (
        path.length > 2 &&
        isPointLeftOfAB(
          newVertex,
          path[path.length - 2],
          path[path.length - 3]
        ) === 0
      ) {
        // If the new vertex and the last two existing vertices (or start) are in a line,
        // then replace the last existing vertex with the new vertex (i.e. don't create
        // two adjacent path segments without an angle/corner).
        vertices[vertices.length - 1] = newVertex;
      } else {
        vertices.push(newVertex);
      }

      lastAddedVertex = newVertex;

      ctx.draw();
    }

    function handleKeyDownDuringConnectionCreation(event) {
      if (
        event.key === "Delete" ||
        event.key === "Backspace" ||
        event.key === "Escape"
      ) {
        const vertices = connection.getVertices();

        if (vertices.length > 0) {
          // Remove last added vertex.
          vertices.pop();
          lastAddedVertex =
            vertices[vertices.length - 1] || start.getPosition();

          const { position: positionSnappedToRightAngle, axis } =
            snapToRightAngle(lastAddedVertex, mousePosition);

          const { snappedPosition, snapped } = snapAlongAxisToCoordinates(
            positionSnappedToRightAngle,
            snappingCoordinates,
            axis
          );

          if (snapped) {
            drawRules(canvas, ctx, { [axis]: snappedPosition[axis] });
          }

          connection.setEnd({ getPosition: () => snappedPosition });
        } else {
          // Remove connection and leave 'connection creation mode'.
          diagram.removeElement(connection);
          stopListenersForConnectionCreation();
        }
      }

      ctx.draw();
    }
  }
}

function findInactiveTerminalsAndConnectionVertices(diagram, medium) {
  const snappingCoordinates = [];

  // Find all inactive terminals
  diagram.getElements().forEach(function (element) {
    element.getTerminalsByMedium?.(medium).forEach(function (terminal) {
      if (!terminal.isActive())
        snappingCoordinates.push(terminal.getPosition());
    });
  });

  // Find all connection vertices
  diagram.getElements().forEach(function (element) {
    if (element.getType() === "connection" && element.getMedium() === medium) {
      snappingCoordinates.push(...element.getVertices());
    }
  });

  return snappingCoordinates;
}
