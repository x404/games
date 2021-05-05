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
  const div = document.createElement("div");
  div.classList.add("cell");
  div.dataset.id = id;
  fragment.appendChild(div);
}

list.appendChild(fragment);

(function () {
  const FINISHCOUNT = 10;
  let start = false;
  let countSuccess = 0;
  let countError = 0;
  let timeout = +document.querySelector(".i-delay").value;
  let flag = false;
  let errorInput = false;

  const humanCountEl = document.querySelector("#human_count");
  const computerCountEl = document.querySelector("#computer_count");

  // =BLINK CELLS
  // let timer;
  let prevId;

  document.querySelector(".i-delay").addEventListener("keyup", function () {
    if (this.value < 0) {
      this.value = this.value.slice(1);
    }
  });

  document.querySelector(".btn-start").addEventListener("click", function () {
    timeout = +document.querySelector(".i-delay").value;
    if (timeout > 0 && typeof timeout === "number") {
      if (start) reset();
      if (errorInput && document.querySelectorAll(".error").length > 0)
        document.querySelector(".error").remove();
      // starting position
      const arr = Object.entries(objOfCells);
      const rnd = randomInteger(arr.length - 1);
      const _id = arr[rnd][1]._id;

      document.querySelector(".btn-start").classList.add("d-none");
      // set active cell
      document.querySelector(`[data-id="${_id}"]`).classList.add("cell-active");

      // start timer
      prevId = _id;
      timer = setInterval(blinkCell, timeout);
      start = true;
      errorInput = false;
    } else {
      if (!errorInput) {
        list.insertAdjacentHTML("beforeend", '<p class="error">Введите число больше нуля!</p>');
      }
      errorInput = true;
    }
  });

  // let out = "";
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
    const rnd = randomInteger(arr.length - 1);
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
  function randomInteger(max) {
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

      if (checkResult()) {
        clearInterval(timer);
        blinkCell();
        timer = setInterval(blinkCell, timeout);
      }

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

    updateCountElements(countSuccess, countError);

    if (countSuccess == FINISHCOUNT || countError == FINISHCOUNT) {
      console.log("%c- STOP GAME -", "color: red;font-weight:bold");
      // console.log(objOfCells);

      const newModal = new Modal(countSuccess, countError);
      newModal.show();

      clearInterval(timer);
      return false;
    }
    return true;
  }

  function updateCountElements(countSuccess, countError) {
    humanCountEl.textContent = countSuccess;
    computerCountEl.textContent = countError;
  }

  function reset() {
    for (let key in objOfCells) {
      objOfCells[key].success = false;
      objOfCells[key].error = false;
    }

    if (document.querySelectorAll(".cell-error").length > 0) {
      document.querySelectorAll(".cell-error").forEach((el) => {
        el.classList.remove("cell-error");
      });
    }

    if (document.querySelectorAll(".cell-success").length > 0) {
      document.querySelectorAll(".cell-success").forEach((el) => {
        el.classList.remove("cell-success");
      });
    }
    prevId = null;
    countSuccess = 0;
    countError = 0;

    updateCountElements(countSuccess, countError);
  }
})(objOfCells);

// Modal
class Modal {
  constructor(countSuccess, countError) {
    this.init();
    this.countSuccess = countSuccess;
    this.countError = countError;
  }

  init() {
    this.isOpened = false;
  }

  show() {
    const html = `
    <div class="modal">
      <div class="modal-inner">
        <p class="title">Score:</p>
        <div class="d-flex score">
          <div>You: ${this.countSuccess}</div>
          <div>Computer: ${this.countError}</div>
        </div>
        <button type="button" class="close">x</button>
      </div>
    </div>
    <div class="backdrop"></div>
    `;
    document.body.classList.add("modal-open");
    document.body.insertAdjacentHTML("beforeend", html);

    this.isOpened = true;
    this.eventsListeners();
  }

  close() {
    if (!this.isOpened) {
      return;
    }
    document.body.classList.remove("modal-open");
    document.querySelector(".backdrop").remove();
    document.querySelector(".modal").remove();
    document.querySelector(".btn-start").classList.remove("d-none");
    this.isOpened = false;
  }

  eventsListeners() {
    document.querySelector(".modal .close").addEventListener(
      "click",
      function (e) {
        this.close();
      }.bind(this)
    );

    window.addEventListener(
      "keydown",
      function (e) {
        if (e.key === "Escape") {
          this.close();
        }
      }.bind(this)
    );
  }
}
