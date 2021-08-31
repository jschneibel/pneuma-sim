/**
 * @file Handles the left mousedown event during simulation.
 * @author Jonathan Schneibel
 * @module
 */

import { getTransformedMousePosition } from "../utils/mousePosition.js";
import { findElementsAtPosition } from "../utils/findAtPosition.js";

export default function handleLeftMouseDown(
  event,
  canvas,
  ctx,
  diagram,
  simulation
) {
  if (event.button !== 0) return; // only handle left mouse down

  const mouseDownPosition = getTransformedMousePosition(event, canvas, ctx);

  const elementUnderMouse = findElementsAtPosition(
    diagram,
    mouseDownPosition
  )[0];

  if (elementUnderMouse) {
    elementUnderMouse.mouseDown?.();
    if (!simulation.isRunning()) {
      simulation.step();
    }

    canvas.addEventListener("mouseup", handleLeftMouseUp);
  }

  function handleLeftMouseUp() {
    elementUnderMouse.mouseUp?.();
    if (!simulation.isRunning()) {
      simulation.step();
    }

    canvas.removeEventListener("mouseup", handleLeftMouseUp);
  }
}
