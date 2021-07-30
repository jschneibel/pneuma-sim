import createStandardElement from "./utils/standardElement.js";

export default function createMakeContact() {
  const type = "makeContact";
  const width = 70;
  const height = width / 5;

  const electricSwitch = createStandardElement({
    type,
    dimensions: { width, height },
    terminalDefinitions: [
      { x: 0, y: 0, medium: "electric" },
      { x: width, y: 0, medium: "electric" },
    ],
    draw,
  });

  // in element-local coordinates
  function draw(ctx) {
    const { width, height } = electricSwitch.getDimensions();

    ctx.beginPath();

    ctx.moveTo(0, 0);
    ctx.lineTo((2 / 10) * width, 0);
    ctx.lineTo((8 / 10) * width, height);
    ctx.moveTo((8 / 10) * width, 0);
    ctx.lineTo(width, 0);
    ctx.stroke();
  }

  return electricSwitch;
}
