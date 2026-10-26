import Image from 'next/image';
import Link from 'next/link';
import { PRESS, SITE } from '@/lib/site';
import { Starburst } from '@/components/fx/starburst';
import { Steam } from '@/components/fx/steam';

export function StoryStrip() {
  return (
    <section className="relative overflow-hidden bg-cream py-20" aria-labelledby="story-h">
      <div className="mx-auto grid max-w-7xl gap-12 px-4 sm:px-6 lg:grid-cols-2 lg:items-center">
        <div className="relative">
          <div className="polaroid rotate-[-2deg]">
            <Image src="/photos/spread.jpg" alt="A table full of Southside breakfast: pancakes, omelettes, hash and waffles" width={1800} height={1200} className="kodachrome" sizes="(max-width: 1024px) 100vw, 600px" />
            <p className="absolute bottom-3 left-0 right-0 text-center font-script text-2xl text-ink">Saturday, 9:40 AM</p>
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
            A real diner.<br />Real people.
          </h2>
          <p className="mt-5 text-lg text-ink-soft">
            In {SITE.since}, {SITE.owners} turned a corner spot on Pleasant Valley into the place Parma starts its day.
            Red booths, a license-plate wall, coffee ground in-house, and a kitchen that makes the corned beef hash,
            the potato pancakes, and the gravy from scratch every single morning.
          </p>
          <ul className="mt-6 grid gap-3 sm:grid-cols-2">
            {PRESS.map((p) => (
              <li key={p.outlet} className="rounded-2xl border border-ink/10 bg-white/60 p-4">
                <p className="text-sm italic text-ink">“{p.quote}”</p>
                <a href={p.url} target="_blank" rel="noreferrer" className="mt-2 block text-xs font-bold uppercase tracking-wider text-cherry hover:underline">
                  {p.outlet} ↗
                </a>
              </li>
            ))}
          </ul>
          <Link href="/story" className="mt-6 inline-flex min-h-[46px] items-center rounded-full border-2 border-ink px-6 font-display text-[15px] uppercase tracking-[.12em] text-ink transition hover:bg-ink hover:text-cream">
            The whole story
          </Link>
        </div>
      </div>
    </section>
  );
}
