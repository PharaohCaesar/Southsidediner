'use client';

import { useEffect, useRef, useState } from 'react';
import { SplitFlap } from '@/components/fx/split-flap';
import { BOARD_SPECIAL_ROWS } from '@/lib/site';

export type BoardRow = { label: string; note: string; special?: boolean };

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
 * The split-flap board. Today's specials (from Admin → Website) are pinned to the top rows in
 * mustard; if there are more specials than rows they take turns. The remaining rows endlessly
 * re-flap, one row at a time, to other dishes from the live menu. Server render shows
 * `initial` so there's no hydration mismatch; the shuffle only happens on the client.
 * Pauses while off-screen or in a background tab.
 */
export function RotatingBoard({ initial, pool, specials }: { initial: BoardRow[]; pool: BoardRow[]; specials: BoardRow[] }) {
  const [rows, setRows] = useState(initial);
  const rowsRef = useRef(rows);
  const menuQueue = useRef<BoardRow[]>([]);
  const specialQueue = useRef<BoardRow[]>([]);
  const next = useRef(0);
  const box = useRef<HTMLOListElement>(null);

  useEffect(() => {
    const specialRows = Math.min(specials.length, BOARD_SPECIAL_ROWS);
    const specialsRotate = specials.length > specialRows;
    const menuRotates = pool.length > initial.length - specialRows;
    if (!specialsRotate && !menuRotates) return;

    let onScreen = false;
    const io = new IntersectionObserver((es) => { onScreen = es[0].isIntersecting; }, { threshold: 0.2 });
    if (box.current) io.observe(box.current);

    const take = (queue: { current: BoardRow[] }, source: BoardRow[], showing: Set<string>, refill: (s: BoardRow[]) => BoardRow[]) => {
      for (let tries = 0; tries < 2; tries++) {
        if (!queue.current.length) queue.current = refill(source);
        while (queue.current.length) {
          const c = queue.current.shift()!;
          if (!showing.has(c.label)) return c;
        }
      }
      return undefined;
    };

    const id = window.setInterval(() => {
      if (!onScreen || document.hidden) return;
      const current = rowsRef.current;
      const showing = new Set(current.map((r) => r.label));
      // Walk the rows round-robin to the next one that can actually change.
      for (let step = 0; step < current.length; step++) {
        const row = next.current % current.length;
        next.current++;
        const isSpecialRow = row < specialRows;
        if (isSpecialRow && !specialsRotate) continue;
        if (!isSpecialRow && !menuRotates) continue;
        const pick = isSpecialRow
          ? take(specialQueue, specials, showing, (s) => s.slice()) // specials keep their board order
          : take(menuQueue, pool, showing, shuffle);
        if (!pick) continue;
        const updated = current.map((r, i) => (i === row ? pick : r));
        rowsRef.current = updated;
        setRows(updated);
        return;
      }
    }, EVERY_MS);

    return () => { window.clearInterval(id); io.disconnect(); };
  }, [pool, specials, initial.length]);

  return (
    <ol ref={box} className="min-w-max space-y-3" aria-label="Now serving">
      {rows.map((row, i) => (
        <li key={i} className="flex items-center gap-4">
          <SplitFlap
            text={row.label}
            cols={COLS}
            tone={row.special ? 'special' : 'cream'}
            className="text-[13px] sm:text-[20px] lg:text-[26px]"
            delay={i * 180}
          />
          <span
            key={row.label}
            className={`board-note hidden w-72 truncate font-ticket text-sm uppercase tracking-wider md:inline ${
              row.special ? 'text-neon' : 'text-mustard/80'
            }`}
          >
            {row.special && <span aria-hidden>★ </span>}
            {row.note}
          </span>
        </li>
      ))}
    </ol>
  );
}
