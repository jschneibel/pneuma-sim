import mixinPath from "./mixins/mixinPath.js";
import mixinDrawing from "./mixins/mixinDrawing.js";
import mixinSelection from "./mixins/mixinSelection.js";
import { ELECTRIC_CONTACT_COLOR } from "../../constants.js";

// every wire always has one startContact
// if the element holding the startContact is deleted, the connected wire also is deleted
// every fully created wire always has one endContact
// if the element holding the endContact is deleted, the connected wire is also deleted
export default function createWire({
  startContact = {},
  endContact = {},
  vertices = [],
}) {
  const wire = {};

  mixinPath({
    element: wire,
    getStartPosition: startContact.getPosition,
    getEndPosition: endContact.getPosition || startContact.getPosition,
    vertices,
    color: ELECTRIC_CONTACT_COLOR,
  });

  // mixinDrawing({
  //   element: wire,
  //   getElementPosition: () => ({ x: 0, y: 0 }), // so we can draw in global coordinates
  //   draw,
  // });

  // // mixinSelection({
  // //   element: wire,
  // //   getElementPosition: wire.getPosition,
  // //   getElementDimensions: wire.getDimensions,
  // //   selected: true,
  // // });

  // // in global coordinates
  // function draw(ctx) {
  //   ctx.beginPath();

  //   // outer box
  //   ctx.moveTo(0, 0);
  //   ctx.lineTo(100, 0);

  //   ctx.stroke();
  // }

  return wire;
}
