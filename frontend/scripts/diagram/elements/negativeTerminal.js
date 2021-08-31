/**
 * @file The negative terminal element.
 * @author Jonathan Schneibel
 * @module
 */

import { createStandardElement } from "./utils/standardElement.js";

import { mixinElectricCurrent } from "./mixins/mixinElectricCurrent.js";

export default function createNegativeTerminal({ diagram }) {
  const type = "negativeTerminal";
  const width = 25;
  const height = 25;

  const terminal = createStandardElement({
    diagram,
    type,
    dimensions: { width, height },
    terminalDefinitions: [{ x: width / 2, y: 0, medium: "electric" }],
    draw,
  });

  mixinElectricCurrent({
    element: terminal,
    resistance: 0,
  });

  function draw(ctx) {
    const gap = (1 / 3) * height;

    ctx.beginPath();

    // minus sign
    const minus = 10;
    ctx.save();
    ctx.translate(minus / 2, (height + gap) / 2);
    ctx.moveTo(-minus / 2, 0);
    ctx.lineTo(minus / 2, 0);
    ctx.restore();

    // V
    ctx.moveTo(width / 2, height);
    ctx.lineTo((3 / 4) * width, gap);
    ctx.lineTo(width, height);

    ctx.stroke();
  }

  return terminal;
}
