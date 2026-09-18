import { judgeFallback } from "../src/data/judgeFallback.js";
import { combineFallback } from "../src/data/combineFallback.js";

const OPENAI_URL = "https://api.openai.com/v1/chat/completions";
const MODEL = "gpt-4o-mini";

async function callOpenAI(systemPrompt, userPrompt) {
  const apiKey = process.env.OPENAI_API_KEY;
  if (!apiKey) throw new Error("no api key");
  const res = await fetch(OPENAI_URL, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${apiKey}`,
    },
    body: JSON.stringify({
      model: MODEL,
      response_format: { type: "json_object" },
      messages: [
        { role: "system", content: systemPrompt },
        { role: "user", content: userPrompt },
      ],
    }),
  });
  if (!res.ok) throw new Error(`openai error ${res.status}`);
  const data = await res.json();
  return JSON.parse(data.choices[0].message.content);
}

const JUDGE_SYSTEM = `당신은 자기계발 게임 "생각의 책"의 AI입니다.
플레이어가 자기 탐색 질문에 자유롭게 답변하면, 그 답변에서 드러나는 강점 하나를 뽑아주세요.
규칙:
- 직업명을 강점으로 쓰지 않는다 (예: "개발자" 금지, "코딩" 사용).
- 심리 진단이나 부정적 평가를 하지 않는다.
- 강점 이름은 두 단어 이내로 짧게.
- item은 정원을 꾸밀 소품 이름 하나 (예: 화분, 꽃, 의자, 트로피, 액자 등).
- reason은 한 문장, 가능성으로 표현("~할 수 있습니다" 톤), 짧고 긍정적으로.
JSON으로만 답하세요: {"strength": "...", "item": "...", "reason": "..."}`;

// ponytail: no OPENAI_API_KEY yet -> same fallback the client uses when this server is unreachable,
// so behavior is consistent whichever path fires. Real key -> real AI, transparently.
export async function judgeAnswer(question, answer) {
  try {
    return await callOpenAI(JUDGE_SYSTEM, `질문: ${question}\n답변: ${answer}`);
  } catch {
    return judgeFallback(answer);
  }
}

const COMBINE_SYSTEM = `당신은 자기계발 게임 "조합대"의 AI입니다.
플레이어가 가진 강점 2~3개를 조합해서 새로운 복합 강점 하나를 제안하세요.
규칙:
- 직업명을 반환하지 않는다 (예: "코딩+글쓰기 -> 개발자" 금지).
- 심리 진단을 하지 않는다.
- 입력된 강점 모두와 관련되어야 한다.
- 이름은 짧고 이해하기 쉽게.
- 절대적인 사실이 아닌 가능성으로 표현한다("~할 수 있습니다" 톤).
- 부정적인 평가를 하지 않는다.
- item은 정원을 꾸밀 소품 이름 하나 (예: 화분, 꽃, 의자, 트로피, 액자 등).
JSON으로만 답하세요: {"name": "...", "description": "...", "reason": "...", "item": "..."}`;

export async function combineStrengths(strengths) {
  try {
    return await callOpenAI(COMBINE_SYSTEM, `강점: ${strengths.join(", ")}`);
  } catch {
    return combineFallback(strengths);
  }
}
