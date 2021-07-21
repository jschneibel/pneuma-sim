import mixinPosition from "./mixins/mixinPosition.js";
import mixinDrawing from "./mixins/mixinDrawing.js";
import mixinContacts from "./mixins/mixinContacts.js";

export default function createWireJunction({ position = { x: 0, y: 0 } }) {
  const wireJunction = {};

  mixinPosition({
    element: wireJunction,
    position,
  });

  mixinDrawing({
    element: wireJunction,
    getElementPosition: wireJunction.getPosition,
    draw: function () {}, // The only drawing is created by mixinContacts.
  });

  // in element-local coordinates
  mixinContacts({
    element: wireJunction,
    getElementPosition: wireJunction.getPosition,
    electricContactPositions: [{ x: 0, y: 0 }],
  });

  return wireJunction;
}
