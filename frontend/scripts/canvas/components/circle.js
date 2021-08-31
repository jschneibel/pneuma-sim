/**
 * @file Utility for drawing circles on a canvas context.
 * @author Jonathan Schneibel
 * @module
 */

export function createCircle(x, y, radius) {
  console.log(`Creating Circle with radius ${radius}`);

  function getDimensions() {
    return {
      x,
      y,
      radius,
    };
  }

  function setRadius(value) {
    radius = value;
  }

  function getRadius() {
    return radius;
  }

  function draw(ctx) {
    ctx.beginPath();
    ctx.arc(x, y, radius, 0, 2 * Math.PI);
    ctx.stroke();
  }

  return {
    getDimensions,
    getRadius,
    setRadius,
    draw,
  };
}
