import handleMiddleMouseDown from "./handleMiddleMouseDown.js";
import handleLeftMouseDown from "./handleLeftMouseDown.js";

export default function handleMouseDown(event, canvas, ctx, diagram) {
  switch (event.button) {
    case 2: // right click
      break;
    case 1: // middle click
      handleMiddleMouseDown(event, canvas, ctx, diagram);
      break;
    case 0: // left click
    default:
      handleLeftMouseDown(event, canvas, ctx, diagram);
  }
}
