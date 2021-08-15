import { createStandardElement } from "./utils/standardElement.js";

import { mixinElectricCurrent } from "./mixins/mixinElectricCurrent.js";
import { mixinActive } from "./mixins/mixinActive.js";
import { mixinSimulation } from "./mixins/mixinSimulation.js";

export default function createPushButtonBreak({ diagram }) {
  const type = "pushButtonBreak";
  const width = 70;
  const height = width / 2;

  const pushButtonBreak = createStandardElement({
    diagram,
    type,
    dimensions: { width, height },
    terminalDefinitions: [
      { x: 0, y: 0, medium: "electric" },
      { x: width, y: 0, medium: "electric" },
    ],
    draw,
  });

  mixinElectricCurrent({
    element: pushButtonBreak,
    resistance: 0,
  });

  mixinActive({
    element: pushButtonBreak,
    onActivate: () => pushButtonBreak.setResistance(Infinity),
    onDeactivate: () => pushButtonBreak.setResistance(0),
  });

  mixinSimulation({
    element: pushButtonBreak,
    mouseDownAction: () => pushButtonBreak.activate(),
    mouseUpAction: () => pushButtonBreak.deactivate(),
    reset: pushButtonBreak.deactivate,
  });

  function draw(ctx) {
    const { width, height } = pushButtonBreak.getDimensions();
    const switchWidth = 70;
    const switchHeight = switchWidth / 5;

    ctx.beginPath();

    ctx.moveTo(0, 0);

    if (pushButtonBreak.isActive()) {
      // Break contact.
      ctx.lineTo((2 / 10) * switchWidth, 0);
      ctx.lineTo((8 / 10) * switchWidth, switchHeight);
      ctx.moveTo((8 / 10) * switchWidth, 0);
      ctx.lineTo(switchWidth, 0);
      ctx.translate(width / 2, switchHeight / 2);
    } else {
      // Make contact.
      ctx.lineTo(switchWidth, 0);
      ctx.translate(width / 2, 0);
    }

    // Button
    const buttonLength = 27;
    const buttonGap = 5;
    const buttonWidth = 15;
    const buttonHeight = buttonWidth / 2;
    ctx.moveTo(0, 0);
    ctx.lineTo(0, (buttonLength - buttonGap) / 2);
    ctx.moveTo(0, (buttonLength + buttonGap) / 2);
    ctx.lineTo(0, buttonLength);
    ctx.moveTo(-buttonWidth / 2, buttonLength + buttonHeight);
    ctx.lineTo(-buttonWidth / 2, buttonLength);
    ctx.lineTo(buttonWidth / 2, buttonLength);
    ctx.lineTo(buttonWidth / 2, buttonLength + buttonHeight);

    ctx.stroke();
  }

  return pushButtonBreak;
}
