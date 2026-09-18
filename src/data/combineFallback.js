const ITEM_POOL = ["화분", "꽃", "의자", "트로피", "액자"];

// Used by both src/data/combinations.js (client, when the server is unreachable) and
// server/ai.js (when there's no OPENAI_API_KEY yet) - pure, no DOM/Node API.
export function combineFallback(strengths) {
  return {
    name: `${strengths.join(" + ")} 융합 강점`,
    description: "여러 강점이 만나 새로운 가능성을 만듭니다.",
    reason: `${strengths.join(", ")} 능력을 함께 활용할 수 있습니다.`,
    item: ITEM_POOL[Math.floor(Math.random() * ITEM_POOL.length)],
  };
}
