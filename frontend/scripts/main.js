import { ELEMENTS } from "./constants.js";

import { createDiagram } from "./diagram/diagram.js";
import { initializeCanvas } from "./canvas/canvas.js";

import { createSimulation } from "./simulation/simulation.js";
import {
  addCommonEventHandlers,
  addEditingEventHandlers,
} from "./input/index.js";

const diagram = await createDiagram();
const { canvas, ctx } = initializeCanvas("canvas", diagram);

// Adding handlers returns a function to remove handlers again.
let removeCommonEventHandlers = addCommonEventHandlers(canvas, ctx, diagram);
let removeEditingEventHandlers = addEditingEventHandlers(canvas, ctx, diagram);

const elementBoxDiv = document.getElementById("element-box");
for (const element of ELEMENTS.filter((element) => element.editorButton)) {
  const elementButton = document.createElement("a");
  elementButton.setAttribute("id", element.type + "-button");
  elementButton.classList.add("element-link");
  elementButton.textContent = element.label;
  elementButton.onclick = createElementButtonOnClickHandler(element.type);
  elementBoxDiv.appendChild(elementButton);
}

function createElementButtonOnClickHandler(elementType) {
  return function () {
    diagram.unselectAll();
    const element = diagram.add[elementType]();
    element.select?.();
    ctx.draw();
  };
}

const simulation = createSimulation(diagram, ctx);

const simulationStartButton = document.getElementById("simulation-start");
const simulationStepButton = document.getElementById("simulation-step");
const simulationPauseButton = document.getElementById("simulation-pause");
const simulationStopButton = document.getElementById("simulation-stop");

simulationStartButton.onclick = function (event) {
  removeEditingEventHandlers(canvas, ctx, diagram);

  simulationStartButton.classList.add("highlighted");
  simulationPauseButton.classList.remove("highlighted");

  simulation.start();
};

simulationStepButton.onclick = function (event) {
  if (!simulation.isStarted()) {
    removeEditingEventHandlers(canvas, ctx, diagram);
  }

  simulationStartButton.classList.remove("highlighted");
  simulationPauseButton.classList.add("highlighted");

  simulation.step();
};

simulationPauseButton.onclick = function (event) {
  if (simulation.isRunning()) {
    removeEditingEventHandlers(canvas, ctx, diagram);

    simulationStartButton.classList.remove("highlighted");
    simulationPauseButton.classList.add("highlighted");

    simulation.pause();
  }
};

simulationStopButton.onclick = function (event) {
  removeEditingEventHandlers = addEditingEventHandlers(canvas, ctx, diagram);

  simulationStartButton.classList.remove("highlighted");
  simulationPauseButton.classList.remove("highlighted");

  simulation.stop();
};
