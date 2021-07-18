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

// position in element-local coordinates
export function createElectricContact({
  parentElement = {},
  getParentPosition = function () {
    return { x: 0, y: 0 };
  },
  position = { x: 0, y: 0 },
}) {
  return createContact({
    parentElement,
    getParentPosition,
    position,
    color: ELECTRIC_CONTACT_COLOR,
  });
}

// position in element-local coordinates
export function createPneumaticContact({
  parentElement = {},
  getParentPosition = function () {
    return { x: 0, y: 0 };
  },
  position = { x: 0, y: 0 },
}) {
  return createContact({
    parentElement,
    getParentPosition,
    position,
    color: PNEUMATIC_CONTACT_COLOR,
  });
}

function createContact({
  parentElement = {},
  getParentPosition = function () {
    return { x: 0, y: 0 };
  },
  position = { x: 0, y: 0 },
  color = "#cc6",
}) {
  const contact = {};

  mixinPosition({
    element: contact,
    position,
  });

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

  // position in element-local coordinates
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

  function draw(ctx) {
    const circleRadius = ELEMENT_CONTACT_SIZE / 2;

    ctx.save();
    ctx.lineWidth = ELEMENT_CONTACT_LINE_WIDTH;
    ctx.strokeStyle = color;
    ctx.fillStyle = color;
    ctx.translate(position.x, position.y);

    ctx.beginPath();
    ctx.moveTo(circleRadius, 0);
    ctx.arc(0, 0, circleRadius, 0, 2 * Math.PI);

    if (contact.isHighlighted()) {
      ctx.fill();
    }
    ctx.stroke();

    ctx.restore();
  }

  return contact;
}
