/**
 * @file Mixin for elements to have electric or pneumatic terminals.
 * @author Jonathan Schneibel
 * @module
 */

import {
  CONTACT_SIZE,
  CONTACT_LINE_WIDTH,
  ELECTRIC_CONTACT_COLOR,
  PNEUMATIC_CONTACT_COLOR,
} from "../../../constants.js";

import { createBasicElement } from "../utils/basicElement.js";

import { mixinPosition } from "./mixinPosition.js";
import { mixinDimensions } from "./mixinDimensions.js";
import { mixinDrawing } from "./mixinDrawing.js";
import { mixinHighlighting } from "./mixinHighlighting.js";
import { mixinActive } from "./mixinActive.js";
import { mixinRemoval } from "./mixinRemoval.js";
import { mixinMedium } from "./mixinMedium.js";

export function mixinTerminals({
  element,
  getElementPosition = () => ({ x: 0, y: 0 }),
  terminalDefinitions = [],
}) {
  const terminals = terminalDefinitions.map((terminalDefinition) =>
    createTerminal({
      parentElement: element,
      getParentPosition: getElementPosition,
      relativePosition: { x: terminalDefinition.x, y: terminalDefinition.y },
      medium: terminalDefinition.medium,
    })
  );

  // Returns a shallow copy.
  element.getTerminals = () => [...terminals];

  element.getTerminalById = function (id) {
    for (let i = 0; i < terminals.length; i++) {
      if (terminals[i].getId() === id) {
        return terminals[i];
      }
    }

    return null;
  };

  element.getTerminalsByMedium = function (medium) {
    return terminals.filter((terminal) => terminal.getMedium() === medium);
  };
}

function createTerminal({
  parentElement,
  getParentPosition = () => ({ x: 0, y: 0 }),
  relativePosition = { x: 0, y: 0 },
  medium,
}) {
  const terminal = createBasicElement("terminal");

  const connections = [];

  let color;
  switch (medium) {
    case "electric":
      color = ELECTRIC_CONTACT_COLOR;
      break;
    case "pneumatic":
      color = PNEUMATIC_CONTACT_COLOR;
      break;
    default:
      color = "#555";
  }

  mixinMedium({
    element: terminal,
    medium,
  });

  const parentPosition = getParentPosition();

  mixinPosition({
    element: terminal,
    position: {
      x: parentPosition.x + relativePosition.x,
      y: parentPosition.y + relativePosition.y,
    },
  });

  // Bind terminal position to parent position.
  const originalParentElementSetPosition = parentElement.setPosition;
  parentElement.setPosition = function (parentPosition) {
    originalParentElementSetPosition(parentPosition);
    terminal.setPosition({
      x: parentPosition.x + relativePosition.x,
      y: parentPosition.y + relativePosition.y,
    });
  };

  mixinDimensions({
    element: terminal,
    dimensions: { width: CONTACT_SIZE, height: CONTACT_SIZE },
  });

  mixinDrawing({
    element: parentElement,
    getOrigin: getParentPosition,
    draw,
  });

  mixinHighlighting({
    element: terminal,
    highlighted: false,
  });

  mixinActive({
    element: terminal,
    active: false,
  });

  mixinRemoval({
    element: parentElement,
    remove: removeParent,
  });

  mixinRemoval({
    element: terminal,
    remove,
  });

  terminal.getParentElement = () => parentElement;

  // position in global coordinates
  terminal.isPositionWithinTerminal = function (position = { x, y }) {
    const terminalPosition = terminal.getPosition();
    const radius = (CONTACT_SIZE + CONTACT_LINE_WIDTH) / 2;

    return (
      position.x >= terminalPosition.x - radius &&
      position.x <= terminalPosition.x + radius &&
      position.y >= terminalPosition.y - radius &&
      position.y <= terminalPosition.y + radius
    );
  };

  // Returns a shallow copy of the connections.
  terminal.getConnections = () => [...connections];

  terminal.addConnection = function (connection) {
    if (connections.indexOf(connection) === -1) {
      connections.push(connection);
      terminal.activate();
    }

    return [...connections]; // Returns a shallow copy of connections.
  };

  terminal.removeConnection = function (diagram, connection) {
    const index = connections.indexOf(connection);
    if (index >= 0) {
      connections.splice(index, 1);
      connection.remove?.(diagram); // A connection cannot exist with an open end.

      if (connections.length === 0) {
        terminal.deactivate();
      }
    }

    return [...connections]; // Returns a shallow copy of remaining connections.
  };

  // Removing the parent element causes the terminal to be removed.
  function removeParent(diagram) {
    terminal.remove(diagram);
  }

  function remove(diagram) {
    const shallowConnectionsCopy = [...connections];
    connections.length = 0; // Empty the array.

    for (const connection of shallowConnectionsCopy) {
      // terminal.removeConnection(diagram, connection);
      connection.remove?.(diagram);
    }
  }

  function draw(ctx) {
    const circleRadius = CONTACT_SIZE / 2;

    ctx.save();
    ctx.lineWidth = CONTACT_LINE_WIDTH;
    ctx.strokeStyle = color;
    ctx.fillStyle = color;
    ctx.translate(relativePosition.x, relativePosition.y);

    ctx.beginPath();
    ctx.moveTo(circleRadius, 0);
    ctx.arc(0, 0, circleRadius, 0, 2 * Math.PI);

    if (terminal.isHighlighted() || terminal.isActive()) {
      ctx.fill();
    }

    ctx.stroke();

    ctx.restore();
  }

  return terminal;
}
