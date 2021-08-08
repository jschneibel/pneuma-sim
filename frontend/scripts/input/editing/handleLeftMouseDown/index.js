import { getTransformedMousePosition } from "../../utils/mousePosition.js";

import checkAndHandleLeftMouseDownOnTerminal from "./onTerminal.js";
import checkAndHandleLeftMouseDownOnElement from "./onElement.js";
import handleLeftMouseDownOnEmptyArea from "./onEmptyArea.js";

export default function handleLeftMouseDown(
  event,
  invokedListenerFn,
  canvas,
  ctx,
  diagram
) {
  if (event.button !== 0) return; // only handle left mouse down

  const mouseDownPosition = getTransformedMousePosition(event, canvas, ctx);
  console.log("mouseDownPosition:", mouseDownPosition);

  if (
    checkAndHandleLeftMouseDownOnTerminal(
      invokedListenerFn,
      canvas,
      ctx,
      diagram,
      mouseDownPosition
    )
  ) {
    return;
  }

  if (
    checkAndHandleLeftMouseDownOnElement(
      event,
      canvas,
      ctx,
      diagram,
      mouseDownPosition
    )
  ) {
    return;
  }

  handleLeftMouseDownOnEmptyArea(event, ctx, diagram);
}
