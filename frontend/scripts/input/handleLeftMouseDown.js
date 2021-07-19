import {
  getTransformedMousePosition,
  findElementAtPosition,
  findElectricContactAtPosition,
  findPneumaticContactAtPosition,
} from "./utils.js";

export default function handleLeftMouseDown(event, canvas, ctx, diagram) {
  const mouseDownPosition = getTransformedMousePosition(event, canvas);

  // handleLeftMouseDownOnElectricContact
  // if (handleLeftMouseDownOnElectricContact()) {
  //   return;
  // }
  let electricContactUnderMouse = findElectricContactAtPosition(
    diagram,
    mouseDownPosition
  );

  if (electricContactUnderMouse) {
    diagram.unselectAll();
    diagram.add.wire({ startContact: electricContactUnderMouse });
    // create wire
    ctx.draw(diagram);
    return;
  }
  // select parent element of contact if it's not a mouse drag!

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
  const currentMousePosition = getTransformedMousePosition(event, canvas);

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
