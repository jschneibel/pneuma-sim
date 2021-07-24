import { getTransformedMousePosition } from "./utils/mousePosition.js";

export default function handleMouseMove(event, canvas, ctx, diagram) {
  const mousePosition = getTransformedMousePosition(event, canvas, ctx);

  diagram.getElements().forEach(function (element) {
    element
      .getContactsByMedium?.("electric")
      .forEach(function (electricContact) {
        if (electricContact.isPositionWithinContact(mousePosition)) {
          electricContact.highlight();
        } else {
          electricContact.unhighlight();
        }
      });

    element
      .getContactsByMedium?.("pneumatic")
      .forEach(function (pneumaticContact) {
        if (pneumaticContact.isPositionWithinContact(mousePosition)) {
          pneumaticContact.highlight();
        } else {
          pneumaticContact.unhighlight();
        }
      });
  });

  // TODO:
  // when dragging from an contact: create wire/hose

  ctx.draw(diagram);
}
