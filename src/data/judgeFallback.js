const KEYWORD_MAP = [
  [["코딩", "개발", "프로그래밍"], "코딩"],
  [["글", "작문", "소설", "글쓰기"], "글쓰기"],
  [["운동", "헬스", "달리기", "축구"], "운동"],
  [["그림", "디자인", "그리기"], "그림"],
  [["분석", "숫자", "데이터"], "분석"],
  [["게임"], "게임"],
  [["계획", "정리"], "계획"],
  [["이야기", "스토리"], "이야기"],
];

const ITEM_POOL = ["화분", "꽃", "의자", "트로피", "액자"];

// Used by both src/data/judge.js (client, when the server is unreachable) and
// server/ai.js (when there's no OPENAI_API_KEY yet) - pure, no DOM/Node API.
export function judgeFallback(answer) {
  const found = KEYWORD_MAP.find(([keywords]) =>
    keywords.some((k) => answer.includes(k)),
  );
  return {
    strength: found ? found[1] : "숨은 재능",
    item: ITEM_POOL[Math.floor(Math.random() * ITEM_POOL.length)],
    reason: "이 답변에서 새로운 가능성이 엿보입니다.",
  };
}
