import { combineStrengths } from "../data/combinations.js";
import { addStrength, addNormalItem, getInventory } from "../state/gameState.js";

const SLOT_COUNT = 9;

export function initCombinationTable() {
  const modal = document.getElementById("combination-table");
  const source = document.getElementById("craft-source");
  const grid = document.getElementById("craft-grid");
  const combineBtn = document.getElementById("combine-btn");
  const resultEl = document.getElementById("combine-result");
  const closeBtn = document.getElementById("close-table");

  let slots = Array(SLOT_COUNT).fill(null);

  function renderSource() {
    source.innerHTML = "";
    for (const name of new Set(getInventory())) {
      const chip = document.createElement("div");
      chip.className = "craft-chip";
      chip.textContent = name;
      chip.draggable = true;
      chip.addEventListener("dragstart", (e) => {
        e.dataTransfer.setData("text/plain", name);
      });
      source.appendChild(chip);
    }
  }

  function renderGrid() {
    grid.innerHTML = "";
    slots.forEach((item, index) => {
      const slot = document.createElement("div");
      slot.className = "craft-slot" + (item ? " filled" : "");
      slot.textContent = item ?? "";
      slot.addEventListener("dragover", (e) => e.preventDefault());
      slot.addEventListener("drop", (e) => {
        e.preventDefault();
        const name = e.dataTransfer.getData("text/plain");
        if (name) {
          slots[index] = name;
          renderGrid();
        }
      });
      slot.addEventListener("click", () => {
        if (slots[index]) {
          slots[index] = null;
          renderGrid();
        }
      });
      grid.appendChild(slot);
    });
  }

  window.addEventListener("interact", (e) => {
    if (e.detail.zone !== "table") return;
    slots = Array(SLOT_COUNT).fill(null);
    resultEl.textContent = "";
    renderSource();
    renderGrid();
    modal.classList.remove("hidden");
  });

  combineBtn.addEventListener("click", async () => {
    const filled = slots.filter(Boolean);
    const unique = [...new Set(filled)];
    if (filled.length !== 2 || unique.length !== 2) {
      resultEl.textContent = "칸에 서로 다른 강점 2개를 놓아주세요.";
      return;
    }
    const [a, b] = unique;
    resultEl.textContent = "조합 중...";
    const result = await combineStrengths(a, b);
    if (!result) {
      resultEl.textContent = "아직 알려진 조합이 없습니다.";
      return;
    }
    addStrength(result.name);
    if (result.item) addNormalItem(result.item);
    resultEl.textContent = result.item
      ? `[${result.name}] 획득! [${result.item}]도 손에 넣었다. ${result.reason}`
      : `[${result.name}] 획득! ${result.reason}`;
    slots = Array(SLOT_COUNT).fill(null);
    renderGrid();
  });

  closeBtn.addEventListener("click", () => {
    modal.classList.add("hidden");
  });
}
