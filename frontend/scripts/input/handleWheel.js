import { ZOOM_SPEED } from "../constants.js";

export default function handleWheel(event, ctx, diagram) {
    const scrollDirection = Math.sign(event.deltaY);
    const zoom = Math.pow(ZOOM_SPEED, -scrollDirection);
    ctx.scale(zoom, zoom);

    ctx.draw(diagram);
}