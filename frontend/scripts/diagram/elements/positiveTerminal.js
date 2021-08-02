import createStandardElement from "./utils/standardElement.js";

export default function createPositiveTerminal() {
  const type = "positiveTerminal";
  const width = 25;
  const height = 25;

  const terminal = createStandardElement({
    type,
    dimensions: { width, height },
    terminalDefinitions: [{ x: width / 2, y: 0, medium: "electric" }],
    draw,
  });

  // in element-local coordinates
  function draw(ctx) {
    const gap = (1 / 3) * height;

    ctx.beginPath();

    // plus sign
    const plus = 10;
    ctx.save();
    ctx.translate(plus / 2, (height + gap) / 2);
    ctx.moveTo(-plus / 2, 0);
    ctx.lineTo(plus / 2, 0);
    ctx.moveTo(0, plus / 2);
    ctx.lineTo(0, -plus / 2);
    ctx.restore();

    // V
    ctx.moveTo(width / 2, height);
    ctx.lineTo((3 / 4) * width, gap);
    ctx.lineTo(width, height);

    ctx.stroke();
  }

  return terminal;
}