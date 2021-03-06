/**
 * @file Handles the keydown event during editing.
 * @author Jonathan Schneibel
 * @module
 */

export default function handleKeyDown(event, ctx, diagram) {
  console.log("event.key:", event.key);

  // Ignore keydown event if typing in an input field.
  if (event.target.matches("input")) return;

  switch (event.key) {
    case "A":
    case "a":
      handleAKey(event, ctx, diagram);
      break;
    case "Delete":
    case "Backspace":
      handleDeletionKeys(ctx, diagram);
      break;
    case "ArrowLeft":
    case "ArrowRight":
    case "ArrowUp":
    case "ArrowDown":
      handleArrowKeys(event, ctx, diagram);
      break;
    case "Escape":
      handleEscapeKey(ctx, diagram);
    default:
      break;
  }
}

function handleAKey(event, ctx, diagram) {
  if (event.ctrlKey) {
    diagram.selectAll();
    ctx.draw();
  }
}

function handleDeletionKeys(ctx, diagram) {
  const shallowElementsCopy = [...diagram.getElements()];

  for (const element of shallowElementsCopy) {
    if (element.isSelected?.()) {
      diagram.removeElement(element);
    }
  }

  ctx.draw();
}

function handleArrowKeys(event, ctx, diagram) {
  let moveDistance;
  if (event.shiftKey) {
    moveDistance = 64;
  } else if (event.ctrlKey) {
    moveDistance = 1;
  } else {
    moveDistance = 8;
  }

  let moveVector;
  if (event.key === "ArrowLeft") {
    moveVector = { x: -moveDistance, y: 0 };
  } else if (event.key === "ArrowRight") {
    moveVector = { x: moveDistance, y: 0 };
  } else if (event.key === "ArrowUp") {
    moveVector = { x: 0, y: moveDistance };
  } else if (event.key === "ArrowDown") {
    moveVector = { x: 0, y: -moveDistance };
  }

  for (const selectedElement of diagram.getSelectedElements()) {
    const currentPosition = selectedElement.getPosition();
    selectedElement.setPosition({
      x: currentPosition.x + moveVector.x,
      y: currentPosition.y + moveVector.y,
    });
  }

  ctx.draw();
}

function handleEscapeKey(ctx, diagram) {
  diagram.unselectAll();
  ctx.draw();
}
