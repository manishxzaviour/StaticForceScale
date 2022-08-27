function drawLine(p1, p2, stroke = "rgba(0, 0, 0, 0.1)", width = 0.5,canvas,context) {
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
canvas.onmousedown = (e) => {
  var rect = e.target.getBoundingClientRect();
  var x = e.clientX-rect.left;
  var y = e.clientY-rect.top;
  context.beginPath();
  context.strokeStyle = "blue";
  context.lineWidth = 1;
  context.arc(x, y, 4, 0, 2 * Math.PI);
  context.font = "17px Arial";
  context.fillText(`T : ${x/80}S F : ${(canvas.height-y)*scaleFactor}N`,x,y);
  context.stroke();
};
function draw(t = canvas.width, n = canvas.height) {
    canvas.setAttribute("width", `${pointSet[pointSet.length-1][0] + 300}px`);
    canvas.setAttribute("height", `750px`);
  grid();
  pointSet.forEach((e) => {
    drawLine(e, pointSet[pointSet.indexOf(e) + 1], colourScale, 1,canvas,context);
  });
}
function grid(c = "rgba(0, 0, 0, 0.3)") { 
  for (let i = 0; i < canvas.width; i += 25) {
    drawLine([i, 0], [i, canvas.height],c,0.3,canvas,context);
    context.beginPath();
    context.font = "10px Arial";
    if(i%80==0)
    context.fillText(`${(i/80)/5} s`,i, canvas.height);
    context.stroke();
  }
  for (let j = 0; j < canvas.height; j += 25) {
    drawLine([0, j], [canvas.width, j], c,0.3,canvas,context);
  }
  drawLine([0,10],[canvas.width,10],'rgb(3, 126, 160)',2,canvas,context);
}
function grid2(x,y){
  context.clearRect(0, 0, canvas2.width, canvas2.height);
  drawLine([0,25],[canvas2.width,25],'grey',1,canvas2,context2);
  drawLine([25,0],[25,canvas2.height],'grey',1,canvas2,context2);//rgba(75, 139, 223, 0.903)
  for(let i=25;i<canvas2.width;i+=160){
    drawLine([i,20],[i,25],'grey',1,canvas2,context2);
    context2.beginPath();
    context2.fillStyle='silver';
    context2.font='13px Arial';
    try{context2.fillText(`${x[i]}n`,i,canvas2.height-10);}
    catch{}
    context2.stroke();
    drawLine([i, 0], [i, canvas2.height],'rgba(0, 0, 0, 0.5)',0.2,canvas2,context2);
  } 
  for(let i=25;i<canvas2.height;i+=100){
    drawLine([20,i],[27,i],'grey',1,canvas2,context2);
    context2.beginPath();
    context2.fillStyle='silver';
    context2.font='13px Arial';
    try {
      context2.fillText(`${y[i]} s`,30,canvas2.height-i);
    } catch (error) {
    }
    context2.stroke();
    drawLine([0, i], [canvas2.width, i], 'rgba(0, 0, 0, 0.5)',0.2,canvas2,context2);
  }
}
function scale(){
}
function draw2(){
  let t=[];
  let n=[];
  for(let x=DataR.length ; DataR.length - x < 6*80 ;x--){
    console.log(DataR[x]);
  }
  grid2(t,0);
}
draw2();
