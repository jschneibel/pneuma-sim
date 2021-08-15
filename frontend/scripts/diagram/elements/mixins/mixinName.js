/**
 * @file Mixin for elements to have a name.
 * @author Jonathan Schneibel
 * @module
 */

import { mixinDrawing } from "./mixinDrawing.js";

export function mixinName({
  element,
  diagram,
  getOrigin = () => ({ x: 0, y: 0 }),
}) {
  let name = undefined;

  element.getName = () => name;

  element.setName = function (value) {
    if (value === "") {
      name = undefined;
      return name;
    } else {
      if (
        diagram.getElementById(parseInt(value)) ||
        diagram.getElementByName(value)
      ) {
        // Do nothing, i.e. keep previous name.
      } else {
        name = value;
      }
    }
  };

  mixinDrawing({
    element,
    getOrigin,
    draw: function (ctx) {
      if (name !== undefined) {
        ctx.write(name, 2, 2);
      }
    },
  });
}
