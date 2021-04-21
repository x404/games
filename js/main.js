// create object and grid
let objOfCells = {};
const CELLCOUNTS = 100;
const fragment = document.createDocumentFragment();
const list = document.querySelector(".list");

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

(function () {
  const TIMEOUT = 1200; //ms
  const FINISHCOUNT = 10;
  let countSuccess = 0;
  let countError = 0;
  const humanCountEl = document.querySelector("#human_count");
  const computerCountEl = document.querySelector("#computer_count");

  let flag = false;

  // =BLINK CELLS
  let timer;
  let prevId;

  document.querySelector(".start").addEventListener("click", function () {
    // starting position
    const arr = Object.entries(objOfCells);
    const rnd = randomInteger(arr.length - 1, "start");
    const _id = arr[rnd][1]._id;

    // set active cell
    document.querySelector(`[data-id="${_id}"]`).classList.add("cell-active");

    // start timer
    prevId = _id;
    timer = setInterval(blinkCell, TIMEOUT);
  });

  let out = "";
  function blinkCell() {
    //  if cell was active and no pressed it
    if (!flag) {
      document.querySelector(".cell-active").classList.add("cell-error");
      document.querySelector(".cell-active").classList.remove("cell-active");

      updateStatusCellInObj(prevId, "error");
    }

    const arr = Object.entries(objOfCells).filter(
      (el) => el[1].error == false && el[1].success == false
    );

    if (arr.length === 0 || !checkResult()) {
      clearInterval(timer);
      return;
    }

    // select random element from array
    const rnd = randomInteger(arr.length - 1, " intimer");
    const _id = arr[rnd][1]._id;

    prevId = _id;
    if (countError < FINISHCOUNT && countSuccess < FINISHCOUNT) {
      // set active next cell in html
      document.querySelector(`[data-id="${_id}"]`).classList.add("cell-active");

      // console.log("arr[" + rnd + "][1]." + _id + "=", _id);
      // console.log("");
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
    // console.log("objOfCells[" + id + "][" + key + "]=", objOfCells[id][key]);
  }

  function checkResult() {
    countSuccess = Object.entries(objOfCells).filter((el) => el[1].success == true).length;
    countError = Object.entries(objOfCells).filter((el) => el[1].error == true).length;

    humanCountEl.textContent = countSuccess;
    computerCountEl.textContent = countError;

    if (countSuccess == FINISHCOUNT || countError == FINISHCOUNT) {
      console.log("%c- STOP GAME -", "color: red;font-weight:bold");
      // console.log(objOfCells);
      clearInterval(timer);
      return false;
    }
    return true;
  }
})(objOfCells);
