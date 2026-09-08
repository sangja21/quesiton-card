"use client";

import { useEffect, useRef, useState } from "react";

/* /assets/ 에셋이 아직 없으면 아이콘 자리를 비워두고 레이아웃만 유지한다 */
export default function DeckIcon({ src, alt = "" }: { src: string; alt?: string }) {
  const [ok, setOk] = useState(true);
  const ref = useRef<HTMLImageElement>(null);

  // 하이드레이션 전에 로드가 실패한 경우 onError가 불리지 않으므로 마운트 시 재확인
  useEffect(() => {
    const img = ref.current;
    if (img && img.complete && img.naturalWidth === 0) setOk(false);
  }, []);

  return (
    <span className="flex h-12 w-12 items-center justify-center">
      {ok && (
        // eslint-disable-next-line @next/next/no-img-element
        <img
          ref={ref}
          src={src}
          alt={alt}
          className="h-12 w-12 object-contain drop-shadow-sm"
          onError={() => setOk(false)}
        />
      )}
    </span>
  );
}
