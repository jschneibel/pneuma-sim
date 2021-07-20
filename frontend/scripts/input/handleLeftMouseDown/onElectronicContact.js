import { SNAPPING_TOLERANCE, ZOOM_SPEED } from "../../constants.js";
import {
  getTransformedMousePosition,
  findElectricContactAtPosition,
  snapToRightAngle,
  snapToInactiveElectricContacts,
} from "../utils.js";

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
    const startContact = electricContactUnderMouse;
    // TODO: Remove handleLeftMouseDown from listeners and add it back after wire creation.

    diagram.unselectAll();
    startContact.activate();

    const wire = diagram.add.wire({
      start: startContact,
      end: { getPosition: () => mouseDownPosition },
    });
    let lastAddedVertex = startContact.getPosition();

    let mousePosition = mouseDownPosition;

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
      mousePosition = getTransformedMousePosition(event, canvas, ctx);

      let { position: currentEndPosition, axis } = snapToRightAngle(
        lastAddedVertex,
        mousePosition
      );

      currentEndPosition[axis] = snapToInactiveElectricContacts(
        canvas,
        ctx,
        diagram,
        { [axis]: currentEndPosition[axis] },
        SNAPPING_TOLERANCE
      )[axis];

      wire.setEnd({ getPosition: () => currentEndPosition });
      // ctx.draw(diagram); // handleMouseMove.js already performs draw on each mousemove event
    }

    function handleLeftMouseDownDuringWireCreation(event) {
      if (event.button !== 0) return; // Only handle left mouse down.
      mousePosition = getTransformedMousePosition(event, canvas, ctx);

      let { position: newVertex, axis } = snapToRightAngle(
        lastAddedVertex,
        mousePosition // mousePosition is updated in handleMouseMoveDuringWireCreation.
      );

      newVertex[axis] = snapToInactiveElectricContacts(
        canvas,
        ctx,
        diagram,
        { [axis]: newVertex[axis] },
        SNAPPING_TOLERANCE
      )[axis];

      const electricContactAtNewVertex = findElectricContactAtPosition(
        diagram,
        newVertex
      );

      if (
        electricContactAtNewVertex &&
        !electricContactAtNewVertex.isActive()
      ) {
        // If there is an inactive contact at the new snapped position.
        wire.setEnd(electricContactAtNewVertex);
        electricContactAtNewVertex.activate();
        stopListenersForWireCreation();
      } else {
        // If the snapped position is empty.
        wire.getVertices().push(newVertex);
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
            vertices[vertices.length - 1] || startContact.getPosition();

          let { position: currentEndPosition, axis } = snapToRightAngle(
            lastAddedVertex,
            mousePosition
          );

          currentEndPosition[axis] = snapToInactiveElectricContacts(
            canvas,
            ctx,
            diagram,
            { [axis]: currentEndPosition[axis] },
            SNAPPING_TOLERANCE
          )[axis];

          wire.setEnd({ getPosition: () => currentEndPosition });
        } else {
          // Remove wire and leave 'wire creation mode'.
          diagram.deleteElement(wire);
          startContact.deactivate();
          stopListenersForWireCreation();
        }
      }

      ctx.draw(diagram);
    }
  }
}
