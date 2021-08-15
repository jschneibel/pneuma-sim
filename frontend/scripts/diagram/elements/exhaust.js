import { createStandardElement } from "./utils/standardElement.js";

import { mixinPort } from "./mixins/mixinPort.js";

export default function createExhaust() {
  const type = "exhaust";
  const width = 19;
  const height = (5 / 4) * width;

  const exhaust = createStandardElement({
    type,
    dimensions: { width, height },
    terminalDefinitions: [{ x: width / 2, y: 0, medium: "pneumatic" }],
    draw,
  });

  mixinPort({
    port: exhaust.getTerminals()[0],
    isExhaust: true,
  });

  function draw(ctx) {
    ctx.beginPath();

    ctx.moveTo(width / 2, height);
    ctx.lineTo(width, height - 0.866 * width);
    ctx.lineTo(0, height - 0.866 * width);
    ctx.lineTo(width / 2, height);

    ctx.moveTo(width / 2, height - 0.866 * width);
    ctx.lineTo(width / 2, 0);

    ctx.stroke();
  }

  return exhaust;
}
