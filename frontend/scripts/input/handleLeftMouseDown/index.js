import { getTransformedMousePosition } from "../utils.js";

import checkAndHandleLeftMouseDownOnElectricContact from "./onElectronicContact.js";
// import checkAndHandleLeftMouseDownOnPneumaticContact from "./onPneumaticContact.js";
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

  if (
    checkAndHandleLeftMouseDownOnElectricContact(
      invokedListenerFn,
      canvas,
      ctx,
      diagram,
      mouseDownPosition
    )
  ) {
    return;
  }

  // if (
  //   checkAndHandleLeftMouseDownOnPneumaticContact(
  //     canvas,
  //     ctx,
  //     diagram,
  //     mouseDownPosition
  //   )
  // ) {
  //   return;
  // }

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
