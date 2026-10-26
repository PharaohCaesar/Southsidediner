import type { Metadata } from 'next';
import Image from 'next/image';
import { fetchMenu, formatPrice } from '@/lib/akelt';
import { SITE } from '@/lib/site';

export const metadata: Metadata = {
  title: 'Menu',
  description: 'The full Southside Diner menu with prices: breakfast hashes, benedicts, omelettes, pancakes, melts, reubens, gyros, burgers and more. Order online for pickup.',
};
export const revalidate = 300;

/** The menu is the ordering platform's menu: same items, same prices, never stale. */
export default async function MenuPage() {
  const menu = await fetchMenu();
  const cats = menu?.categories ?? [];

  return (
    <div className="bg-cream">
      <header className="bg-ink py-14 text-white">
        <div className="mx-auto max-w-7xl px-4 sm:px-6">
          <p className="font-script text-3xl text-mustard">Breakfast · Lunch</p>
          <h1 className="font-display text-6xl uppercase tracking-wide sm:text-7xl">
            <span className="neon" style={{ ['--neon-color' as string]: 'var(--neon)' }}>The menu</span>
          </h1>
          <p className="mt-3 max-w-xl text-white/75">
            Everything made from scratch. Prices below are today&apos;s prices — tap any dish to order it for pickup.
          </p>
          {cats.length > 0 && (
            <nav aria-label="Menu sections" className="mt-6 flex gap-2 overflow-x-auto pb-2 [scrollbar-width:none]">
              {cats.map((c) => (
                <a key={c.id} href={`#${c.id}`} className="whitespace-nowrap rounded-full border border-white/20 px-4 py-2 text-sm font-semibold hover:border-mustard hover:text-mustard">
                  {c.name}
                </a>
              ))}
            </nav>
          )}
        </div>
      </header>

      <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6">
        {cats.length === 0 ? (
          <div className="ticket ticket-edge mx-auto max-w-md px-8 pb-8 pl-12 pt-8 text-center">
            <p className="text-lg uppercase">The menu is being written up.</p>
            <p className="mt-2 text-sm">Give us a call — {SITE.phone}</p>
            <a href={SITE.akeltOrigin} data-akelt-order className="mt-4 inline-block rounded bg-cherry px-5 py-3 text-sm font-bold uppercase tracking-wider text-white">
              See the menu on the ordering page
            </a>
          </div>
        ) : (
          <div className="space-y-16">
            {cats.map((c) => (
              <section key={c.id} id={c.id} aria-labelledby={`h-${c.id}`} className="scroll-mt-24">
                <div className="flex items-end gap-4">
                  {c.image_url && (
                    <span className="relative hidden h-16 w-24 overflow-hidden rounded-xl sm:block">
                      <Image src={c.image_url} alt="" fill sizes="96px" className="kodachrome object-cover" />
                    </span>
                  )}
                  <div>
                    <h2 id={`h-${c.id}`} className="font-display text-4xl uppercase tracking-wide text-ink">{c.name}</h2>
                    {c.description && <p className="text-ink-soft">{c.description}</p>}
                  </div>
                </div>
                <div className="chrome-strip mt-3" aria-hidden />
                <ul className="mt-6 grid gap-x-10 gap-y-5 md:grid-cols-2">
                  {c.items.map((it) => (
                    <li key={it.id} className={it.available ? '' : 'opacity-50'}>
                      <a href={`${SITE.akeltOrigin}/`} data-akelt-order className="group flex gap-4">
                        {it.image_url && (
                          <span className="relative h-20 w-20 shrink-0 overflow-hidden rounded-xl shadow">
                            <Image src={it.image_url} alt="" fill sizes="80px" className="kodachrome object-cover transition group-hover:scale-105" />
                          </span>
                        )}
                        <span className="min-w-0 flex-1">
                          <span className="flex items-baseline gap-2">
                            <span className="font-display text-xl uppercase tracking-wide text-ink group-hover:text-cherry">{it.name}</span>
                            <span className="flex-1 border-b border-dotted border-ink/30" aria-hidden />
                            <span className="font-ticket text-base text-carbon">{formatPrice(it.price_cents, menu?.restaurant.currency)}</span>
                          </span>
                          {it.description && <span className="mt-1 block text-sm text-ink-soft">{it.description}</span>}
                          {!it.available && <span className="mt-1 block text-xs font-bold uppercase tracking-wider text-cherry">86&apos;d today</span>}
                        </span>
                      </a>
                    </li>
                  ))}
                </ul>
              </section>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
