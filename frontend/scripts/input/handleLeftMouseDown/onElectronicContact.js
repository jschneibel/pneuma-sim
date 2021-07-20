import { SNAPPING_TOLERANCE } from "../../constants.js";
import {
  getTransformedMousePosition,
  findElectricContactAtPosition,
  snapToRightAngle,
  snapToInactiveElectricContacts,
} from "../utils.js";

export default function checkAndHandleLeftMouseDownOnElectricContact(
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

    const wire = diagram.add.wire({ startContact });
    let lastAddedVertex = startContact.getPosition();
    wire.setEndPosition(() => mouseDownPosition);

    let mousePosition = mouseDownPosition;

    document.addEventListener("mousemove", handleMouseMoveDuringWireCreation);
    canvas.addEventListener("mousedown", handleLeftMouseDownDuringWireCreation);
    document.addEventListener("keydown", handleKeyDownDuringWireCreation);

    ctx.draw(diagram);
    return true;

    function handleMouseMoveDuringWireCreation(event) {
      mousePosition = getTransformedMousePosition(event, canvas, ctx);

      let { position: currentEndPosition, direction } = snapToRightAngle(
        lastAddedVertex,
        mousePosition
      );

      currentEndPosition[direction] = snapToInactiveElectricContacts(
        canvas,
        ctx,
        diagram,
        { [direction]: currentEndPosition[direction] },
        SNAPPING_TOLERANCE
      )[direction];

      // if (direction === "x") {
      //   currentEndPosition.x = snapToInactiveElectricContacts(
      //     canvas,
      //     ctx,
      //     diagram,
      //     { x: currentEndPosition.x },
      //     SNAPPING_TOLERANCE
      //   ).x;
      // } else if (direction === "y") {
      //   currentEndPosition.y = snapToInactiveElectricContacts(
      //     canvas,
      //     ctx,
      //     diagram,
      //     { y: currentEndPosition.y },
      //     SNAPPING_TOLERANCE
      //   ).y;
      // }

      wire.setEndPosition(() => currentEndPosition);
      // ctx.draw(diagram); // handleMouseMove.js already performs draw on each mousemove event
    }

    function handleLeftMouseDownDuringWireCreation(event) {
      let { position: newVertex, direction } = snapToRightAngle(
        lastAddedVertex,
        mousePosition // mousePosition is updated in handleMouseMoveDuringWireCreation
      );

      newVertex[direction] = snapToInactiveElectricContacts(
        canvas,
        ctx,
        diagram,
        { [direction]: newVertex[direction] },
        SNAPPING_TOLERANCE
      )[direction];

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
          vertices.pop();
          lastAddedVertex =
            vertices[vertices.length - 1] || startContact.getPosition();

          let { position: currentEndPosition, direction } = snapToRightAngle(
            lastAddedVertex,
            mousePosition
          );

          currentEndPosition[direction] = snapToInactiveElectricContacts(
            canvas,
            ctx,
            diagram,
            { [direction]: currentEndPosition[direction] },
            SNAPPING_TOLERANCE
          )[direction];

          // if (direction === "x") {
          //   // snap horizontally
          // } else if (direction === "y") {
          //   currentEndPosition = snapToInactiveElectricContactsVertically(
          //     canvas,
          //     ctx,
          //     diagram,
          //     currentEndPosition,
          //     SNAPPING_TOLERANCE
          //   );
          // }

          wire.setEndPosition(() => currentEndPosition);
        } else {
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
        }
      }

      ctx.draw(diagram);
    }
  }
}
