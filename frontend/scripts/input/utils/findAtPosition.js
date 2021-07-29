// Type is optional.
export function findElementsAtPosition(diagram, position, type) {
  const elementsAtPosition = [];

  diagram.getElements().forEach(function (element) {
    if (type && element.getType?.() !== type) {
      return;
    }

    if (element.isPositionWithinBoundingArea?.(position)) {
      elementsAtPosition.push(element);
    }
  });

  return elementsAtPosition;
}

export function findTerminalAtPosition(diagram, position, medium) {
  let terminalAtPosition;

  diagram.getElements().some(function (element) {
    let terminals = [];

    if (medium && typeof element.getTerminalsByMedium === "function") {
      terminals = element.getTerminalsByMedium(medium);
    } else if (typeof element.getTerminals === "function") {
      terminals = element.getTerminals();
    }

    return terminals.some(function (terminal) {
      if (terminal.isPositionWithinTerminal(position)) {
        terminalAtPosition = terminal;
        return true;
      }

      return false;
    });
  });

  return terminalAtPosition;
}

// export function findWireAtPosition(diagram, position) {}
