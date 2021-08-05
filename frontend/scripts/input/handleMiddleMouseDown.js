import { getTransformedMousePosition } from "./utils/mousePosition.js";

export default function handleMiddleMouseDown(event, canvas, ctx, diagram) {
  if (event.button !== 1) return; // only handle middle mouse down

  const mouseDownPosition = getTransformedMousePosition(event, canvas, ctx);

  document.addEventListener("mousemove", handleMiddleMouseDrag);

  document.addEventListener("mouseup", handleMiddleMouseDragEnd);

  function handleMiddleMouseDrag(event) {
    ctx.save();
    panView(event, canvas, ctx, mouseDownPosition);
  }

  function handleMiddleMouseDragEnd(event) {
    removePanViewListeners(handleMiddleMouseDrag, handleMiddleMouseDragEnd);
  }
}

function panView(event, canvas, ctx, mouseDownPosition) {
  const currentMousePosition = getTransformedMousePosition(event, canvas, ctx);

  ctx.restore();
  ctx.save();
  ctx.translate(
    currentMousePosition.x - mouseDownPosition.x,
    currentMousePosition.y - mouseDownPosition.y
  );

  ctx.draw();
}

function removePanViewListeners(
  handleMiddleMouseDrag,
  handleMiddleMouseDragEnd
) {
  document.removeEventListener("mouseup", handleMiddleMouseDragEnd);
  document.removeEventListener("mousemove", handleMiddleMouseDrag);
}
