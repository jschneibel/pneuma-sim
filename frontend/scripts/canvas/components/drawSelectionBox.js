import {
  SELECTION_BOX_COLOR,
  SELECTION_BOX_PADDING,
  SELECTION_BOX_SQUARE_LENGTH,
} from "../../constants.js";

export function drawSelectionBox(ctx, x, y, width, height) {
  const padding = SELECTION_BOX_PADDING;
  const cornerSquareLength = SELECTION_BOX_SQUARE_LENGTH;

  width = width + 2 * padding;
  height = height + 2 * padding;

  ctx.save();
  ctx.strokeStyle = SELECTION_BOX_COLOR;
  ctx.translate(x - padding, y - padding);

  ctx.beginPath();

  ctx.moveTo(0, 0);
  ctx.lineTo(width, 0);
  ctx.lineTo(width, height);
  ctx.lineTo(0, height);
  ctx.lineTo(0, 0);

  drawCenteredSquare(ctx, 0, 0, cornerSquareLength);
  drawCenteredSquare(ctx, width, 0, cornerSquareLength);
  drawCenteredSquare(ctx, width, height, cornerSquareLength);
  drawCenteredSquare(ctx, 0, height, cornerSquareLength);

  ctx.stroke();

  ctx.restore();
}

function drawCenteredSquare(ctx, x, y, length) {
  ctx.save();
  ctx.translate(x - length / 2, y - length / 2);

  ctx.moveTo(0, 0);
  ctx.lineTo(length, 0);
  ctx.lineTo(length, length);
  ctx.lineTo(0, length);
  ctx.lineTo(0, 0);

  ctx.restore();
}
