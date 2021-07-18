import { getTransformedMousePosition } from "./utils.js";

export default function handleMiddleMouseDown(event, canvas, diagram) {
  const mouseDownPosition = getTransformedMousePosition(event, canvas);

  document.addEventListener("mousemove", handleMiddleMouseDrag);

  document.addEventListener("mouseup", handleMiddleMouseDragEnd);
}

function handleMiddleMouseDrag(event) {
  canvas.getContext("2d").save();
  panView(event, canvas, diagram, mouseDownPosition);
}

function panView(event, canvas, diagram, mouseDownPosition) {
  const currentMousePosition = getTransformedMousePosition(event, canvas);

  const ctx = canvas.getContext("2d");
  ctx.restore();
  ctx.save();
  ctx.translate(
    currentMousePosition.x - mouseDownPosition.x,
    currentMousePosition.y - mouseDownPosition.y
  );
  ctx.draw(diagram);
}

function handleMiddleMouseDragEnd(event) {
  removePanViewListeners(handleMiddleMouseDrag, handleMiddleMouseDragEnd);
}

function removePanViewListeners(
  handleMiddleMouseDrag,
  handleMiddleMouseDragEnd
) {
  document.removeEventListener("mouseup", handleMiddleMouseDragEnd);
  document.removeEventListener("mousemove", handleMiddleMouseDrag);
}
