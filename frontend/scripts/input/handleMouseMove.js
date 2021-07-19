import { getTransformedMousePosition } from "./utils.js";

export default function handleMouseMove(event, canvas, ctx, diagram) {
  const mousePosition = getTransformedMousePosition(event, canvas, ctx);

  diagram.getElements().forEach(function (element) {
    element.getElectricContacts?.().forEach(function (electricContact) {
      if (electricContact.isPositionWithinContact(mousePosition)) {
        electricContact.highlight();
      } else {
        electricContact.unhighlight();
      }
    });

    element.getPneumaticContacts?.().forEach(function (pneumaticContact) {
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
