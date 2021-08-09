import createStandardElement from "./utils/standardElement.js";

export default function createCompressedAirSupply() {
  const type = "compressedAirSupply";
  const width = 19;
  const height = (5 / 4) * width;

  const compressedAirSupply = createStandardElement({
    type,
    dimensions: { width, height },
    terminalDefinitions: [{ x: width / 2, y: 0, medium: "pneumatic" }],
    draw,
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
