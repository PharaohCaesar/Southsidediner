import Image from 'next/image';
import Link from 'next/link';
import { AWARDS, FEATURED_PRESS, SITE } from '@/lib/site';
import { Starburst } from '@/components/fx/starburst';
import { Steam } from '@/components/fx/steam';

export function StoryStrip() {
  return (
    <section className="relative overflow-hidden bg-cream py-20" aria-labelledby="story-h">
      <div className="mx-auto grid max-w-7xl gap-12 px-4 sm:px-6 lg:grid-cols-2 lg:items-center">
        <div className="relative">
          <div className="polaroid rotate-[-2deg]">
            <Image src="/photos/spread.jpg" alt="A table full of Southside breakfast: pancakes, omelettes, hash and waffles" width={1800} height={1200} className="kodachrome" sizes="(max-width: 1024px) 100vw, 600px" />
            <p className="polaroid-cap font-script text-2xl text-ink">Saturday, 9:40 AM</p>
          </div>
          <div className="absolute -right-4 -top-6 sm:-right-10">
            <Starburst text={`Since ${SITE.since}`} />
          </div>
          <div className="absolute -bottom-4 left-4">
            <Steam />
          </div>
        </div>
        <div>
          <p className="font-script text-3xl text-cherry">Our story</p>
          <h2 id="story-h" className="mt-1 font-display text-5xl uppercase leading-[.95] tracking-wide text-ink sm:text-6xl">
            A real diner.<br />A real family.
          </h2>
          <p className="mt-5 text-lg text-ink-soft">
            Since {SITE.since} our family has run this corner of Pleasant Valley Road as the place Parma starts its day.
            Red booths, a license-plate wall, coffee ground in-house, and a kitchen that makes the corned beef hash, the
            potato pancakes and the gravy from scratch every single morning.
          </p>

          {/* Awards */}
          <ul className="mt-6 grid gap-3 sm:grid-cols-2" aria-label="Awards">
            {AWARDS.map((a) => (
              <li key={a.title} className="relative overflow-hidden rounded-2xl bg-ink p-4 text-cream shadow-lg">
                <span className="absolute -right-3 -top-3 grid h-14 w-14 rotate-12 place-items-center rounded-full bg-mustard font-display text-sm text-ink" aria-hidden>
                  {a.year}
                </span>
                <p className="font-display text-2xl uppercase tracking-wide text-mustard">{a.title}</p>
                <p className="text-xs font-semibold uppercase tracking-[.16em] text-cream/70">{a.source} · {a.year}</p>
              </li>
            ))}
          </ul>

          {/* Press */}
          <ul className="mt-3 grid gap-3 sm:grid-cols-3" aria-label="Press">
            {FEATURED_PRESS.map((p) => (
              <li key={p.url} className="rounded-2xl border border-ink/10 bg-white/60 p-4">
                <p className="text-sm italic text-ink">“{p.quote}”</p>
                <a href={p.url} target="_blank" rel="noreferrer" className="mt-2 block text-xs font-bold uppercase tracking-wider text-cherry hover:underline">
                  {p.outlet}, {p.year} ↗
                </a>
              </li>
            ))}
          </ul>
          <Link href="/story" className="mt-6 inline-flex min-h-[46px] items-center rounded-full border-2 border-ink px-6 font-display text-[15px] uppercase tracking-[.12em] text-ink transition hover:bg-ink hover:text-cream">
            Our story &amp; press
          </Link>
        </div>
      </div>
    </section>
  );
}
