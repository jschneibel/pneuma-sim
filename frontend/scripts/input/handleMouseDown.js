import handleMiddleMouseDown from "./handleMiddleMouseDown.js";
import handleLeftMouseDown from "./handleLeftMouseDown/index.js";

export default function handleMouseDown(event, canvas, ctx, diagram) {
  switch (event.button) {
    case 0: // left click
      handleLeftMouseDown(event, canvas, ctx, diagram, this);
      break;
    case 2: // right click
      // do nothing
      break;
    case 1: // middle click
      handleMiddleMouseDown(event, canvas, ctx, diagram);
      break;
    default:
      // do nothing
      break;
  }
}
