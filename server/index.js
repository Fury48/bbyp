import http from "node:http";
import { judgeAnswer, combineStrengths } from "./ai.js";
import { signup, login } from "./store.js";

const PORT = 3001;

function readJsonBody(req) {
  return new Promise((resolve, reject) => {
    let body = "";
    req.on("data", (chunk) => (body += chunk));
    req.on("end", () => {
      try {
        resolve(JSON.parse(body));
      } catch (err) {
        reject(err);
      }
    });
  });
}

function sendJson(res, status, data) {
  res.writeHead(status, { "Content-Type": "application/json" });
  res.end(JSON.stringify(data));
}

// ponytail: this is the swap point for Supabase Edge Functions later; routes stay the same shape.
const routes = {
  "POST /api/combine": async (req, res) => {
    const { strengths } = await readJsonBody(req);
    sendJson(res, 200, await combineStrengths(strengths));
  },
  "POST /api/judge-answer": async (req, res) => {
    const { question, answer } = await readJsonBody(req);
    sendJson(res, 200, await judgeAnswer(question, answer));
  },
  "POST /api/signup": async (req, res) => {
    const { username, password } = await readJsonBody(req);
    const result = signup(username, password);
    sendJson(res, result.ok ? 200 : 400, result);
  },
  "POST /api/login": async (req, res) => {
    const { username, password } = await readJsonBody(req);
    const result = login(username, password);
    sendJson(res, result.ok ? 200 : 400, result);
  },
};

const server = http.createServer(async (req, res) => {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Methods", "POST, OPTIONS");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type");

  if (req.method === "OPTIONS") {
    res.writeHead(204);
    res.end();
    return;
  }

  const handler = routes[`${req.method} ${req.url}`];
  if (!handler) {
    res.writeHead(404);
    res.end();
    return;
  }

  try {
    await handler(req, res);
  } catch {
    sendJson(res, 400, { error: "invalid request" });
  }
});

server.listen(PORT, () => {
  console.log(`local server listening on http://localhost:${PORT}`);
  console.log(
    process.env.OPENAI_API_KEY
      ? "OPENAI_API_KEY detected - using real AI."
      : "No OPENAI_API_KEY - using local fallback logic.",
  );
});
