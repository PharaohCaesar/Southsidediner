import type { Metadata } from 'next';
import Link from 'next/link';
import { UnifrakturMaguntia } from 'next/font/google';
import { AWARDS, LISTS, PRESS, SITE, TV } from '@/lib/site';

const blackletter = UnifrakturMaguntia({ weight: '400', subsets: ['latin'] });

export const metadata: Metadata = {
  title: 'In the news',
  description: `${SITE.name} in the press: Best Diner (Cleveland Scene, Best of Cleveland 2016), Ohio's Best Diner (PureWow 2017), Fox 8 New Day Cleveland, Yelp Cleveland, Cleveland Magazine and more.`,
  alternates: { canonical: '/press' },
};

export default function PressPage() {
  return (
    <div className="bg-paper">
      {/* ─── Press archive, styled like the family's newsprint collection ─── */}
      <section className="bg-paper py-16 text-ink" aria-labelledby="press-h">
        <div className="mx-auto max-w-6xl px-4 sm:px-6">
          <div className="flex items-end justify-between border-b-4 border-double border-ink pb-2 text-[11px] font-bold uppercase tracking-[.2em]">
            <span>Parma, Ohio</span>
            <span>In the news</span>
          </div>
          <h1 id="press-h" className={`${blackletter.className} py-3 text-center text-5xl sm:text-7xl`}>
            <span className="sr-only">In the news: </span>Southside Diner
          </h1>
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

          {/* TV + video interviews */}
          <div className="mt-12 border-t-4 border-double border-ink pt-6">
            <h3 className="text-center font-display text-3xl uppercase tracking-wide">On camera</h3>
            <ul className="mt-5 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
              {TV.map((t) => (
                <li key={t.url}>
                  <a href={t.url} target="_blank" rel="noreferrer" className="group flex h-full items-center gap-3 border border-ink p-4 transition hover:bg-ink hover:text-paper">
                    <span className="grid h-11 w-11 shrink-0 place-items-center rounded-full bg-cherry text-white" aria-hidden>▶</span>
                    <span>
                      <span className="block font-display text-xl">{t.year}</span>
                      <span className="block text-[11px] font-bold uppercase tracking-[.2em] text-cherry group-hover:text-mustard">{t.source}</span>
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

      <p className="pb-16 text-center">
        <Link href="/story" className="font-display text-lg uppercase tracking-[.14em] text-cherry underline-offset-4 hover:underline">← Our story</Link>
      </p>
    </div>
  );
}
