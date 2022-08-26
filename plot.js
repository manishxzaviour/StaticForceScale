function drawLine(p1, p2, stroke = "rgba(0, 0, 0, 0.1)", width = 0.5) {
  if (stroke) {
    context.strokeStyle = stroke;
  }
  if (width) {
    context.lineWidth = width;
  }
  context.lineJoin = "round";
  context.beginPath();
  context.moveTo(p1[0], canvas.height - p1[1]);
  try {
    context.lineTo(p2[0], canvas.height - p2[1]);
  } catch (error) {}
  context.stroke();
}
let colourScale = "rgb(255,0,0)";
let pointSet = [[0, 0]];
let scaleFactor = 2;
let diff = 0;
canvas.onmousedown = (e) => {
  var rect = e.target.getBoundingClientRect();
  var x = e.clientX-rect.left;
  var y = e.clientY-rect.top;
  console.log('x:'+x);
  console.log('y:'+y);
  context.beginPath();
  context.strokeStyle = "blue";
  context.lineWidth = 1;
  context.arc(x, y, 4, 0, 2 * Math.PI);
  context.font = "17px Arial";
  context.stroke();
  context.beginPath();
  context.lineWidth = 0.6;
  context.strokeStyle = "grey";
  context.fillText(`T : ${x/80}S F : ${(canvas.height-y)*scaleFactor}N`,x,y);
  context.stroke();
};
function draw(t = 0, n = 0) {
  let x = canvas.width;
  let y = canvas.height;
  pointSet.push([t, n / scaleFactor]);
  if (x - t < 150) {
    canvas.setAttribute("width", `${x + (x - t) + 750}px`);
    diff = x - t;
    canvas.setAttribute("height", `750px`);
    grid();
    document.querySelector(".selection").style.transition = "0.4s";
    document.querySelector(".selection").style.opacity = "0.1";
    try {
      document.getElementById("discription").style.transition = "0.4s";
      document.getElementById("discription").style.opacity = "0.2";
    } catch (error) {}
    document.querySelector(".selection").style.transition = "0.1s";
    document.querySelector(".selection").style.top = `-50px`;
    document.querySelector(".selection").style.left = `${canvas.width - 200}px`;
    window.scrollBy(750, 0);
  }
  context.clearRect(0, 0, canvas.width, canvas.height);
  grid();
  pointSet.forEach((e) => {
    drawLine(e, pointSet[pointSet.indexOf(e) + 1], colourScale, 1);
  });
}
function grid(c = "rgba(0, 0, 0, 0.3)") { 
  for (let i = 0; i < canvas.width; i += 25) {
    drawLine([i, 0], [i, canvas.height]);
    context.beginPath();
    context.font = "10px Arial";
    if(i%80==0)
    context.fillText(`${(i/80)/5} s`,i, canvas.height);
    context.stroke();
  }
  for (let j = 0; j < canvas.height; j += 25) {
    drawLine([0, j], [canvas.width, j], c);
  }
  drawLine([0,10],[canvas.width,10],'rgb(3, 126, 160)',2);
}
