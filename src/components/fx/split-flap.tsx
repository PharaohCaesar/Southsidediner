'use client';

import { useEffect, useRef, useState } from 'react';

const CHARS = ' ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789$.&\'-:,!/#+()';

/** Uppercases and folds text into the flap charset (curly quotes, accents, anything else → nearest/blank). */
function toFlaps(text: string, cols: number): string {
  return text
    .normalize('NFD')
    .replace(/[̀-ͯ]/g, '')
    .replace(/[‘’`]/g, "'")
    .toUpperCase()
    .split('')
    .map((ch) => (CHARS.includes(ch) ? ch : ' '))
    .join('')
    .padEnd(cols)
    .slice(0, cols);
}

/**
 * Solari split-flap board. Decorative: the resolved text is the only accessible text
 * (the per-column charset is aria-hidden so crawlers and screen readers don't see
 * gibberish — a Vagón lesson). Starts flapping when scrolled into view, and whenever
 * `text` changes afterwards it flaps from what's showing to the new text.
 */
export function SplitFlap({
  text, cols, className = '', delay = 0, tone = 'cream',
}: { text: string; cols: number; className?: string; delay?: number; tone?: 'cream' | 'special' }) {
  const target = toFlaps(text, cols);
  const [shown, setShown] = useState(' '.repeat(cols));
  const ref = useRef<HTMLDivElement>(null);
  const cur = useRef<number[]>(Array.from({ length: cols }, () => 0));
  const visible = useRef(false);
  const first = useRef(true);
  const run = useRef(0);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const goal = target.split('').map((ch) => Math.max(0, CHARS.indexOf(ch)));
    const id = ++run.current;
    const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    const animate = (wait: number) => {
      if (reduce) {
        cur.current = goal.slice();
        requestAnimationFrame(() => { if (id === run.current) setShown(target); });
        return;
      }
      const t0 = performance.now() + wait;
      const tick = () => {
        if (id !== run.current) return; // a newer text took over
        const now = performance.now();
        if (now < t0) { requestAnimationFrame(tick); return; }
        let moving = false;
        const c = cur.current;
        for (let i = 0; i < c.length; i++) {
          // Columns start staggered left→right and flap one char per frame.
          if (now < t0 + i * 45) { moving = true; continue; }
          if (c[i] !== goal[i]) { c[i] = (c[i] + 1) % CHARS.length; moving = true; }
        }
        setShown(c.map((n) => CHARS[n]).join(''));
        if (moving) setTimeout(() => requestAnimationFrame(tick), 28);
      };
      requestAnimationFrame(tick);
    };

    if (visible.current) { animate(0); return; }
    const io = new IntersectionObserver(
      (es) => {
        if (!es[0].isIntersecting) return;
        visible.current = true;
        io.disconnect();
        animate(first.current ? delay : 0);
        first.current = false;
      },
      { threshold: 0.4 }
    );
    io.observe(el);
    return () => io.disconnect();
  }, [target, delay]);

  return (
    <div ref={ref} className={`flex gap-[3px] ${className}`} role="img" aria-label={text}>
      {shown.split('').map((ch, i) => (
        <span
          key={i}
          aria-hidden
          className={`relative grid h-[1.55em] w-[1em] place-items-center overflow-hidden rounded-[3px] font-display text-[1em] leading-none shadow-[inset_0_1px_0_rgba(255,255,255,.08),0_1px_2px_rgba(0,0,0,.6)] ${
            tone === 'special' ? 'bg-[#26150f] text-mustard' : 'bg-[#1a1a1d] text-cream'
          }`}
        >
          <span className="pointer-events-none absolute inset-x-0 top-1/2 h-px bg-black/80" />
          {ch}
        </span>
      ))}
    </div>
  );
}
