import {
  SELECTION_BOX_COLOR,
  SELECTION_BOX_SQUARE_LENGTH,
} from "../../constants.js";

export function drawSelection({ ctx, shape = [] }) {
  const cornerSquareLength = SELECTION_BOX_SQUARE_LENGTH;

  ctx.save();
  ctx.strokeStyle = SELECTION_BOX_COLOR;
  ctx.beginPath();

  ctx.moveTo(shape[shape.length - 1].x, shape[shape.length - 1].y);

  for (let i = 0; i < shape.length; i++) {
    ctx.lineTo(shape[i].x, shape[i].y);
  }

  for (let i = 0; i < shape.length; i++) {
    drawCenteredSquare(
      ctx,
      { x: shape[i].x, y: shape[i].y },
      cornerSquareLength
    );
  }

  ctx.stroke();
  ctx.restore();
}

function drawCenteredSquare(ctx, center, length) {
  ctx.save();
  ctx.translate(center.x - length / 2, center.y - length / 2);

  ctx.moveTo(0, 0);
  ctx.lineTo(length, 0);
  ctx.lineTo(length, length);
  ctx.lineTo(0, length);
  ctx.lineTo(0, 0);

  ctx.restore();
}
