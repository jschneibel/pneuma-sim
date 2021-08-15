export function mixinDrawing({
  element,
  getOrigin = () => ({ x: 0, y: 0 }),
  draw = function drawLocally() {},
}) {
  // extend draw function if it already has been mixed-in
  const existingDraw = element.draw;

  element.draw = function (ctx) {
    if (existingDraw) {
      existingDraw(ctx);
    }

    const origin = getOrigin();

    ctx.save();
    ctx.translate(origin.x, origin.y);
    draw(ctx);
    ctx.restore();
  };
}
