'use client';

import Image from 'next/image';
import { useEffect, useRef, useState } from 'react';
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

const SPEED = 32; // px per second while revolving
const RESUME_AFTER = 2500; // ms of stillness after a touch, drag or arrow before it revolves again
const CAT_LABEL = Object.fromEntries(GALLERY_CATEGORIES.map((c) => [c.key, c.label])) as Record<string, string>;

/**
 * "From the kitchen": an endlessly revolving strip of real plates. It drifts sideways on its own,
 * pauses for hover/touch/focus (and off-screen), and takes drags, swipes, trackpad scrolls and the
 * arrow buttons. The strip is rendered three times and kept inside the middle copy, so it loops
 * with no seam. Tap a plate for the full-screen viewer (arrows, swipe, ←/→, Esc) with the live
 * price and "Order this", which opens the Akelt ordering popup.
 */
export function PhotoGallery({ items }: { items: GalleryItem[] }) {
  const [open, setOpen] = useState<number | null>(null);
  const dialog = useRef<HTMLDialogElement>(null);
  const track = useRef<HTMLDivElement>(null);
  const hold = useRef({ hover: false, focus: false, until: 0 }); // reasons to stand still
  const drag = useRef<{ x: number; left: number; moved: boolean } | null>(null);
  const openRef = useRef(open);
  useEffect(() => { openRef.current = open; }, [open]);

  // The revolve loop.
  useEffect(() => {
    const el = track.current;
    if (!el) return;
    const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    let onScreen = false;
    const io = new IntersectionObserver((es) => { onScreen = es[0].isIntersecting; });
    io.observe(el);

    const set = () => el.scrollWidth / 3; // width of one copy
    // Keep the scroll position inside the middle copy (the outer copies are look-alikes).
    const wrap = () => {
      const w = set();
      if (w <= 0) return;
      if (el.scrollLeft < w * 0.5) el.scrollLeft += w;
      else if (el.scrollLeft >= w * 1.5) el.scrollLeft -= w;
    };
    // Start a little into the middle copy.
    const start = () => { el.scrollLeft = set(); };
    start();
    const ro = new ResizeObserver(() => wrap());
    ro.observe(el);

    let raf = 0;
    let last = performance.now();
    let carry = 0; // sub-pixel progress (scrollLeft rounds to whole pixels)
    const tick = (t: number) => {
      const dt = Math.min(64, t - last);
      last = t;
      const h = hold.current;
      const still = reduce || !onScreen || document.hidden || h.hover || h.focus || drag.current || openRef.current != null || t < h.until;
      if (!still) {
        carry += (SPEED * dt) / 1000;
        const px = Math.floor(carry);
        if (px) { el.scrollLeft += px; carry -= px; }
      }
      wrap();
      raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => { cancelAnimationFrame(raf); io.disconnect(); ro.disconnect(); };
  }, []);

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

  const pauseFor = (ms = RESUME_AFTER) => { hold.current.until = performance.now() + ms; };
  const nudge = (dir: 1 | -1) => {
    const el = track.current;
    if (!el) return;
    pauseFor(RESUME_AFTER + 600);
    el.scrollBy({ left: dir * el.clientWidth * 0.75, behavior: 'smooth' });
  };
  const step = (dir: 1 | -1) => setOpen((o) => (o == null ? o : (o + dir + items.length) % items.length));
  const copies = [0, 1, 2];

  return (
    <>
      <div className="mx-auto mb-6 flex max-w-7xl items-center justify-between gap-4 px-4 sm:px-6">
        <p className="text-sm text-white/50">
          <span className="hidden md:inline">Drag, scroll or use the arrows.</span>
          <span className="md:hidden">Swipe to browse.</span> Tap a plate to see it up close.
        </p>
        <div className="flex gap-2">
          <button
            type="button"
            onClick={() => nudge(-1)}
            aria-label="Scroll photos back"
            className="grid h-12 w-12 place-items-center rounded-full border border-white/25 text-2xl text-white/80 transition hover:border-mustard hover:text-mustard"
          >
            ‹
          </button>
          <button
            type="button"
            onClick={() => nudge(1)}
            aria-label="Scroll photos forward"
            className="grid h-12 w-12 place-items-center rounded-full border border-white/25 text-2xl text-white/80 transition hover:border-mustard hover:text-mustard"
          >
            ›
          </button>
        </div>
      </div>

      <div
        ref={track}
        data-gallery-track
        className="flex cursor-grab gap-3 overflow-x-auto overscroll-x-contain px-4 pb-2 [-ms-overflow-style:none] [scrollbar-width:none] active:cursor-grabbing sm:gap-4 [&::-webkit-scrollbar]:hidden [mask-image:linear-gradient(to_right,transparent,#000_3%,#000_97%,transparent)]"
        onPointerEnter={(e) => { if (e.pointerType === 'mouse') hold.current.hover = true; }}
        onPointerLeave={(e) => {
          if (e.pointerType !== 'mouse') return;
          hold.current.hover = false;
          drag.current = null; // a drag that leaves the strip ends there
        }}
        onFocus={() => { hold.current.focus = true; }}
        onBlur={(e) => { if (!e.currentTarget.contains(e.relatedTarget as Node)) hold.current.focus = false; }}
        onTouchStart={() => pauseFor(60_000)}
        onTouchEnd={() => pauseFor()}
        onWheel={() => pauseFor()}
        onPointerDown={(e) => {
          if (e.pointerType !== 'mouse' || e.button !== 0) return;
          drag.current = { x: e.clientX, left: e.currentTarget.scrollLeft, moved: false };
        }}
        onPointerMove={(e) => {
          const d = drag.current;
          if (!d) return;
          const dx = e.clientX - d.x;
          if (Math.abs(dx) > 5) d.moved = true;
          if (d.moved) e.currentTarget.scrollLeft = d.left - dx;
        }}
        onPointerUp={() => {
          // Leave `moved` readable by the click that follows, then clear.
          const d = drag.current;
          setTimeout(() => { if (drag.current === d) drag.current = null; }, 0);
          pauseFor(1200);
        }}
        onClickCapture={(e) => {
          if (drag.current?.moved) { e.preventDefault(); e.stopPropagation(); } // a drag isn't a tap
        }}
      >
        {copies.map((c) =>
          items.map((p, n) => {
            const twin = c !== 1; // the outer copies exist only for the seamless loop
            return (
              <button
                key={`${c}-${p.src}`}
                type="button"
                tabIndex={twin ? -1 : undefined}
                aria-hidden={twin || undefined}
                onClick={() => setOpen(n)}
                onDragStart={(e) => e.preventDefault()}
                style={{ aspectRatio: `${p.w} / ${p.h}` }}
                className="group relative h-[240px] shrink-0 overflow-hidden rounded-2xl bg-white/5 text-left shadow-[0_14px_30px_rgba(0,0,0,.35)] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-mustard sm:h-[300px] lg:h-[360px]"
                aria-label={twin ? undefined : `${p.label}${p.price ? `, ${p.price}` : ''}: view larger`}
              >
                <Image
                  src={p.src}
                  alt=""
                  fill
                  draggable={false}
                  sizes="(max-width: 640px) 70vw, 560px"
                  className="kodachrome select-none object-cover transition duration-500 group-hover:scale-[1.04]"
                />
                <span className="pointer-events-none absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/80 via-black/30 to-transparent px-3 pb-2.5 pt-10">
                  <span className="block font-display text-lg uppercase leading-tight tracking-wide text-white">{p.label}</span>
                </span>
                {p.price && (
                  // A price tag clipped on, in guest-check mint.
                  <span className="pointer-events-none absolute right-2 top-2 rotate-3 rounded-sm bg-[#d4ecdd] px-2 py-0.5 font-display text-sm tracking-wide text-[#2d4f9e] shadow">
                    {p.price}
                  </span>
                )}
              </button>
            );
          })
        )}
      </div>

      <dialog
        ref={dialog}
        data-lenis-prevent
        aria-label={open != null ? items[open].label : 'Photo'}
        onClose={() => { setOpen(null); window.__lenis?.start(); }}
        onKeyDown={(e) => {
          if (e.key === 'ArrowRight') { e.preventDefault(); step(1); }
          if (e.key === 'ArrowLeft') { e.preventDefault(); step(-1); }
        }}
        onClick={(e) => { if (e.target === e.currentTarget) setOpen(null); }} // backdrop
        className="m-0 h-[100svh] max-h-none w-screen max-w-none overscroll-contain bg-transparent p-0 text-white backdrop:bg-black/90 backdrop:backdrop-blur-sm"
      >
        {open != null && (
          <Viewer
            item={items[open]}
            index={open}
            total={items.length}
            onClose={() => setOpen(null)}
            onStep={step}
          />
        )}
      </dialog>
    </>
  );
}

function Viewer({
  item, index, total, onClose, onStep,
}: {
  item: GalleryItem;
  index: number;
  total: number;
  onClose: () => void;
  onStep: (dir: 1 | -1) => void;
}) {
  const swipeX = useRef<number | null>(null); // swipe left/right on the photo (touch)
  return (
    <div className="flex h-full flex-col" onClick={(e) => { if (e.target === e.currentTarget) onClose(); }}>
      <div className="flex items-center justify-between px-4 py-3 text-sm text-white/60 sm:px-6">
        <span aria-live="polite">{index + 1} / {total}</span>
        <button
          type="button"
          autoFocus
          onClick={onClose}
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
          if (Math.abs(dx) > 50) onStep(dx < 0 ? 1 : -1);
        }}
      >
        <Image key={item.src} src={item.src} alt={item.label} fill sizes="100vw" className="kodachrome animate-rise object-contain" />
        <button
          type="button"
          onClick={() => onStep(-1)}
          aria-label="Previous photo"
          className="absolute left-2 top-1/2 hidden h-12 w-12 -translate-y-1/2 place-items-center rounded-full bg-black/50 text-2xl hover:bg-black/70 sm:grid"
        >
          ‹
        </button>
        <button
          type="button"
          onClick={() => onStep(1)}
          aria-label="Next photo"
          className="absolute right-2 top-1/2 hidden h-12 w-12 -translate-y-1/2 place-items-center rounded-full bg-black/50 text-2xl hover:bg-black/70 sm:grid"
        >
          ›
        </button>
      </div>

      <div className="flex flex-wrap items-center justify-between gap-3 px-4 pb-[calc(16px+env(safe-area-inset-bottom))] pt-4 sm:px-6">
        <div>
          <p className="font-display text-2xl uppercase leading-none tracking-wide sm:text-3xl">{item.label}</p>
          <p className="mt-1 text-sm text-white/60">
            {CAT_LABEL[item.cat]}
            {item.price && <> · <span className="font-semibold text-mustard">{item.price}</span></>}
            <span className="sm:hidden"> · swipe for more</span>
          </p>
        </div>
        <a
          href={SITE.akeltOrigin}
          data-akelt-order="/"
          data-bell
          // Close the viewer first: the ordering popup opens in the page, under a modal dialog.
          onClick={onClose}
          className="inline-flex min-h-[50px] items-center rounded-full bg-cherry px-6 font-display text-lg uppercase tracking-[.12em] text-white shadow-[0_0_24px_rgba(200,16,46,.7)] transition hover:bg-[#e01636]"
        >
          {item.price ? 'Order this' : 'Order online'}
        </a>
      </div>
    </div>
  );
}
