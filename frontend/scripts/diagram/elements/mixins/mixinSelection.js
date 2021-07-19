import { SELECTION_BOX_PADDING } from "../../../constants.js";
import { drawSelectionBox } from "../../../canvas/components/drawSelectionBox.js";
import mixinDrawing from "./mixinDrawing.js";

export default function mixinSelection({
  element = {},
  getElementPosition = () => ({ x: 0, y: 0 }),
  getElementDimensions = () => ({ width, height }),
  selected = false,
}) {
  mixinDrawing({
    element,
    getElementPosition: getElementPosition,
    draw: function (ctx) {
      if (element.isSelected()) {
        const { width, height } = getElementDimensions();
        drawSelectionBox(ctx, 0, 0, width, height);
      }
    },
  });

  element.select = () => (selected = true);

  element.unselect = () => (selected = false);

  element.isSelected = () => selected;

  element.isPositionWithinSelectionBox = function (position = { x, y }) {
    const elementPosition = getElementPosition();
    const { width, height } = getElementDimensions();

    return (
      position.x >= elementPosition.x - SELECTION_BOX_PADDING &&
      position.x <= elementPosition.x + width + SELECTION_BOX_PADDING &&
      position.y >= elementPosition.y - SELECTION_BOX_PADDING &&
      position.y <= elementPosition.y + height + SELECTION_BOX_PADDING
    );
  };
}
