import { judgeFallback } from "./judgeFallback.js";

const API_URL = "http://localhost:3001/api/judge-answer";

// ponytail: local server stub for now; point API_URL at the Supabase Edge Function later, callers don't change.
export async function judgeAnswer(question, answer) {
  try {
    const res = await fetch(API_URL, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ question, answer }),
    });
    if (!res.ok) throw new Error("bad response");
    return await res.json();
  } catch {
    return judgeFallback(answer);
  }
}
