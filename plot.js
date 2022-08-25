function drawLine(p1, p2, stroke = "black", width = 1) {
  if (stroke) {
    context.strokeStyle = stroke;
  }
  if (width) {
    context.lineWidth = width;
  }
  context.beginPath();
  context.moveTo(p1[0], canvas.height - p1[1]);
  context.lineTo(p2[0], canvas.height - p2[1]);
  context.stroke();
}
function draw() {
}
function grid() {
  for (let i = 0; i < canvas.width; i += 25) {
    drawLine([i, 0], [i, 600]);
  }
  for (let j = 0; j < 500; j += 25) {
    drawLine([0, j], [canvas.width, j]);
  }
  // make so that mouse position on canvas title
}