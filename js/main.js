//(function () {
let objOfCells = {};
const fragment = document.createDocumentFragment();
const list = document.querySelector(".list");
const TIMEOUT = 1200;
const FINISHCOUNT = 2;
const CELLCOUNTS = 5;
let countSuccess = 0;
let countError = 0;
const humanCountEl = document.querySelector("#human_count");
const computerCountEl = document.querySelector("#computer_count");

let flag = false;

// create object and grid
for (let i = 1; i <= CELLCOUNTS; i++) {
  createObj(i);
  renderGrid(i);
}

function createObj(id) {
  let obj = {};
  obj._id = id;
  obj.success = false;
  obj.error = false;

  objOfCells[id] = obj;
}

function renderGrid(id) {
  let div = document.createElement("div");
  div.classList.add("cell");
  div.dataset.id = id;
  fragment.appendChild(div);
}

list.appendChild(fragment);

// blink cells
let timer;
let prevId;

document.querySelector(".start").addEventListener("click", function () {
  const arr = Object.entries(objOfCells);
  const rnd = randomInteger(arr.length - 1, "start");
  const _id = arr[rnd][1]._id;

  document.querySelector(`[data-id="${_id}"]`).classList.add("cell-active");

  // start timer
  prevId = _id;
  timer = setInterval(fn, TIMEOUT);
});

let out = "";
function fn() {
  // если ячейчка была активной и на нее не нажали
  // if (document.querySelectorAll(".cell-active").length > 0) {
  if (!flag) {
    document.querySelector(".cell-active").classList.add("cell-error");
    document.querySelector(".cell-active").classList.remove("cell-active");

    // обновляем объект и устанавливаем предыдующему элементу объекта - error=true
    updateStatusCellInObj(prevId, "error");

    document.querySelector("#ids").textContent += prevId + " ";
  }

  const arr = Object.entries(objOfCells).filter(
    (el) => el[1].error == false && el[1].success == false
  );
  console.log(arr);

  if (arr.length === 0) clearInterval(timer);

  // получаем случайный элемент из вновь сформированного массива
  const rnd = randomInteger(arr.length - 1, " intimer");
  const _id = arr[rnd][1]._id;

  checkResult();

  console.log(prevId, _id);

  if (prevId == _id) {
    console.error("previd = _id");
  }

  prevId = _id;
  if (countError < FINISHCOUNT && countSuccess < FINISHCOUNT) {
    console.log("arr[" + rnd + "][1]." + _id + "=", _id);
    console.log("");

    // делаем активную следующую клетку
    document.querySelector(`[data-id="${_id}"]`).classList.add("cell-active");
  }
  flag = false;
}

// random number
function randomInteger(max, st) {
  let rand = Math.floor(Math.random() * (max + 1));
  return rand;
}

//click cell
document.querySelector(".list").addEventListener("click", function (e) {
  const target = e.target;
  if (target.classList.contains("cell-active")) {
    const id = target.dataset.id;
    flag = true;
    updateStatusCellInObj(id, "success");
    checkResult();

    target.classList.remove("cell-active");
    target.classList.add("cell-success");
  }
});

function updateStatusCellInObj(id, key) {
  objOfCells[id][key] = true;
  console.log("objOfCells[" + id + "][" + key + "]=", objOfCells[id][key]);
}

function checkResult() {
  countSuccess = Object.entries(objOfCells).filter((el) => el[1].success == true).length;
  countError = Object.entries(objOfCells).filter((el) => el[1].error == true).length;

  humanCountEl.textContent = countSuccess;
  computerCountEl.textContent = countError;

  if (countSuccess == FINISHCOUNT || countError == FINISHCOUNT) {
    console.log("- STOP GAME -");
    console.log(objOfCells);
    clearInterval(timer);
  }
}
//})();
