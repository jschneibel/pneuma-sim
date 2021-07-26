import { drawAxes } from "./utils.js";

export function getCanvasContext() {
  return document.getElementById("canvas").getContext("2d");
}

export function initializeCanvas() {
  const canvas = document.getElementById("canvas");
  const ctx = canvas.getContext("2d");

  canvas.width = window.innerWidth;
  canvas.height = window.innerHeight;

  ctx.translate(
    // Math.floor(canvas.width * (1 / 2)) + 0.5,
    // Math.floor(canvas.height * (1 / 2)) + 0.5
    Math.floor(canvas.width * (2 / 7)) + 0.5,
    Math.floor(canvas.height * (3 / 4)) + 0.5
  );
  ctx.scale(1, -1);

  ctx.font = "12px sans-serif";
  ctx.strokeStyle = "#bbccdd";
  ctx.fillStyle = "#bbccdd";

  // this function writes text without it being vertically mirrored
  ctx.write = function (text, x, y) {
    ctx.save();
    ctx.scale(1, -1);
    ctx.fillText(text, x, -y);
    ctx.restore();
  };

  ctx.clear = function () {
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
  };

  ctx.draw = function (diagram) {
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
  };

  ctx.clear();

  return { canvas: canvas, ctx: ctx };
}
