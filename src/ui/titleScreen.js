const API_BASE = "http://localhost:3001";

export function initTitleScreen(onStart) {
  const titleScreen = document.getElementById("title-screen");
  const authRow = document.querySelector(".auth-row");
  const loginForm = document.getElementById("login-form");
  const signupForm = document.getElementById("signup-form");
  const authMessage = document.getElementById("auth-message");
  const welcomeBack = document.getElementById("welcome-back");
  const welcomeUsername = document.getElementById("welcome-username");
  const startBtn = document.getElementById("start-game-btn");
  const logoutBtn = document.getElementById("logout-btn");

  function showWelcome(username) {
    authRow.classList.add("hidden");
    authMessage.textContent = "";
    welcomeBack.classList.remove("hidden");
    welcomeUsername.textContent = username;
  }

  function showAuthForms() {
    authRow.classList.remove("hidden");
    welcomeBack.classList.add("hidden");
  }

  async function callAuth(path, username, password) {
    const res = await fetch(`${API_BASE}${path}`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ username, password }),
    });
    return res.json();
  }

  loginForm.addEventListener("submit", async (e) => {
    e.preventDefault();
    const username = document.getElementById("login-username").value.trim();
    const password = document.getElementById("login-password").value;
    authMessage.textContent = "확인 중...";
    try {
      const result = await callAuth("/api/login", username, password);
      if (!result.ok) {
        authMessage.textContent = result.error || "로그인에 실패했습니다.";
        return;
      }
      localStorage.setItem("bypp-user", result.username);
      showWelcome(result.username);
    } catch {
      authMessage.textContent =
        "서버에 연결할 수 없습니다. (npm run server 실행 확인)";
    }
  });

  signupForm.addEventListener("submit", async (e) => {
    e.preventDefault();
    const username = document.getElementById("signup-username").value.trim();
    const password = document.getElementById("signup-password").value;
    authMessage.textContent = "가입 중...";
    try {
      const result = await callAuth("/api/signup", username, password);
      if (!result.ok) {
        authMessage.textContent = result.error || "회원가입에 실패했습니다.";
        return;
      }
      localStorage.setItem("bypp-user", result.username);
      showWelcome(result.username);
    } catch {
      authMessage.textContent =
        "서버에 연결할 수 없습니다. (npm run server 실행 확인)";
    }
  });

  startBtn.addEventListener("click", () => {
    titleScreen.classList.add("hidden");
    onStart(localStorage.getItem("bypp-user"));
  });

  logoutBtn.addEventListener("click", () => {
    localStorage.removeItem("bypp-user");
    showAuthForms();
  });

  const existingUser = localStorage.getItem("bypp-user");
  if (existingUser) {
    showWelcome(existingUser);
  }
}
