import {
  ELEMENT_CONTACT_SIZE,
  ELEMENT_CONTACT_LINE_WIDTH,
  ELECTRIC_CONTACT_COLOR,
  PNEUMATIC_CONTACT_COLOR,
} from "../../../constants.js";
import mixinPosition from "../mixins/mixinPosition.js";
import mixinDimensions from "../mixins/mixinDimensions.js";
import mixinDrawing from "../mixins/mixinDrawing.js";
import mixinHighlighting from "../mixins/mixinHighlighting.js";
import mixinActive from "../mixins/mixinActive.js";
import mixinRemoval from "../mixins/mixinRemoval.js";

// position in element-local coordinates
export function createElectricContact({
  parentElement = {},
  getParentPosition = () => ({ x: 0, y: 0 }),
  position = { x: 0, y: 0 },
}) {
  return createContact({
    parentElement,
    getParentPosition,
    relativePosition: position,
    color: ELECTRIC_CONTACT_COLOR,
  });
}

// position in element-local coordinates
export function createPneumaticContact({
  parentElement = {},
  getParentPosition = () => ({ x: 0, y: 0 }),
  position = { x: 0, y: 0 },
}) {
  return createContact({
    parentElement,
    getParentPosition,
    relativePosition: position,
    color: PNEUMATIC_CONTACT_COLOR,
  });
}

function createContact({
  parentElement = {},
  getParentPosition = () => ({ x: 0, y: 0 }),
  relativePosition = { x: 0, y: 0 },
  color = "#cc6",
}) {
  const contact = {};
  const connections = [];

  const parentPosition = getParentPosition();
  const position = {
    x: parentPosition.x + relativePosition.x,
    y: parentPosition.y + relativePosition.y,
  };

  mixinPosition({
    element: contact,
    position,
  });

  // bind contact position to parent position
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
    dimensions: { width: ELEMENT_CONTACT_SIZE, height: ELEMENT_CONTACT_SIZE },
  });

  mixinDrawing({
    element: parentElement,
    getElementPosition: getParentPosition,
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
    const radius = (ELEMENT_CONTACT_SIZE + ELEMENT_CONTACT_LINE_WIDTH) / 2;

    return (
      position.x >= contactPosition.x - radius &&
      position.x <= contactPosition.x + radius &&
      position.y >= contactPosition.y - radius &&
      position.y <= contactPosition.y + radius
    );
  };

  contact.getConnections = () => connections;

  contact.addConnection = function (connection) {
    contact.getConnections().push(connection);
    contact.activate();
  };

  contact.removeConnection = function (diagram, connection) {
    const index = connections.indexOf(connection);
    if (index >= 0) {
      connections.splice(index, 1);
      connection.remove?.(diagram);

      if (connections.length === 0) {
        contact.deactivate();
      }
    }

    return connections;
  };

  // Removing the parent element causes the contact to be removed.
  function removeParent(diagram) {
    contact.remove(diagram);
  }

  function remove(diagram) {
    let shallowConnectionsCopy = [...contact.getConnections()];
    shallowConnectionsCopy.forEach(function (connection) {
      contact.removeConnection(diagram, connection);
    });
  }

  function draw(ctx) {
    const circleRadius = ELEMENT_CONTACT_SIZE / 2;

    ctx.save();
    ctx.lineWidth = ELEMENT_CONTACT_LINE_WIDTH;
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
