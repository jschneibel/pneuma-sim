// Type is optional.
export function findElementsAtPosition(diagram, position, type) {
  const elementsAtPosition = [];

  diagram.getElements().forEach(function (element) {
    if (type && element.getType?.() !== type) {
      return;
    }

    if (element.isPositionWithinBoundingArea?.(position)) {
      elementsAtPosition.push(element);
    }
  });

  return elementsAtPosition;
}

export function findElectricContactAtPosition(diagram, position) {
  let electricContactAtPosition;

  diagram.getElements().some(function (element) {
    if (typeof element.getContactsByMedium === "function") {
      return element
        .getContactsByMedium("electric")
        .some(function (electricContact) {
          if (electricContact.isPositionWithinContact(position)) {
            electricContactAtPosition = electricContact;
            return true;
          }
          return false;
        });
    }
  });

  return electricContactAtPosition;
}

export function findWireAtPosition(diagram, position) {}

export function findPneumaticContactAtPosition(diagram, position) {
  let pneumaticContactAtPosition;

  diagram.getElements().some(function (element) {
    if (typeof element.getPneumaticContacts === "function") {
      return element
        .getContactsByMedium("pneumatic")
        .some(function (pneumaticContact) {
          if (pneumaticContact.isPositionWithinContact(position)) {
            pneumaticContactAtPosition = pneumaticContact;
            return true;
          }
          return false;
        });
    }
  });

  return pneumaticContactAtPosition;
}
