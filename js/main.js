(function () {
  let objOfCells = {};
  const fragment = document.createDocumentFragment();
  const list = document.querySelector(".list");
  const TIMEOUT = 1500;

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
  setInterval(function () {
    const rnd = randomInteger(1, 100);
    if (document.querySelectorAll(".cell-active").length > 0) {
      document.querySelector(".cell-active").classList.remove("cell-active");
    }

    document.querySelector(`[data-id="${rnd}"]`).classList.add("cell-active");
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
    const countSuccess = Object.entries(objOfCells).filter(
      (el) => el[1].success == true
    ).length;

    const countError = Object.entries(objOfCells).filter(
      (el) => el[1].error == true
    ).length;

    console.group("Count ================");
    console.log("success = ", countSuccess);
    console.log("error = ", countError);
    console.groupEnd();
  }
})();
