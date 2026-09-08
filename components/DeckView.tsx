"use client";

import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import type { Deck, Question } from "@/lib/questions";
import { loadCustomQuestions, verse, verseRef } from "@/lib/questions";

const storageKey = (slug: string) => `sharing-cards:${slug}`;

export default function DeckView({ deck }: { deck: Deck }) {
  // 이 카테고리에 만들어둔 내 질문을 기본 질문 뒤에 합친다
  const [custom, setCustom] = useState<Question[]>([]);

  useEffect(() => {
    setCustom(loadCustomQuestions().filter((q) => q.category === deck.slug));
  }, [deck.slug]);

  const merged = useMemo<Deck>(
    () =>
      custom.length > 0
        ? { ...deck, questions: [...deck.questions, ...custom] }
        : deck,
    [deck, custom]
  );

  return merged.mode === "sequence" ? (
    <SequenceDeck deck={merged} />
  ) : (
    <DrawDeck deck={merged} />
  );
}

function DeckHeader({
  meta,
  onBack,
}: {
  meta?: string;
  onBack?: () => void;
}) {
  const backClass =
    "rounded-full bg-white/60 px-4 py-2 text-sm font-medium text-ink shadow-sm backdrop-blur-sm transition hover:bg-white/80";
  return (
    <header className="flex items-center justify-between">
      {onBack ? (
        <button onClick={onBack} className={backClass}>
          ← 목록
        </button>
      ) : (
        <Link href="/" className={backClass}>
          ← 홈
        </Link>
      )}
      {meta && <span className="text-sm font-medium text-ink-soft">{meta}</span>}
    </header>
  );
}

/* ── 뽑기 모드: 아이스브레이킹 · 밸런스 게임 · 나만의 카드 ── */

export function DrawDeck({
  deck,
  persistDrawn = true,
  onBack,
  topSlot,
}: {
  deck: Deck;
  persistDrawn?: boolean;
  onBack?: () => void;
  topSlot?: React.ReactNode;
}) {
  const [drawn, setDrawn] = useState<string[]>([]);
  const [open, setOpen] = useState<Question | null>(null);
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    if (persistDrawn) {
      try {
        const raw = localStorage.getItem(storageKey(deck.slug));
        if (raw) setDrawn(JSON.parse(raw));
      } catch {}
    }
    setLoaded(true);
  }, [deck.slug, persistDrawn]);

  useEffect(() => {
    if (!loaded || !persistDrawn) return;
    try {
      localStorage.setItem(storageKey(deck.slug), JSON.stringify(drawn));
    } catch {}
  }, [drawn, loaded, deck.slug, persistDrawn]);

  const remaining = deck.questions.filter((q) => !drawn.includes(q.id));

  const openCard = (q: Question) => {
    setOpen(q);
    setDrawn((prev) => (prev.includes(q.id) ? prev : [...prev, q.id]));
  };

  const drawRandom = () => {
    const pool = remaining.filter((q) => q.id !== open?.id);
    if (pool.length === 0) return;
    openCard(pool[Math.floor(Math.random() * pool.length)]);
  };

  const reset = () => {
    setDrawn([]);
    setOpen(null);
  };

  const manyCards = deck.questions.length > 8;
  const drawnCount = deck.questions.filter((q) => drawn.includes(q.id)).length;

  return (
    <main className="mx-auto flex w-full max-w-md flex-1 flex-col px-6 pb-32 pt-6">
      <DeckHeader onBack={onBack} meta={`${drawnCount} / ${deck.questions.length}`} />
      {topSlot}

      <h1 className="mt-8 font-serif text-3xl font-bold">{deck.name}</h1>
      <p className="mt-1.5 text-sm text-ink-soft">
        카드를 탭해서 질문을 열어보세요.
      </p>

      <div className={`mt-8 grid gap-3 ${manyCards ? "grid-cols-4" : "grid-cols-2"}`}>
        {deck.questions.map((q, i) => {
          const isDrawn = drawn.includes(q.id);
          return (
            <button
              key={q.id}
              onClick={() => openCard(q)}
              aria-label={isDrawn ? `다시 보기: ${q.text}` : `${i + 1}번 카드 뽑기`}
              className={`rise-in aspect-[3/4] overflow-hidden rounded-2xl text-left transition-transform duration-150 active:scale-95 ${
                isDrawn
                  ? "bg-white/65 p-2 shadow-sm backdrop-blur-sm"
                  : `${deck.skin} shadow-md shadow-indigo-300/25`
              }`}
              style={{ animationDelay: `${Math.min(i * 30, 450)}ms` }}
            >
              {isDrawn ? (
                <span
                  className={`block overflow-hidden leading-snug text-ink-soft ${
                    manyCards ? "text-[10px]" : "p-2 text-sm"
                  }`}
                  style={{
                    display: "-webkit-box",
                    WebkitLineClamp: manyCards ? 5 : 6,
                    WebkitBoxOrient: "vertical",
                  }}
                >
                  {q.text}
                </span>
              ) : (
                <span className="card-dots flex h-full w-full items-center justify-center">
                  <span
                    className={`font-serif font-bold text-white/95 ${
                      manyCards ? "text-2xl" : "text-4xl"
                    }`}
                  >
                    ?
                  </span>
                </span>
              )}
            </button>
          );
        })}
      </div>

      {drawn.length > 0 && (
        <button
          onClick={reset}
          className="mx-auto mt-8 text-sm text-ink-soft underline underline-offset-4 transition hover:text-ink"
        >
          처음부터 다시 하기
        </button>
      )}

      <div className="fixed inset-x-0 bottom-6 z-40 flex justify-center px-6">
        <button
          onClick={remaining.length > 0 ? drawRandom : reset}
          className="w-full max-w-md rounded-full bg-ink py-4 font-semibold text-white shadow-xl shadow-indigo-400/30 transition-transform active:scale-[0.98]"
        >
          {remaining.length > 0 ? "아무 카드나 뽑기" : "모두 뽑았어요 · 처음부터"}
        </button>
      </div>

      {open && (
        <QuestionOverlay
          deck={deck}
          question={open}
          number={deck.questions.findIndex((q) => q.id === open.id) + 1}
          onClose={() => setOpen(null)}
          onNext={remaining.filter((q) => q.id !== open.id).length > 0 ? drawRandom : undefined}
        />
      )}
    </main>
  );
}

function QuestionOverlay({
  deck,
  question,
  number,
  onClose,
  onNext,
}: {
  deck: Deck;
  question: Question;
  number: number;
  onClose: () => void;
  onNext?: () => void;
}) {
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [onClose]);

  return (
    <div
      role="dialog"
      aria-modal="true"
      className={`${deck.skin} fade-in fixed inset-0 z-50 flex flex-col items-center justify-center px-6`}
    >
      <div className="card-dots absolute inset-0 opacity-30" aria-hidden />

      <div
        key={question.id}
        className="flip-in relative w-full max-w-md rounded-[2rem] bg-white/90 px-7 py-10 shadow-2xl shadow-black/15 backdrop-blur"
      >
        <p className="font-serif text-lg font-bold text-ink-soft">Q{number}.</p>
        <p className="mt-4 font-serif text-2xl font-bold leading-relaxed">
          {question.text}
        </p>
        {question.hint && (
          <p className="mt-4 text-sm text-ink-soft">{question.hint}</p>
        )}
        {question.options && (
          <div className="mt-7 flex flex-col gap-2.5">
            <div className="rounded-2xl border-2 border-ink/10 bg-white px-5 py-4 text-center font-medium">
              {question.options.a}
            </div>
            <p className="text-center font-serif text-sm font-bold text-ink-soft">
              vs
            </p>
            <div className="rounded-2xl border-2 border-ink/10 bg-white px-5 py-4 text-center font-medium">
              {question.options.b}
            </div>
          </div>
        )}
      </div>

      <div className="relative mt-8 flex w-full max-w-md gap-3">
        <button
          onClick={onClose}
          className="flex-1 rounded-full bg-white/30 py-3.5 font-semibold text-white backdrop-blur-sm transition hover:bg-white/40"
        >
          닫기
        </button>
        {onNext && (
          <button
            onClick={onNext}
            className="flex-1 rounded-full bg-white py-3.5 font-semibold text-ink shadow-lg transition-transform active:scale-[0.98]"
          >
            다음 카드 뽑기
          </button>
        )}
      </div>
    </div>
  );
}

/* ── 순서 모드: 말씀 나눔 ── */

function SequenceDeck({ deck }: { deck: Deck }) {
  const [step, setStep] = useState(0);
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    try {
      const raw = localStorage.getItem(storageKey(deck.slug));
      if (raw) {
        const n = Number(JSON.parse(raw));
        if (Number.isInteger(n) && n >= 0 && n < deck.questions.length) setStep(n);
      }
    } catch {}
    setLoaded(true);
  }, [deck.slug, deck.questions.length]);

  useEffect(() => {
    if (!loaded) return;
    try {
      localStorage.setItem(storageKey(deck.slug), JSON.stringify(step));
    } catch {}
  }, [step, loaded, deck.slug]);

  const q = deck.questions[step];
  const isLast = step === deck.questions.length - 1;

  return (
    <main className="mx-auto flex w-full max-w-md flex-1 flex-col px-6 pb-10 pt-6">
      <DeckHeader meta={`${step + 1} / ${deck.questions.length}`} />

      <h1 className="mt-8 font-serif text-3xl font-bold">{deck.name}</h1>
      <blockquote className="mt-4 rounded-2xl bg-white/55 p-5 backdrop-blur-sm">
        <p className="font-serif text-sm leading-relaxed text-ink-soft">
          “{verse}”
        </p>
        <cite className="mt-2 block text-xs not-italic text-ink-soft/70">
          {verseRef}
        </cite>
      </blockquote>

      <div className="mt-6 flex items-center justify-center gap-2" aria-hidden>
        {deck.questions.map((_, i) => (
          <span
            key={i}
            className={`h-2 rounded-full transition-all duration-300 ${
              i === step ? `w-6 ${deck.skin}` : i < step ? "w-2 bg-ink/30" : "w-2 bg-ink/10"
            }`}
          />
        ))}
      </div>

      <div
        key={q.id}
        className={`${deck.skin} flip-in mt-5 flex flex-1 flex-col overflow-hidden rounded-[2rem] p-2 shadow-xl shadow-indigo-400/25`}
      >
        <div className="flex flex-1 flex-col justify-center rounded-[1.6rem] bg-white/90 px-7 py-10 backdrop-blur">
          <p className="font-serif text-lg font-bold text-ink-soft">
            Q{step + 1}.
          </p>
          <p className="mt-4 font-serif text-[1.4rem] font-bold leading-relaxed">
            {q.text}
          </p>
          {q.hint && <p className="mt-4 text-sm text-ink-soft">{q.hint}</p>}
        </div>
      </div>

      <div className="mt-6 flex gap-3">
        <button
          onClick={() => setStep((s) => Math.max(0, s - 1))}
          disabled={step === 0}
          className="flex-1 rounded-full bg-white/60 py-4 font-semibold text-ink shadow-sm backdrop-blur-sm transition hover:bg-white/80 disabled:opacity-40"
        >
          이전
        </button>
        <button
          onClick={() => (isLast ? setStep(0) : setStep((s) => s + 1))}
          className="flex-1 rounded-full bg-ink py-4 font-semibold text-white shadow-lg shadow-indigo-400/30 transition-transform active:scale-[0.98]"
        >
          {isLast ? "처음으로" : "다음 질문"}
        </button>
      </div>
    </main>
  );
}
