"use client";

import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import { useSearchParams } from "next/navigation";
import { DrawDeck } from "@/components/DeckView";
import type { Category, CustomQuestion, Deck } from "@/lib/questions";
import { CUSTOM_LIST_KEY, decks, loadCustomQuestions } from "@/lib/questions";
import { decodeQuestions, encodeQuestions } from "@/lib/share";

const categoryOf = (slug: Category) => decks.find((d) => d.slug === slug)!;

export default function CustomView() {
  const shared = useSearchParams().get("q");
  if (shared) return <SharedDeck encoded={shared} />;
  return <MyCards />;
}

/* ── 내 질문 만들기: 카테고리를 골라 해당 덱에 추가 ── */

function MyCards() {
  const [questions, setQuestions] = useState<CustomQuestion[]>([]);
  const [loaded, setLoaded] = useState(false);
  const [category, setCategory] = useState<Category>("icebreak");
  const [draft, setDraft] = useState("");
  const [optA, setOptA] = useState("");
  const [optB, setOptB] = useState("");
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editDraft, setEditDraft] = useState("");
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    setQuestions(loadCustomQuestions());
    setLoaded(true);
  }, []);

  useEffect(() => {
    if (!loaded) return;
    try {
      localStorage.setItem(CUSTOM_LIST_KEY, JSON.stringify(questions));
    } catch {}
  }, [questions, loaded]);

  const add = () => {
    const text = draft.trim();
    if (!text) return;
    const a = optA.trim();
    const b = optB.trim();
    setQuestions((prev) => [
      ...prev,
      {
        id: crypto.randomUUID(),
        text,
        category,
        options: category === "balance" && a && b ? { a, b } : undefined,
      },
    ]);
    setDraft("");
    setOptA("");
    setOptB("");
  };

  const remove = (id: string) =>
    setQuestions((prev) => prev.filter((q) => q.id !== id));

  const startEdit = (q: CustomQuestion) => {
    setEditingId(q.id);
    setEditDraft(q.text);
  };

  const saveEdit = () => {
    const text = editDraft.trim();
    if (text) {
      setQuestions((prev) =>
        prev.map((q) => (q.id === editingId ? { ...q, text } : q))
      );
    }
    setEditingId(null);
  };

  const share = async () => {
    const url = `${location.origin}/custom?q=${encodeQuestions(questions)}`;
    try {
      await navigator.clipboard.writeText(url);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      window.prompt("아래 링크를 복사하세요", url);
    }
  };

  return (
    <main className="mx-auto flex w-full max-w-md flex-1 flex-col px-6 pb-36 pt-6">
      <header className="flex items-center justify-between">
        <Link
          href="/"
          className="rounded-full bg-white/60 px-4 py-2 text-sm font-medium text-ink shadow-sm backdrop-blur-sm transition hover:bg-white/80"
        >
          ← 홈
        </Link>
        <span className="text-sm font-medium text-ink-soft">
          내 질문 {questions.length}개
        </span>
      </header>

      <h1 className="mt-8 font-serif text-3xl font-bold">나만의 카드</h1>
      <p className="mt-1.5 text-sm text-ink-soft">
        카테고리를 골라 질문을 만들면 그 덱의 카드 사이에 섞여 나옵니다. 질문은
        이 브라우저에 저장됩니다.
      </p>

      <div className="mt-6 flex gap-2" role="radiogroup" aria-label="카테고리 선택">
        {decks.map((d) => (
          <button
            key={d.slug}
            role="radio"
            aria-checked={category === d.slug}
            onClick={() => setCategory(d.slug as Category)}
            className={`flex-1 rounded-full px-2 py-2.5 text-xs font-semibold transition ${
              category === d.slug
                ? `${d.skin} text-white shadow-md`
                : "bg-white/60 text-ink-soft backdrop-blur-sm hover:bg-white/80"
            }`}
          >
            {d.name}
          </button>
        ))}
      </div>

      <div className="mt-3 flex gap-2">
        <input
          value={draft}
          onChange={(e) => setDraft(e.target.value)}
          onKeyDown={(e) => {
            // 한글 IME 조합 중 Enter는 무시 (keyCode 229는 Safari 대응)
            if (e.nativeEvent.isComposing || e.keyCode === 229) return;
            if (e.key === "Enter") add();
          }}
          placeholder="새 질문을 입력하세요"
          className="min-w-0 flex-1 rounded-2xl border-2 border-transparent bg-white/70 px-4 py-3 text-sm shadow-sm backdrop-blur-sm placeholder:text-ink-soft/60 focus:border-accent focus:outline-none"
        />
        <button
          onClick={add}
          disabled={!draft.trim()}
          className="shrink-0 rounded-2xl bg-ink px-5 py-3 text-sm font-semibold text-white shadow-md transition-transform active:scale-95 disabled:opacity-40"
        >
          추가
        </button>
      </div>

      {category === "balance" && (
        <div className="mt-2 flex items-center gap-2">
          <input
            value={optA}
            onChange={(e) => setOptA(e.target.value)}
            placeholder="선택지 A (선택)"
            className="min-w-0 flex-1 rounded-2xl border-2 border-transparent bg-white/70 px-4 py-2.5 text-sm shadow-sm backdrop-blur-sm placeholder:text-ink-soft/60 focus:border-accent focus:outline-none"
          />
          <span className="shrink-0 font-serif text-xs font-bold text-ink-soft">
            vs
          </span>
          <input
            value={optB}
            onChange={(e) => setOptB(e.target.value)}
            placeholder="선택지 B (선택)"
            className="min-w-0 flex-1 rounded-2xl border-2 border-transparent bg-white/70 px-4 py-2.5 text-sm shadow-sm backdrop-blur-sm placeholder:text-ink-soft/60 focus:border-accent focus:outline-none"
          />
        </div>
      )}

      {questions.length === 0 ? (
        <div className="mt-10 rounded-3xl bg-white/50 p-8 text-center backdrop-blur-sm">
          <p className="font-serif text-lg font-bold">아직 만든 질문이 없어요</p>
          <p className="mt-2 text-sm text-ink-soft">
            카테고리를 고르고 질문을 추가하면 그 덱에서 카드로 나타납니다.
          </p>
        </div>
      ) : (
        decks.map((d) => {
          const items = questions.filter((q) => q.category === d.slug);
          if (items.length === 0) return null;
          return (
            <section key={d.slug} className="mt-7">
              <div className="flex items-center justify-between">
                <h2 className="flex items-center gap-2 text-sm font-semibold text-ink-soft">
                  <span
                    className={`h-2.5 w-2.5 rounded-full ${d.skin}`}
                    aria-hidden
                  />
                  {d.name} · {items.length}개
                </h2>
                <Link
                  href={`/deck/${d.slug}`}
                  className="text-xs font-medium text-accent underline underline-offset-4"
                >
                  덱 열기
                </Link>
              </div>
              <ul className="mt-3 flex flex-col gap-3">
                {items.map((q) => (
                  <li
                    key={q.id}
                    className="rise-in rounded-2xl bg-white/70 p-4 shadow-sm backdrop-blur-sm"
                  >
                    {editingId === q.id ? (
                      <div>
                        <textarea
                          value={editDraft}
                          onChange={(e) => setEditDraft(e.target.value)}
                          rows={2}
                          autoFocus
                          className="w-full rounded-xl border-2 border-accent/40 bg-white px-3 py-2 text-sm focus:border-accent focus:outline-none"
                        />
                        <div className="mt-2 flex justify-end gap-2">
                          <button
                            onClick={() => setEditingId(null)}
                            className="rounded-full px-3 py-1.5 text-xs font-medium text-ink-soft transition hover:bg-ink/5"
                          >
                            취소
                          </button>
                          <button
                            onClick={saveEdit}
                            className="rounded-full bg-ink px-4 py-1.5 text-xs font-semibold text-white"
                          >
                            저장
                          </button>
                        </div>
                      </div>
                    ) : (
                      <div className="flex items-start gap-3">
                        <p className="flex-1 text-sm leading-relaxed">
                          {q.text}
                          {q.options && (
                            <span className="mt-1 block text-xs text-ink-soft">
                              {q.options.a} vs {q.options.b}
                            </span>
                          )}
                        </p>
                        <div className="flex shrink-0 gap-1">
                          <button
                            onClick={() => startEdit(q)}
                            className="rounded-full px-2.5 py-1 text-xs font-medium text-ink-soft transition hover:bg-ink/5"
                          >
                            수정
                          </button>
                          <button
                            onClick={() => remove(q.id)}
                            className="rounded-full px-2.5 py-1 text-xs font-medium text-red-400 transition hover:bg-red-50"
                          >
                            삭제
                          </button>
                        </div>
                      </div>
                    )}
                  </li>
                ))}
              </ul>
            </section>
          );
        })
      )}

      <div className="fixed inset-x-0 bottom-6 z-40 flex justify-center px-6">
        <button
          onClick={share}
          disabled={questions.length === 0}
          className="w-full max-w-md rounded-full bg-ink py-4 font-semibold text-white shadow-xl shadow-indigo-400/30 transition-transform active:scale-[0.98] disabled:opacity-40"
        >
          {copied ? "링크 복사됨" : "공유 링크 복사"}
        </button>
      </div>
    </main>
  );
}

/* ── 공유받은 덱 (?q=...) ── */

function SharedDeck({ encoded }: { encoded: string }) {
  const questions = useMemo(() => decodeQuestions(encoded), [encoded]);
  const [saved, setSaved] = useState(false);

  if (!questions) {
    return (
      <main className="mx-auto flex w-full max-w-md flex-1 flex-col items-center justify-center px-6 text-center">
        <p className="font-serif text-2xl font-bold">링크를 읽을 수 없어요</p>
        <p className="mt-3 text-sm text-ink-soft">
          공유 링크가 잘리지 않았는지 확인하고 다시 열어보세요.
        </p>
        <Link
          href="/"
          className="mt-8 rounded-full bg-ink px-8 py-3.5 font-semibold text-white shadow-lg"
        >
          홈으로
        </Link>
      </main>
    );
  }

  const deck: Deck = {
    slug: "custom",
    name: "함께 나눌 카드",
    tagline: "",
    icon: "/assets/icon-custom.png",
    mode: "draw",
    skin: "skin-custom",
    questions,
  };

  const importAll = () => {
    try {
      const mine = loadCustomQuestions();
      const existing = new Set(mine.map((q) => `${q.category}:${q.text}`));
      const merged = [
        ...mine,
        ...questions
          .filter((q) => !existing.has(`${q.category}:${q.text}`))
          .map((q) => ({ ...q, id: crypto.randomUUID() })),
      ];
      localStorage.setItem(CUSTOM_LIST_KEY, JSON.stringify(merged));
      setSaved(true);
    } catch {}
  };

  const counts = decks
    .map((d) => {
      const n = questions.filter((q) => q.category === d.slug).length;
      return n > 0 ? `${categoryOf(d.slug as Category).name} ${n}` : null;
    })
    .filter(Boolean)
    .join(" · ");

  return (
    <DrawDeck
      deck={deck}
      persistDrawn={false}
      topSlot={
        <div className="mt-6 flex items-center justify-between gap-3 rounded-2xl bg-white/60 p-4 backdrop-blur-sm">
          <p className="text-sm text-ink-soft">공유받은 카드 · {counts}</p>
          <button
            onClick={importAll}
            disabled={saved}
            className="shrink-0 rounded-full bg-ink px-4 py-2 text-xs font-semibold text-white transition-transform active:scale-95 disabled:opacity-50"
          >
            {saved ? "저장됨" : "내 카드에 저장"}
          </button>
        </div>
      }
    />
  );
}
