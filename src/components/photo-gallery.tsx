'use client';

import Image from 'next/image';
import { useEffect, useMemo, useRef, useState } from 'react';
import { GALLERY_CATEGORIES, SITE, type GalleryCategory } from '@/lib/site';

export type GalleryItem = {
  src: string;
  label: string;
  cat: GalleryCategory;
  w: number;
  h: number;
  /** Live menu price, e.g. "$15.99" (null when the photo isn't a single menu item or the feed is down). */
  price: string | null;
};

const FIRST = 12; // tiles shown before "See all"
const CAT_LABEL = Object.fromEntries(GALLERY_CATEGORIES.map((c) => [c.key, c.label])) as Record<string, string>;

/**
 * "From the kitchen": a filterable masonry wall of real plates. Tap a photo for a full-screen
 * viewer (arrows, swipe, ←/→, Esc) with the live price and an "Order this" button that opens the
 * Akelt ordering popup.
 */
export function PhotoGallery({ items }: { items: GalleryItem[] }) {
  const [cat, setCat] = useState<'all' | GalleryCategory>('all');
  const [showAll, setShowAll] = useState(false);
  const [open, setOpen] = useState<number | null>(null);
  const dialog = useRef<HTMLDialogElement>(null);

  const list = useMemo(() => (cat === 'all' ? items : items.filter((i) => i.cat === cat)), [items, cat]);
  const shown = showAll ? list : list.slice(0, FIRST);
  const current = open != null ? list[open] : null;

  // Drive the native <dialog> from state; pause the page's smooth scrolling while it's up.
  useEffect(() => {
    const d = dialog.current;
    if (!d) return;
    if (open != null && !d.open) {
      d.showModal();
      window.__lenis?.stop();
    } else if (open == null && d.open) {
      d.close();
    }
  }, [open]);

  const step = (dir: 1 | -1) => setOpen((o) => (o == null ? o : (o + dir + list.length) % list.length));

  // Swipe left/right on the photo (touch).
  const swipeX = useRef<number | null>(null);

  return (
    <>
      <div className="flex flex-wrap gap-2" role="group" aria-label="Filter photos">
        {GALLERY_CATEGORIES.map((c) => {
          const active = cat === c.key;
          return (
            <button
              key={c.key}
              type="button"
              aria-pressed={active}
              onClick={() => { setCat(c.key); setShowAll(false); }}
              className={`min-h-[42px] rounded-full px-4 font-display text-[15px] uppercase tracking-[.12em] transition ${
                active
                  ? 'bg-mustard text-ink shadow-[0_0_18px_rgba(242,177,52,.45)]'
                  : 'border border-white/20 text-white/75 hover:border-white/50 hover:text-white'
              }`}
            >
              {c.label}
            </button>
          );
        })}
      </div>

      <ul key={cat} className="mt-8 columns-2 gap-3 sm:gap-4 md:columns-3 xl:columns-4" aria-label="Photos">
        {shown.map((p, n) => (
          <li key={p.src} className="mb-3 break-inside-avoid sm:mb-4">
            <button
              type="button"
              onClick={() => setOpen(n)}
              className="group relative block w-full overflow-hidden rounded-2xl bg-white/5 text-left shadow-[0_14px_30px_rgba(0,0,0,.35)] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-mustard animate-rise"
              style={{ animationDelay: `${Math.min(n, 11) * 40}ms` }}
              aria-label={`${p.label}${p.price ? `, ${p.price}` : ''}: view larger`}
            >
              <Image
                src={p.src}
                alt=""
                width={p.w}
                height={p.h}
                sizes="(max-width: 768px) 50vw, (max-width: 1280px) 33vw, 25vw"
                className="kodachrome h-auto w-full transition duration-500 group-hover:scale-[1.04]"
              />
              <span className="pointer-events-none absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/80 via-black/30 to-transparent px-3 pb-2.5 pt-10 transition md:translate-y-2 md:opacity-0 md:group-hover:translate-y-0 md:group-hover:opacity-100 md:group-focus-visible:translate-y-0 md:group-focus-visible:opacity-100">
                <span className="block font-display text-base uppercase leading-tight tracking-wide text-white sm:text-lg">{p.label}</span>
              </span>
              {p.price && (
                // A price tag clipped on, in guest-check mint.
                <span className="pointer-events-none absolute right-2 top-2 rotate-3 rounded-sm bg-[#d4ecdd] px-2 py-0.5 font-display text-sm tracking-wide text-[#2d4f9e] shadow transition md:opacity-0 md:group-hover:opacity-100 md:group-focus-visible:opacity-100">
                  {p.price}
                </span>
              )}
            </button>
          </li>
        ))}
      </ul>

      {list.length > FIRST && !showAll && (
        <div className="mt-4 text-center">
          <button
            type="button"
            onClick={() => setShowAll(true)}
            className="inline-flex min-h-[48px] items-center rounded-full border-2 border-mustard px-6 font-display text-[15px] uppercase tracking-[.14em] text-mustard transition hover:bg-mustard hover:text-ink"
          >
            See all {list.length} plates
          </button>
        </div>
      )}

      <dialog
        ref={dialog}
        data-lenis-prevent
        aria-label={current ? current.label : 'Photo'}
        onClose={() => { setOpen(null); window.__lenis?.start(); }}
        onKeyDown={(e) => {
          if (e.key === 'ArrowRight') { e.preventDefault(); step(1); }
          if (e.key === 'ArrowLeft') { e.preventDefault(); step(-1); }
        }}
        onClick={(e) => { if (e.target === e.currentTarget) setOpen(null); }} // backdrop
        className="m-0 h-[100svh] max-h-none w-screen max-w-none overscroll-contain bg-transparent p-0 text-white backdrop:bg-black/90 backdrop:backdrop-blur-sm"
      >
        {current && (
          <div className="flex h-full flex-col" onClick={(e) => { if (e.target === e.currentTarget) setOpen(null); }}>
            <div className="flex items-center justify-between px-4 py-3 text-sm text-white/60 sm:px-6">
              <span aria-live="polite">{(open ?? 0) + 1} / {list.length}</span>
              <button
                type="button"
                autoFocus
                onClick={() => setOpen(null)}
                aria-label="Close"
                className="grid h-11 w-11 place-items-center rounded-full bg-white/10 text-xl text-white hover:bg-white/20"
              >
                ✕
              </button>
            </div>

            <div
              className="relative min-h-0 flex-1 touch-pan-y"
              onPointerDown={(e) => { swipeX.current = e.pointerType === 'mouse' ? null : e.clientX; }}
              onPointerUp={(e) => {
                if (swipeX.current == null) return;
                const dx = e.clientX - swipeX.current;
                swipeX.current = null;
                if (Math.abs(dx) > 50) step(dx < 0 ? 1 : -1);
              }}
            >
              <Image key={current.src} src={current.src} alt={current.label} fill sizes="100vw" className="kodachrome animate-rise object-contain" />
              <button
                type="button"
                onClick={() => step(-1)}
                aria-label="Previous photo"
                className="absolute left-2 top-1/2 hidden h-12 w-12 -translate-y-1/2 place-items-center rounded-full bg-black/50 text-2xl hover:bg-black/70 sm:grid"
              >
                ‹
              </button>
              <button
                type="button"
                onClick={() => step(1)}
                aria-label="Next photo"
                className="absolute right-2 top-1/2 hidden h-12 w-12 -translate-y-1/2 place-items-center rounded-full bg-black/50 text-2xl hover:bg-black/70 sm:grid"
              >
                ›
              </button>
            </div>

            <div className="flex flex-wrap items-center justify-between gap-3 px-4 pb-[calc(16px+env(safe-area-inset-bottom))] pt-4 sm:px-6">
              <div>
                <p className="font-display text-2xl uppercase leading-none tracking-wide sm:text-3xl">{current.label}</p>
                <p className="mt-1 text-sm text-white/60">
                  {CAT_LABEL[current.cat]}
                  {current.price && <> · <span className="font-semibold text-mustard">{current.price}</span></>}
                  <span className="sm:hidden"> · swipe for more</span>
                </p>
              </div>
              <a
                href={SITE.akeltOrigin}
                data-akelt-order="/"
                data-bell
                // Close the viewer first: the ordering popup opens in the page, under a modal dialog.
                onClick={() => setOpen(null)}
                className="inline-flex min-h-[50px] items-center rounded-full bg-cherry px-6 font-display text-lg uppercase tracking-[.12em] text-white shadow-[0_0_24px_rgba(200,16,46,.7)] transition hover:bg-[#e01636]"
              >
                {current.price ? 'Order this' : 'Order online'}
              </a>
            </div>
          </div>
        )}
      </dialog>
    </>
  );
}
