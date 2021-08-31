/**
 * @file Handles the left mousedown event on empty areas during editing.
 * @author Jonathan Schneibel
 * @module
 */

export default function handleLeftMouseDownOnEmptyArea(event, ctx, diagram) {
  if (event.ctrlKey || event.shiftKey) {
    // do nothing
  } else {
    diagram.unselectAll();
    ctx.draw();
  }

  // TODO: Open selection box, if it's a mouse drag.

  return;
}
