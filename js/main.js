(function () {
  let objOfCells = {};
  const fragment = document.createDocumentFragment();
  const list = document.querySelector(".list");
  const TIMEOUT = 1000;
  let countSuccess = 0;
  let countError = 0;
  const humanCountEl = document.querySelector("#human_count");
  const computerCountEl = document.querySelector("#computer_count");

  // create object and grid
  for (let i = 1; i <= 100; i++) {
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
  let timer = setInterval(function () {
    const rndId = randomInteger(1, 100);
    if (document.querySelectorAll(".cell-active").length > 0) {
      document.querySelector(".cell-active").classList.add("cell-error");
      document.querySelector(".cell-active").classList.remove("cell-active");
      updateStatusCellInObj(rndId, "error");
      checkResult();
    }

    if (countError < 10 && countSuccess < 10) {
      document
        .querySelector(`[data-id="${rndId}"]`)
        .classList.add("cell-active");
    }
  }, TIMEOUT);

  function randomInteger(min, max) {
    let rand = min + Math.random() * (max + 1 - min);
    return Math.floor(rand);
  }

  //click cell
  document.querySelector(".list").addEventListener("click", function (e) {
    const target = e.target;
    if (target.classList.contains("cell-active")) {
      const id = target.dataset.id;
      updateStatusCellInObj(id, "success");
      checkResult();

      target.classList.remove("cell-active");
      target.classList.add("cell-success");
    }
  });

  function updateStatusCellInObj(id, key) {
    objOfCells[id][key] = true;
  }

  function checkResult() {
    countSuccess = Object.entries(objOfCells).filter(
      (el) => el[1].success == true
    ).length;

    countError = Object.entries(objOfCells).filter((el) => el[1].error == true)
      .length;

    humanCountEl.textContent = countSuccess;
    computerCountEl.textContent = countError;

    if (countSuccess == 10 || countError == 10) {
      clearInterval(timer);
    }

    console.group("Count ================");
    console.log("success = ", countSuccess);
    console.log("error = ", countError);
    console.groupEnd();
  }
})();
