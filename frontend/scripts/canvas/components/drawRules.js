import { RULES_COLOR } from "../../constants.js";

export default function drawRules(canvas, ctx, position = { x: 0, y: 0 }) {
  const { leftEdgeX, rightEdgeX, topEdgeY, bottomEdgeY } = getEdgeCoordinates(
    canvas,
    ctx
  );

  ctx.save();
  ctx.lineWidth = 0.35;
  ctx.strokeStyle = RULES_COLOR;
  ctx.beginPath();

  if (position.x) {
    ctx.moveTo(position.x, bottomEdgeY);
    ctx.lineTo(position.x, topEdgeY);
  }

  if (position.y) {
    ctx.moveTo(leftEdgeX, position.y);
    ctx.lineTo(rightEdgeX, position.y);
  }

  ctx.stroke();

  ctx.restore();
}

function getEdgeCoordinates(canvas, ctx) {
  const rect = canvas.getBoundingClientRect();
  const leftEdgeX = 0;
  const rightEdgeX = rect.right - rect.left;
  const topEdgeY = 0;
  const bottomEdgeY = rect.bottom - rect.top;

  // a: horizontal scaling
  // d: vertical scaling
  // e: horizontal translation
  // f: vertical translation
  const { a, d, e, f } = ctx.getTransform();

  const transformedLeftEdgeX = (leftEdgeX - e) / a;
  const transformedRightEdgeX = (rightEdgeX - e) / a;
  const transformedTopEdgeY = (topEdgeY - f) / d;
  const transformedBottomEdgeY = (bottomEdgeY - f) / d;

  return {
    leftEdgeX: transformedLeftEdgeX,
    rightEdgeX: transformedRightEdgeX,
    topEdgeY: transformedTopEdgeY,
    bottomEdgeY: transformedBottomEdgeY,
  };
}
