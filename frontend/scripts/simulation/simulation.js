// TODO: Allow simulation with calculated currents,
// derived from set of linear equations.
// Use Modified Nodal Analysis (MNA) as shown here:
// https://lpsa.swarthmore.edu/Systems/Electrical/mna/MNA3.html
// Reference:
// DeCarlo, RA, Lin PM, Linear Circuit Analysis: Time Domain, Phasor and Laplace Transform Approaches, Oxford University Press, 2001.  Node Voltage, Loop Current, and Modified Nodal Analysis.

// NOTE: The electrical simulation currently works by looking for any
// paths from positive to negative terminals. If paths or sub-paths
// with zero resistance are found, they are preferred over parallel
// paths with resistance higher than zero. The paths that have been
// found are then set to have a current (without any calculated
// magnitude). This works for most simple circuits and is sufficient
// for the goal of ultimately controlling/simulating pneumatic circuits.
// However, even ignoring the fact that no current magnitudes are given
// with this approach, it still delivers wrong results in certain cases:
// If the terminals induce currents that flow across elements in
// opposite directions, it is not known which of the opposing currents
// is larger (or whether they are equal). Therefore, it is not clear
// in which direction the total current of such elements is flowing,
// if any. With the implemented approach, such elements are always
// set to have a current because they are part of a path as described
// above. The same logic applies to other elements connected in series.
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
      remainingElements
    );

    if (paths.hasZeroResistance) {
      console.warn(
        "Short circuit! No resistance between positive and negative terminal."
      );
    }

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

// Returns an array of arrays representing paths from
// the startElement, tracing only the remainingElements
// and adding up resistances along the path.
// Paths always end at negativeTerminals.
// Paths can only include elements with resistance < Infinity.
// If a path can go along a series of elements with zero resistance,
// then it will ignore all parallel series with resistance > 0.
function findPathsAlongRemainingElements(startElement, remainingElements) {
  if (startElement.getType?.() === "negativeTerminal") {
    // If at a negativeTerminal, then successfully end recursion.
    const path = [
      {
        id: startElement.getId(),
        element: startElement,
      },
    ];

    if (startElement.getResistance() === 0) {
      path.hasZeroResistance = true;
    }

    return path;
  }

  if (startElement.getResistance?.() === Infinity) {
    return [];
  }

  const nextElements = getConnectedElements(startElement).filter(
    (element) => remainingElements.indexOf(element) > -1
  );

  let paths = [];
  const pathsOfZeroResistance = [];

  for (let i = 0; i < nextElements.length; i++) {
    const nextElement = nextElements[i];
    const nextRemainingElements = remainingElements.filter(
      (element) => element.getId() !== nextElement.getId()
    );

    const pathsFromNextElement = findPathsAlongRemainingElements(
      nextElement,
      nextRemainingElements
    );

    if (pathsFromNextElement.hasZeroResistance) {
      pathsOfZeroResistance.push(pathsFromNextElement);
    }

    if (pathsFromNextElement.length > 0) {
      // Only store paths that lead to a negativeTerminal.
      paths.push(pathsFromNextElement);
    }
  }

  if (pathsOfZeroResistance.length > 0) {
    // If there is a path with zero resistance,
    // then ignore all paths with resistance > 0.
    paths = pathsOfZeroResistance;
  }

  if (paths.length > 1) {
    paths = [
      {
        id: startElement.getId(),
        element: startElement,
      },
      paths,
    ];
  } else if (paths.length === 1) {
    paths = [
      {
        id: startElement.getId(),
        element: startElement,
      },
      ...paths[0],
    ];
  } else {
    // If there is no path to a negativeTerminal along remaining elements,
    // then return an empty path.
    return [];
  }

  if (
    pathsOfZeroResistance.length > 0 &&
    startElement.getResistance?.() === 0
  ) {
    paths.hasZeroResistance = true;
  }

  return paths;
}
