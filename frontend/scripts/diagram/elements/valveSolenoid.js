import createStandardElement from "./utils/standardElement.js";

import mixinElectricCurrent from "./mixins/mixinElectricCurrent.js";

export default function createValveSolenoid() {
  const type = "valveSolenoid";
  const width = 70;
  const height = width / 5;

  const valveSolenoid = createStandardElement({
    type,
    dimensions: { width, height },
    terminalDefinitions: [
      { x: 0, y: 0, medium: "electric" },
      { x: width, y: 0, medium: "electric" },
    ],
    draw,
  });

  mixinElectricCurrent({
    element: valveSolenoid,
    resistance: 1,
  });

  // in element-local coordinates
  function draw(ctx) {
    const { width, height } = valveSolenoid.getDimensions();

    ctx.beginPath();

    ctx.moveTo(0, 0);
    ctx.lineTo((2 / 10) * width, 0);
    ctx.lineTo((8 / 10) * width, height);
    ctx.moveTo((8 / 10) * width, 0);
    ctx.lineTo(width, 0);
    ctx.lineTo(0, height);
    ctx.stroke();
  }

  return valveSolenoid;
}
