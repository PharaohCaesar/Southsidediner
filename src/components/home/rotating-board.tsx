'use client';

import { useEffect, useRef, useState } from 'react';
import { SplitFlap } from '@/components/fx/split-flap';

export type BoardRow = { label: string; note: string };

const COLS = 26;
const EVERY_MS = 3200;

function shuffle<T>(a: T[]): T[] {
  const b = a.slice();
  for (let i = b.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [b[i], b[j]] = [b[j], b[i]];
  }
  return b;
}

/**
 * The split-flap board, endlessly re-flapping one row at a time (top to bottom, then
 * around again) to other dishes from the live menu. Server render shows `initial`
 * so there's no hydration mismatch; the shuffle only happens on the client. Pauses
 * while off-screen or in a background tab.
 */
export function RotatingBoard({ initial, pool }: { initial: BoardRow[]; pool: BoardRow[] }) {
  const [rows, setRows] = useState(initial);
  const rowsRef = useRef(rows);
  const queue = useRef<BoardRow[]>([]);
  const next = useRef(0);
  const box = useRef<HTMLOListElement>(null);

  useEffect(() => {
    if (pool.length <= initial.length) return;
    let onScreen = false;
    const io = new IntersectionObserver((es) => { onScreen = es[0].isIntersecting; }, { threshold: 0.2 });
    if (box.current) io.observe(box.current);

    const id = window.setInterval(() => {
      if (!onScreen || document.hidden) return;
      const showing = new Set(rowsRef.current.map((r) => r.label));
      let pick: BoardRow | undefined;
      for (let tries = 0; tries < 2 && !pick; tries++) {
        if (!queue.current.length) queue.current = shuffle(pool);
        while (queue.current.length && !pick) {
          const c = queue.current.shift()!;
          if (!showing.has(c.label)) pick = c;
        }
      }
      if (!pick) return;
      const row = next.current % rowsRef.current.length;
      next.current++;
      const updated = rowsRef.current.map((r, i) => (i === row ? pick! : r));
      rowsRef.current = updated;
      setRows(updated);
    }, EVERY_MS);

    return () => { window.clearInterval(id); io.disconnect(); };
  }, [pool, initial.length]);

  return (
    <ol ref={box} className="min-w-max space-y-3" aria-label="Now serving">
      {rows.map((row, i) => (
        <li key={i} className="flex items-center gap-4">
          <SplitFlap text={row.label} cols={COLS} className="text-[13px] sm:text-[20px] lg:text-[26px]" delay={i * 180} />
          <span key={row.label} className="board-note hidden w-64 truncate font-ticket text-sm uppercase tracking-wider text-mustard/80 md:inline">{row.note}</span>
        </li>
      ))}
    </ol>
  );
}
