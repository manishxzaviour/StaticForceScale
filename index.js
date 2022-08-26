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
                <canvas id="graph" height="500px" width="750px" style="background-color:white;margin:20px;border:3px dotted grey; margin:auto; position:relative; top:0px; scroll:auto; cursor:pointer" class="shaddow">
                </canvas>
                <br>
                0,0&nbsp;&nbsp;>T
                </div>
              `;
let selection = ["massB", "pulseB", "plotB", "downloadB", "evalB"];
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
let count = 1;
let DataR = [];
let temp = [];
let timeOut;
var anchor = document.createElement("a");
let b = selection.map((a) => {
  return document.getElementById(a);
});
function recieveD() {
  //get data
  // make request every 1 s and get array
  // append array to larger array
  for (let i = 0; i < 80; i++) {
    temp[i] = Math.random() * 100000;
  }
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
  samples.innerHTML = `samples : ${count} mode : ${state}`;
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
      DatD.value = (DataGm*9.806)/ 1000 ;
      break;
    case "Pasc (N/m^2)":
      DatD.value = DataGm / 1000 / 9.806 / eval(prompt("area in m"));
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
function downloadRaw(){
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
  //80 hz to 1 hz save to a array
  let x = document.createElement("script");
  x.src = "./plot.js";
  workSpace.style.width = "760px";
  workSpace.innerHTML = plotD;
  canvas = document.getElementById("graph");
  context = canvas.getContext("2d");
  canvas.onmouseover = (e) => {
    var rect = e.target.getBoundingClientRect();
    canvas.onmousedown = () => {
      var x = e.clientX - rect.left;
      var y = canvas.height - (e.clientY - rect.top);
      canvas.setAttribute("title", `T : ${x*5/80} s, N : ${y}`);
    };
  };
  document.body.appendChild(x);
  setTimeout(() => {
    timeOut = setInterval(() => {
      document.getElementById("Data").value=
        DataGm / 1000 / 9.806;
      recieveD();
      temp.forEach((a) => {
        setTimeout(() => {
          draw(temp.indexOf(a)*5  + (count - 3) * temp.length*5, a);
        }, 50);
      });
    }, 1000);
    grid();
  }, 200);
  b[3].disabled = false;
};
b[3].onclick = () => {
  clearInterval(timeOut);
  grid("green");
  anchor.href = canvas.toDataURL("image/png");
  anchor.download = "plot.PNG";
  anchor.click();
  downloadRaw();
};
b[4].onclick = () => {
  clearInterval(timeOut);
  let evalF = document.createElement("textarea");
  evalF.style = "height:500px;width:700px;font-size:17px;";
  evalF.setAttribute("id", "js");
  workSpace.append(evalF);
  let p = `
    <button type="button" id="eval" class="GenericFont">eval</button>
    <div id="discription"><h4>Available variables :
    </h4>
    <ul>
    <li><strong>'DataGm'</strong>  availabe in Gm</li>
    <li><strong>'DatD'</strong>  availabe in Gm</li>
    <li><strong>'unit'</strong>  availabe in Gm</li>
    <li><strong>'DataR'</strong>  all availavle data in Gm</li>
    <li><strong>'workSpace'</strong>  workSpace</li>
    <li><strong>'GetD()'</strong>  available every second</li>
    <li><strong>'get()'</strong>   store to item list in weight mode</li>
    <li><strong>'draw(x,y)'</strong>   store and draw from pointSet</li>
    <li><strong>'drawLine(p1, p2, stroke = "rgba(0, 0, 0, 0.3)", width = 1)'</strong>   draw line</li>
    <li><strong>'downloadRaw()", width = 1)'</strong>   download DataR as text</li>
    </ul>
    </div>
    `;
  let x = document.createElement("div");
  x.innerHTML = p;
  x.style = "position:absolute;top:500px;left:85%;color:rgb(2, 56, 56);";
  workSpace.appendChild(x);
  document.getElementById("eval").onclick = () => {
    eval(document.getElementById("js").value);
  };
};
