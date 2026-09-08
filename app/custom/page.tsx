import { Suspense } from "react";
import type { Metadata } from "next";
import CustomView from "@/components/CustomView";

export const metadata: Metadata = {
  title: "나만의 카드 — 나눔카드",
};

export default function CustomPage() {
  return (
    <Suspense>
      <CustomView />
    </Suspense>
  );
}
