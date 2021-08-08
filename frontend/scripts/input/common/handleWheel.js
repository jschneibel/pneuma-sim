import { ZOOM_SPEED } from "../../constants.js";

export default function handleWheel(event, ctx) {
  // TODO: Zoom on mouse position instead of origin.
  const scrollDirection = Math.sign(event.deltaY);
  const zoom = Math.pow(ZOOM_SPEED, -scrollDirection);
  ctx.scale(zoom, zoom);

  ctx.draw();
}
