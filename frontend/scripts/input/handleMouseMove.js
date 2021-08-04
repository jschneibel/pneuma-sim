import { getTransformedMousePosition } from "./utils/mousePosition.js";

export default function handleMouseMove(event, canvas, ctx, diagram) {
  const mousePosition = getTransformedMousePosition(event, canvas, ctx);

  diagram.getElements().forEach(function (element) {
    element.getTerminals?.().forEach(function (terminal) {
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
    });
  });
}
