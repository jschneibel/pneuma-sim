import createStandardElement from "./utils/standardElement.js";

import mixinElectricCurrent from "./mixins/mixinElectricCurrent.js";
import mixinActive from "./mixins/mixinActive.js";

export default function createMakeContact() {
  const type = "makeContact";
  const width = 70;
  const height = width / 5;

  const makeContact = createStandardElement({
    type,
    dimensions: { width, height },
    terminalDefinitions: [
      { x: 0, y: 0, medium: "electric" },
      { x: width, y: 0, medium: "electric" },
    ],
    draw,
  });

  mixinElectricCurrent({
    element: makeContact,
    resistance: Infinity,
  });

  mixinActive({
    element: makeContact,
    onActivate: () => makeContact.setResistance(0),
    onDeactivate: () => makeContact.setResistance(Infinity),
  });

  function draw(ctx) {
    const { width, height } = makeContact.getDimensions();

    ctx.beginPath();

    ctx.moveTo(0, 0);

    if (makeContact.isActive()) {
      // Make contact.
      ctx.lineTo(width, 0);
    } else {
      // Break contact.
      ctx.lineTo((2 / 10) * width, 0);
      ctx.lineTo((8 / 10) * width, height);
      ctx.moveTo((8 / 10) * width, 0);
      ctx.lineTo(width, 0);
    }

    ctx.stroke();
  }

  return makeContact;
}
