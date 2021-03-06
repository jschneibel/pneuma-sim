/**
 * @file The push-button element to toggle contact.
 * @author Jonathan Schneibel
 * @module
 */

import { createStandardElement } from "./utils/standardElement.js";

import { mixinElectricCurrent } from "./mixins/mixinElectricCurrent.js";
import { mixinActive } from "./mixins/mixinActive.js";
import { mixinSimulation } from "./mixins/mixinSimulation.js";

export default function createPushButtonToggle({ diagram }) {
  const type = "pushButtonToggle";
  const width = 70;
  const height = width / 2;

  const pushButtonToggle = createStandardElement({
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
    element: pushButtonToggle,
    resistance: Infinity,
  });

  mixinActive({
    element: pushButtonToggle,
    onActivate: () => pushButtonToggle.setResistance(0),
    onDeactivate: () => pushButtonToggle.setResistance(Infinity),
  });

  mixinSimulation({
    element: pushButtonToggle,
    mouseDownAction: () => pushButtonToggle.toggleActive(),
    reset: pushButtonToggle.deactivate,
  });

  function draw(ctx) {
    const { width, height } = pushButtonToggle.getDimensions();
    const switchWidth = 70;
    const switchHeight = switchWidth / 5;

    ctx.beginPath();

    ctx.moveTo(0, 0);

    if (pushButtonToggle.isActive()) {
      // Make contact.
      ctx.lineTo(switchWidth, 0);
      ctx.translate(width / 2, 0);
    } else {
      // Break contact.
      ctx.lineTo((2 / 10) * switchWidth, 0);
      ctx.lineTo((8 / 10) * switchWidth, switchHeight);
      ctx.moveTo((8 / 10) * switchWidth, 0);
      ctx.lineTo(switchWidth, 0);
      ctx.translate(width / 2, switchHeight / 2);
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
    ctx.lineTo(buttonWidth / 2, buttonLength - buttonHeight);

    ctx.stroke();
  }

  return pushButtonToggle;
}
