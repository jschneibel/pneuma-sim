import { NEW_ELEMENT_DEFAUL_POSITION } from "../../constants.js";

import createBasicElement from "./utils/basicElement.js";

import mixinPosition from "./mixins/mixinPosition.js";
import mixinDimensions from "./mixins/mixinDimensions.js";
import mixinSelection from "./mixins/mixinSelection.js";
import mixinDrawing from "./mixins/mixinDrawing.js";
import mixinTerminals from "./mixins/mixinTerminals.js";
import mixinBoundingArea from "./mixins/mixinBoundingArea.js";
import mixinProperty from "./mixins/mixinProperty.js";

export default function createCell() {
  const cell = createBasicElement("cell");

  mixinPosition({
    element: cell,
    position: NEW_ELEMENT_DEFAUL_POSITION,
  });

  mixinDimensions({
    element: cell,
    dimensions: { width: 60, height: 40 },
  });

  mixinBoundingArea({
    element: cell,
    getOrigin: cell.getPosition,
    getElementDimensions: cell.getDimensions,
  });

  mixinDrawing({
    element: cell,
    getOrigin: cell.getPosition,
    draw,
  });

  const { width, height } = cell.getDimensions();

  // in element-local coordinates
  mixinTerminals({
    element: cell,
    getElementPosition: cell.getPosition,
    terminalDefinitions: [
      { x: 0, y: height / 2, medium: "electric" },
      { x: width, y: height / 2, medium: "electric" },
    ],
  });

  mixinSelection({
    element: cell,
    getOrigin: cell.getPosition,
    getSelectionShape: cell.getBoundingArea,
  });

  // in element-local coordinates
  function draw(ctx) {
    const { width, height } = cell.getDimensions();
    const gap = 1 / 7;
    const heightRatio = 3 / 7;

    ctx.beginPath();

    // left part (big)
    ctx.moveTo(0, height / 2);
    ctx.lineTo(((1 - gap) / 2) * width, height / 2);
    ctx.moveTo(((1 - gap) / 2) * width, height);
    ctx.lineTo(((1 - gap) / 2) * width, 0);

    // right part (small)
    ctx.moveTo(((1 + gap) / 2) * width, ((1 + heightRatio) / 2) * height);
    ctx.lineTo(((1 + gap) / 2) * width, ((1 - heightRatio) / 2) * height);
    ctx.moveTo(((1 + gap) / 2) * width, height / 2);
    ctx.lineTo(width, height / 2);

    // plus sign
    const plus = 7;
    ctx.save();
    ctx.translate((1 / 4) * width, (7 / 8) * height);
    ctx.moveTo(-plus / 2, 0);
    ctx.lineTo(plus / 2, 0);
    ctx.moveTo(0, plus / 2);
    ctx.lineTo(0, -plus / 2);
    ctx.restore();

    ctx.stroke();
  }

  mixinProperty({
    element: cell,
    label: "Element type",
    getProperty: "getType",
  });

  mixinProperty({
    element: cell,
    label: "ID",
    getProperty: "getId",
  });

  mixinProperty({
    element: cell,
    label: "x",
    getProperty: "getPosition",
    setProperty: "setPosition",
    formatProperty: (position) => position.x,
    parseInput: function (x) {
      const position = cell.getPosition();
      position.x = parseInt(x);
      return position;
    },
  });

  mixinProperty({
    element: cell,
    label: "y",
    getProperty: "getPosition",
    setProperty: "setPosition",
    formatProperty: (position) => position.y,
    parseInput: function (y) {
      const position = cell.getPosition();
      position.y = parseInt(y);
      return position;
    },
  });

  return cell;
}
