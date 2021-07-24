import { getTransformedMousePosition } from "./utils/mousePosition.js";

export default function handleMouseMove(event, canvas, ctx, diagram) {
  const mousePosition = getTransformedMousePosition(event, canvas, ctx);

  diagram.getElements().forEach(function (element) {
    element.getContacts?.().forEach(function (contact) {
      if (contact.isPositionWithinContact(mousePosition)) {
        contact.highlight();
      } else {
        contact.unhighlight();
      }
    });
  });

  ctx.draw(diagram);
}
