let state='Weight';
let tempLit = `
</strong></label><input type="number" step="any" id="Data" placeholder="000000000" style="font-size:20px ;">
                <br>
                <label for="sel"><strong>unit:</strong></label>
                <select id="sel">
                    <option selected>Gm</option>
                    <option>Kg</option>
                    <option>N</option>
                    <option>Pasc (N/m^2)</option>
                    <option>waterEq</option>
                </select>
                <button type="button" id="ref" onclick="GetD()">ref</button>
                <button type="button" id="get" onclick="get()">get</button>
                <table id="itemL">
                    <tr>
                    <th>Sr</th>
                    <th>Read</th>
                    <th>Unit</th>
                    <th>Label</th>
                    <th>Dimension</th>
                    </tr>
                </table>`;
let selection = ["massB", "pulseB", "plotB", "downloadB", "evalB"];
let workSpace = document.getElementById("workSpace");
workSpace.innerHTML = `<label for="weight"><strong>${state}`+tempLit;
let DatD = document.getElementById("Data");
let unit = document.getElementById("sel");
let srn = 1;
let DataGm;
let table = document.getElementById("itemL");
let canvas;
let context;
let b = selection.map((a) => {
  return document.getElementById(a);
});
function GetD() {
  DataGm = 1000;
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
    case "N":
      DatD.value = DataGm / 1000 / 9.806;
      break;
    case "Pasc (N/m^2)":
      DatD.value = DataGm / 1000 / 9.806 / eval(prompt("area in m"));
      break;
    case "waterEq":
      DatD.value = DataGm / 1000 / 9.806;
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
b[0].onclick = () => {
  state='Weight';
  workSpace.innerHTML = `<label for="weight"><strong>${state}`+ tempLit;
  GetD();
  // does not get tale when clicked get gets disabled
};
b[1].onclick = () => {
  state='Impulse';
  workSpace.innerHTML = `<label for="weight"><strong>${state}`+ tempLit;
  GetD();
};
b[2].onclick = () => {
  //advanceServer eg
  // js draw?
  //80 hz to 1 hz save to a array
  let x=document.createElement('script');
  x.src="./plot.js";
  document.body.appendChild(x);
  b[3].disabled = false;
};
b[3].onclick = () => {
  //download
  alert("only in plotter!");
};
b[4].onclick = () => {
  let evalF = document.createElement("textarea");
  evalF.style = "height:500px;width:700px;font-size:17px;";
  evalF.setAttribute("id", "js");
  workSpace.append(evalF);
  let p = `
    <button type="button" id="eval" class="GenericFont">eval</button>
    <h4>Available variables :
    </h4>
    <ul>
    <li><strong>'DataGm'</strong>  availabe in Gm</li>
    <li><strong>'DatD'</strong>  availabe in Gm</li>
    <li><strong>'unit'</strong>  availabe in Gm</li>
    <li><strong>'workSpace'</strong>  workSpace</li>
    <li><strong>'GetD()'</strong>  available every second</li>
    <li><strong>'get()'</strong>   store to item list in weight mode</li>
    </ul>
    `;
  let x = document.createElement("div");
  x.innerHTML = p;
  x.style = "position:absolute;top:500px;left:85%;color:rgb(2, 56, 56);";
  workSpace.appendChild(x);
  document.getElementById("eval").onclick = () => {
    eval(document.getElementById("js").value);
  };
};
