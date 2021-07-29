import createStandardElement from "./utils/standardElement.js";

export default function createCell() {
  const type = "cell";
  const width = 60;
  const height = (width * 2) / 3;

  const cell = createStandardElement({
    type,
    dimensions: { width, height },
    terminalDefinitions: [
      { x: 0, y: height / 2, medium: "electric" },
      { x: width, y: height / 2, medium: "electric" },
    ],
    draw,
  });

  // in element-local coordinates
  function draw(ctx) {
    const { width, height } = cell.getDimensions();
    const gap = 1 / 7;
    const heightRatio = 3 / 7;

    ctx.beginPath();

    // left part (big)
    ctx.moveTo(0, height / 2);
    ctx.lineTo(((1 - gap) / 2) * width, height / 2);
    ctx.moveTo(((1 - gap) / 2) * width, height);
    ctx.lineTo(((1 - gap) / 2) * width, 0);

    // right part (small)
    ctx.moveTo(((1 + gap) / 2) * width, ((1 + heightRatio) / 2) * height);
    ctx.lineTo(((1 + gap) / 2) * width, ((1 - heightRatio) / 2) * height);
    ctx.moveTo(((1 + gap) / 2) * width, height / 2);
    ctx.lineTo(width, height / 2);

    // plus sign
    const plus = 7;
    ctx.save();
    ctx.translate((1 / 4) * width, (7 / 8) * height);
    ctx.moveTo(-plus / 2, 0);
    ctx.lineTo(plus / 2, 0);
    ctx.moveTo(0, plus / 2);
    ctx.lineTo(0, -plus / 2);
    ctx.restore();

    ctx.stroke();
  }

  return cell;
}
