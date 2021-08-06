import { getTransformedMousePosition } from "./utils/mousePosition.js";

export default function handleMouseMove(event, canvas, ctx, diagram) {
  const mousePosition = getTransformedMousePosition(event, canvas, ctx);

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
