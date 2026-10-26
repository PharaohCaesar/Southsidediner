import { BOARD, SITE } from '@/lib/site';
import { SplitFlap } from '@/components/fx/split-flap';
import { OpenNow } from '@/components/open-now';

/** "Now serving" split-flap board + the live open/closed clock from Akelt. */
export function SpecialsBoard() {
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
          <ol className="min-w-max space-y-3">
            {BOARD.map((row, i) => (
              <li key={row.label} className="flex items-center gap-4">
                <SplitFlap text={row.label} cols={26} className="text-[13px] sm:text-[20px] lg:text-[26px]" delay={i * 180} />
                <span className="hidden font-ticket text-sm uppercase tracking-wider text-mustard/80 md:inline">{row.note}</span>
              </li>
            ))}
          </ol>
        </div>
        <p className="mt-4 text-sm text-white/50">
          Daily specials on the board inside. Full menu and prices on the{' '}
          <a href="/menu" className="text-mustard underline-offset-2 hover:underline">menu page</a> — everything&apos;s made from scratch at{' '}
          {SITE.address.line1}.
        </p>
      </div>
    </section>
  );
}
