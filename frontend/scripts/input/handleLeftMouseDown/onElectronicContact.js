import { SNAPPING_TOLERANCE, ZOOM_SPEED } from "../../constants.js";
import {
  getTransformedMousePosition,
  findElectricContactAtPosition,
  snapToRightAngle,
  snapToInactiveElectricContacts,
  snapToWires,
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

    diagram.unselectAll();

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
      const mousePosition = getTransformedMousePosition(event, canvas, ctx);

      let { position: positionSnappedToRightAngle, axis } = snapToRightAngle(
        lastAddedVertex,
        mousePosition
      );

      let positionSnappedToInactiveElectricContact = {
        ...positionSnappedToRightAngle, // shallow copy
      };
      positionSnappedToInactiveElectricContact[axis] =
        snapToInactiveElectricContacts(
          canvas,
          ctx,
          diagram,
          { [axis]: positionSnappedToRightAngle[axis] },
          SNAPPING_TOLERANCE
        )[axis];

      let positionSnappedToWireJunction = {
        ...positionSnappedToInactiveElectricContact, // shallow copy
      };
      positionSnappedToWireJunction[axis] = snapToWires(
        canvas,
        ctx,
        diagram,
        { [axis]: positionSnappedToInactiveElectricContact[axis] },
        SNAPPING_TOLERANCE
      )[axis];

      wire.setEnd({ getPosition: () => positionSnappedToWireJunction });
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
        // electricContactAtNewVertex.activate();
        stopListenersForWireCreation();
      } else {
        // If the snapped position is empty.
        const vertices = wire.getVertices();

        if (
          (newVertex.x === vertices[vertices.length - 1]?.x &&
            newVertex.x === vertices[vertices.length - 2]?.x) ||
          (newVertex.y === vertices[vertices.length - 1]?.y &&
            newVertex.y === vertices[vertices.length - 2]?.y)
        ) {
          // If the new vertex and the last two existing vertices are in a line,
          // then replace the last existing vertex with the new vertex.
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
          diagram.removeElement(wire);
          stopListenersForWireCreation();
        }
      }

      ctx.draw(diagram);
    }
  }
}
