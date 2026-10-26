import { BOARD, SIGNATURES, SITE } from '@/lib/site';
import { fetchMenu, formatPrice } from '@/lib/akelt';
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

/** "Now serving" split-flap board, endlessly flipping through the menu, + the live open/closed clock. */
export async function SpecialsBoard() {
  const pool = await boardPool();
  return (
    <section className="relative bg-[#0f0e0e] py-16 text-white" aria-labelledby="board-h">
      <div className="mx-auto max-w-7xl px-4 sm:px-6">
        <div className="flex flex-wrap items-end justify-between gap-4">
          <div>
            <p className="font-script text-2xl text-mustard">Now serving</p>
            <h2 id="board-h" className="font-display text-4xl uppercase tracking-wide sm:text-5xl">The board</h2>
          </div>
          <OpenNow />
        </div>
        <div className="mt-8 overflow-x-auto rounded-2xl border border-white/10 bg-[#141416] p-4 shadow-[inset_0_0_60px_rgba(0,0,0,.8)] sm:p-6 [scrollbar-width:none]">
          <RotatingBoard initial={BOARD.map((r) => ({ ...r }))} pool={pool} />
        </div>
        <p className="mt-4 text-sm text-white/50">
          The board flips through our menu all day long. Full menu and prices on the{' '}
          <a href="/menu" className="text-mustard underline-offset-2 hover:underline">menu page</a> — everything&apos;s made from scratch at{' '}
          {SITE.address.line1}
        </p>
      </div>
    </section>
  );
}
