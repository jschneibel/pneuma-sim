import { NEW_ELEMENT_DEFAUL_POSITION } from "../../constants.js";

import createBasicElement from "./utils/basicElement.js";

import mixinPosition from "./mixins/mixinPosition.js";
import mixinDimensions from "./mixins/mixinDimensions.js";
import mixinSelection from "./mixins/mixinSelection.js";
import mixinDrawing from "./mixins/mixinDrawing.js";
import mixinContacts from "./mixins/mixinContacts.js";
import mixinBoundingArea from "./mixins/mixinBoundingArea.js";
import mixinProperty from "./mixins/mixinProperty.js";

export default function createSwitch() {
  const electricSwitch = createBasicElement("switch");

  mixinPosition({
    element: electricSwitch,
    position: NEW_ELEMENT_DEFAUL_POSITION,
  });

  mixinDimensions({
    element: electricSwitch,
    dimensions: { width: 100, height: 100 / 7 },
  });

  mixinBoundingArea({
    element: electricSwitch,
    getOrigin: electricSwitch.getPosition,
    getElementDimensions: electricSwitch.getDimensions,
  });

  mixinDrawing({
    element: electricSwitch,
    getOrigin: electricSwitch.getPosition,
    draw,
  });

  const { width } = electricSwitch.getDimensions();

  // in element-local coordinates
  mixinContacts({
    element: electricSwitch,
    getElementPosition: electricSwitch.getPosition,
    contactDefinitions: [
      { x: 0, y: 0, medium: "electric" },
      { x: width, y: 0, medium: "electric" },
    ],
  });

  mixinSelection({
    element: electricSwitch,
    getOrigin: electricSwitch.getPosition,
    getSelectionShape: electricSwitch.getBoundingArea,
  });

  // in element-local coordinates
  function draw(ctx) {
    const { width, height } = electricSwitch.getDimensions();

    ctx.beginPath();

    ctx.moveTo(0, 0);
    ctx.lineTo((2 / 10) * width, 0);
    ctx.lineTo((8 / 10) * width, height);
    ctx.moveTo((8 / 10) * width, 0);
    ctx.lineTo(width, 0);
    ctx.stroke();
  }

  mixinProperty({
    element: electricSwitch,
    label: "Element type",
    getProperty: "getType",
  });

  mixinProperty({
    element: electricSwitch,
    label: "ID",
    getProperty: "getId",
  });

  mixinProperty({
    element: electricSwitch,
    label: "x",
    getProperty: "getPosition",
    setProperty: "setPosition",
    formatProperty: (position) => position.x,
    parseInput: function (x) {
      const position = electricSwitch.getPosition();
      position.x = parseInt(x);
      return position;
    },
  });

  mixinProperty({
    element: electricSwitch,
    label: "y",
    getProperty: "getPosition",
    setProperty: "setPosition",
    formatProperty: (position) => position.y,
    parseInput: function (y) {
      const position = electricSwitch.getPosition();
      position.y = parseInt(y);
      return position;
    },
  });

  return electricSwitch;
}
