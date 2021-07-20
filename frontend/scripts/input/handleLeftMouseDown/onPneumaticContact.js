import { SNAPPING_TOLERANCE } from "../../constants.js";
import {
  getTransformedMousePosition,
  findPneumaticContactAtPosition,
  snapToRightAngle,
  snapToInactivePneumaticContactsVertically,
} from "../utils.js";

export default function checkAndHandleLeftMouseDownOnPneumaticContact(
  canvas,
  ctx,
  diagram,
  mouseDownPosition
) {
  const pneumaticContactUnderMouse = findPneumaticContactAtPosition(
    diagram,
    mouseDownPosition
  );

  // TODO: check if contact is already connected to a piping!
  if (!pneumaticContactUnderMouse) {
    return false;
  } else {
    const startContact = pneumaticContactUnderMouse;
    // TODO: remove handleLeftMouseDown from listeners and add it back after piping creation

    diagram.unselectAll();
    startContact.activate();

    const piping = diagram.add.piping({ startContact });
    let lastAddedVertex = startContact.getPosition();
    piping.setEndPosition(() => mouseDownPosition);

    let mousePosition = mouseDownPosition;

    document.addEventListener("mousemove", handleMouseMoveDuringPipingCreation);
    canvas.addEventListener(
      "mousedown",
      handleLeftMouseDownDuringPipingCreation
    );
    document.addEventListener("keydown", handleKeyDownDuringPipingCreation);

    ctx.draw(diagram);
    return true;

    function handleMouseMoveDuringPipingCreation(event) {
      mousePosition = getTransformedMousePosition(event, canvas, ctx);

      let { position: currentEndPosition, direction } = snapToRightAngle(
        lastAddedVertex,
        mousePosition
      );

      if (direction === "x") {
        // snap horizontally
      } else if (direction === "y") {
        currentEndPosition = snapToInactivePneumaticContactsVertically(
          canvas,
          ctx,
          diagram,
          currentEndPosition,
          SNAPPING_TOLERANCE
        );
      }

      piping.setEndPosition(() => currentEndPosition);
      // ctx.draw(diagram); // handleMouseMove.js already performs draw on each mousemove event
    }

    function handleLeftMouseDownDuringPipingCreation(event) {
      let { position: newVertex, direction } = snapToRightAngle(
        lastAddedVertex,
        mousePosition // mousePosition is updated in handleMouseMoveDuringPipingCreation
      );

      if (direction === "x") {
        // snap horizontally
      } else if (direction === "y") {
        newVertex = snapToInactivePneumaticContactsVertically(
          canvas,
          ctx,
          diagram,
          newVertex,
          SNAPPING_TOLERANCE
        );
      }

      piping.getVertices().push(newVertex);
      lastAddedVertex = newVertex;
    }

    function handleKeyDownDuringPipingCreation(event) {
      if (
        event.key === "Delete" ||
        event.key === "Backspace" ||
        event.key === "Escape"
      ) {
        const vertices = piping.getVertices();

        if (vertices.length > 0) {
          vertices.pop();
          lastAddedVertex =
            vertices[vertices.length - 1] || startContact.getPosition();

          let { position: currentEndPosition, direction } = snapToRightAngle(
            lastAddedVertex,
            mousePosition
          );

          if (direction === "x") {
            // snap horizontally
          } else if (direction === "y") {
            currentEndPosition = snapToInactivePneumaticContactsVertically(
              canvas,
              ctx,
              diagram,
              currentEndPosition,
              SNAPPING_TOLERANCE
            );
          }

          piping.setEndPosition(() => currentEndPosition);
        } else {
          diagram.deleteElement(piping);
          startContact.deactivate();

          document.removeEventListener(
            "mousemove",
            handleMouseMoveDuringPipingCreation
          );
          canvas.removeEventListener(
            "mousedown",
            handleLeftMouseDownDuringPipingCreation
          );
          document.removeEventListener(
            "keydown",
            handleKeyDownDuringPipingCreation
          );
        }
      }

      ctx.draw(diagram);
    }
  }
}
