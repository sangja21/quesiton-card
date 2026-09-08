import type { Category, CustomQuestion } from "@/lib/questions";

/* 질문 목록 ↔ URL-safe base64 (클라이언트 전용: btoa/atob 사용) */

interface Packed {
  c: Category;
  t: string;
  a?: string;
  b?: string;
}

const isCategory = (c: unknown): c is Category =>
  c === "icebreak" || c === "balance" || c === "word";

export function encodeQuestions(questions: CustomQuestion[]): string {
  const packed: Packed[] = questions.map((q) => ({
    c: q.category,
    t: q.text,
    ...(q.options ? { a: q.options.a, b: q.options.b } : {}),
  }));
  const bytes = new TextEncoder().encode(JSON.stringify(packed));
  let bin = "";
  bytes.forEach((byte) => {
    bin += String.fromCharCode(byte);
  });
  return btoa(bin).replace(/\+/g, "-").replace(/\//g, "_").replace(/=+$/, "");
}

export function decodeQuestions(encoded: string): CustomQuestion[] | null {
  try {
    const b64 = encoded.replace(/-/g, "+").replace(/_/g, "/");
    const bin = atob(b64);
    const bytes = Uint8Array.from(bin, (c) => c.charCodeAt(0));
    const packed: unknown = JSON.parse(new TextDecoder().decode(bytes));
    if (!Array.isArray(packed)) return null;
    const questions: CustomQuestion[] = [];
    packed.forEach((item, i) => {
      // 구버전 링크(문자열 배열)도 열 수 있게 유지
      if (typeof item === "string" && item.trim()) {
        questions.push({ id: `shared-${i}`, text: item, category: "icebreak" });
        return;
      }
      if (!item || typeof item.t !== "string" || !item.t.trim()) return;
      questions.push({
        id: `shared-${i}`,
        text: item.t,
        category: isCategory(item.c) ? item.c : "icebreak",
        options:
          typeof item.a === "string" && typeof item.b === "string"
            ? { a: item.a, b: item.b }
            : undefined,
      });
    });
    return questions.length > 0 ? questions : null;
  } catch {
    return null;
  }
}
