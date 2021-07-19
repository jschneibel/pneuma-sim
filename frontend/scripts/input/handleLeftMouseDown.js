import { SNAPPING_TOLERANCE } from "../constants.js";
import {
  getTransformedMousePosition,
  findElementAtPosition,
  findElectricContactAtPosition,
  findPneumaticContactAtPosition,
  snapToRightAngle,
  snapToInactiveElectricContactsVertically,
} from "./utils.js";

export default function handleLeftMouseDown(event, canvas, ctx, diagram) {
  const mouseDownPosition = getTransformedMousePosition(event, canvas, ctx);

  // handleLeftMouseDownOnElectricContact
  // if (handleLeftMouseDownOnElectricContact()) {
  //   return;
  // }
  let electricContactUnderMouse = findElectricContactAtPosition(
    diagram,
    mouseDownPosition
  );

  if (electricContactUnderMouse) {
    const startContact = electricContactUnderMouse;
    // TODO: remove handleLeftMouseDown from listeners and add it back after wire creation
    // TODO: check if contact is already connected to a wire!
    diagram.unselectAll();
    // TODO: permanently highlight contact (has to be a different state than 'highlight', maybe 'active'?)
    startContact.activate();
    const wire = diagram.add.wire({ startContact });
    let lastAddedVertex = startContact.getPosition();
    wire.setEndPosition(() => mouseDownPosition);
    // create wire
    let mousePosition = mouseDownPosition;
    document.addEventListener("mousemove", handleMouseMoveDuringWireCreation);
    canvas.addEventListener("mousedown", handleLeftMouseDownDuringWireCreation);
    document.addEventListener("keydown", handleKeyDownDuringWireCreation);

    ctx.draw(diagram);
    return;

    function handleMouseMoveDuringWireCreation(event) {
      mousePosition = getTransformedMousePosition(event, canvas, ctx);

      let { position: currentEndPosition, direction } = snapToRightAngle(
        lastAddedVertex,
        mousePosition
      );

      if (direction === "x") {
        // snap horizontally
      } else if (direction === "y") {
        currentEndPosition = snapToInactiveElectricContactsVertically(
          canvas,
          ctx,
          diagram,
          currentEndPosition,
          SNAPPING_TOLERANCE
        );
      }

      wire.setEndPosition(() => currentEndPosition);
      // ctx.draw(diagram); // handleMouseMove.js already performs draw on each mousemove event
    }

    function handleLeftMouseDownDuringWireCreation(event) {
      let { position: newVertex, direction } = snapToRightAngle(
        lastAddedVertex,
        mousePosition // mousePosition is updated in handleMouseMoveDuringWireCreation
      );

      if (direction === "x") {
        // snap horizontally
      } else if (direction === "y") {
        newVertex = snapToInactiveElectricContactsVertically(
          canvas,
          ctx,
          diagram,
          newVertex,
          SNAPPING_TOLERANCE
        );
      }

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

          if (direction === "x") {
            // snap horizontally
          } else if (direction === "y") {
            currentEndPosition = snapToInactiveElectricContactsVertically(
              canvas,
              ctx,
              diagram,
              currentEndPosition,
              SNAPPING_TOLERANCE
            );
          }

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

  // handleLeftMouseDownOnPneumaticContact
  let pneumaticContactUnderMouse = findPneumaticContactAtPosition(
    diagram,
    mouseDownPosition
  );

  // handleLeftMouseDownOnElement
  let elementUnderMouse = findElementAtPosition(diagram, mouseDownPosition);

  // handleLeftMouseDownInEmptyArea
  if (!elementUnderMouse) {
    if (event.ctrlKey || event.shiftKey) {
      // do nothing
    } else {
      diagram.unselectAll();
      ctx.draw(diagram);
    }

    // TODO: Open selection box, if it's a mouse drag.
    return;
  }

  if (event.ctrlKey || event.shiftKey) {
    if (elementUnderMouse.isSelected()) {
      // unselect all other elements only on mouseup and if it's not a mouse drag
      function handleLeftMouseUp() {
        elementUnderMouse.unselect();
        ctx.draw(diagram);
        removeUnselectElementListeners(
          canvas,
          handleLeftMouseUp,
          handleLeftMouseMove
        );
      }
      canvas.addEventListener("mouseup", handleLeftMouseUp);

      function handleLeftMouseMove() {
        removeUnselectElementListeners(
          canvas,
          handleLeftMouseUp,
          handleLeftMouseMove
        );
      }
      canvas.addEventListener("mousemove", handleLeftMouseMove);
    } else {
      elementUnderMouse.select();
    }
  } else {
    if (elementUnderMouse.isSelected()) {
      // re-select element on mouseup, if it's not a mouse drag
      function handleLeftMouseUp() {
        diagram.unselectAll();
        elementUnderMouse.select();
        ctx.draw(diagram);
        removeReselectElementListeners(
          canvas,
          handleLeftMouseUp,
          handleLeftMouseMove
        );
      }
      canvas.addEventListener("mouseup", handleLeftMouseUp);

      function handleLeftMouseMove() {
        removeReselectElementListeners(
          canvas,
          handleLeftMouseUp,
          handleLeftMouseMove
        );
      }
      canvas.addEventListener("mousemove", handleLeftMouseMove);
    } else {
      diagram.unselectAll();
      elementUnderMouse.select();
    }
  }

  ctx.draw(diagram);

  const originalDistancesToSelectedElements = [];
  diagram.getSelectedElements().forEach(function (selectedElement) {
    const selectedElementPosition = selectedElement.getPosition();
    originalDistancesToSelectedElements.push({
      x: selectedElementPosition.x - mouseDownPosition.x,
      y: selectedElementPosition.y - mouseDownPosition.y,
    });
  });

  function handleLeftMouseDrag(event) {
    dragSelectedElements(
      event,
      canvas,
      ctx,
      diagram,
      originalDistancesToSelectedElements
    );
  }
  document.addEventListener("mousemove", handleLeftMouseDrag);

  function handleLeftMouseDragEnd(event) {
    removeSelectedElementDragListeners(
      handleLeftMouseDrag,
      handleLeftMouseDragEnd
    );
  }
  document.addEventListener("mouseup", handleLeftMouseDragEnd);
}

function dragSelectedElements(
  event,
  canvas,
  ctx,
  diagram,
  originalDistancesToSelectedElements
) {
  const selectedElements = diagram.getSelectedElements();
  const currentMousePosition = getTransformedMousePosition(event, canvas, ctx);

  for (let i = 0; i < selectedElements.length; i++) {
    selectedElements[i].setPosition({
      x: currentMousePosition.x + originalDistancesToSelectedElements[i].x,
      y: currentMousePosition.y + originalDistancesToSelectedElements[i].y,
    });
  }

  // ctx.draw(diagram); // handleMouseMove.js already performs draw on each mousemove event
}

function removeSelectedElementDragListeners(
  handleLeftMouseDrag,
  handleLeftMouseDragEnd
) {
  document.removeEventListener("mousemove", handleLeftMouseDrag);
  document.removeEventListener("mouseup", handleLeftMouseDragEnd);
}

function removeUnselectElementListeners(
  canvasElement,
  handleLeftMouseUp,
  handleLeftMouseMove
) {
  canvasElement.removeEventListener("mouseup", handleLeftMouseUp);
  canvasElement.removeEventListener("mousemove", handleLeftMouseMove);
}

function removeReselectElementListeners(
  canvasElement,
  handleLeftMouseUp,
  handleLeftMouseMove
) {
  canvasElement.removeEventListener("mouseup", handleLeftMouseUp);
  canvasElement.removeEventListener("mousemove", handleLeftMouseMove);
}
