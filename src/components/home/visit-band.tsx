import Link from 'next/link';
import { SITE } from '@/lib/site';

export function VisitBand() {
  return (
    <section className="relative overflow-hidden bg-mint py-16 text-ink" aria-labelledby="visit-h">
      <div className="mx-auto grid max-w-7xl gap-8 px-4 sm:px-6 md:grid-cols-3">
        <div className="md:col-span-2">
          <p className="font-script text-3xl text-cherry">Come on in</p>
          <h2 id="visit-h" className="font-display text-5xl uppercase leading-[.95] tracking-wide">
            {SITE.hoursSummary}
          </h2>
          <p className="mt-3 max-w-lg text-lg text-ink/80">
            {SITE.address.line1}, {SITE.address.city}, {SITE.address.state} {SITE.address.zip}. Counter seats, booths, and a
            full pot of coffee waiting.
          </p>
          <div className="mt-6 flex flex-wrap gap-3">
            <a href={SITE.mapsUrl} target="_blank" rel="noreferrer" className="inline-flex min-h-[48px] items-center rounded-full bg-ink px-6 font-display text-[15px] uppercase tracking-[.12em] text-cream hover:bg-black">
              Directions
            </a>
            <a href={`tel:${SITE.phoneE164}`} className="inline-flex min-h-[48px] items-center rounded-full border-2 border-ink px-6 font-display text-[15px] uppercase tracking-[.12em] hover:bg-ink hover:text-cream">
              {SITE.phone}
            </a>
            <Link href="/jobs" className="inline-flex min-h-[48px] items-center rounded-full px-4 font-semibold underline-offset-4 hover:underline">
              We&apos;re hiring →
            </Link>
          </div>
        </div>
        <div className="ticket ticket-edge self-start px-6 pb-6 pl-12 pt-6 rotate-1">
          <p className="border-b-[3px] border-double border-cherry/70 pb-1 text-xs font-bold uppercase tracking-[.2em]">Guest check</p>
          <p className="mt-3 text-lg uppercase">Order ahead</p>
          <p className="mt-1 text-sm">Skip the line. Ready in about 20 minutes.</p>
          <a href={SITE.akeltOrigin} data-akelt-order="/" data-bell className="mt-4 inline-flex min-h-[44px] items-center rounded bg-cherry px-5 text-sm font-bold uppercase tracking-[.12em] text-white hover:bg-cherry-deep">
            Start an order
          </a>
        </div>
      </div>
    </section>
  );
}
