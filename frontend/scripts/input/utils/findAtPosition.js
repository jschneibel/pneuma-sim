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

export function findContactAtPosition(diagram, position, medium) {
  let contactAtPosition;

  diagram.getElements().some(function (element) {
    let contacts = [];

    if (medium && typeof element.getContactsByMedium === "function") {
      contacts = element.getContactsByMedium(medium);
    } else if (typeof element.getContacts === "function") {
      contacts = element.getContacts();
    }

    return contacts.some(function (contact) {
      if (contact.isPositionWithinContact(position)) {
        contactAtPosition = contact;
        return true;
      }

      return false;
    });
  });

  return contactAtPosition;
}

// export function findWireAtPosition(diagram, position) {}
