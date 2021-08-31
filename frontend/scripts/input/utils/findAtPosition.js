/**
 * @file Utility functions to check if certain elements are at a given position.
 * @author Jonathan Schneibel
 * @module
 */

/**
 * Finds all elements whose bounding area is at the given position.
 * If type is omitted, all types of elements are considered.
 *
 * @param {object} diagram The diagram whose elements to check.
 * @param {{x: number, y: number}} position The position to check.
 * @param {string} [type] The element type to consider.
 * @returns {Array.<object>} Array of elements that have been found at the given position.
 */
export function findElementsAtPosition(diagram, position, type) {
  const elementsAtPosition = [];

  for (const element of diagram.getElements()) {
    if (type && element.getType?.() !== type) {
      continue;
    }

    if (element.isPositionWithinBoundingArea?.(position)) {
      elementsAtPosition.push(element);
    }
  }

  return elementsAtPosition;
}

/**
 * Finds all terminals of a given medium that are at a given position.
 * If the medium is omitted, all terminals are considered.
 *
 * @param {object} diagram The diagram whose elements to check.
 * @param {{x: number, y: number}} position The position to check.
 * @param {string} [medium] The medium to consider ('electric' or 'pneumatic').
 * @returns {Array.<object>} Array of terminals that have been found at the given position.
 */
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
