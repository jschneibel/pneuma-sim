import { SNAPPING_TOLERANCE } from "../../constants.js";
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

  // TODO: check if contact is already connected to a wire!
  if (!electricContactUnderMouse) {
    return false;
  } else {
    const startContact = electricContactUnderMouse;
    // TODO: remove handleLeftMouseDown from listeners and add it back after wire creation

    diagram.unselectAll();
    startContact.activate();

    const wire = diagram.add.wire({
      start: startContact,
      end: { getPosition: () => mouseDownPosition },
    });
    let lastAddedVertex = startContact.getPosition();

    let mousePosition = mouseDownPosition;

    document.addEventListener("mousemove", handleMouseMoveDuringWireCreation);
    canvas.addEventListener("mousedown", handleLeftMouseDownDuringWireCreation);
    document.addEventListener("keydown", handleKeyDownDuringWireCreation);
    // Disable previously registered left mousedown listener.
    canvas.removeEventListener("mousedown", invokedListenerFn);

    ctx.draw(diagram);
    return true;

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
      if (event.button !== 0) return; // only handle left mouse down

      let { position: newVertex, axis } = snapToRightAngle(
        lastAddedVertex,
        mousePosition // mousePosition is updated in handleMouseMoveDuringWireCreation
      );

      newVertex[axis] = snapToInactiveElectricContacts(
        canvas,
        ctx,
        diagram,
        { [axis]: newVertex[axis] },
        SNAPPING_TOLERANCE
      )[axis];

      wire.getVertices().push(newVertex);
      lastAddedVertex = newVertex;
    }

    function handleKeyDownDuringWireCreation(event) {
      if (
        event.key === "Delete" ||
        event.key === "Backspace" ||
        event.key === "Escape"
      ) {
        const vertices = wire.getVertices();

        if (vertices.length > 0) {
          // Remove last added vertex:

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
          // Remove wire and leave 'wire creation mode':

          diagram.deleteElement(wire);
          startContact.deactivate();

          document.removeEventListener(
            "mousemove",
            handleMouseMoveDuringWireCreation
          );
          canvas.removeEventListener(
            "mousedown",
            handleLeftMouseDownDuringWireCreation
          );
          document.removeEventListener(
            "keydown",
            handleKeyDownDuringWireCreation
          );
          // re=enable selecting elements etc. on left mousedown
          canvas.addEventListener("mousedown", invokedListenerFn);
        }
      }

      ctx.draw(diagram);
    }
  }
}
