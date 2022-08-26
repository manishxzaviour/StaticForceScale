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
let pointSet = [[0, 0]];
let factor = 10;
function scale(x, y) {
let colourScale = "rgb(0,255,0)";
  let threshold = [730, 70];
  // 500px = 2 kg = ~20 N 10 kg = 100 N
  if (y > threshold[0]) {
    while (y> threshold[0]) {
      y= y / 2;
      factor++;
    }
    colourScale = `rgb(${12 * factor},0,0)`;
  }
  else if(threshold[1]>y){
    while (threshold[1]>y) {
        y = y * 2;
        factor--;
      }
      colourScale = `rgb(0,0,${12 * factor})`;
  }
  return [[x, y], colourScale];
}
function draw(t = 0, n = 0) {
  let x = canvas.width;
  let y = canvas.height;
  pointSet.push(scale(t, n));
  if (x - t < 150) {
    canvas.setAttribute("width", `${x + (x - t) + 750}px`);
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
    window.scrollBy(750, y / 4);
  }
  pointSet.forEach((e) => {
    drawLine(e[0], pointSet[pointSet.indexOf(e) + 1][0], e[1], 0.1);
  });
}
function grid(c = "rgba(0, 0, 0, 0.3)") {
  for (let i = 0; i < canvas.width; i += 25) {
    drawLine([i, 0], [i, canvas.height]);
  }
  for (let j = 0; j < canvas.height; j += 25) {
    drawLine([0, j], [canvas.width, j], c);
  }
}
