export type DeckSlug = "icebreak" | "balance" | "word" | "custom";
export type Category = "icebreak" | "balance" | "word";

export const CUSTOM_LIST_KEY = "sharing-cards:custom:list";

export interface Question {
  id: string;
  text: string;
  hint?: string;
  options?: { a: string; b: string };
}

export interface Deck {
  slug: DeckSlug;
  name: string;
  tagline: string;
  icon: string;
  mode: "draw" | "sequence";
  skin: string;
  questions: Question[];
}

const icebreak: Question[] = [
  { id: "ice-1", text: "지금 핸드폰 잠금 화면 보여줄 수 있나요?" },
  { id: "ice-2", text: "들어본 칭찬 중 가장 기억에 남는 것 딱 한 개만!" },
  { id: "ice-3", text: "최근에 스스로 “아, 나 귀엽네” 했던 순간 있어요?" },
  { id: "ice-4", text: "내 삶에 큰 영향 준 사람 한 명을 꼽는다면 누구예요?" },
  { id: "ice-5", text: "하나님께 꼭 물어보고 싶은 질문은?" },
  { id: "ice-6", text: "나를 지금 이 자리까지 오게 한 결정 중 가장 중요한 건?" },
  { id: "ice-7", text: "이번 주 내 소확행은?" },
  { id: "ice-8", text: "요즘 내 마음을 표현한다면 어떤 색이에요?" },
  { id: "ice-9", text: "취미나 요즘 제일 관심사는?" },
  { id: "ice-10", text: "최근에 설렜던 순간이 있다면?" },
  { id: "ice-11", text: "요즘 가방이나 주머니에 항상 갖고 다니는 물건은?" },
  { id: "ice-12", text: "최근에 본 콘텐츠(드라마·영화·유튜브) 중 추천하고 싶은 건?" },
  { id: "ice-13", text: "나만의 스트레스 푸는 소소한 방법은?" },
  { id: "ice-14", text: "내가 제일 자신 있는 ‘작은 능력’은?" },
  { id: "ice-15", text: "시간과 돈 상관없이 당장 떠날 수 있다면 가고 싶은 나라는?" },
  { id: "ice-16", text: "주변 사람들이 내게 가장 자주 하는 말은?" },
  { id: "ice-17", text: "올해 내 마음을 무겁게 하는 건 무엇인가요?" },
  { id: "ice-18", text: "이상형을 세 단어로 표현한다면?" },
  { id: "ice-19", text: "올해 초에 했던 다짐은? 이루었나요?" },
  { id: "ice-20", text: "올해 새롭게 생긴 관계 중 나에게 의미 있었던 관계는?" },
];

const balance: Question[] = [
  {
    id: "bal-1",
    text: "내가 바라는 신앙 공동체는?",
    options: { a: "따뜻한 위로의 공동체", b: "함께 도전하는 공동체" },
  },
  {
    id: "bal-2",
    text: "하나님께 단 하나만 구할 수 있다면?",
    options: { a: "평안", b: "열정" },
  },
  {
    id: "bal-3",
    text: "어떤 사람에게 마음이 가나요?",
    options: { a: "나랑 닮은 사람", b: "나랑 완전 다른 사람" },
  },
  {
    id: "bal-4",
    text: "기쁨을 고를 수 있다면?",
    options: { a: "작은 기쁨 자주", b: "큰 기쁨 가득" },
  },
];

const word: Question[] = [
  {
    id: "word-1",
    text: "“함께 지어져 간다”는 말을 들었을 때 떠오르는 이미지나 느낌은 어떤가요?",
    hint: "예: 건축, 퍼즐, 팀플, 관계 등",
  },
  {
    id: "word-2",
    text: "오늘 새로 알게 된 사람 중 기억에 남는 한 가지는?",
    hint: "긍정적인 것으로 나눠주세요!",
  },
  {
    id: "word-3",
    text: "“성령 안에서 함께 지어져 간다”는 말씀은 공동체의 성장이 단순히 사람의 노력만으로 되는 게 아니라는 의미입니다. 내가 공동체의 일원으로서 가장 감사하게 느끼는 순간은 언제인가요?",
  },
  {
    id: "word-4",
    text: "‘함께 지어져 가는’ 과정 속에서 나는 어떤 부분을 더 세워가야 할까요?",
    hint: "예: 협력, 용서, 헌신, 관계, 인내 등",
  },
  {
    id: "word-5",
    text: "우리 공동체가 ‘하나님이 거하실 처소’로 세워지기 위해, 이번 주에 함께 시도해볼 수 있는 작은 실천 한 가지는 무엇일까요?",
  },
];

export const decks: Deck[] = [
  {
    slug: "icebreak",
    name: "아이스브레이킹",
    tagline: "서로를 알아가는 스무 가지 질문",
    icon: "/assets/icon-icebreak.png",
    mode: "draw",
    skin: "skin-icebreak",
    questions: icebreak,
  },
  {
    slug: "balance",
    name: "밸런스 게임",
    tagline: "당신의 선택은? 네 가지 갈림길",
    icon: "/assets/icon-balance.png",
    mode: "draw",
    skin: "skin-balance",
    questions: balance,
  },
  {
    slug: "word",
    name: "말씀 나눔",
    tagline: "‘함께 지어져 간다’ 다섯 걸음",
    icon: "/assets/icon-word.png",
    mode: "sequence",
    skin: "skin-word",
    questions: word,
  },
];

export interface CustomQuestion extends Question {
  category: Category;
}

const isCategory = (c: unknown): c is Category =>
  c === "icebreak" || c === "balance" || c === "word";

/* 클라이언트 전용: 브라우저에 저장된 내 질문 불러오기 (구버전 데이터는 아이스브레이킹으로 분류) */
export function loadCustomQuestions(): CustomQuestion[] {
  try {
    const raw = localStorage.getItem(CUSTOM_LIST_KEY);
    if (!raw) return [];
    const list: unknown = JSON.parse(raw);
    if (!Array.isArray(list)) return [];
    return list
      .filter(
        (q): q is { id?: string; text: string; category?: unknown; options?: { a: string; b: string } } =>
          !!q && typeof q.text === "string" && q.text.trim().length > 0
      )
      .map((q) => ({
        id: typeof q.id === "string" ? q.id : crypto.randomUUID(),
        text: q.text,
        category: isCategory(q.category) ? q.category : "icebreak",
        options: q.options,
      }));
  } catch {
    return [];
  }
}

export const verse =
  "너희도 성령 안에서 하나님이 거하실 처소가 되기 위하여 그리스도 예수 안에서 함께 지어져 가느니라";
export const verseRef = "에베소서 2:22";
