// TODO: Allow simulation with calculated currents,
// derived from actual voltages and resistances:
// - Use mesh method.
// - Find all independent loops/meshs.
// - Create set of equations represented by matrices, e.g.
// https://www.analyzemath.com/applied_mathematics/electric_circuit_1.html.
// - Branches without loops have no current.
// - For positive/negative contacts (like in festo),
// a path from positive to negative contact can be
// considered a loop, including the voltage (difference
// of potential between the contacts). Find all 'loops'
// with potential differences.

export function startSimulation(diagram, ctx) {
  console.log("start simulation");

  diagram.unselectAll();

  const elements = diagram.getElements();

  // Find paths from positive to negative terminals.
  const positiveTerminals = elements.filter(
    (element) => element.getType?.() === "positiveTerminal"
  );

  const negativeTerminals = elements.filter(
    (element) => element.getType?.() === "negativeTerminal"
  );

  if (positiveTerminals.length === 0 || negativeTerminals === 0) {
    // Cannot simulate because positive or negative terminals are missing.
    ctx.draw(diagram);
    return;
  }

  // Example:
  //       J
  // (+A)--+--B-----(-C)
  //       |--D-----(-E)
  // => [A, AJ, J, [[JB, B, BC, C],[JD, D, DE, E]]]
  const positiveToNegativePaths = [];

  for (let i = 0; i < positiveTerminals.length; i++) {
    const startElement = positiveTerminals[i];
    const remainingElements = elements.filter(
      (element) => element.getId() !== startElement.getId()
    );

    let paths = findPathsAlongRemainingElements(
      startElement,
      remainingElements,
      0
    );

    if (paths.length === 0) {
      // Do nothing.
    } else if (paths.length === 1) {
      positiveToNegativePaths.push(...paths);
    } else {
      positiveToNegativePaths.push(paths);
    }
  }

  console.log(positiveToNegativePaths);

  ctx.draw(diagram);
}

export function pauseSimulation(diagram, ctx) {
  console.log("pause simulation");
}

export function stopSimulation(diagram, ctx) {
  console.log("stop simulation");
}

function getConnectedElements(element) {
  const connectedElements = [];

  if (typeof element.getTerminalsByMedium === "function") {
    let terminals = element.getTerminalsByMedium("electric");
    for (let i = 0; i < terminals.length; i++) {
      if (terminals[i].getConnections().length > 0) {
        connectedElements.push(...terminals[i].getConnections());
      }
    }
  }

  if (typeof element.getStart === "function") {
    connectedElements.push(element.getStart().getParentElement());
  }

  if (typeof element.getEnd === "function") {
    connectedElements.push(element.getEnd().getParentElement());
  }

  return connectedElements;
}

// Returns an array of arrays for each
function findPathsAlongRemainingElements(
  startElement,
  remainingElements,
  cumulativeResistance
) {
  cumulativeResistance += startElement.getResistance?.() || 0;

  const nextElements = getConnectedElements(startElement).filter(
    (element) => remainingElements.indexOf(element) > -1
  );

  if (nextElements.length === 0) {
    // End recursion if end of path is reached.
    // TODO: Check if end is a negative terminal?
    const path = [
      {
        id: startElement.getId(),
        element: startElement,
        cumulativeResistance,
      },
    ];
    return path;
  } else if (nextElements.length === 1) {
    const nextStartElement = nextElements[0];
    const nextRemainingElements = remainingElements.filter(
      (element) => element.getId() !== nextStartElement.getId()
    );

    const path = [
      {
        id: startElement.getId(),
        element: startElement,
        cumulativeResistance,
      },
      ...findPathsAlongRemainingElements(
        nextStartElement,
        nextRemainingElements,
        cumulativeResistance
      ),
    ];
    return path;
  } else {
    const paths = [];
    for (let i = 0; i < nextElements.length; i++) {
      const nextStartElement = nextElements[i];
      const nextRemainingElements = remainingElements.filter(
        (element) => element.getId() !== nextStartElement.getId()
      );

      const path = findPathsAlongRemainingElements(
        nextStartElement,
        nextRemainingElements,
        cumulativeResistance
      );
      paths.push(path);
    }
    return [startElement.getId(), paths];
  }
}