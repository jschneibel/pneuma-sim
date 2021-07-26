export function drawAxes(ctx) {
  ctx.save();
  ctx.strokeStyle = "#778899";
  ctx.fillStyle = "#778899";
  ctx.font = "10px sans-serif";

  // TODO: move text to DOM for performance gains

  ctx.write("pneumaSIM", 3, 3);
  // canvas.font = '10px serif';
  // canvas.write('πνεῦμα', 4, -9);

  // canvas.font = '2200px serif';
  // canvas.fillStyle = '#242932';
  // canvas.write('πνεῦμα', -window.innerWidth*3/5, -window.innerHeight/2);

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
