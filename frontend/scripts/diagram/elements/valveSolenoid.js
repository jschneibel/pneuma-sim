/**
 * @file The valve solenoid element.
 * @author Jonathan Schneibel
 * @module
 */

import { createStandardElement } from "./utils/standardElement.js";

import { mixinElectricCurrent } from "./mixins/mixinElectricCurrent.js";
import { mixinProperty } from "./mixins/mixinProperty.js";
import { mixinSimulation } from "./mixins/mixinSimulation.js";

export default function createValveSolenoid({ diagram }) {
  const type = "valveSolenoid";
  const width = 65;
  const height = 40;

  const valveSolenoid = createStandardElement({
    diagram,
    type,
    dimensions: { width, height },
    terminalDefinitions: [
      { x: 20, y: 0, medium: "electric" },
      { x: 20, y: height, medium: "electric" },
    ],
    draw,
  });

  mixinElectricCurrent({
    element: valveSolenoid,
    resistance: 1,
  });

  mixinSimulation({
    element: valveSolenoid,
    poweredAction: () => target?.activate?.(),
    switchPowerOnAction: () => target?.activate?.(),
    switchPowerOffAction: () => target?.deactivate?.(),
  });

  let target = undefined;
  valveSolenoid.getTarget = () => target;
  valveSolenoid.setTarget = function (newTarget) {
    const type = newTarget?.getType?.();
    switch (type) {
      case "solenoidValve32":
        target = newTarget;
        break;
      default:
        target = undefined;
    }
  };

  let targetById = true; // false if a name was entered.
  mixinProperty({
    element: valveSolenoid,
    label: "Target ID or name",
    getProperty: "getTarget",
    setProperty: "setTarget",
    formatProperty: function (target) {
      if (target) {
        if (targetById) {
          return target.getId();
        } else {
          return target.getName();
        }
      } else {
        return "";
      }
    },
    parseInput: function (input) {
      const elementById = diagram.getElementById(parseInt(input));
      if (elementById) {
        targetById = true;
        return elementById;
      }

      const elementByName = diagram.getElementByName(input.trim());
      if (elementByName) {
        targetById = false;
        return elementByName;
      }
    },
  });

  function draw(ctx) {
    const { width, height } = valveSolenoid.getDimensions();
    const boxWidth = 40;
    const boxHeight = (2 / 5) * boxWidth;
    const boxOffset = (height - boxHeight) / 2;
    const valveWidth = 10;
    const valveHeight = 10;
    const gap = width - boxWidth - valveWidth / 2;

    ctx.beginPath();

    // box
    ctx.moveTo(0, boxOffset);
    ctx.lineTo(boxWidth, boxOffset);
    ctx.lineTo(boxWidth, boxOffset + boxHeight);
    ctx.lineTo(0, boxOffset + boxHeight);
    ctx.lineTo(0, boxOffset);
    ctx.moveTo((1 / 5) * boxWidth, boxOffset);
    ctx.lineTo((4 / 5) * boxWidth, boxOffset + boxHeight);

    // terminal lines
    ctx.moveTo(boxWidth / 2, 0);
    ctx.lineTo(boxWidth / 2, boxOffset);
    ctx.moveTo(boxWidth / 2, boxOffset + boxHeight);
    ctx.lineTo(boxWidth / 2, height);

    // connection to valve
    ctx.moveTo(boxWidth, height / 2);
    ctx.lineTo(boxWidth + (1 / 6) * gap, height / 2);
    ctx.moveTo(boxWidth + (2 / 6) * gap, height / 2);
    ctx.lineTo(boxWidth + (3 / 6) * gap, height / 2);
    ctx.moveTo(boxWidth + (4 / 6) * gap, height / 2);
    ctx.lineTo(boxWidth + (5 / 6) * gap, height / 2);
    ctx.moveTo(boxWidth + (6 / 6) * gap, height / 2);

    // valve top
    ctx.translate(boxWidth + gap, height / 2);
    ctx.moveTo(0, 0);
    ctx.lineTo(valveWidth / 2, valveHeight);
    ctx.lineTo(-valveWidth / 2, valveHeight);
    ctx.lineTo(0, 0);
    ctx.moveTo(0, valveHeight);
    ctx.lineTo(0, height / 2);

    // valve bottom
    ctx.moveTo(0, 0);
    ctx.lineTo(valveWidth / 2, -valveHeight);
    ctx.lineTo(-valveWidth / 2, -valveHeight);
    ctx.lineTo(0, 0);
    ctx.moveTo(0, -valveHeight);
    ctx.lineTo(0, -height / 2);

    ctx.stroke();
  }

  return valveSolenoid;
}
