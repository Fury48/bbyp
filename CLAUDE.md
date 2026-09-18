# 2026 BYPP Hackathon

## 1. Project Goal

Stardew Valley 감성의 **2D Top-Down 자기계발 웹게임**.

핵심 목표:

> **게임 플레이를 통해 자기계발을 하고, 현실의 나 자신을 알아가는 경험을 만든다.**

자기계발 콘텐츠를 읽거나 공부하게 하는 것이 아니라, 자기 탐색 자체를 게임 플레이로 만든다.

현재 최우선 목표는 **싱글플레이 핵심 루프 완성**이다.

---

## 2. Core Game Loop

```text
집에서 시작
↓
책상 위 '생각의 책' 열기
↓
나 자신에 대한 질문에 답하기
↓
[코딩], [글쓰기], [운동] 등의 강점 아이템 획득
↓
조합대로 이동
↓
강점 2개 조합
↓
새로운 복합 강점 발견
↓
게임 활동 및 아이템 획득
↓
마당 꾸미기
```

플레이어의 기본 공간은 **집 + 마당/정원**이다.

대규모 월드는 구현하지 않는다.

---

## 3. 생각의 책

게임의 본격적인 시작점.

책을 펼치면 자신을 돌아볼 수 있는 질문이 나온다.

예:

* 다른 사람보다 쉽게 해낸다고 느끼는 것은?
* 사람들이 자주 나에게 부탁하는 것은?
* 시간 가는 줄 모르고 하는 것은?
* 다른 사람에게 하나를 가르친다면 무엇인가?
* 내가 평균 이상이라고 생각하는 분야는?
* 앞으로 더 잘할 가능성이 있다고 생각하는 것은?

모든 질문에 답할 필요는 없으며 일부는 건너뛸 수 있다.

답변을 통해 강점 아이템을 획득한다.

```text
"코딩을 잘한다" → [코딩]
"글을 잘 쓴다" → [글쓰기]
"운동을 잘한다" → [운동]
```

강점 아이템은 **소모되지 않고 계속 사용할 수 있다.**

---

## 4. 조합대

이 게임의 핵심 시스템.

플레이어는 보유한 강점 2개를 조합할 수 있다.

```text
[코딩] + [글쓰기]
↓
[기술 전달력]
```

AI의 역할은 **직업 추천이 아니라 새로운 복합 강점의 가능성을 제안하는 것**이다.

잘못된 예:

```text
코딩 + 글쓰기 → 개발자
```

좋은 예:

```text
코딩 + 글쓰기 → 기술 전달력
분석 + 게임 → 전략적 사고
운동 + 계획 → 자기관리력
그림 + 이야기 → 시각적 스토리텔링
```

AI 결과는 사용자를 확정적으로 진단하지 않는다.

### AI Response

가능하면 구조화된 JSON을 사용한다.

```json
{
  "name": "기술 전달력",
  "description": "복잡한 기술을 이해하고 다른 사람이 이해하기 쉽게 전달하는 능력",
  "reason": "코딩과 글쓰기 능력을 함께 활용할 수 있습니다."
}
```

규칙:

* 직업명을 반환하지 않는다.
* 심리 진단을 하지 않는다.
* 두 입력 강점 모두와 관련되어야 한다.
* 짧고 이해하기 쉽게 반환한다.
* 부정적인 평가를 하지 않는다.
* 절대적인 사실이 아닌 가능성으로 표현한다.

AI 실패 시 fallback 데이터를 사용하며 게임 진행을 막지 않는다.

---

## 5. Inventory & Garden

아이템은 크게 두 종류이다.

```text
Strength Items
예시:
- 코딩
- 글쓰기
- 기술 전달력
등등

Normal Items
예시:
- 꽃
- 화분
- 의자
- 트로피
```

강점 아이템은 자기 탐색/조합에 사용한다.

일반 아이템은 마당 꾸미기에 사용한다.

정원은 단순 장식 공간이 아니라:

> **플레이어의 활동과 성장 기록이 시각적으로 쌓이는 공간**

이어야 한다.

초기 구현은 단순한 Grid 배치 정도로 충분하다.

---

## 6. Social Features — Later

싱글플레이가 완성되기 전에는 구현하지 않는다.

향후 다른 플레이어의 정원에 방문할 수 있다.

실시간 멀티플레이가 아니라 저장된 Garden State를 불러오는 방식이다.

```text
Player A Garden 저장
↓
Player B가 Snapshot 로드
↓
Player B가 혼자 탐색
```

방문자는 방문록에:

> "내가 생각하는 이 사람의 장점"

을 작성할 수 있다.

실시간 위치 동기화, WebSocket 등은 필요 없다.

---

# 7. Tech Stack

### Game

* Phaser 3
* Vite
* JavaScript

### UI

* HTML + CSS + Vanilla JavaScript DOM

Phaser:

* 게임 월드
* 이동
* 충돌
* 카메라
* 오브젝트 상호작용

DOM:

* 생각의 책
* 질문 입력
* 인벤토리
* 조합창
* 로그인
* Modal

React는 현재 사용하지 않는다.

### Data

초기:

```text
JavaScript State + localStorage
```

싱글플레이 핵심 기능 완성 후:

```text
Supabase
- Authentication
- PostgreSQL
- Player Profile
- Inventory
- Garden State
- Guestbook
```

### AI

게임 내부에서는 provider와 분리된 인터페이스를 사용한다.

```javascript
combineStrengths(strengthA, strengthB)
```

API Secret은 Frontend에 넣지 않는다.

서버 측 endpoint / Supabase Edge Function 등을 사용한다.

### Deployment

* Frontend: Vercel
* Backend: Supabase

---

# 8. Development Order

**최종 사용자 흐름과 개발 순서는 다르다.**

로그인부터 만들지 않는다.

반드시 핵심 게임 플레이부터 완성한다.

### Phase 1 — Playable World

```text
Phaser 실행
→ 집 + 마당
→ Player
→ WASD 이동
→ Collision
→ E 상호작용
```

### Phase 2 — Thought Book

```text
책 접근
→ E
→ 책 UI
→ 질문
→ 답변
```

### Phase 3 — Strength System

```text
답변
→ 강점 획득
→ Inventory 저장
```

### Phase 4 — Combination Table

처음에는 AI 없이 fallback 데이터로 구현한다.

```text
[코딩] + [글쓰기]
→ [기술 전달력]
```

### Phase 5 — First Vertical Slice

다음 흐름을 완전히 연결한다.

```text
게임 시작
→ 책
→ 질문
→ 강점 2개 획득
→ 조합대로 이동
→ 두 강점 조합
→ 복합 강점 획득
→ 인벤토리 확인
```

**이 루프가 안정적으로 작동하기 전에는 큰 기능을 추가하지 않는다.**

### Phase 6 — Garden

일반 아이템 획득 및 간단한 정원 배치.

### Phase 7 — Save

localStorage에 다음을 저장한다.

* 강점
* 복합 강점
* 인벤토리
* 정원 상태
* 책 진행 상태

### Phase 8 — AI

fallback 조합을 실제 AI API로 확장한다.

fallback은 제거하지 않는다.

### Phase 9 — Authentication / DB

Supabase 로그인 및 데이터 저장을 연결한다.

### Phase 10 — Polish

핵심 기능 안정화 후:

* 최종 에셋 적용
* Pixel UI
* Animation
* Sound
* BGM
* Camera 개선

### Phase 11 — Social

싱글플레이가 완성된 이후:

```text
Garden Snapshot
→ Share
→ Visit
→ Guestbook
```

---

# 9. Asset Policy

현재는 **기능 구현이 그래픽보다 우선**이다.

최종 에셋은 핵심 기능 완성 이후 별도로 제작한다.

따라서:

* 외부 에셋을 임의로 다운로드하지 않는다.
* 이미지/SVG/Sprite를 불필요하게 대량 생성하지 않는다.
* 단색 사각형, 텍스트 등 최소 placeholder만 사용한다.
* placeholder 디자인을 다듬는 데 시간을 쓰지 않는다.
* 게임 로직과 에셋을 분리한다.
* 특정 임시 이미지 크기에 로직이 의존하지 않게 한다.

```text
기능 완성
→ 안정화
→ 최종 에셋 제작
→ 에셋 교체
→ 연출 개선
```

---

# 10. Do NOT Build Yet

현재 구현하지 않는다.

* 실시간 Multiplayer
* WebSocket
* 대규모 월드
* 농사
* 전투
* 상점 / 경제
* NPC AI / 호감도
* 복잡한 퀘스트
* Skill Tree
* 복잡한 Crafting
* 자체 게임 엔진
* 자체 Auth
* Redux
* ECS
* Microservices
* 불필요한 Architecture

---

# 11. Claude Code Rules

1. **MVP First**

   * 핵심 게임 루프와 관계없는 기능은 미룬다.

2. **One Feature at a Time**

   * 한 번에 여러 핵심 시스템을 구현하지 않는다.

3. **Do Not Overengineer**

   * 필요 없는 abstraction, manager, pattern을 만들지 않는다.

4. **Preserve Working Features**

   * 새 기능 때문에 정상 기능을 깨뜨리지 않는다.

5. **No Unrequested Features**

   * 요구되지 않은 기능을 임의로 추가하지 않는다.

6. **Small Changes**

   * 관련 있는 파일만 읽고 수정한다.
   * 큰 리팩터링보다 작은 변경을 선호한다.

7. **Assets Later**

   * 현재는 placeholder만 사용한다.

8. **Never Expose Secrets**

   * API Key 및 Secret을 Frontend에 넣지 않는다.

---

# 12. First MVP Definition

다음 시나리오가 오류 없이 실행되면 첫 MVP가 완성된 것이다.

```text
Player Spawn
↓
생각의 책 열기
↓
질문에 답하기
↓
[코딩] 획득
↓
다른 질문
↓
[글쓰기] 획득
↓
조합대로 이동
↓
[코딩] + [글쓰기]
↓
[기술 전달력] 획득
↓
Inventory에서 확인
```

이 시나리오가 완성되기 전까지 새로운 대규모 기능을 추가하지 않는다.
