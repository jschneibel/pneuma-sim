export function startSimulation(diagram, ctx) {
  console.log("start simulation");
}

export function pauseSimulation(diagram, ctx) {
  console.log("pause simulation");
}

export function stopSimulation(diagram, ctx) {
  console.log("stop simulation");
}

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
