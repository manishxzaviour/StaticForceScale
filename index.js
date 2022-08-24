let weightD = `
<label for="weight"><strong>Reading:</strong></label><input type="number" step="any" id="Data" placeholder="000000000" style="font-size:20px ;">
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

let impulseD = `
<label for="pulse"><strong>Pulse:</strong></label><input type="number" id="Data" step="any" placeholder="000000000" style="font-size:20px ;">
                <br>
                <label for="sel"><strong>unit:</strong></label>
                <select id="sel">
                    <option selected>Gm</option>
                    <option>Kg</option>
                    <option>N</option>
                    <option>Pasc (N/m^2)</option>
                    <option>waterEq</option>
                </select>
                <button type="button" id="ref" onclick="GetD()">ref</button>`;
let plotD = `
          <h3>Graph T(s) vs F(N)</h3>
          <u>scale: 1 unit = 1 s & 1 N</u>
          <br />
          <br />
          <image id="graph" title="plot T v F"></image>
        `;
let selection = ["massB", "pulseB", "plotB", "downloadB", "evalB"];
let workSpace = document.getElementById("workSpace");
workSpace.innerHTML = weightD;
let DatD = document.getElementById("Data");
let unit = document.getElementById("sel");
let table = document.getElementById("itemL");
let srn = 0;
let DataGm;
let b = selection.map((a) => {
  return document.getElementById(a);
});
function GetD(){
    DataGm= 1000;
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
    unit.onchange=refD;
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
  workSpace.innerHTML = weightD;
  GetD();
  refD();
};
b[1].onclick = () => {
  workSpace.innerHTML = impulseD;
  GetD();
  refD();
};
b[2].onclick = () => {
    //advanceServer eg
  workSpace.innerHTML = plotD;
  b[3].disabled=false;
};
b[3].onclick=()=>{
    //download
    alert("only in plotter!");
}
b[4].onclick = () => {
    let evalF= document.createElement("textarea");
    evalF.style="height:500px;width:700px;font-size:17px;"
    evalF.setAttribute('id',"js")
    workSpace.append(evalF);
    let p=`
    <button type="button" id="eval" class="GenericFont">eval</button>
    <h4>Available variables :
    </h4>
    <ul>
    <li>'DataGm'  availabe in Gm</li>
    <li>'DatD'  availabe in Gm</li>
    <li>'unit'  availabe in Gm</li>
    <li>'GetD()'  available every second</li>
    <li>'get()'   store to item list in weight mode</li>
    </ul>
    `
    let x= document.createElement('div');
    x.innerHTML=p;
    workSpace.appendChild(x);
    document.getElementById("eval").onclick=()=>{eval(document.getElementById("js").value)};
  };
