import { createStandardElement } from "./utils/standardElement.js";

import { mixinSimulation } from "./mixins/mixinSimulation.js";
import { mixinPort } from "./mixins/mixinPort.js";
import { mixinProperty } from "./mixins/mixinProperty.js";

export default function createCylinder({ diagram }) {
  const type = "cylinder";
  const width = 80;
  const height = 120 / 4;

  // TODO: Calculate the piston's speed based on
  // physical parameters (pressure, friction, ...).
  let distance = 0; // Goes from 0 to 1.
  const pistonSpeed = 0.5; // [distance/s]

  const cylinder = createStandardElement({
    diagram,
    type,
    dimensions: { width, height },
    terminalDefinitions: [{ x: width / 12, y: 0, medium: "pneumatic" }],
    draw,
  });

  mixinPort({
    port: cylinder.getTerminals()[0],
  });

  mixinSimulation({
    element: cylinder,
    checkIfPowered: () => cylinder.getTerminals()[0].getPressure() > 0,
    poweredAction: function (timestep) {
      const oldDistance = distance;
      distance += pistonSpeed * (timestep / 1000);
      distance = Math.min(distance, 1);

      if (distance === 1 && oldDistance < 1) {
        perfomActionByType(extensionTarget);
      }
    },
    unpoweredAction: function (timestep) {
      const oldDistance = distance;
      distance -= pistonSpeed * (timestep / 1000);
      distance = Math.max(distance, 0);

      if (distance === 0 && oldDistance > 0) {
        perfomActionByType(retractionTarget);
      }
    },
    reset: () => (distance = 0),
  });

  let extensionTarget = undefined;
  cylinder.getExtensionTarget = () => extensionTarget;
  cylinder.setExtensionTarget = function (value) {
    if (isValidTargetType(value?.getType?.())) {
      extensionTarget = value;
    } else {
      extensionTarget = undefined;
    }
  };

  let extensionTargetById = true; // false if a name was entered.
  mixinProperty({
    element: cylinder,
    label: "Target ID or name (full extension)",
    getProperty: "getExtensionTarget",
    setProperty: "setExtensionTarget",
    formatProperty: function (target) {
      if (target) {
        if (extensionTargetById) {
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
        extensionTargetById = true;
        return elementById;
      }

      const elementByName = diagram.getElementByName(input.trim());
      if (elementByName) {
        extensionTargetById = false;
        return elementByName;
      }
    },
  });

  let retractionTarget = undefined;
  cylinder.getRetractionTarget = () => retractionTarget;
  cylinder.setRetractionTarget = function (value) {
    if (isValidTargetType(value?.getType?.())) {
      retractionTarget = value;
    } else {
      retractionTarget = undefined;
    }
  };

  let retractionTargetById = true; // false if a name was entered.
  mixinProperty({
    element: cylinder,
    label: "Target ID or name (full retraction)",
    getProperty: "getRetractionTarget",
    setProperty: "setRetractionTarget",
    formatProperty: function (target) {
      if (target) {
        if (retractionTargetById) {
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
        retractionTargetById = true;
        return elementById;
      }

      const elementByName = diagram.getElementByName(input.trim());
      if (elementByName) {
        retractionTargetById = false;
        return elementByName;
      }
    },
  });

  function draw(ctx) {
    const { width, height } = cylinder.getDimensions();

    const rodWidth = height / 6;
    const hoops = 3;
    const minGap = width / 6;
    const maxGap = width - rodWidth - 2 * rodWidth;
    const gap = minGap + distance * (maxGap - minGap);

    ctx.beginPath();

    // outer box
    ctx.moveTo(0, 0);
    ctx.lineTo(width, 0);
    ctx.lineTo(width, (height - rodWidth) / 2);
    ctx.moveTo(width, (height - rodWidth) / 2 + rodWidth);
    ctx.lineTo(width, height);
    ctx.lineTo(0, height);
    ctx.lineTo(0, 0);

    // piston plate
    ctx.moveTo(gap, 0);
    ctx.lineTo(gap, height);
    ctx.moveTo(gap + rodWidth, 0);
    ctx.lineTo(gap + rodWidth, height);

    // piston rod
    ctx.moveTo(gap + rodWidth, (height - rodWidth) / 2);
    ctx.lineTo(width + gap, (height - rodWidth) / 2);
    ctx.lineTo(width + gap, (height - rodWidth) / 2 + rodWidth);
    ctx.lineTo(gap + rodWidth, (height - rodWidth) / 2 + rodWidth);

    // spring
    let startX = gap + rodWidth;
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

function perfomActionByType(target) {
  const type = target?.getType?.();
  switch (type) {
    case "breakContact":
    case "makeContact":
    case "pushButtonBreak":
    case "pushButtonMake":
    case "solenoidValve32":
      target.activate();
      break;
    case "pushButtonToggle":
      target.toggleActive();
    default:
    // Do nothing (invalid target).
  }
}

function isValidTargetType(type) {
  switch (type) {
    case "breakContact":
    case "makeContact":
    case "pushButtonBreak":
    case "pushButtonMake":
    case "pushButtonToggle":
    case "solenoidValve32":
      return true;
    default:
      return false;
  }
}
