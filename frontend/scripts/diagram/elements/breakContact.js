import createStandardElement from "./utils/standardElement.js";

import mixinElectricCurrent from "./mixins/mixinElectricCurrent.js";

export default function createBreakContact() {
  const type = "breakContact";
  const width = 70;
  const height = width / 5;

  const breakContact = createStandardElement({
    type,
    dimensions: { width, height },
    terminalDefinitions: [
      { x: 0, y: 0, medium: "electric" },
      { x: width, y: 0, medium: "electric" },
    ],
    draw,
  });

  mixinElectricCurrent({
    element: breakContact,
    resistance: 0,
  });

  // in element-local coordinates
  function draw(ctx) {
    const { width, height } = breakContact.getDimensions();

    ctx.beginPath();

    ctx.moveTo(0, 0);
    ctx.lineTo((2 / 10) * width, 0);
    ctx.lineTo((8.5 / 10) * width, (7 / 10) * height);
    ctx.moveTo((8 / 10) * width, height);
    ctx.lineTo((8 / 10) * width, 0);
    ctx.lineTo(width, 0);
    ctx.stroke();
  }

  return breakContact;
}