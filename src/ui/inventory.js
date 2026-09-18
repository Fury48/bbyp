import { getInventory, getNormalItems } from "../state/gameState.js";

export function initInventory() {
  const panel = document.getElementById("inventory-panel");
  const strengthList = document.getElementById("inventory-list");
  const itemList = document.getElementById("normal-item-list");

  function renderList(el, names) {
    el.innerHTML = "";
    for (const name of names) {
      const li = document.createElement("li");
      li.textContent = name;
      el.appendChild(li);
    }
  }

  function render() {
    renderList(strengthList, getInventory());
    renderList(itemList, getNormalItems());
  }

  window.addEventListener("inventory-changed", render);
  window.addEventListener("toggle-inventory", () => {
    panel.classList.toggle("hidden");
  });
  document.getElementById("close-inventory").addEventListener("click", () => {
    panel.classList.add("hidden");
  });
  render();
}
