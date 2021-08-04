import createStandardElement from "./utils/standardElement.js";

import mixinElectricCurrent from "./mixins/mixinElectricCurrent.js";
import mixinProperty from "./mixins/mixinProperty.js";

export default function createRelay() {
  const type = "relay";
  const width = 40;
  const height = width;

  const relay = createStandardElement({
    type,
    dimensions: { width, height },
    terminalDefinitions: [
      { x: width / 2, y: 0, medium: "electric" },
      { x: width / 2, y: height, medium: "electric" },
    ],
    draw,
  });

  mixinElectricCurrent({
    element: relay,
    resistance: 1,
  });

  let targetId = undefined;

  relay.getTargetId = () => targetId;
  relay.setTargetId = (value) => (targetId = value);

  mixinProperty({
    element: relay,
    label: "Target ID",
    getProperty: "getTargetId",
    setProperty: "setTargetId",
    formatProperty: (targetId) => (isNaN(targetId) ? "" : targetId),
    parseInput: (input) => parseInt(input),
  });

  // in element-local coordinates
  function draw(ctx) {
    const { width, height } = relay.getDimensions();
    const boxHeight = (2 / 5) * width;
    const boxOffset = (height - boxHeight) / 2;

    ctx.beginPath();

    // box
    ctx.moveTo(0, boxOffset);
    ctx.lineTo(width, boxOffset);
    ctx.lineTo(width, boxOffset + boxHeight);
    ctx.lineTo(0, boxOffset + boxHeight);
    ctx.lineTo(0, boxOffset);

    // terminal lines
    ctx.moveTo(width / 2, 0);
    ctx.lineTo(width / 2, boxOffset);
    ctx.moveTo(width / 2, boxOffset + boxHeight);
    ctx.lineTo(width / 2, height);

    ctx.stroke();
  }

  return relay;
}
