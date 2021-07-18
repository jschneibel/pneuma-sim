export default function handleKeyDown(event, canvas, ctx, diagram) {
  console.log(event.key);

  if (event.key === "Delete" || event.key === "Backspace") {
    const elements = diagram.getElements();

    for (let i = elements.length - 1; i >= 0; i--) {
      if (elements[i].isSelected()) {
        elements.splice(i, 1);
      }
    }

    // diagram.getElements().forEach((element) => !element.isSelected());
    ctx.draw(diagram);
  }

  if (
    event.key === "ArrowLeft" ||
    event.key === "ArrowRight" ||
    event.key === "ArrowUp" ||
    event.key === "ArrowDown"
  ) {
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

    diagram.getSelectedElements().forEach(function (selectedElement) {
      const currentPosition = selectedElement.getPosition();
      selectedElement.setPosition({
        x: currentPosition.x + moveVector.x,
        y: currentPosition.y + moveVector.y,
      });
    });

    ctx.draw(diagram);
  }
}
