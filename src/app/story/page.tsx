import type { Metadata } from 'next';
import Image from 'next/image';
import { AWARDS, LISTS, PRESS, SITE, TV } from '@/lib/site';
import { UnifrakturMaguntia } from 'next/font/google';

const blackletter = UnifrakturMaguntia({ weight: '400', subsets: ['latin'] });
import { Starburst } from '@/components/fx/starburst';

export const metadata: Metadata = {
  title: 'Our story',
  description: `${SITE.name} has been family owned and operated in Parma, Ohio since ${SITE.since}: a 1950s diner with red booths, a license-plate wall, coffee ground in-house and everything made from scratch.`,
};

const GALLERY = [
  ['/photos/spread.jpg', 'The Saturday spread'],
  ['/photos/corned-beef-hash.jpg', 'Corned beef hash, made every morning'],
  ['/photos/athenian-breakfast.jpg', 'The Athenian breakfast'],
  ['/photos/pancakes.jpg', 'Blueberry pancakes'],
  ['/photos/benedicts.jpg', 'Eggs benedict'],
  ['/photos/gyro.jpg', 'The gyro'],
] as const;

export default function StoryPage() {
  return (
    <div className="bg-cream">
      <header className="relative overflow-hidden bg-ink py-20 text-white">
        <div className="checker-floor opacity-25" />
        <div className="relative mx-auto max-w-4xl px-4 text-center sm:px-6">
          <p className="font-script text-3xl text-mustard">Since {SITE.since}</p>
          <h1 className="font-display text-6xl uppercase leading-[.95] tracking-wide sm:text-7xl">
            Parma&apos;s corner diner
          </h1>
          <p className="mx-auto mt-5 max-w-2xl text-lg text-white/80">
            In {SITE.since} our family took over a spot on West Pleasant Valley Road and turned it into Southside Diner.
            Nothing fancy about the idea: real breakfast, real lunch, made by hand, served by people who know your order.
          </p>
        </div>
      </header>

      <section className="mx-auto max-w-7xl px-4 py-16 sm:px-6">
        <div className="grid gap-10 lg:grid-cols-3">
          {[
            ['Made from scratch', 'The corned beef hash, the potato pancakes, the sausage gravy, the tzatziki. If it can be made in our kitchen, it is.'],
            ['Ground in-house', 'The coffee is ground here, every morning, and the pot never runs dry.'],
            ['Open every day', `${SITE.hoursSummary}. Holidays too, unless the board says otherwise.`],
          ].map(([h, b]) => (
            <div key={h} className="rounded-3xl border-2 border-ink/10 bg-white/70 p-6">
              <h2 className="font-display text-3xl uppercase tracking-wide text-ink">{h}</h2>
              <p className="mt-2 text-ink-soft">{b}</p>
            </div>
          ))}
        </div>
      </section>

      <section className="relative mx-auto max-w-7xl px-4 pb-16 sm:px-6" aria-labelledby="gal-h">
        <div className="flex items-center justify-between">
          <h2 id="gal-h" className="font-display text-4xl uppercase tracking-wide text-ink">From the counter</h2>
          <Starburst text="Real food, real photos" className="hidden sm:grid" />
        </div>
        <ul className="mt-6 grid grid-cols-2 gap-6 md:grid-cols-3">
          {GALLERY.map(([src, cap], i) => (
            <li key={src} className={`polaroid ${i % 2 ? 'rotate-[1.5deg]' : 'rotate-[-1.5deg]'}`}>
              <span className="relative block aspect-square overflow-hidden">
                <Image src={src} alt={cap} fill sizes="(max-width: 768px) 50vw, 33vw" className="kodachrome object-cover" />
              </span>
              <span className="absolute bottom-3 left-0 right-0 text-center font-script text-lg text-ink">{cap}</span>
            </li>
          ))}
        </ul>
      </section>

      {/* ─── Press archive, styled like the family's newsprint collection ─── */}
      <section className="bg-paper py-16 text-ink" aria-labelledby="press-h">
        <div className="mx-auto max-w-6xl px-4 sm:px-6">
          <div className="flex items-end justify-between border-b-4 border-double border-ink pb-2 text-[11px] font-bold uppercase tracking-[.2em]">
            <span>Parma, Ohio</span>
            <span>The press archive</span>
          </div>
          <h2 id="press-h" className={`${blackletter.className} py-3 text-center text-5xl sm:text-7xl`}>Southside Diner</h2>
          <div className="flex justify-between border-y border-ink py-1 text-[11px] font-bold uppercase tracking-[.2em]">
            <span>Food / People / Recognition</span>
            <span>Since {SITE.since}</span>
          </div>

          {/* Awards */}
          <p className="mt-10 text-center text-xs font-bold uppercase tracking-[.25em]">Two awards. One neighborhood diner.</p>
          <ul className="mt-4 grid gap-6 md:grid-cols-2">
            {AWARDS.map((a) => (
              <li key={a.title} className="border-2 border-ink p-6 text-center">
                <p className="font-display text-sm uppercase tracking-[.25em]">{a.source}</p>
                <p className="mt-2 font-display text-5xl uppercase leading-none tracking-wide text-cherry">{a.title}</p>
                <p className="mt-1 font-display text-2xl">{a.year}</p>
                <p className="mt-4 font-serif text-lg italic">“{a.quote}”</p>
                {a.url && (
                  <a href={a.url} target="_blank" rel="noreferrer" className="mt-3 inline-block text-xs font-bold uppercase tracking-[.2em] underline-offset-4 hover:underline">
                    Read the story ↗
                  </a>
                )}
              </li>
            ))}
          </ul>

          {/* TV */}
          <div className="mt-12 border-t-4 border-double border-ink pt-6">
            <h3 className="text-center font-display text-3xl uppercase tracking-wide">On Fox 8 New Day Cleveland</h3>
            <ul className="mt-5 grid gap-4 sm:grid-cols-3">
              {TV.map((t) => (
                <li key={t.url}>
                  <a href={t.url} target="_blank" rel="noreferrer" className="group flex items-center gap-3 border border-ink p-4 transition hover:bg-ink hover:text-paper">
                    <span className="grid h-11 w-11 shrink-0 place-items-center rounded-full bg-cherry text-white" aria-hidden>▶</span>
                    <span>
                      <span className="block font-display text-xl">{t.year}</span>
                      <span className="block text-sm">{t.title}</span>
                    </span>
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Clippings */}
          <div className="mt-12 border-t-4 border-double border-ink pt-6">
            <h3 className="text-center font-display text-3xl uppercase tracking-wide">In print</h3>
            <ul className="mt-6 columns-1 gap-6 sm:columns-2 lg:columns-3">
              {PRESS.map((p) => (
                <li key={p.url} className="mb-6 break-inside-avoid border-b border-ink/40 pb-5">
                  <p className="text-[11px] font-bold uppercase tracking-[.2em] text-cherry">{p.outlet} · {p.year}</p>
                  <p className="mt-1 font-display text-xl leading-tight">{p.title}</p>
                  <p className="mt-2 font-serif italic">“{p.quote}”</p>
                  <a href={p.url} target="_blank" rel="noreferrer" className="mt-2 inline-block text-xs font-bold uppercase tracking-[.2em] underline-offset-4 hover:underline">
                    Read the story ↗
                  </a>
                </li>
              ))}
            </ul>
            <p className="mt-2 text-center text-sm">
              Also ranked by Stacker from Yelp reviews:{' '}
              {LISTS.map((l, i) => (
                <span key={l.url}>
                  {i > 0 && ' · '}
                  <a href={l.url} target="_blank" rel="noreferrer" className="underline underline-offset-2">{l.label} ({l.year})</a>
                </span>
              ))}
            </p>
          </div>
        </div>
      </section>
    </div>
  );
}
