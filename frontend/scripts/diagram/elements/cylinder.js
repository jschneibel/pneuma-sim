import createStandardElement from "./utils/standardElement.js";

export default function createCylinder() {
  const type = "cylinder";
  const width = 120;
  const height = 120 / 4;

  const cylinder = createStandardElement({
    type,
    dimensions: { width, height },
    terminalDefinitions: [
      { x: 10, y: 0, medium: "pneumatic" },
      { x: 10, y: height, medium: "pneumatic" },
      { x: (8 / 10) * width, y: 0, medium: "electric" },
    ],
    draw,
  });

  // in element-local coordinates
  function draw(ctx) {
    const { width, height } = cylinder.getDimensions();

    const rodWidth = height / 6;
    const hoops = 4;
    let distance = width / 6;

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
    ctx.moveTo(distance, 0);
    ctx.lineTo(distance, height);
    ctx.moveTo(distance + rodWidth, 0);
    ctx.lineTo(distance + rodWidth, height);
    ctx.moveTo(distance + rodWidth, (height - rodWidth) / 2);
    ctx.lineTo(width + distance, (height - rodWidth) / 2);
    ctx.moveTo(distance + rodWidth, (height - rodWidth) / 2 + rodWidth);
    ctx.lineTo(width + distance, (height - rodWidth) / 2 + rodWidth);

    // spring
    let startX = distance + rodWidth;
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
