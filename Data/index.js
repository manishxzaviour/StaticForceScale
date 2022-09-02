let state = "Weight";
let tempLit = `
</strong></label><input type="number" step="any" id="Data" placeholder="000000000" style="font-size:20px ;">
                <br>
                <label for="sel"><strong>unit:</strong></label>
                <select id="sel">
                    <option selected>Gm</option>
                    <option>Kg</option>
                    <option>N (mass)</option>
                    <option>Pasc (N/m^2)</option>
                </select>
                <button type="button" id="ref" style="cursor:pointer; font-size:20px; margin:5px"onclick="GetD()">ref</button>
                <button type="button" id="get" style="cursor:pointer; font-size:20px; margin:5px" onclick="get()">get</button>
                <table id="itemL">
                    <tr>
                    <th>Sr</th>
                    <th>Read</th>
                    <th>Unit</th>
                    <th>Label</th>
                    <th>Dimension</th>
                    </tr>
                </table>`;
let plotD = `
                <h3>Graph T(s) vs F(N)</h3><input type="number" step="any" id="Data" placeholder="000000000" style="font-size:20px;">
                <u>scale: 1 unit = 1 s & 1 N</u>
                <div style="background-color:rgba(206, 227, 227,0.6);">
                &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;^N
                <canvas id="graph" height="500px" width="750px" style="display:none;background-color:white;border:3px dotted grey; margin:auto; position:relative; top:0px; cursor:pointer" class="shaddow">
                </canvas>
                <canvas id="autoScaleGraph" height="525px" width="925px" style="background-color:white; margin:auto; position:relative; top:0px;cursor:pointer; border-radius:10px" class="shaddow"></canvas>
                <br>
                0,0&nbsp;&nbsp;>T (ms)
                </div>
              `;
let selection = ["massB", "pulseB", "plotB", "downloadB", "evalB", "calB"];
let workSpace = document.getElementById("workSpace");
workSpace.innerHTML = `<label for="weight"><strong>${state}` + tempLit;
let DatD = document.getElementById("Data");
let unit = document.getElementById("sel");
let srn = 1;
let DataGm;
let table = document.getElementById("itemL");
let samples = document.getElementById("samples");
let canvas;
let context;
let canvas2;
let context2;
let count = 1;
let DataR = [];
let temp = [];
let timeOut;
let period = 5;
var anchor = document.createElement("a");
let b = selection.map((a) => {
  return document.getElementById(a);
});
function recieveD() {
  // for (let i = 0; i < 80; i++) {
  //   temp[i] = Math.random() * 10000;
  // }
  let xhttp = new XMLHttpRequest();
  xhttp.onreadystatechange = function () {
    if (this.readyState == 4 && this.status == 200) {
      let str = this.responseText;
      for (let i = 0; i < 20; i++) {
        temp[i] = parseInt(str.substring(0, str.indexOf(",")));
        str = str.substring(str.indexOf(",") + 1, str.length);
      }
      // console.log(temp);
    }
  };
  xhttp.open("GET", "/get", true);
  xhttp.send();
  DataR = DataR.concat(temp);
  let x = 0;
  if (state == "Weight") {
    temp.forEach((a) => {
      x += a;
    });
    DataGm = x / temp.length;
  } else {
    DataGm = Math.max.apply(null, temp);
  }
  samples.innerHTML = `sampleSet : ${count} mode: ${state}`;
  count++;
}
function GetD() {
  recieveD();
  refD();
}
function refD() {
  DatD = document.getElementById("Data");
  unit = document.getElementById("sel");
  switch (unit.value) {
    case "Gm":
      DatD.value = DataGm;
      break;
    case "Kg":
      DatD.value = DataGm / 1000;
      break;
    case "N (mass)":
      DatD.value = (DataGm * 9.806) / 1000;
      break;
    case "Pasc (N/m^2)":
      DatD.value = (DataGm * 9.806) / 1000 / eval(prompt("area in m"));
      break;
  }
  unit.onchange = refD;
}
GetD();
function get() {
  let temp = `<td>${srn}</td><td>${DatD.value}</td><td>${unit.value}</td><td><input type="text"></td><td><input type="text"></td>`;
  let tr = document.createElement("tr");
  tr.innerHTML = temp;
  table.appendChild(tr);
  srn++;
}
function downloadRaw() {
  anchor.setAttribute("download", "Raw.txt");
  anchor.href = "data:text/plain," + encodeURIComponent(DataR.join("\n"));
  anchor.click();
}
b[0].onclick = () => {
  clearInterval(timeOut);
  srn = 1;
  state = "Weight";
  workSpace.innerHTML = `<label for="weight"><strong>${state}` + tempLit;
  table = document.getElementById("itemL");
  GetD();
};
b[1].onclick = () => {
  clearInterval(timeOut);
  srn = 1;
  state = "Impulse";
  workSpace.innerHTML = `<label for="weight"><strong>${state}` + tempLit;
  table = document.getElementById("itemL");
  GetD();
};
b[2].onclick = () => {
  let x = document.createElement("script");
  x.src = "./plot.js";
  workSpace.style.width = "760px";
  workSpace.innerHTML = plotD;
  canvas = document.getElementById("graph");
  context = canvas.getContext("2d");
  canvas2 = document.getElementById("autoScaleGraph");
  context2 = canvas2.getContext("2d");
  document.body.appendChild(x);
  setTimeout(() => {
    grid2();
    timeOut = setInterval(() => {
      document.getElementById("Data").value = (DataGm * 9.806) / 1000;
      recieveD();
      draw2(temp);
      // temp.forEach((a) => {
      //   pointSet.push([
      //     temp.indexOf(a) * period + count *temp.length * period,
      //     (Math.abs(a) * 9.806) / 1000 * scaleFactor,
      //   ]);
      // });
    }, 1000);
  }, 1000);
  b[3].disabled = false;
};
b[3].onclick = () => {
  clearInterval(timeOut);
  canvas.style.display = "block";
  canvas2.style.display = "none";
  if (
    confirm(
      "download?(ok)\n would you like to anotate points ? \n\t dont forget to perform proper scaling before download \n\t you can always redraw all using 'draw()' without parameters with proper scaleFactor"
    )
  ) {
    draw();
    grid("green");
    anchor.href = canvas.toDataURL("image/png");
    anchor.download = "plot.PNG";
    anchor.click();
    downloadRaw();
  }
  draw();
  grid("green");
  document.querySelector(".selection").style.opacity = "0.2";
  setTimeout(() => {
    const scaleF=setInterval(()=> {
      let newScale = eval(
        prompt(`change scale? current for y-axis = ${scaleFactor} \n cancel to abort`)
      );
      let newPeriod=eval(
        prompt(`change period? current for x-axis = ${period} \n cancel to abort`)
      );
      if (newScale != null) {
        scaleFactor = newScale;
        draw();
        grid("green");
      }
      if(newPeriod!=null){
        period=newPeriod;
        draw();
        grid("green");
      }
      if(newScale == null && newPeriod==null){
        draw();
        grid("green");
        clearInterval(scaleF);
      }
    },3000);
    }, 2500);
};
b[4].onclick = () => {
  clearInterval(timeOut);
  let evalF = document.createElement("textarea");
  evalF.style = "height:500px;width:700px;font-size:17px;";
  evalF.setAttribute("id", "js");
  workSpace.append(evalF);
  let p = `
  <br><br>
  <button type="button" id="eval" class="GenericFont" style="cursor: pointer;">Eval</button>
  <br>
    go to about page to find available variables <a href="/about.html" target="_blank" el="noopener">about</a>
    `;
  let x = document.createElement("div");
  x.innerHTML = p;
  x.style = "position:absolute;top:500px;left:85%;color:rgb(2, 56, 56);";
  workSpace.appendChild(x);
  document.getElementById("eval").onclick = () => {
    eval(document.getElementById("js").value);
  };
};
b[5].onclick = () => {
  let opt=confirm("would you like to ? \n\t zero(ok) or \n\t calibrate(cancel)");
  let post=new XMLHttpRequest();
  if(opt){
    post.onreadystatechange = function (){
      if (this.readyState == 4 && this.status == 200) {
        alert("zeroed");
      }
      else console.log("not zeroed",this.status);
    }
    post.open("GET","/zero",true);
    post.send();
  }
  else{
    let calib=parseInt(eval(prompt("enter mass used in gm")));
    post.onreadystatechange = function (){
      if (this.readyState == 4 && this.status == 200) {
        alert("calibrated");
      }
      else console.log("not calibrated",this.status);
    }
    post.open("POST","/calib",true);
    post.send(calib);
  }
};
