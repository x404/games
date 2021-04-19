(function () {
  let arr = [];
  const fragment = document.createDocumentFragment();
  const list = document.querySelector(".list");
  const TIMEOUT = 1000;

  for (let i = 1; i <= 100; i++) {
    createObj(i);
    createGrid(i);
  }

  function createObj(id) {
    let obj = {};
    obj._id = id;
    obj.completed = false;
    arr.push(obj);
  }

  function createGrid(id) {
    let div = document.createElement("div");
    div.classList.add("cell");
    div.dataset.id = id;
    fragment.appendChild(div);
  }

  list.appendChild(fragment);

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
})();
