import { getTransformedMousePosition } from "./utils.js";

export default function handleLeftMouseDown(event, canvas, diagram) {
  const mouseDownPosition = getTransformedMousePosition(event, canvas);

  let elementUnderMouse;
  diagram.getElements().some(function (element) {
    if (element.isPositionWithinSelectionBox(mouseDownPosition)) {
      elementUnderMouse = element;
      return true;
    }
    return false;
  });

  if (!elementUnderMouse) {
    if (event.ctrlKey || event.shiftKey) {
      // do nothing
    } else {
      diagram.unselectAll();
      canvas.getContext("2d").draw(diagram);
    }

    // ...open selection box, if it's a mouse drag
    return;
  }

  if (event.ctrlKey || event.shiftKey) {
    if (elementUnderMouse.isSelected()) {
      // unselect only on mouseup, if it's not a mouse drag
      function handleLeftMouseUp() {
        elementUnderMouse.unselect();
        canvas.getContext("2d").draw(diagram);
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
        canvas.getContext("2d").draw(diagram);
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

  canvas.getContext("2d").draw(diagram);

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
  diagram,
  originalDistancesToSelectedElements
) {
  const selectedElements = diagram.getSelectedElements();
  const currentMousePosition = getTransformedMousePosition(event, canvas);

  for (let i = 0; i < selectedElements.length; i++) {
    selectedElements[i].setPosition({
      x: currentMousePosition.x + originalDistancesToSelectedElements[i].x,
      y: currentMousePosition.y + originalDistancesToSelectedElements[i].y,
    });
  }

  canvas.getContext("2d").draw(diagram);
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
