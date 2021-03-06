/**
 * @file A standard element with common mixins.
 * @author Jonathan Schneibel
 * @module
 */

import { NEW_ELEMENT_DEFAULT_POSITION } from "../../../constants.js";

import { createBasicElement } from "./basicElement.js";

import { mixinPosition } from "../mixins/mixinPosition.js";
import { mixinDimensions } from "../mixins/mixinDimensions.js";
import { mixinSelection } from "../mixins/mixinSelection.js";
import { mixinDrawing } from "../mixins/mixinDrawing.js";
import { mixinTerminals } from "../mixins/mixinTerminals.js";
import { mixinBoundingArea } from "../mixins/mixinBoundingArea.js";
import { mixinProperty } from "../mixins/mixinProperty.js";
import { mixinName } from "../mixins/mixinName.js";

export function createStandardElement({
  diagram,
  type,
  position = NEW_ELEMENT_DEFAULT_POSITION,
  dimensions,
  terminalDefinitions,
  draw,
}) {
  const element = createBasicElement(type);

  mixinPosition({
    element,
    position,
  });

  mixinDimensions({
    element,
    dimensions,
  });

  mixinBoundingArea({
    element,
    getOrigin: element.getPosition,
    getElementDimensions: element.getDimensions,
  });

  mixinDrawing({
    element,
    getOrigin: element.getPosition,
    draw,
  });

  mixinTerminals({
    element,
    getElementPosition: element.getPosition,
    terminalDefinitions,
  });

  mixinSelection({
    element,
    getOrigin: element.getPosition,
    getSelectionShape: element.getBoundingArea,
  });

  mixinName({
    element,
    diagram,
    getOrigin: function () {
      const position = element.getPosition();
      const dimensions = element.getDimensions();
      const origin = {
        x: position.x + dimensions.width,
        y: position.y + dimensions.height,
      };
      return origin;
    },
  });

  mixinProperty({
    element,
    label: "Element type",
    getProperty: "getLabel",
  });

  mixinProperty({
    element,
    label: "ID",
    getProperty: "getId",
  });

  mixinProperty({
    element,
    label: "Name",
    getProperty: "getName",
    setProperty: "setName",
    formatProperty: (name) => (name ? name : ""),
    parseInput: (input) => input.trim(),
  });

  mixinProperty({
    element,
    label: "x",
    getProperty: "getPosition",
    setProperty: "setPosition",
    formatProperty: (position) => position.x,
    parseInput: function (x) {
      const position = element.getPosition();
      position.x = parseInt(x);
      return position;
    },
  });

  mixinProperty({
    element,
    label: "y",
    getProperty: "getPosition",
    setProperty: "setPosition",
    formatProperty: (position) => position.y,
    parseInput: function (y) {
      const position = element.getPosition();
      position.y = parseInt(y);
      return position;
    },
  });

  return element;
}
