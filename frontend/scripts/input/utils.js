import drawRules from "../canvas/components/drawRules.js";

export function getTransformedMousePosition(event, canvas, ctx) {
  // const canvasElement = event.currentTarget;
  const rect = canvas.getBoundingClientRect();
  const untransformedX = event.clientX - rect.left;
  const untransformedY = event.clientY - rect.top;

  // a: horizontal scaling
  // d: vertical scaling
  // e: horizontal translation
  // f: vertical translation
  const { a, d, e, f } = ctx.getTransform();

  const transformedX = (untransformedX - e) / a;
  const transformedY = (untransformedY - f) / d;

  return { x: transformedX, y: transformedY };
}

export function findElementAtPosition(diagram, position) {
  let elementAtPosition;

  diagram.getElements().some(function (element) {
    if (element.isPositionWithinSelectionBox?.(position)) {
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

export function snapToRightAngle(a, b) {
  const delta = {
    x: b.x - a.x,
    y: b.y - a.y,
  };

  if (Math.abs(delta.x) > Math.abs(delta.y)) {
    return {
      position: { x: b.x, y: a.y },
      axis: "x",
    };
  } else {
    return {
      position: { x: a.x, y: b.y },
      axis: "y",
    };
  }
}

// Only snaps those coordinates given in position.
// E.g. position = { x: 10 } will return { x: snappedX } (without y)
export function snapToInactiveElectricContacts(
  canvas,
  ctx,
  diagram,
  position,
  tolerance
) {
  const snappedPosition = {};

  // collect all inactive contacts
  const contacts = [];
  diagram.getElements().forEach(function (element) {
    element.getElectricContacts?.().forEach(function (contact) {
      if (!contact.isActive()) contacts.push(contact);
    });
  });

  if (position.x) {
    // sort contacts by smallest horizontal delta to given x
    contacts.sort(function (a, b) {
      const horizontalDeltaA = Math.abs(a.getPosition().x - position.x);
      const horizontalDeltaB = Math.abs(b.getPosition().x - position.x);
      return Math.sign(horizontalDeltaA - horizontalDeltaB);
    });

    // if the first contact has a horizontal delta to given x smaller than tolerance
    if (Math.abs(contacts[0]?.getPosition().x - position.x) < tolerance) {
      // then snap to x coordinate of that contact
      drawRules(canvas, ctx, { x: contacts[0].getPosition().x });
      snappedPosition.x = contacts[0].getPosition().x;
    } else {
      // else don't snap
      snappedPosition.x = position.x;
    }
  }

  if (position.y) {
    // sort contacts by smallest vertical delta to given y
    contacts.sort(function (a, b) {
      const verticalDeltaA = Math.abs(a.getPosition().y - position.y);
      const verticalDeltaB = Math.abs(b.getPosition().y - position.y);
      return Math.sign(verticalDeltaA - verticalDeltaB);
    });

    // if the first contact has a vertical delta to given y smaller than tolerance
    if (Math.abs(contacts[0]?.getPosition().y - position.y) < tolerance) {
      // then snap to y coordinate of that contact
      drawRules(canvas, ctx, { y: contacts[0].getPosition().y });
      snappedPosition.y = contacts[0].getPosition().y;
    } else {
      // else don't snap
      snappedPosition.y = position.y;
    }
  }

  return snappedPosition;
}

// This effectively snaps to wire vertices, which
// is the same as snapping to wire segments.
// Only snaps those coordinates given in position.
// E.g. position = { x: 10 } will return { x: snappedX } (without y)
export function snapToWires(canvas, ctx, diagram, position, tolerance) {
  const snappedPosition = {};

  // collect all wire vertices
  // TODO: don't collect itself!
  const vertices = [];
  diagram.getElements().forEach(function (element) {
    let type = element.getType?.();
    if (type === "wire") {
      vertices.push(...element.getVertices());
    }
  });

  if (position.x) {
    // sort contacts by smallest horizontal delta to given x
    vertices.sort(function (a, b) {
      const horizontalDeltaA = Math.abs(a.x - position.x);
      const horizontalDeltaB = Math.abs(b.x - position.x);
      return Math.sign(horizontalDeltaA - horizontalDeltaB);
    });

    // if the first contact has a horizontal delta to given x smaller than tolerance
    if (Math.abs(vertices[0]?.x - position.x) < tolerance) {
      // then snap to x coordinate of that contact
      drawRules(canvas, ctx, { x: vertices[0].x });
      snappedPosition.x = vertices[0].x;
    } else {
      // else don't snap
      snappedPosition.x = position.x;
    }
  }

  if (position.y) {
    // sort contacts by smallest vertical delta to given y
    vertices.sort(function (a, b) {
      const verticalDeltaA = Math.abs(a.y - position.y);
      const verticalDeltaB = Math.abs(b.y - position.y);
      return Math.sign(verticalDeltaA - verticalDeltaB);
    });

    // if the first contact has a vertical delta to given y smaller than tolerance
    if (Math.abs(vertices[0]?.y - position.y) < tolerance) {
      // then snap to y coordinate of that contact
      drawRules(canvas, ctx, { y: vertices[0].y });
      snappedPosition.y = vertices[0].y;
    } else {
      // else don't snap
      snappedPosition.y = position.y;
    }
  }

  return snappedPosition;
}

export function snapToInactivePneumaticContactsVertically(
  canvas,
  ctx,
  diagram,
  position,
  tolerance
) {
  const contacts = [];
  // collect all inactive contacts
  diagram.getElements().forEach(function (element) {
    element.getPneumaticContacts?.().forEach(function (contact) {
      if (contact.isActive()) contacts.push(contact);
    });
  });

  // sort contacts by smallest vertical delta to given y
  contacts.sort(function (a, b) {
    const verticalDeltaA = Math.abs(a.getPosition().y - position.y);
    const verticalDeltaB = Math.abs(b.getPosition().y - position.y);
    return Math.sign(verticalDeltaA - verticalDeltaB);
  });

  // if the first contact has a vertical delta to given y smaller than tolerance
  // then return that contact
  if (Math.abs(contacts[0]?.getPosition().y - position.y) < tolerance) {
    drawRules(canvas, ctx, { y: contacts[0].getPosition().y });
    return {
      x: position.x,
      y: contacts[0].getPosition().y,
    };
  } else {
    return position;
  }
}
