import { getTransformedMousePosition } from "../utils/mousePosition.js";
import { findElementsAtPosition } from "../utils/findAtPosition.js";

export default function checkAndHandleLeftMouseDownOnElement(
  event,
  canvas,
  ctx,
  diagram,
  mouseDownPosition
) {
  const elementUnderMouse = findElementsAtPosition(
    diagram,
    mouseDownPosition
  )[0];

  if (!elementUnderMouse) {
    return false;
  }

  if (event.ctrlKey || event.shiftKey) {
    if (elementUnderMouse.isSelected()) {
      // unselect all other elements only on mouseup and if it's not a mouse drag
      function handleLeftMouseUp() {
        elementUnderMouse.unselect();
        ctx.draw();
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
      elementUnderMouse.select?.();
    }
    ctx.draw();
  } else {
    if (elementUnderMouse.isSelected()) {
      // Re-select only this element (if multiple are selected)
      // on mouseup, if it's not a mouse drag.
      function handleLeftMouseUp() {
        diagram.unselectAll();
        elementUnderMouse.select?.();
        ctx.draw();
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
      elementUnderMouse.select?.();
    }

    ctx.draw();

    const originalDistancesToSelectedElements = [];
    diagram.getSelectedElements().forEach(function (selectedElement) {
      const selectedElementPosition = selectedElement.getPosition?.();
      if (selectedElementPosition) {
        originalDistancesToSelectedElements.push({
          x: selectedElementPosition.x - mouseDownPosition.x,
          y: selectedElementPosition.y - mouseDownPosition.y,
        });
      } else {
        originalDistancesToSelectedElements.push(null);
      }
    });

    document.addEventListener("mousemove", handleLeftMouseDrag);
    function handleLeftMouseDrag(event) {
      dragSelectedElements(
        event,
        canvas,
        ctx,
        diagram,
        originalDistancesToSelectedElements
      );
    }

    document.addEventListener("mouseup", handleLeftMouseDragEnd);
    function handleLeftMouseDragEnd(event) {
      removeSelectedElementDragListeners(
        handleLeftMouseDrag,
        handleLeftMouseDragEnd
      );
    }

    return true;
  }
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
    selectedElements[i].setPosition?.({
      x: currentMousePosition.x + originalDistancesToSelectedElements[i].x,
      y: currentMousePosition.y + originalDistancesToSelectedElements[i].y,
    });
  }

  ctx.draw();
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
