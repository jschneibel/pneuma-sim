import { getTransformedMousePosition } from "../utils/mousePosition.js";
import { findElectricContactAtPosition } from "../utils/findElementsAtPosition.js";
import {
  snapToRightAngle,
  snapAlongAxisToCoordinates,
} from "../utils/snapping.js";
import drawRules from "../../canvas/components/drawRules.js";

export default function checkAndHandleLeftMouseDownOnElectricContact(
  invokedListenerFn,
  canvas,
  ctx,
  diagram,
  mouseDownPosition
) {
  const electricContactUnderMouse = findElectricContactAtPosition(
    diagram,
    mouseDownPosition
  );

  if (!electricContactUnderMouse || electricContactUnderMouse.isActive()) {
    return false;
  } else {
    // an inactive electricContact is under the mouse
    const start = electricContactUnderMouse;

    diagram.unselectAll();

    const wire = diagram.add.wire({
      start,
      end: { getPosition: () => mouseDownPosition },
    });

    let lastAddedVertex = start.getPosition();
    let mousePosition = mouseDownPosition;
    const snappingCoordinates =
      findInactiveElectricContactsAndWireVertices(diagram);

    startListenersForWireCreation();

    ctx.draw(diagram);
    return true;

    function startListenersForWireCreation() {
      // Enable listeners specific to wire creation:
      document.addEventListener("mousemove", handleMouseMoveDuringWireCreation);
      canvas.addEventListener(
        "mousedown",
        handleLeftMouseDownDuringWireCreation
      );
      document.addEventListener("keydown", handleKeyDownDuringWireCreation);

      // Disable selecting elements etc. on left down:
      canvas.removeEventListener("mousedown", invokedListenerFn);
    }

    function stopListenersForWireCreation() {
      // Disable listeners specific to wire creation:
      document.removeEventListener(
        "mousemove",
        handleMouseMoveDuringWireCreation
      );
      canvas.removeEventListener(
        "mousedown",
        handleLeftMouseDownDuringWireCreation
      );
      document.removeEventListener("keydown", handleKeyDownDuringWireCreation);

      // Re-enable selecting elements etc. on left mousedown:
      canvas.addEventListener("mousedown", invokedListenerFn);
    }

    function handleMouseMoveDuringWireCreation(event) {
      const mousePosition = getTransformedMousePosition(event, canvas, ctx);

      const { position: positionSnappedToRightAngle, axis } = snapToRightAngle(
        lastAddedVertex,
        mousePosition
      );

      const { snappedPosition, snapped } = snapAlongAxisToCoordinates(
        positionSnappedToRightAngle,
        snappingCoordinates,
        axis
      );

      if (snapped) {
        drawRules(canvas, ctx, { [axis]: snappedPosition[axis] });
      }

      wire.setEnd({ getPosition: () => snappedPosition });
      // ctx.draw(diagram); // handleMouseMove.js already performs draw on each mousemove event
    }

    function handleLeftMouseDownDuringWireCreation(event) {
      if (event.button !== 0) return; // Only handle left mouse down.
      mousePosition = getTransformedMousePosition(event, canvas, ctx);

      const { position: positionSnappedToRightAngle, axis } = snapToRightAngle(
        lastAddedVertex,
        mousePosition // mousePosition is updated in handleMouseMoveDuringWireCreation.
      );

      const { snappedPosition } = snapAlongAxisToCoordinates(
        positionSnappedToRightAngle,
        snappingCoordinates,
        axis
      );

      const electricContactAtSnappedPosition = findElectricContactAtPosition(
        diagram,
        snappedPosition
      );

      if (
        electricContactAtSnappedPosition &&
        !electricContactAtSnappedPosition.isActive()
      ) {
        // If there is an inactive electric contact at the new snapped position...
        wire.setEnd(electricContactAtSnappedPosition);
        stopListenersForWireCreation();
      } else {
        // If the snapped position is empty...
        const newVertex = snappedPosition;
        const vertices = wire.getVertices();
        const startPosition = start.getPosition();

        if (
          (newVertex.x === vertices[vertices.length - 1]?.x &&
            newVertex.x ===
              (vertices[vertices.length - 2]?.x || startPosition.x)) ||
          (newVertex.y === vertices[vertices.length - 1]?.y &&
            newVertex.y ===
              (vertices[vertices.length - 2]?.y || startPosition.y))
        ) {
          // If the new vertex and the last two existing vertices (or start) are in a line,
          // then replace the last existing vertex with the new vertex (i.e. don't create
          // two adjacent path segments without an angle/corner).
          vertices[vertices.length - 1] = newVertex;
        } else {
          wire.getVertices().push(newVertex);
        }

        lastAddedVertex = newVertex;
        handleMouseMoveDuringWireCreation(event);
      }
    }

    function handleKeyDownDuringWireCreation(event) {
      if (
        event.key === "Delete" ||
        event.key === "Backspace" ||
        event.key === "Escape"
      ) {
        const vertices = wire.getVertices();

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

          wire.setEnd({ getPosition: () => snappedPosition });
        } else {
          // Remove wire and leave 'wire creation mode'.
          diagram.removeElement(wire);
          stopListenersForWireCreation();
        }
      }

      ctx.draw(diagram);
    }
  }
}

function findInactiveElectricContactsAndWireVertices(diagram) {
  const snappingCoordinates = [];

  // Find all inactive electric contacts
  diagram.getElements().forEach(function (element) {
    element.getElectricContacts?.().forEach(function (contact) {
      if (!contact.isActive()) snappingCoordinates.push(contact.getPosition());
    });
  });

  // Find all wire vertices
  diagram.getElements().forEach(function (element) {
    let type = element.getType?.();
    if (type === "wire") {
      snappingCoordinates.push(...element.getVertices());
    }
  });

  return snappingCoordinates;
}
