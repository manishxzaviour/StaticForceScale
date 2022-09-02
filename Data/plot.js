function drawLine(
  p1,
  p2,
  stroke = "rgba(0, 0, 0, 0.1)",
  width = 0.5,
  canvas,
  context
) {
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
let set=[];
for(let x=0;x<160;x++){set[[x]]=0;}
let flag=true;
let scaleFactor = 10;
let countx=0;
canvas.onmousedown = (e) => {
  var rect = e.target.getBoundingClientRect();
  var x = e.clientX - rect.left;
  var y = e.clientY - rect.top;
  context.beginPath();
  context.strokeStyle = "blue";
  context.lineWidth = 1;
  context.arc(x, y, 4, 0, 2 * Math.PI);
  context.font = "17px Arial";
  context.fillStyle="black";
  context.fillText(
    `T: ${(x / (20*period)).toFixed(3)}S , F: ${((canvas.height - y) / scaleFactor).toFixed(4)}N`,
    x,
    y
  );
  context.stroke();
};
function draw() {
  let pos=0;
  if(DataR.length*period>canvas.width)
  canvas.setAttribute("width", `${DataR.length*period + 300}px`);
  canvas.setAttribute("height", `750px`);
  context.fillStyle="white";
  context.fillRect(0, 0, canvas.width, canvas.height);
  grid();
  DataR.forEach((e)=>{
    drawLine(
          [pos*period,(e*9.81/1000)*scaleFactor],
          [(pos+1)*period,(DataR[pos + 1]*9.81/1000)*scaleFactor],
          colourScale,
          1,
          canvas,
          context
        );
        pos++;
  });
}
function grid(c = "rgba(0, 0, 0, 0.3)") {
  let pos=0;
  for (let i = 0; i < canvas.width; i += 20) {
    drawLine([i, 0], [i, canvas.height], c, 0.3, canvas, context);
    context.beginPath();
    context.font = "10px Arial";
    if (i % (20*period) == 0){
      context.fillText(`${pos} s`, i, canvas.height);
    pos++;
    } 
    context.stroke();
  }
  for (let j = 0; j < canvas.height; j += 20) {
    drawLine([0, j], [canvas.width, j], c, 0.3, canvas, context);
  }
  drawLine([0, 10], [canvas.width, 10], "rgb(3, 126, 160)", 2, canvas, context);
}
function grid2(x, y) {
  drawLine([0, 25], [canvas2.width, 25], "grey", 1, canvas2, context2);
  drawLine([25, 0], [25, canvas2.height], "grey", 1, canvas2, context2);
  let count = 0;
  for (let i = 25; i < canvas2.width; i += 50) {
    drawLine([i, 20], [i, 25], "grey", 1, canvas2, context2);
    context2.beginPath();
    context2.fillStyle = "silver";
    context2.font = "13px Arial";
    try {
      context2.fillText(`.${x[count]}`, i, canvas2.height - 10);
      count++;
    } catch {}
    context2.stroke();
    drawLine(
      [i, 0],
      [i, canvas2.height],
      "rgba(0, 0, 0, 0.5)",
      0.2,
      canvas2,
      context2
    );
  }
  count = 0;
  for (let i = 25; i < canvas2.height; i += 50) {
    drawLine([20, i], [27, i], "grey", 1, canvas2, context2);
    context2.beginPath();
    context2.fillStyle = "silver";
    context2.font = "13px Arial";
    try {
      context2.fillText(`${y[count]} n`, 30, canvas2.height - i);
      count++;
    } catch (error) {}
    context2.stroke();
    drawLine(
      [0, i],
      [canvas2.width, i],
      "rgba(0, 0, 0, 0.5)",
      0.2,
      canvas2,
      context2
    );
  }
}
function draw2(setGot) {
    setGot.forEach((e)=>{
      set.shift();
      set.push((e*9.806/ 1000));
    });
  let yMax = set[0];
  yMax=Math.max.apply(null,set);
  yMax=yMax*1.2;
  yMax=Math.ceil(yMax);
  let temparry = [];
  let temparrx=[];
  let p=[0,0];
  context2.clearRect(0,0,canvas2.width,canvas2.height);
  for (let x = 0; x < set.length; x++) {
    let t ;
    t = x * canvas2.width/160;
    let n = (set[x] / yMax) * (canvas2.height-25);
    drawLine([p[0]+25,p[1]+25],[t+25,n+25],'red',0.5,canvas2,context2);
    p=[t,n];
  }
  for (let y = 0; y < 10; y++) {
    temparry.push((y * yMax) / 10);
  }
  for (let x = 0; x <20; x++) {
    temparrx.push(countx);
    countx+=50;
  } 
  grid2(temparrx, temparry);
}
