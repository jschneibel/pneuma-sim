import createStandardElement from "./utils/standardElement.js";

import mixinSimulation from "./mixins/mixinSimulation.js";
import mixinActive from "./mixins/mixinActive.js";
import mixinPort from "./mixins/mixinPort.js";

export default function createSolenoidValve32({ diagram }) {
  const type = "solenoidValve32";
  const height = 60;
  const width = (4 / 7) * height * (4 / 5 + 2 + (5 / 6) * (4 / 5));
  const terminalX = (4 / 7) * height * (4 / 5 + 1 + 1 / 4);

  const solenoidValve32 = createStandardElement({
    type,
    dimensions: { width, height },
    terminalDefinitions: [
      { x: terminalX, y: 0, medium: "pneumatic" },
      { x: terminalX, y: height, medium: "pneumatic" },
    ],
    draw,
  });

  const port0 = solenoidValve32.getTerminals()[0];
  const port1 = solenoidValve32.getTerminals()[1];

  mixinActive({
    element: solenoidValve32,
    onActivate: function () {
      port1.setExhaust(false);
      port1.connectToPort(port0);
    },
    onDeactivate: function () {
      port1.setExhaust(true);
      port1.disconnectFromPort(port0);
    },
  });

  mixinSimulation({
    element: solenoidValve32,
    mouseDownAction: () => solenoidValve32.activate(),
    mouseUpAction: () => solenoidValve32.deactivate(),
  });

  mixinPort({
    port: port0,
  });

  mixinPort({
    port: port1,
    isExhaust: true,
  });

  function draw(ctx) {
    const { width, height } = solenoidValve32.getDimensions(); // 65, 56
    // const x = (4/7)*height((4/5) + 2 + (5/6)*(4/5)); // 25 + 32*2 + 5/6*25 ~= 110
    // const y = 2 * valveOffset + valveHeight; // 56
    const valveHeight = (4 / 7) * height;
    const valveWidth = valveHeight;
    const valveOffset = (height - valveHeight) / 2;

    const solenoidWidth = (4 / 5) * valveWidth;
    const solenoidHeight = valveHeight / 2;

    ctx.beginPath();

    // terminal lines
    ctx.save();
    ctx.translate(solenoidWidth + valveWidth + valveWidth / 4, 0);
    ctx.moveTo(0, 0);
    ctx.lineTo(0, valveOffset);
    ctx.moveTo(0, valveOffset + valveHeight);
    ctx.lineTo(0, valveOffset + valveHeight + valveOffset);
    ctx.translate(valveWidth / 2, 0);
    ctx.moveTo(0, valveOffset);
    ctx.lineTo(0, 0);
    ctx.moveTo(-valveWidth / 6, 0);
    ctx.lineTo(valveWidth / 6, 0);
    ctx.lineTo(0, (-0.866 * valveWidth) / 3);
    ctx.lineTo(-valveWidth / 6, 0);
    ctx.restore();

    if (solenoidValve32.isActive()) {
      ctx.translate(valveWidth, 0);
    }

    // solenoid
    ctx.moveTo(0, valveOffset);
    ctx.lineTo(solenoidWidth, valveOffset);
    ctx.lineTo(solenoidWidth, valveOffset + solenoidHeight);
    ctx.lineTo(0, valveOffset + solenoidHeight);
    ctx.lineTo(0, valveOffset);
    ctx.moveTo((1 / 5) * solenoidWidth, valveOffset);
    ctx.lineTo((4 / 5) * solenoidWidth, valveOffset + solenoidHeight);

    // handle
    ctx.save();
    ctx.translate(solenoidWidth, valveOffset + valveHeight);
    ctx.moveTo(0, 0);
    ctx.lineTo(0, -valveHeight / 2);
    ctx.moveTo(0, -valveHeight / 10);
    ctx.lineTo((-2 / 3) * solenoidWidth, -valveHeight / 10);
    ctx.moveTo(0, (-3 * valveHeight) / 10);
    ctx.lineTo((-2 / 3) * solenoidWidth, (-3 * valveHeight) / 10);
    ctx.moveTo((-2 / 3) * solenoidWidth, 0);
    ctx.lineTo((-2 / 3) * solenoidWidth, (-4 * valveHeight) / 10);

    ctx.restore();

    // valve (left half)
    ctx.save();
    ctx.translate(solenoidWidth, valveOffset);
    ctx.moveTo(0, 0);
    ctx.lineTo(valveWidth, 0);
    ctx.lineTo(valveWidth, valveHeight);
    ctx.lineTo(0, valveHeight);

    ctx.translate(valveWidth / 4, 0);
    ctx.moveTo(0, 0);
    ctx.lineTo(0, valveHeight);
    ctx.stroke();
    ctx.beginPath();
    ctx.moveTo(0, valveHeight);
    ctx.lineTo(valveWidth / 12, (3 / 4) * valveHeight);
    ctx.lineTo(-valveWidth / 12, (3 / 4) * valveHeight);
    ctx.fill();
    ctx.translate(valveWidth / 2, 0);
    ctx.moveTo(0, 0);
    ctx.lineTo(0, valveHeight / 4);
    ctx.moveTo(-valveWidth / 8, valveHeight / 4);
    ctx.lineTo(valveWidth / 8, valveHeight / 4);
    ctx.restore();

    // valve (right half)
    ctx.save();
    ctx.translate(solenoidWidth + valveWidth, valveOffset);
    ctx.moveTo(0, 0);
    ctx.lineTo(valveWidth, 0);
    ctx.lineTo(valveWidth, valveHeight);
    ctx.lineTo(0, valveHeight);

    ctx.translate(valveWidth / 4, 0);
    ctx.moveTo(0, 0);
    ctx.lineTo(0, valveHeight / 4);
    ctx.moveTo(-valveWidth / 8, valveHeight / 4);
    ctx.lineTo(valveWidth / 8, valveHeight / 4);

    ctx.translate(valveWidth / 2, 0);
    ctx.moveTo(-valveWidth / 2, valveHeight);
    ctx.lineTo(0, 0);
    ctx.stroke();

    ctx.beginPath();
    ctx.rotate(0.4636);
    ctx.moveTo(0, 0);
    ctx.lineTo(valveWidth / 12, (1 / 4) * valveHeight);
    ctx.lineTo(-valveWidth / 12, (1 / 4) * valveHeight);
    ctx.fill();
    ctx.restore();

    // spring
    ctx.save();
    ctx.translate(solenoidWidth + 2 * valveWidth, valveOffset);
    ctx.moveTo(0, solenoidHeight);
    ctx.lineTo((1 / 6) * solenoidWidth, 0);
    ctx.lineTo((2 / 6) * solenoidWidth, solenoidHeight);
    ctx.lineTo((3 / 6) * solenoidWidth, 0);
    ctx.lineTo((4 / 6) * solenoidWidth, solenoidHeight);
    ctx.lineTo((5 / 6) * solenoidWidth, 0);
    ctx.restore();

    ctx.stroke();
  }

  return solenoidValve32;
}
