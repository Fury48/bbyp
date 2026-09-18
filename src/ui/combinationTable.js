import { combineStrengths } from "../data/combinations.js";
import { addStrength, addNormalItem, getInventory } from "../state/gameState.js";

export function initCombinationTable() {
  const modal = document.getElementById("combination-table");
  const selectA = document.getElementById("strength-a");
  const selectB = document.getElementById("strength-b");
  const combineBtn = document.getElementById("combine-btn");
  const resultEl = document.getElementById("combine-result");
  const closeBtn = document.getElementById("close-table");

  function fillOptions(select) {
    select.innerHTML = "";
    for (const name of getInventory()) {
      const opt = document.createElement("option");
      opt.value = name;
      opt.textContent = name;
      select.appendChild(opt);
    }
  }

  window.addEventListener("interact", (e) => {
    if (e.detail.zone !== "table") return;
    resultEl.textContent = "";
    fillOptions(selectA);
    fillOptions(selectB);
    modal.classList.remove("hidden");
  });

  combineBtn.addEventListener("click", () => {
    const a = selectA.value;
    const b = selectB.value;
    if (!a || !b || a === b) {
      resultEl.textContent = "서로 다른 강점 2개를 선택하세요.";
      return;
    }
    const result = combineStrengths(a, b);
    if (!result) {
      resultEl.textContent = "아직 알려진 조합이 없습니다.";
      return;
    }
    addStrength(result.name);
    if (result.item) addNormalItem(result.item);
    resultEl.textContent = result.item
      ? `[${result.name}] 획득! [${result.item}]도 손에 넣었다. ${result.reason}`
      : `[${result.name}] 획득! ${result.reason}`;
    fillOptions(selectA);
    fillOptions(selectB);
  });

  closeBtn.addEventListener("click", () => {
    modal.classList.add("hidden");
  });
}
