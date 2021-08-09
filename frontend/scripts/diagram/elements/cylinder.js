import createStandardElement from "./utils/standardElement.js";

import mixinSimulation from "./mixins/mixinSimulation.js";
import mixinPort from "./mixins/mixinPort.js";

export default function createCylinder() {
  const type = "cylinder";
  const width = 80;
  const height = 120 / 4;
  let distance = 0; // Goes from 0 to 1.

  const cylinder = createStandardElement({
    type,
    dimensions: { width, height },
    terminalDefinitions: [{ x: width / 12, y: 0, medium: "pneumatic" }],
    draw,
  });

  mixinPort({
    port: cylinder.getTerminals()[0],
  });

  mixinSimulation({
    element: cylinder,
    poweredAction: function (timestep) {
      distance += 0.01;
      distance = Math.min(distance, 1);
    },
    unpoweredAction: function (timestep) {
      distance -= 0.01;
      distance = Math.max(distance, 0);
    },
  });

  function draw(ctx) {
    const { width, height } = cylinder.getDimensions();

    const rodWidth = height / 6;
    const hoops = 3;
    const minGap = width / 6;
    const maxGap = width - rodWidth - 2 * rodWidth;
    const gap = minGap + distance * (maxGap - minGap);

    ctx.beginPath();

    // outer box
    ctx.moveTo(0, 0);
    ctx.lineTo(width, 0);
    ctx.lineTo(width, (height - rodWidth) / 2);
    ctx.moveTo(width, (height - rodWidth) / 2 + rodWidth);
    ctx.lineTo(width, height);
    ctx.lineTo(0, height);
    ctx.lineTo(0, 0);

    // rod and plate
    ctx.moveTo(gap, 0);
    ctx.lineTo(gap, height);
    ctx.moveTo(gap + rodWidth, 0);
    ctx.lineTo(gap + rodWidth, height);
    ctx.moveTo(gap + rodWidth, (height - rodWidth) / 2);
    ctx.lineTo(width + gap, (height - rodWidth) / 2);
    ctx.moveTo(gap + rodWidth, (height - rodWidth) / 2 + rodWidth);
    ctx.lineTo(width + gap, (height - rodWidth) / 2 + rodWidth);

    // spring
    let startX = gap + rodWidth;
    let hoopWidth = (width - startX) / hoops;
    for (let i = 0; i < hoops; i++) {
      ctx.moveTo(startX, height);
      ctx.lineTo(startX + hoopWidth / 2, 0);
      ctx.lineTo(
        startX + hoopWidth * (1 / 2 + (height - rodWidth) / 2 / height / 2),
        (height - rodWidth) / 2
      );
      ctx.moveTo(
        startX +
          hoopWidth *
            (1 / 2 + ((height - rodWidth) / 2 + rodWidth) / height / 2),
        (height - rodWidth) / 2 + rodWidth
      );
      ctx.lineTo(startX + hoopWidth, height);
      startX += hoopWidth;
    }

    ctx.stroke();
  }

  return cylinder;
}
