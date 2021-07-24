import createBasicElement from "./utils/basicElement.js";

import mixinDrawing from "./mixins/mixinDrawing.js";
import mixinPosition from "./mixins/mixinPosition.js";
import mixinSelection from "./mixins/mixinSelection.js";
import mixinDimensions from "./mixins/mixinDimensions.js";
import mixinContacts from "./mixins/mixinContacts.js";
import mixinBoundingArea from "./mixins/mixinBoundingArea.js";

export default function createCylinder() {
  const cylinder = createBasicElement("cylinder");

  mixinPosition({
    element: cylinder,
    position: { x: 20, y: 20 },
  });

  mixinDimensions({
    element: cylinder,
    dimensions: { width: 120, height: 120 / 4 },
  });

  mixinBoundingArea({
    element: cylinder,
    getOrigin: cylinder.getPosition,
    getElementDimensions: cylinder.getDimensions,
  });

  mixinDrawing({
    element: cylinder,
    getOrigin: cylinder.getPosition,
    draw,
  });

  const { width, height } = cylinder.getDimensions();

  // in element-local coordinates
  mixinContacts({
    element: cylinder,
    getElementPosition: cylinder.getPosition,
    contactDefinitions: [
      { x: 10, y: 0, medium: "pneumatic" },
      { x: 10, y: height, medium: "pneumatic" },
      { x: (8 / 10) * width, y: 0, medium: "electric" },
    ],
  });

  mixinSelection({
    element: cylinder,
    getOrigin: cylinder.getPosition,
    getSelectionShape: cylinder.getBoundingArea,
    selected: true,
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
