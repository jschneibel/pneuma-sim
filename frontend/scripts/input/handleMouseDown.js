import handleMiddleMouseDown from "./handleMiddleMouseDown.js";
import handleLeftMouseDown from "./handleLeftMouseDown.js";

export default function handleMouseDown(event, canvasElement, diagram) {
  switch (event.button) {
    case 2: // right click
      break;
    case 1: // middle click
      handleMiddleMouseDown(event, canvasElement, diagram);
      break;
    case 0: // left click
    default:
      handleLeftMouseDown(event, canvasElement, diagram);
  }
}
