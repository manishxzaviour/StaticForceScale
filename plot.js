let plotD = `
          <h3>Graph T(s) vs F(N)</h3>
          <u>scale: 1 unit = 1 s & 1 N</u>
          <div style="background-color:rgba(206, 227, 227,0.6);">
          &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;^N
          <canvas id="graph" title="plot T v F" height="500px" width="750px" style="background-color:white;margin:20px;border:1px solid grey; border-radius: 8px; margin:auto; position:relative; top:0px; scroll:auto;" class="shaddow">
          </canvas>
          <br>
          0,0&nbsp;&nbsp;>T
          </div>
        `;
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
function draw() {}
function grid() {
  for (let i = 0; i < canvas.width; i += 25) {
    drawLine([i, 0], [i, 600]);
  }
  for (let j = 0; j < 500; j += 25) {
    drawLine([0, j], [canvas.width, j]);
  }
  // make so that mouse position on canvas title
}
workSpace.style.width = "760px";
workSpace.innerHTML = plotD;
canvas = document.getElementById("graph");
context = canvas.getContext("2d");
draw();
grid();
