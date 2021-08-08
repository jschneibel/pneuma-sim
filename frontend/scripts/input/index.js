import handleLeftMouseDown from "./editing/handleLeftMouseDown/index.js";
import handleMiddleMouseDown from "./common/handleMiddleMouseDown.js";
import handleWheel from "./common/handleWheel.js";
import handleKeyDown from "./editing/handleKeyDown.js";
import handleMouseMove from "./editing/handleMouseMove.js";

export function addCommonEventHandlers(canvas, ctx, diagram) {
  canvas.addEventListener("mousedown", unwrapMiddleMouseDownHandler);
  canvas.addEventListener("wheel", unwrapWheelHandler, { passive: true });

  function unwrapMiddleMouseDownHandler(event) {
    handleMiddleMouseDown(event, canvas, ctx, diagram);
  }

  function unwrapWheelHandler(event) {
    handleWheel(event, ctx);
  }

  function removeCommonEventHandlers(canvas, ctx, diagram) {
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
    handleLeftMouseDown(
      event,
      unwrapLeftMouseDownHandler,
      canvas,
      ctx,
      diagram
    );
  }

  function unwrapMouseMoveHandler(event) {
    handleMouseMove(event, canvas, ctx, diagram);
  }

  function unwrapKeyDownHandler(event) {
    handleKeyDown(event, ctx, diagram);
  }

  function removeEditingEventHandlers(canvas, ctx, diagram) {
    canvas.removeEventListener("mousedown", unwrapLeftMouseDownHandler);
    canvas.removeEventListener("mousemove", unwrapMouseMoveHandler);
    document.removeEventListener("keydown", unwrapKeyDownHandler);
  }

  return removeEditingEventHandlers;
}
