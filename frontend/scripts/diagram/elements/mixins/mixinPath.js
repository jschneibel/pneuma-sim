import mixinDrawing from "./mixinDrawing.js";

export default function mixinPath({
  element = {},
  getStartPosition = () => ({ x: 0, y: 0 }),
  getEndPosition = () => ({ x: 0, y: 0 }),
  vertices = [],
  color = "#cc6",
}) {
  element.setStartPosition = function (startPositionGetter) {
    getStartPosition = startPositionGetter;
  };

  element.setEndPosition = function (endPositionGetter) {
    getEndPosition = endPositionGetter;
  };

  // Note: This is not returning a copy.
  element.getVertices = () => vertices;

  element.setVertices = (newVertices) => (vertices = newVertices);

  mixinDrawing({
    element,
    getElementPosition: () => ({ x: 0, y: 0 }), // so we can draw in global coordinates
    draw,
  });

  // in global coordinates
  function draw(ctx) {
    const startPosition = getStartPosition();
    const endPosition = getEndPosition();

    ctx.save();
    ctx.beginPath();
    ctx.strokeStyle = color;

    ctx.moveTo(startPosition.x, startPosition.y);

    vertices.forEach(function (node) {
      ctx.lineTo(node.x, node.y);
    });

    ctx.lineTo(endPosition.x, endPosition.y);

    ctx.stroke();
    ctx.restore();
  }
}
