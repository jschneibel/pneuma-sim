/**
 * @file The compressed air supply element.
 * @author Jonathan Schneibel
 * @module
 */

import { createStandardElement } from "./utils/standardElement.js";

import { mixinPort } from "./mixins/mixinPort.js";
import { mixinProperty } from "./mixins/mixinProperty.js";

export default function createCompressedAirSupply({ diagram }) {
  const type = "compressedAirSupply";
  const width = 19;
  const height = (5 / 4) * width;

  const compressedAirSupply = createStandardElement({
    diagram,
    type,
    dimensions: { width, height },
    terminalDefinitions: [{ x: width / 2, y: 0, medium: "pneumatic" }],
    draw,
  });

  let suppliedPressure = 10;
  compressedAirSupply.getSuppliedPressure = () => suppliedPressure;
  compressedAirSupply.setSuppliedPressure = function (value) {
    value = parseInt(value);

    if (isNaN(value) || value < 0) {
      // Do nothing.
    } else {
      suppliedPressure = value;
    }
  };

  mixinProperty({
    element: compressedAirSupply,
    label: "Supplied pressure [MPa]",
    getProperty: "getSuppliedPressure",
    setProperty: "setSuppliedPressure",
    parseInput: (input) => parseInt(input),
  });

  mixinPort({
    port: compressedAirSupply.getTerminals()[0],
  });

  function draw(ctx) {
    ctx.beginPath();

    ctx.moveTo(0, height);
    ctx.lineTo(width, height);
    ctx.lineTo(width / 2, height - 0.866 * width);
    ctx.lineTo(0, height);

    ctx.moveTo(width / 2, height - 0.866 * width);
    ctx.lineTo(width / 2, 0);

    ctx.stroke();
  }

  return compressedAirSupply;
}
