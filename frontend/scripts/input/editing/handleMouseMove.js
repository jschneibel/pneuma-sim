/**
 * @file Handles the mousemove event during editing.
 * @author Jonathan Schneibel
 * @module
 */

import { getTransformedMousePosition } from "../utils/mousePosition.js";

export default function handleMouseMove(event, canvas, ctx, diagram) {
  const mousePosition = getTransformedMousePosition(event, canvas, ctx);
  if (!mousePosition) {
    // When the mouse is at the edge of the window, no coordinates
    // are given in the mousemove event. Breaking here avoids
    // errors further downstream.
    return;
  }

  for (const element of diagram.getElements()) {
    for (const terminal of element.getTerminals?.() || []) {
      if (terminal.isPositionWithinTerminal(mousePosition)) {
        if (!terminal.isHighlighted()) {
          terminal.highlight();
          ctx.draw();
        }
      } else {
        if (terminal.isHighlighted()) {
          terminal.unhighlight();
          ctx.draw();
        }
      }
    }
  }
}
