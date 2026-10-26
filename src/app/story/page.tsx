import type { Metadata } from 'next';
import Image from 'next/image';
import { PRESS, SITE } from '@/lib/site';
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
            In {SITE.since}, {SITE.owners} took over a spot on West Pleasant Valley Road and turned it into Southside Diner.
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

      <section className="bg-ink py-16 text-white" aria-labelledby="press-h">
        <div className="mx-auto max-w-7xl px-4 sm:px-6">
          <h2 id="press-h" className="font-script text-3xl text-mustard">What people say</h2>
          <ul className="mt-6 grid gap-6 md:grid-cols-3">
            {PRESS.map((p) => (
              <li key={p.outlet} className="rounded-2xl border border-white/10 p-6">
                <p className="text-lg italic">“{p.quote}”</p>
                <a href={p.url} target="_blank" rel="noreferrer" className="mt-3 block font-display text-sm uppercase tracking-[.2em] text-mustard hover:underline">{p.outlet} ↗</a>
              </li>
            ))}
          </ul>
        </div>
      </section>
    </div>
  );
}
