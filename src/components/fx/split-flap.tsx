'use client';

import { useEffect, useRef, useState } from 'react';

const CHARS = ' ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789$.&\'-:,!';

/**
 * Solari split-flap board. Decorative: the resolved text is the only accessible text
 * (the per-column charset is aria-hidden so crawlers and screen readers don't see
 * gibberish — a Vagón lesson).
 */
export function SplitFlap({ text, cols, className = '', delay = 0 }: { text: string; cols: number; className?: string; delay?: number }) {
  const target = text.toUpperCase().padEnd(cols).slice(0, cols);
  const [shown, setShown] = useState(' '.repeat(cols));
  const ref = useRef<HTMLDivElement>(null);
  const started = useRef(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const io = new IntersectionObserver(
      (es) => {
        if (!es[0].isIntersecting || started.current) return;
        started.current = true;
        io.disconnect();
        const t0 = performance.now() + delay;
        const cur = target.split('').map(() => 0);
        const goal = target.split('').map((ch) => Math.max(0, CHARS.indexOf(ch)));
        const tick = () => {
          const now = performance.now();
          if (now < t0) { requestAnimationFrame(tick); return; }
          let moving = false;
          for (let i = 0; i < cur.length; i++) {
            // Columns start staggered left→right and flap one char per frame.
            if (now < t0 + i * 45) { moving = true; continue; }
            if (cur[i] !== goal[i]) { cur[i] = (cur[i] + 1) % CHARS.length; moving = true; }
          }
          setShown(cur.map((n) => CHARS[n]).join(''));
          if (moving) setTimeout(() => requestAnimationFrame(tick), 28);
        };
        requestAnimationFrame(tick);
      },
      { threshold: 0.4 }
    );
    io.observe(el);
    return () => io.disconnect();
  }, [target, delay]);

  // Re-run when the text changes after first reveal.
  useEffect(() => { started.current = false; }, [text]);

  return (
    <div ref={ref} className={`flex gap-[3px] ${className}`} role="img" aria-label={text}>
      {shown.split('').map((ch, i) => (
        <span
          key={i}
          aria-hidden
          className="relative grid h-[1.55em] w-[1em] place-items-center overflow-hidden rounded-[3px] bg-[#1a1a1d] font-display text-[1em] leading-none text-cream shadow-[inset_0_1px_0_rgba(255,255,255,.08),0_1px_2px_rgba(0,0,0,.6)]"
        >
          <span className="pointer-events-none absolute inset-x-0 top-1/2 h-px bg-black/80" />
          {ch}
        </span>
      ))}
    </div>
  );
}
