import mixinDrawing from "./mixinDrawing.js";

export default function mixinConnection({
  element = {},
  start = { getPosition: () => ({ x: 0, y: 0 }) },
  end = { getPosition: () => ({ x: 0, y: 0 }) },
  vertices = [],
  color = "#cc6",
}) {
  element.setStart = (newStart) => (start = newStart);
  element.getStart = () => start;
  element.getStartPosition = () => start.getPosition?.();

  element.setEnd = (newEnd) => (end = newEnd);
  element.getEnd = () => end;
  element.getEndPosition = () => end.getPosition?.();

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
    const startPosition = element.getStartPosition();
    const endPosition = element.getEndPosition();

    ctx.save();
    ctx.beginPath();
    ctx.strokeStyle = color;

    ctx.moveTo(startPosition.x, startPosition.y);

    element.getVertices().forEach(function (node) {
      ctx.lineTo(node.x, node.y);
    });

    ctx.lineTo(endPosition.x, endPosition.y);

    ctx.stroke();
    ctx.restore();
  }
}
