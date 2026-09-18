import { QUESTIONS } from "../data/questions.js";
import { addStrength, hasStrength } from "../state/gameState.js";

export function initThoughtBook() {
  const modal = document.getElementById("thought-book");
  const list = document.getElementById("question-list");
  const closeBtn = document.getElementById("close-book");

  function render() {
    list.innerHTML = "";
    for (const q of QUESTIONS) {
      const btn = document.createElement("button");
      const answered = hasStrength(q.strength);
      btn.textContent = answered ? `${q.text} (완료)` : q.text;
      btn.disabled = answered;
      btn.addEventListener("click", () => {
        addStrength(q.strength);
        render();
      });
      list.appendChild(btn);
    }
  }

  window.addEventListener("interact", (e) => {
    if (e.detail.zone !== "book") return;
    render();
    modal.classList.remove("hidden");
  });

  closeBtn.addEventListener("click", () => {
    modal.classList.add("hidden");
  });
}
