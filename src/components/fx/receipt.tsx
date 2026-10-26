'use client';

import { useEffect, useRef, useState } from 'react';

type Line = { l: string; r?: string; bold?: boolean; gap?: boolean };

/** A dot-matrix receipt that prints line by line when it scrolls into view. */
export function Receipt({ lines }: { lines: Line[] }) {
  const ref = useRef<HTMLDivElement>(null);
  const [printed, setPrinted] = useState(0);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const io = new IntersectionObserver(
      (entries) => {
        if (!entries[0].isIntersecting) return;
        io.disconnect();
        let i = 0;
        const tick = () => {
          i += 1;
          setPrinted(i);
          if (i < lines.length) setTimeout(tick, 90);
        };
        tick();
      },
      { threshold: 0.15 }
    );
    io.observe(el);
    return () => io.disconnect();
  }, [lines.length]);

  return (
    <div ref={ref} className="relative mx-auto w-full max-w-[340px]">
      <div className="relative z-10 mx-auto h-5 w-[92%] rounded-b-xl bg-chrome-dark shadow-[0_6px_14px_rgba(0,0,0,.5)]" aria-hidden />
      <div
        className="ticket-edge relative -mt-1 overflow-hidden bg-[#fdfbf5] px-6 pb-8 pt-6 font-ticket text-[13px] leading-[1.75] text-ink shadow-[0_24px_50px_rgba(0,0,0,.45)]"
        style={{ clipPath: `inset(0 0 ${Math.max(0, 100 - (printed / lines.length) * 100)}% 0)`, transition: 'clip-path .09s linear' }}
        aria-label="Receipt with address and hours"
      >
        {lines.map((ln, i) => (
          <div key={i} className={`flex justify-between gap-4 ${ln.gap ? 'mt-3' : ''} ${ln.bold ? 'font-bold' : ''}`}>
            <span className="truncate">{ln.l}</span>
            {ln.r && <span className="shrink-0">{ln.r}</span>}
          </div>
        ))}
        <div className="mt-4 h-10 bg-[repeating-linear-gradient(90deg,#111_0_2px,transparent_2px_4px,#111_4px_5px,transparent_5px_9px,#111_9px_12px,transparent_12px_14px)] opacity-80" aria-hidden />
      </div>
    </div>
  );
}
