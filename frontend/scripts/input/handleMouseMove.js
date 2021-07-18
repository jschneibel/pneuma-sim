import { getTransformedMousePosition } from "./utils.js";

export default function handleMouseMove(event, canvasElement, diagram) {
  const mousePosition = getTransformedMousePosition(event, canvasElement);

  diagram.getElements().forEach(function (element) {
    let elementPosition = element.getPosition();
    let relativeMousePosition = {
      x: mousePosition.x - elementPosition.x,
      y: mousePosition.y - elementPosition.y,
    };

    element.getElectricContacts().forEach(function (electricContact) {
      if (electricContact.isPositionWithinContact(relativeMousePosition)) {
        electricContact.highlight();
      } else {
        electricContact.unhighlight();
      }
    });

    element.getPneumaticContacts().forEach(function (pneumaticContact) {
      if (pneumaticContact.isPositionWithinContact(relativeMousePosition)) {
        pneumaticContact.highlight();
      } else {
        pneumaticContact.unhighlight();
      }
    });
  });

  // TODO:
  // when dragging from an contact: create wire/hose

  canvasElement.getContext("2d").draw(diagram);
}
