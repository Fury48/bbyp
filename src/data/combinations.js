const FALLBACK = {
  "글쓰기+코딩": {
    name: "기술 전달력",
    description: "복잡한 기술을 이해하고 다른 사람이 이해하기 쉽게 전달하는 능력",
    reason: "코딩과 글쓰기 능력을 함께 활용할 수 있습니다.",
    item: "화분",
  },
  "운동+코딩": {
    name: "자기관리력",
    description: "목표를 향해 꾸준히 스스로를 관리하는 능력",
    reason: "운동과 코딩 모두 꾸준함이 필요한 활동입니다.",
    item: "트로피",
  },
  "글쓰기+운동": {
    name: "전달력",
    description: "몸으로 익힌 감각을 글로 풀어 다른 사람에게 전달하는 능력",
    reason: "운동과 글쓰기 능력을 함께 활용할 수 있습니다.",
    item: "의자",
  },
};

// ponytail: local-only fallback; swap the lookup for a server AI call later without changing callers.
export function combineStrengths(a, b) {
  const key = [a, b].sort().join("+");
  return FALLBACK[key] ?? null;
}
