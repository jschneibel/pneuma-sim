export function getTransformedMousePosition(event, canvas) {
  // const canvasElement = event.currentTarget;
  const rect = canvas.getBoundingClientRect();
  const untransformedX = event.clientX - rect.left;
  const untransformedY = event.clientY - rect.top;

  // a: horizontal scaling
  // d: vertical scaling
  // e: horizontal translation
  // f: vertical translation
  const { a, d, e, f } = canvas.getContext("2d").getTransform();

  const transformedX = (untransformedX - e) / a;
  const transformedY = (untransformedY - f) / d;

  return { x: transformedX, y: transformedY };
}

export function findElementAtPosition(diagram, position) {
  let elementAtPosition;

  diagram.getElements().some(function (element) {
    if (element.isPositionWithinSelectionBox(position)) {
      elementAtPosition = element;
      return true;
    }
    return false;
  });

  return elementAtPosition;
}

export function findElectricContactAtPosition(diagram, position) {
  let electricContactAtPosition;

  diagram.getElements().some(function (element) {
    let elementPosition = element.getPosition();
    let relativePosition = {
      x: position.x - elementPosition.x,
      y: position.y - elementPosition.y,
    };

    return element.getElectricContacts().some(function (electricContact) {
      if (electricContact.isPositionWithinContact(relativePosition)) {
        electricContactAtPosition = electricContact;
        return true;
      }
      return false;
    });
  });

  return electricContactAtPosition;
}

export function findPneumaticContactAtPosition(diagram, position) {
  let pneumaticContactAtPosition;

  diagram.getElements().some(function (element) {
    let elementPosition = element.getPosition();
    let relativePosition = {
      x: position.x - elementPosition.x,
      y: position.y - elementPosition.y,
    };

    return element.getPneumaticContacts().some(function (pneumaticContact) {
      if (pneumaticContact.isPositionWithinContact(relativePosition)) {
        pneumaticContactAtPosition = pneumaticContact;
        return true;
      }
      return false;
    });
  });

  return pneumaticContactAtPosition;
}
