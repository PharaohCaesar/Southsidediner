import type { Metadata } from 'next';
import Image from 'next/image';
import Link from 'next/link';
import { AWARDS, PRESS, SITE, TV } from '@/lib/site';
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
              <span className="polaroid-cap font-script text-lg text-ink">{cap}</span>
            </li>
          ))}
        </ul>
      </section>

      {/* Recognition teaser: the full archive lives on /press */}
      <section className="bg-ink py-14 text-white" aria-labelledby="rec-h">
        <div className="mx-auto flex max-w-6xl flex-col items-start gap-6 px-4 sm:px-6 lg:flex-row lg:items-center lg:justify-between">
          <div>
            <p className="font-script text-2xl text-mustard">Parma noticed</p>
            <h2 id="rec-h" className="font-display text-4xl uppercase tracking-wide sm:text-5xl">
              {AWARDS.map((a) => `${a.title} ${a.year}`).join(' · ')}
            </h2>
            <p className="mt-2 max-w-2xl text-white/70">
              Plus {TV.length} TV and video features and {PRESS.length} write-ups in Cleveland Scene, Cleveland Magazine and more.
            </p>
          </div>
          <Link
            href="/press"
            className="inline-flex min-h-[52px] shrink-0 items-center rounded-full border-2 border-mustard px-6 font-display text-lg uppercase tracking-[.14em] text-mustard transition hover:bg-mustard hover:text-ink"
          >
            In the news →
          </Link>
        </div>
      </section>
    </div>
  );
}
