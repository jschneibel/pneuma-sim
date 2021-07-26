import { createDiagram } from "./diagram/diagram.js";
import { initializeCanvas } from "./canvas/canvas.js";
import handleLeftMouseDown from "./input/handleLeftMouseDown/index.js";
import handleMiddleMouseDown from "./input/handleMiddleMouseDown.js";
import handleMouseMove from "./input/handleMouseMove.js";
import handleWheel from "./input/handleWheel.js";
import handleKeyDown from "./input/handleKeyDown.js";

const diagram = await createDiagram();
const { canvas, ctx } = initializeCanvas();

canvas.addEventListener("mousedown", function unwrapHandler(event) {
  handleLeftMouseDown(event, unwrapHandler, canvas, ctx, diagram);
});

canvas.addEventListener("mousedown", function (event) {
  handleMiddleMouseDown(event, canvas, ctx, diagram);
});

canvas.addEventListener(
  "wheel",
  function (event) {
    handleWheel(event, ctx, diagram);
  },
  { passive: true }
);

document.addEventListener("keydown", function (event) {
  handleKeyDown(event, ctx, diagram);
});

canvas.addEventListener("mousemove", function (event) {
  handleMouseMove(event, canvas, ctx, diagram);
});

const cellButton = document.getElementById("cell-button");
cellButton.onclick = createElementButtonOnClickHandler("cell");

const switchButton = document.getElementById("switch-button");
switchButton.onclick = createElementButtonOnClickHandler("switch");

const cylinderButton = document.getElementById("cylinder-button");
cylinderButton.onclick = createElementButtonOnClickHandler("cylinder");

function createElementButtonOnClickHandler(elementType) {
  return function () {
    diagram.unselectAll();
    const element = diagram.add[elementType]();
    element.select?.();
    ctx.draw(diagram);
  };
}
