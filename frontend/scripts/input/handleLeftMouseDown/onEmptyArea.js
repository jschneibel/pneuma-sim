export default function handleLeftMouseDownOnEmptyArea(event, ctx, diagram) {
  if (event.ctrlKey || event.shiftKey) {
    // do nothing
  } else {
    diagram.unselectAll();
    ctx.draw(diagram);
  }

  // TODO: Open selection box, if it's a mouse drag.

  return;
}
