import Link from "next/link";
import DeckIcon from "@/components/DeckIcon";
import { decks, verse, verseRef } from "@/lib/questions";

export default function Home() {
  return (
    <main className="mx-auto flex w-full max-w-md flex-1 flex-col px-6 pb-10 pt-16">
      <p className="rise-in text-sm font-medium tracking-wide text-ink-soft">
        마음이 열리는 시간
      </p>
      <h1 className="rise-in mt-2 font-serif text-5xl font-bold tracking-tight">
        나눔카드
      </h1>
      <p className="rise-in mt-3 text-ink-soft" style={{ animationDelay: "80ms" }}>
        카드를 뽑아 서로의 이야기를 들어보세요.
      </p>

      <div className="mt-10 flex flex-col gap-4">
        {decks.map((deck, i) => (
          <Link
            key={deck.slug}
            href={`/deck/${deck.slug}`}
            className={`${deck.skin} rise-in relative overflow-hidden rounded-3xl p-6 text-white shadow-lg shadow-indigo-300/30 transition-transform duration-200 hover:scale-[1.015] active:scale-[0.99]`}
            style={{ animationDelay: `${120 + i * 90}ms` }}
          >
            <div className="card-dots absolute inset-0 opacity-25" aria-hidden />
            <div className="relative">
              <div className="flex items-center justify-between">
                <DeckIcon src={deck.icon} />
                <span className="rounded-full bg-white/25 px-3 py-1 text-xs font-medium backdrop-blur-sm">
                  {deck.mode === "sequence"
                    ? "순서대로 5문항"
                    : `카드 ${deck.questions.length}장`}
                </span>
              </div>
              <h2 className="mt-6 font-serif text-2xl font-bold">{deck.name}</h2>
              <p className="mt-1.5 text-sm text-white/90">{deck.tagline}</p>
            </div>
          </Link>
        ))}

        <Link
          href="/custom"
          className="skin-custom rise-in relative overflow-hidden rounded-3xl p-6 text-white shadow-lg shadow-indigo-300/30 transition-transform duration-200 hover:scale-[1.015] active:scale-[0.99]"
          style={{ animationDelay: `${120 + decks.length * 90}ms` }}
        >
          <div className="card-dots absolute inset-0 opacity-25" aria-hidden />
          <div className="relative">
            <div className="flex items-center justify-between">
              <DeckIcon src="/assets/icon-custom.png" />
              <span className="rounded-full bg-white/25 px-3 py-1 text-xs font-medium backdrop-blur-sm">
                직접 만들기
              </span>
            </div>
            <h2 className="mt-6 font-serif text-2xl font-bold">나만의 카드</h2>
            <p className="mt-1.5 text-sm text-white/90">
              내 질문을 만들어 원하는 덱에 넣고 링크로 공유해보세요
            </p>
          </div>
        </Link>
      </div>

      <footer className="mt-auto pt-14 text-center">
        <blockquote>
          <p className="font-serif text-sm leading-relaxed text-ink-soft">
            “{verse}”
          </p>
          <cite className="mt-2 block text-xs not-italic text-ink-soft/70">
            {verseRef}
          </cite>
        </blockquote>
        <p className="mt-8 text-[11px] font-medium tracking-widest text-ink-soft/50">
          made by VineBranch
        </p>
      </footer>
    </main>
  );
}
