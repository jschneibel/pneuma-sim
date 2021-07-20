import { getTransformedMousePosition } from "../utils.js";

import checkAndHandleLeftMouseDownOnElectricContact from "./onElectronicContact.js";
import checkAndHandleLeftMouseDownOnPneumaticContact from "./onPneumaticContact.js";
import checkAndHandleLeftMouseDownOnElement from "./onElement.js";
import handleLeftMouseDownOnEmptyArea from "./onEmptyArea.js";

export default function handleLeftMouseDown(event, canvas, ctx, diagram) {
  const mouseDownPosition = getTransformedMousePosition(event, canvas, ctx);

  if (
    checkAndHandleLeftMouseDownOnElectricContact(
      canvas,
      ctx,
      diagram,
      mouseDownPosition
    )
  ) {
    return;
  }

  if (
    checkAndHandleLeftMouseDownOnPneumaticContact(
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
