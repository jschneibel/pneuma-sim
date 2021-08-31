/**
 * @file Provides utility functions for the canvas context.
 * @author Jonathan Schneibel
 * @module
 */

export function drawDiagram(diagram, ctx) {
  ctx.clear();

  // Draw unselected elements first (i.e. in background),
  // starting with the last added element.
  const elements = diagram.getElements();
  for (let i = elements.length - 1; i >= 0; i--) {
    if (!elements[i].isSelected?.()) {
      elements[i].draw?.(ctx);
    }
  }

  // Draw selected elements second (i.e. in foreground),
  // starting with the last added element.
  for (let i = elements.length - 1; i >= 0; i--) {
    if (elements[i].isSelected?.()) {
      elements[i].draw?.(ctx);
    }
  }
}

export function clearCanvas(canvas, ctx) {
  const rect = canvas.getBoundingClientRect();

  const untransformedXLeft = -rect.left;
  const untransformedYBottom = rect.bottom;

  const untransformedWidth = rect.width;
  const untransformedHeight = rect.height;

  // a: horizontal scaling
  // d: vertical scaling
  // e: horizontal translation
  // f: vertical translation
  const { a, d, e, f } = ctx.getTransform();

  const transformedXLeft = (untransformedXLeft - e) / a;
  const transformedYBottom = (untransformedYBottom - f) / d;

  const transformedWidth = untransformedWidth / Math.abs(a);
  const transformedHeight = untransformedHeight / Math.abs(d);

  ctx.clearRect(
    transformedXLeft,
    transformedYBottom,
    transformedWidth,
    transformedHeight
  );

  // Alternative way to clear (check performance impact)
  // ctx.save();
  // ctx.fillStyle = "#232730";
  // ctx.fillRect(
  // transformedXLeft,
  // transformedYBottom,
  // transformedWidth,
  // transformedHeight
  // );
  // ctx.restore();

  drawAxes(ctx);
}

function drawAxes(ctx) {
  ctx.save();
  ctx.strokeStyle = "#778899";
  ctx.fillStyle = "#778899";
  ctx.font = "10px sans-serif";

  // TODO: move text to DOM for performance gains
  ctx.write("pneumaSIM", 3, 3);

  const length = 110;
  ctx.beginPath();

  ctx.write("x", length + 10, -3);
  ctx.moveTo(-20, 0);
  ctx.lineTo(length, 0);
  ctx.lineTo(length - 5, 5);
  ctx.moveTo(length, 0);
  ctx.lineTo(length - 5, -5);

  ctx.write("y", -3, length + 11);
  ctx.moveTo(0, -20);
  ctx.lineTo(0, length);
  ctx.lineTo(5, length - 5);
  ctx.moveTo(0, length);
  ctx.lineTo(-5, length - 5);

  ctx.stroke();
  ctx.restore();
}
