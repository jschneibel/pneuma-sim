import mixinPosition from "./mixins/mixinPosition.js";
import mixinDimensions from "./mixins/mixinDimensions.js";
import mixinSelection from "./mixins/mixinSelection.js";
import mixinDrawing from "./mixins/mixinDrawing.js";
import mixinContacts from "./mixins/mixinContacts.js";

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

  mixinSelection({
    element: electricSwitch,
    getElementPosition: electricSwitch.getPosition,
    getElementDimensions: electricSwitch.getDimensions,
    selected: true,
  });

  mixinDrawing({
    element: electricSwitch,
    getElementPosition: electricSwitch.getPosition,
    draw,
  });

  const { width } = electricSwitch.getDimensions();

  mixinContacts({
    element: electricSwitch,
    getElementPosition: electricSwitch.getPosition,
    electricContactPositions: [
      { x: 0, y: 0 },
      { x: width, y: 0 },
    ],
    pneumaticContactPositions: [],
  });

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
