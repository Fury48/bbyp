import http from "node:http";
import { lookupFallback } from "../src/data/combinations.js";

const PORT = 3001;

// ponytail: this handler is the swap point for a real AI call (+ Supabase Edge Function later).
// It currently just serves the same fallback table the client already has, giving the
// client<->server interface a real network boundary to develop against.
const server = http.createServer((req, res) => {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Methods", "POST, OPTIONS");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type");

  if (req.method === "OPTIONS") {
    res.writeHead(204);
    res.end();
    return;
  }

  if (req.method === "POST" && req.url === "/api/combine") {
    let body = "";
    req.on("data", (chunk) => (body += chunk));
    req.on("end", () => {
      try {
        const { a, b } = JSON.parse(body);
        const result = lookupFallback(a, b);
        res.setHeader("Content-Type", "application/json");
        res.writeHead(200);
        res.end(JSON.stringify(result));
      } catch {
        res.writeHead(400);
        res.end(JSON.stringify({ error: "invalid request" }));
      }
    });
    return;
  }

  res.writeHead(404);
  res.end();
});

server.listen(PORT, () => {
  console.log(`combine server listening on http://localhost:${PORT}`);
});
