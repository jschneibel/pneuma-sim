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
      direction: "x",
    };
  } else {
    return {
      position: { x: a.x, y: b.y },
      direction: "y",
    };
  }
}

export function snapToInactiveElectricContactsVertically(
  canvas,
  ctx,
  diagram,
  position,
  tolerance
) {
  const contacts = [];
  // collect all inactive contacts
  diagram.getElements().forEach(function (element) {
    element.getElectricContacts?.().forEach(function (contact) {
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
