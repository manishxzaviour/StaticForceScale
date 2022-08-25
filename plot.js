function drawLine(p1, p2, stroke = "rgba(0, 0, 0, 0.3)", width = 1) {
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
let o=[0,0];
let pointSet=[o];
function draw(t=0,n=0) {
    let x=canvas.width;
    let y=canvas.height;
    //scale
    pointSet.push([t,n]);
    console.log(pointSet);
    if(t>(canvas.width)){
        canvas.setAttribute("width",`${canvas.width+t+250}px`);
        grid();
        document.querySelector(".selection").style.transition="0.4s";
        document.querySelector(".selection").style.opacity="0.2";
        document.getElementById("discription").style.transition="0.4s";
        document.getElementById("discription").style.opacity="0.2";
    }
    pointSet.forEach((e)=>{
        drawLine(e,pointSet[pointSet.indexOf(e)+1],'red');
    });
}
function grid() {
  for (let i = 0; i < canvas.width; i += 25) {
    drawLine([i, 0], [i, 600]);
  }
  for (let j = 0; j < 500; j += 25) {
    drawLine([0, j], [canvas.width, j]);
  }
}