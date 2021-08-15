import { createStandardElement } from "./utils/standardElement.js";

import { mixinElectricCurrent } from "./mixins/mixinElectricCurrent.js";
import { mixinActive } from "./mixins/mixinActive.js";
import { mixinSimulation } from "./mixins/mixinSimulation.js";

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

  mixinActive({
    element: breakContact,
    onActivate: () => breakContact.setResistance(Infinity),
    onDeactivate: () => breakContact.setResistance(0),
  });

  mixinSimulation({
    element: breakContact,
    reset: breakContact.deactivate,
  });

  function draw(ctx) {
    const { width, height } = breakContact.getDimensions();

    ctx.beginPath();

    // Outer parts.
    ctx.moveTo(0, 0);
    ctx.lineTo((2 / 10) * width, 0);
    ctx.moveTo((8 / 10) * width, height);
    ctx.lineTo((8 / 10) * width, 0);
    ctx.lineTo(width, 0);

    // Latch.
    ctx.moveTo((2 / 10) * width, 0);
    if (breakContact.isActive()) {
      // Breaking contact.
      ctx.lineTo((7.5 / 10) * width, (14 / 10) * height);
    } else {
      // Making contact.
      ctx.lineTo((8.5 / 10) * width, (7 / 10) * height);
    }

    ctx.stroke();
  }

  return breakContact;
}
