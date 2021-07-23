// Type is optional.
export function findElementAtPosition(diagram, position, type) {
  let elementAtPosition;

  diagram.getElements().some(function (element) {
    if (type && element.getType?.() !== type) {
      return false;
    }

    if (element.isPositionWithinBoundingArea?.(position)) {
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
    if (typeof element.getElectricContacts === "function") {
      return element.getElectricContacts().some(function (electricContact) {
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
      return element.getPneumaticContacts().some(function (pneumaticContact) {
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
