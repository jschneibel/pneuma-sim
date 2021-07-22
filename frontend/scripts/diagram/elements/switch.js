import mixinPosition from "./mixins/mixinPosition.js";
import mixinDimensions from "./mixins/mixinDimensions.js";
import mixinSelection from "./mixins/mixinSelection.js";
import mixinDrawing from "./mixins/mixinDrawing.js";
import mixinContacts from "./mixins/mixinContacts.js";
import mixinBoundingArea from "./mixins/mixinBoundingArea.js";

export default function createSwitch() {
  const electricSwitch = {};

  mixinPosition({
    element: electricSwitch,
    position: { x: 20, y: 20 },
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

  mixinSelection({
    element: electricSwitch,
    getOrigin: electricSwitch.getPosition,
    getSelectionShape: electricSwitch.getBoundingArea,
    selected: true,
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
    electricContactPositions: [
      { x: 0, y: 0 },
      { x: width, y: 0 },
    ],
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

  return electricSwitch;
}
