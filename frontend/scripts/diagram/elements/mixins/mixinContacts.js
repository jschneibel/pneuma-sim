import {
  CONTACT_SIZE,
  CONTACT_LINE_WIDTH,
  ELECTRIC_CONTACT_COLOR,
  PNEUMATIC_CONTACT_COLOR,
} from "../../../constants.js";

import createBasicElement from "../utils/basicElement.js";

import mixinPosition from "./mixinPosition.js";
import mixinDimensions from "./mixinDimensions.js";
import mixinDrawing from "./mixinDrawing.js";
import mixinHighlighting from "./mixinHighlighting.js";
import mixinActive from "./mixinActive.js";
import mixinRemoval from "./mixinRemoval.js";
import mixinMedium from "./mixinMedium.js";

export default function mixinContacts({
  element = {},
  getElementPosition = () => ({ x: 0, y: 0 }),
  contactDefinitions = [],
}) {
  const contacts = contactDefinitions.map((contactDefinition) =>
    createContact({
      parentElement: element,
      getParentPosition: getElementPosition,
      relativePosition: { x: contactDefinition.x, y: contactDefinition.y },
      medium: contactDefinition.medium,
    })
  );

  // Returns a shallow copy.
  element.getContacts = () => [...contacts];

  element.getContactById = function (id) {
    for (let i = 0; i < contacts.length; i++) {
      if (contacts[i].getId() === id) {
        return contacts[i];
      }
    }

    return null;
  };

  element.getContactsByMedium = function (medium) {
    return contacts.filter((contact) => contact.getMedium() === medium);
  };
}

function createContact({
  parentElement = {},
  getParentPosition = () => ({ x: 0, y: 0 }),
  relativePosition = { x: 0, y: 0 },
  medium,
}) {
  const contact = createBasicElement("contact");

  const connections = [];

  let color;
  switch (medium) {
    case "electric":
      color = ELECTRIC_CONTACT_COLOR;
      break;
    case "pneumatic":
      color = PNEUMATIC_CONTACT_COLOR;
      break;
    default:
      color = "#555";
  }

  mixinMedium({
    element: contact,
    medium,
  });

  const parentPosition = getParentPosition();

  mixinPosition({
    element: contact,
    position: {
      x: parentPosition.x + relativePosition.x,
      y: parentPosition.y + relativePosition.y,
    },
  });

  // Bind contact position to parent position.
  const originalParentElementSetPosition = parentElement.setPosition;
  parentElement.setPosition = function (parentPosition) {
    originalParentElementSetPosition(parentPosition);
    contact.setPosition({
      x: parentPosition.x + relativePosition.x,
      y: parentPosition.y + relativePosition.y,
    });
  };

  mixinDimensions({
    element: contact,
    dimensions: { width: CONTACT_SIZE, height: CONTACT_SIZE },
  });

  mixinDrawing({
    element: parentElement,
    getOrigin: getParentPosition,
    draw,
  });

  mixinHighlighting({
    element: contact,
    highlighted: false,
  });

  mixinActive({
    element: contact,
    active: false,
  });

  mixinRemoval({
    element: parentElement,
    remove: removeParent,
  });

  mixinRemoval({
    element: contact,
    remove,
  });

  contact.getParentElement = () => parentElement;

  // position in global coordinates
  contact.isPositionWithinContact = function (position = { x, y }) {
    const contactPosition = contact.getPosition();
    const radius = (CONTACT_SIZE + CONTACT_LINE_WIDTH) / 2;

    return (
      position.x >= contactPosition.x - radius &&
      position.x <= contactPosition.x + radius &&
      position.y >= contactPosition.y - radius &&
      position.y <= contactPosition.y + radius
    );
  };

  // Returns a shallow copy of the connections.
  contact.getConnections = () => [...connections];

  contact.addConnection = function (connection) {
    const connectionIndex = connections.indexOf(connection);

    if (connectionIndex === -1) {
      connections.push(connection);
      contact.activate();
    }

    return [...connections]; // Returns a shallow copy of connections.
  };

  contact.removeConnection = function (diagram, connection) {
    const index = connections.indexOf(connection);
    if (index >= 0) {
      connections.splice(index, 1);
      connection.remove?.(diagram); // A connection cannot exist with an open end.

      if (connections.length === 0) {
        contact.deactivate();
      }
    }

    return [...connections]; // Returns a shallow copy of remaining connections.
  };

  // Removing the parent element causes the contact to be removed.
  function removeParent(diagram) {
    contact.remove(diagram);
  }

  function remove(diagram) {
    const shallowConnectionsCopy = [...connections];
    connections.length = 0; // Empty the array.

    shallowConnectionsCopy.forEach(function (connection) {
      // contact.removeConnection(diagram, connection);
      connection.remove?.(diagram);
    });
  }

  function draw(ctx) {
    const circleRadius = CONTACT_SIZE / 2;

    ctx.save();
    ctx.lineWidth = CONTACT_LINE_WIDTH;
    ctx.strokeStyle = color;
    ctx.fillStyle = color;
    ctx.translate(relativePosition.x, relativePosition.y);

    ctx.beginPath();
    ctx.moveTo(circleRadius, 0);
    ctx.arc(0, 0, circleRadius, 0, 2 * Math.PI);

    if (contact.isHighlighted() || contact.isActive()) {
      ctx.fill();
    }

    ctx.stroke();

    ctx.restore();
  }

  return contact;
}
