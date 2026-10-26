import { BOARD, BOARD_SPECIAL_ROWS, SIGNATURES, SITE } from '@/lib/site';
import { fetchMenu, fetchSiteFeed, formatPrice } from '@/lib/akelt';
// Only the component and a type come from the client module: a VALUE imported from a 'use client'
// file into a server component arrives as a client-reference proxy, not the value.
import { RotatingBoard, type BoardRow } from '@/components/home/rotating-board';
import { OpenNow } from '@/components/open-now';

// Sides, drinks and the kids' menu make a dull board; everything else rotates through.
const SKIP = /side|drink|beverage|kid/i;

/** Dishes from the live Akelt menu (prices never stale); signature dishes if the feed is down. */
async function boardPool(): Promise<BoardRow[]> {
  const menu = await fetchMenu();
  const pool =
    menu?.categories
      .filter((c) => !SKIP.test(c.name))
      .flatMap((c) =>
        c.items
          .filter((i) => i.available && i.name.length <= 26)
          .map((i) => ({ label: i.name, note: `${c.name} · ${formatPrice(i.price_cents, menu.restaurant.currency)}` }))
      ) ?? [];
  return pool.length ? pool : [...BOARD, ...SIGNATURES.map((s) => ({ label: s.name, note: 'House favorite' }))];
}

/** Today's specials from Admin → Website (Akelt /api/site), as board rows. */
async function todaysSpecials(): Promise<BoardRow[]> {
  const feed = await fetchSiteFeed();
  return (feed?.specials ?? []).map((s) => ({
    label: s.title,
    // Price first, so a long note can't push it out of view.
    note: [s.price_cents != null ? formatPrice(s.price_cents) : null, s.note].filter(Boolean).join(' · ') || "Today's special",
    special: true,
  }));
}

/**
 * "Now serving" split-flap board + the live open/closed clock. Today's specials sit on the top
 * rows; the rest endlessly flip through the menu.
 */
export async function SpecialsBoard() {
  const [pool, specials] = await Promise.all([boardPool(), todaysSpecials()]);
  const pinned = specials.slice(0, BOARD_SPECIAL_ROWS);
  const initial: BoardRow[] = [...pinned, ...BOARD.slice(0, BOARD.length - pinned.length).map((r) => ({ ...r }))];
  return (
    <section className="relative bg-[#0f0e0e] py-16 text-white" aria-labelledby="board-h">
      <div className="mx-auto max-w-7xl px-4 sm:px-6">
        <div className="flex flex-wrap items-end justify-between gap-4">
          <div>
            <p className="font-script text-2xl text-mustard">{specials.length ? "Today's specials are up" : 'Now serving'}</p>
            <h2 id="board-h" className="font-display text-4xl uppercase tracking-wide sm:text-5xl">The board</h2>
          </div>
          <OpenNow />
        </div>
        <div className="mt-8 overflow-x-auto rounded-2xl border border-white/10 bg-[#141416] p-4 shadow-[inset_0_0_60px_rgba(0,0,0,.8)] sm:p-6 [scrollbar-width:none]">
          <RotatingBoard initial={initial} pool={pool} specials={specials} />
        </div>
        {specials.length > 0 && (
          // Phones don't have room for the notes column, so the specials' prices go here.
          <ul className="mt-4 space-y-1 text-sm md:hidden" aria-label="Today's specials">
            {specials.map((s) => (
              <li key={s.label} className="flex gap-2 text-white/80">
                <span className="text-neon" aria-hidden>★</span>
                <span>
                  <span className="font-semibold text-mustard">{s.label}</span> · {s.note}
                </span>
              </li>
            ))}
          </ul>
        )}
        <p className="mt-4 text-sm text-white/50">
          The board flips through our menu all day long. Full menu and prices on the{' '}
          <a href="/menu" className="text-mustard underline-offset-2 hover:underline">menu page</a> — everything&apos;s made from scratch at{' '}
          {SITE.address.line1}
        </p>
      </div>
    </section>
  );
}
