import handleLeftMouseDownDuringEditing from "./editing/handleLeftMouseDown/index.js";
import handleMouseMoveDuringEditing from "./editing/handleMouseMove.js";
import handleKeyDownDuringEditing from "./editing/handleKeyDown.js";
import handleMiddleMouseDown from "./common/handleMiddleMouseDown.js";
import handleWheel from "./common/handleWheel.js";
import handleLeftMouseDownDuringSimulation from "./simulation/handleLeftMouseDown.js";

export function addCommonEventHandlers(canvas, ctx, diagram) {
  canvas.addEventListener("mousedown", unwrapMiddleMouseDownHandler);
  canvas.addEventListener("wheel", unwrapWheelHandler, { passive: true });

  function unwrapMiddleMouseDownHandler(event) {
    handleMiddleMouseDown(event, canvas, ctx, diagram);
  }

  function unwrapWheelHandler(event) {
    handleWheel(event, ctx);
  }

  function removeCommonEventHandlers() {
    canvas.removeEventListener("mousedown", unwrapMiddleMouseDownHandler);
    canvas.removeEventListener("wheel", unwrapWheelHandler);
  }

  return removeCommonEventHandlers;
}

export function addEditingEventHandlers(canvas, ctx, diagram) {
  canvas.addEventListener("mousedown", unwrapLeftMouseDownHandler);
  canvas.addEventListener("mousemove", unwrapMouseMoveHandler);
  document.addEventListener("keydown", unwrapKeyDownHandler);

  function unwrapLeftMouseDownHandler(event) {
    handleLeftMouseDownDuringEditing(
      event,
      unwrapLeftMouseDownHandler,
      canvas,
      ctx,
      diagram
    );
  }

  function unwrapMouseMoveHandler(event) {
    handleMouseMoveDuringEditing(event, canvas, ctx, diagram);
  }

  function unwrapKeyDownHandler(event) {
    handleKeyDownDuringEditing(event, ctx, diagram);
  }

  function removeEditingEventHandlers() {
    canvas.removeEventListener("mousedown", unwrapLeftMouseDownHandler);
    canvas.removeEventListener("mousemove", unwrapMouseMoveHandler);
    document.removeEventListener("keydown", unwrapKeyDownHandler);
  }

  return removeEditingEventHandlers;
}

export function addSimulationEventHandlers(canvas, ctx, diagram, simulation) {
  canvas.addEventListener("mousedown", unwrapLeftMouseDownHandler);

  function unwrapLeftMouseDownHandler(event) {
    handleLeftMouseDownDuringSimulation(
      event,
      canvas,
      ctx,
      diagram,
      simulation
    );
  }

  function removeSimulationEventHandlers() {
    canvas.removeEventListener("mousedown", unwrapLeftMouseDownHandler);
  }

  return removeSimulationEventHandlers;
}
