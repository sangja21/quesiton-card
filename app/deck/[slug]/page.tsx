import { notFound } from "next/navigation";
import type { Metadata } from "next";
import DeckView from "@/components/DeckView";
import { decks } from "@/lib/questions";

export function generateStaticParams() {
  return decks.map((deck) => ({ slug: deck.slug }));
}

export async function generateMetadata({
  params,
}: PageProps<"/deck/[slug]">): Promise<Metadata> {
  const { slug } = await params;
  const deck = decks.find((d) => d.slug === slug);
  return { title: deck ? `${deck.name} — 나눔카드` : "나눔카드" };
}

export default async function DeckPage({ params }: PageProps<"/deck/[slug]">) {
  const { slug } = await params;
  const deck = decks.find((d) => d.slug === slug);
  if (!deck) notFound();
  return <DeckView deck={deck} />;
}
