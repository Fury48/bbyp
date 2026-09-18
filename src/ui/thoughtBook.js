import { QUESTIONS } from "../data/questions.js";
import { judgeAnswer } from "../data/judge.js";
import {
  addStrength,
  addNormalItem,
  isQuestionAnswered,
  markQuestionAnswered,
} from "../state/gameState.js";

export function initThoughtBook() {
  const modal = document.getElementById("thought-book");
  const list = document.getElementById("question-list");
  const closeBtn = document.getElementById("close-book");

  function render() {
    list.innerHTML = "";
    for (const question of QUESTIONS) {
      const card = document.createElement("div");
      card.className = "question-card";

      const label = document.createElement("p");
      label.textContent = question;
      card.appendChild(label);

      if (isQuestionAnswered(question)) {
        const done = document.createElement("p");
        done.className = "question-done";
        done.textContent = "답변 완료";
        card.appendChild(done);
        list.appendChild(card);
        continue;
      }

      const textarea = document.createElement("textarea");
      textarea.rows = 2;
      card.appendChild(textarea);

      const submitBtn = document.createElement("button");
      submitBtn.className = "question-btn";
      submitBtn.textContent = "답변하기";
      submitBtn.addEventListener("click", async () => {
        const answer = textarea.value.trim();
        if (!answer) return;
        submitBtn.disabled = true;
        submitBtn.textContent = "생각하는 중...";
        const result = await judgeAnswer(question, answer);
        addStrength(result.strength);
        if (result.item) addNormalItem(result.item);
        markQuestionAnswered(question);
        render();
      });
      card.appendChild(submitBtn);

      list.appendChild(card);
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
