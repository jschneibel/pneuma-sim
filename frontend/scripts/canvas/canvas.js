import { clearCanvas, drawDiagram } from "./utils.js";

export function initializeCanvas(canvasId, diagram) {
  const canvas = document.getElementById(canvasId);
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

  ctx.clear = () => clearCanvas(canvas, ctx);

  ctx.draw = function (drawOnTop = function () {}) {
    window.requestAnimationFrame(function () {
      drawDiagram(diagram, ctx);
      drawOnTop();
    });
  };

  ctx.clear();

  return { canvas: canvas, ctx: ctx };
}
