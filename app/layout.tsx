import type { Metadata, Viewport } from "next";
import { Gowun_Batang, IBM_Plex_Sans_KR } from "next/font/google";
import "./globals.css";

const gowun = Gowun_Batang({
  weight: ["400", "700"],
  subsets: ["latin"],
  variable: "--font-gowun",
});

const plex = IBM_Plex_Sans_KR({
  weight: ["400", "500", "600", "700"],
  subsets: ["latin"],
  variable: "--font-plex",
});

export const metadata: Metadata = {
  title: "나눔카드",
  description: "카드를 뽑아 서로의 이야기를 들어보세요. 모임을 위한 나눔 질문카드.",
  openGraph: {
    title: "나눔카드",
    description: "카드를 뽑아 서로의 이야기를 들어보세요. 모임을 위한 나눔 질문카드.",
    locale: "ko_KR",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "나눔카드",
    description: "카드를 뽑아 서로의 이야기를 들어보세요. 모임을 위한 나눔 질문카드.",
  },
};

export const viewport: Viewport = {
  themeColor: "#f2edff",
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html
      lang="ko"
      className={`${gowun.variable} ${plex.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col" suppressHydrationWarning>
        {children}
      </body>
    </html>
  );
}
