import Link from 'next/link';
import { SITE } from '@/lib/site';
import { GuestCheck } from '@/components/guest-check';
import { OpenNow } from '@/components/open-now';

export function VisitBand() {
  return (
    <section className="relative overflow-hidden bg-mint py-16 text-ink" aria-labelledby="visit-h">
      <div className="mx-auto grid max-w-7xl gap-8 px-4 sm:px-6 md:grid-cols-[1fr_360px]">
        <div>
          <p className="font-script text-3xl text-cherry">Come on in</p>
          <h2 id="visit-h" className="font-display text-5xl uppercase leading-[.95] tracking-wide">
            {SITE.hoursSummary}
          </h2>
          <p className="mt-3 max-w-lg text-lg text-ink/80">
            {SITE.address.line1}, {SITE.address.city}, {SITE.address.state} {SITE.address.zip}. Counter seats, booths, and a
            full pot of coffee waiting.
          </p>
          {/* Live open/closed from Akelt (honours "Closed today"), lit like a diner sign. */}
          <div className="mt-5 inline-block rounded-2xl bg-ink text-white shadow-[0_10px_24px_rgba(0,0,0,.18)]">
            <OpenNow />
          </div>
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
        <GuestCheck number="6002008" table="To go" guests="1" server="You" prices className="rotate-1 self-start">
          <p className="ink flex justify-between text-xl"><span>Order ahead</span><span className="-mr-[66px] w-14 text-right">✓</span></p>
          <p className="ink text-xl">Skip the line —</p>
          <p className="ink text-xl">ready in about 20 min.</p>
          <div className="py-2">
            <a href={SITE.akeltOrigin} data-akelt-order="/" data-bell className="inline-flex min-h-[44px] items-center rounded-sm bg-[#2d4f9e] px-5 font-display text-[15px] uppercase tracking-[.14em] text-white hover:bg-[#223e80]">
              Start an order
            </a>
          </div>
        </GuestCheck>
      </div>
    </section>
  );
}
