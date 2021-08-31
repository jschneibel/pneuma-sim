/**
 * @file Mixin for elements to have a 'selected' state, including selection box.
 * @author Jonathan Schneibel
 * @module
 */

import { drawSelection } from "../../../canvas/components/drawSelection.js";

import { mixinDrawing } from "./mixinDrawing.js";

export function mixinSelection({
  element,
  getOrigin = () => ({ x: 0, y: 0 }),
  getSelectionShape = function () {},
  selected = false,
}) {
  mixinDrawing({
    element,
    getOrigin,
    draw: function (ctx) {
      if (element.isSelected()) {
        drawSelection({ ctx, shape: getSelectionShape() });
      }
    },
  });

  element.select = () => (selected = true);

  element.unselect = () => (selected = false);

  element.isSelected = () => selected;
}
