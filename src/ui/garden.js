import { getNormalItems, getGarden, setGardenCell } from "../state/gameState.js";

export function initGarden() {
  const modal = document.getElementById("garden");
  const select = document.getElementById("garden-item-select");
  const grid = document.getElementById("garden-grid");
  const closeBtn = document.getElementById("close-garden");

  function renderSelect() {
    select.innerHTML = "";
    const emptyOpt = document.createElement("option");
    emptyOpt.value = "";
    emptyOpt.textContent = "(비우기)";
    select.appendChild(emptyOpt);
    for (const name of new Set(getNormalItems())) {
      const opt = document.createElement("option");
      opt.value = name;
      opt.textContent = name;
      select.appendChild(opt);
    }
  }

  function renderGrid() {
    grid.innerHTML = "";
    getGarden().forEach((item, index) => {
      const cell = document.createElement("button");
      cell.className = "garden-cell";
      cell.textContent = item ?? "";
      cell.addEventListener("click", () => {
        setGardenCell(index, select.value);
        renderGrid();
      });
      grid.appendChild(cell);
    });
  }

  window.addEventListener("interact", (e) => {
    if (e.detail.zone !== "garden") return;
    renderSelect();
    renderGrid();
    modal.classList.remove("hidden");
  });

  closeBtn.addEventListener("click", () => {
    modal.classList.add("hidden");
  });
}
