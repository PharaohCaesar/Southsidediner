'use client';

import { useCallback, useEffect, useRef, useState } from 'react';
import { SITE } from '@/lib/site';
import { sizzle, ding } from '@/components/fx/sound';

// "Fire up the griddle." A raw breakfast sits on a cold flat-top (canvas). Hover or drag
// the spatula and it cooks: a soft brush erases the raw frame to reveal its pixel-aligned
// cooked twin, with steam rising wherever you've been. A coarse grid mirrors the erasing
// to compute "% cooked"; past 70% the rest sizzles through on its own, the headline
// swaps, and "Order's up" takes over. Same engine as the Mirabella "clean the room" hero.

const GRID_W = 64;
const GRID_H = 36;
const DONE_AT = 0.7;

type Particle = { x: number; y: number; vx: number; vy: number; life: number; max: number; r: number };

export function GriddleHero() {
  const wrap = useRef<HTMLDivElement>(null);
  const canvas = useRef<HTMLCanvasElement>(null);
  const steam = useRef<HTMLCanvasElement>(null);
  const grid = useRef<Uint8Array>(new Uint8Array(GRID_W * GRID_H));
  const cooked = useRef(0);
  const finishing = useRef(false);
  const particles = useRef<Particle[]>([]);
  const sizzleTimer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const [pct, setPct] = useState(0);
  const [done, setDone] = useState(false);
  const [ready, setReady] = useState(false);
  const [touched, setTouched] = useState(false);

  // Client-only (runs inside paintRaw after mount), so the width check is safe here.
  const src = (which: 'raw' | 'cooked') => `/images/griddle-${which}${window.innerWidth < 900 ? '-1280' : ''}.webp`;

  // Draw the raw frame to the canvas at the canvas's own resolution.
  const paintRaw = useCallback(() => {
    const c = canvas.current;
    const w = wrap.current;
    if (!c || !w) return;
    const dpr = Math.min(2, window.devicePixelRatio || 1);
    const { width, height } = w.getBoundingClientRect();
    c.width = Math.round(width * dpr);
    c.height = Math.round(height * dpr);
    const s = steam.current;
    if (s) { s.width = c.width; s.height = c.height; }
    const img = new Image();
    img.src = src('raw');
    img.onload = () => {
      const ctx = c.getContext('2d')!;
      ctx.globalCompositeOperation = 'source-over';
      // cover-fit
      const ir = img.width / img.height;
      const cr = c.width / c.height;
      let dw = c.width, dh = c.height, dx = 0, dy = 0;
      if (ir > cr) { dw = c.height * ir; dx = (c.width - dw) / 2; } else { dh = c.width / ir; dy = (c.height - dh) / 2; }
      ctx.clearRect(0, 0, c.width, c.height);
      ctx.drawImage(img, dx, dy, dw, dh);
      // Re-apply what's already cooked after a resize.
      const g = grid.current;
      ctx.globalCompositeOperation = 'destination-out';
      for (let gy = 0; gy < GRID_H; gy++) for (let gx = 0; gx < GRID_W; gx++) {
        if (!g[gy * GRID_W + gx]) continue;
        ctx.fillRect((gx / GRID_W) * c.width - 2, (gy / GRID_H) * c.height - 2, c.width / GRID_W + 4, c.height / GRID_H + 4);
      }
      setReady(true);
    };
  }, []);

  useEffect(() => {
    paintRaw();
    const ro = new ResizeObserver(() => paintRaw());
    if (wrap.current) ro.observe(wrap.current);
    return () => ro.disconnect();
  }, [paintRaw]);

  // Steam particle loop.
  useEffect(() => {
    let raf = 0;
    const loop = () => {
      const s = steam.current;
      if (s) {
        const ctx = s.getContext('2d')!;
        ctx.clearRect(0, 0, s.width, s.height);
        const ps = particles.current;
        for (let i = ps.length - 1; i >= 0; i--) {
          const p = ps[i];
          p.life += 1;
          p.x += p.vx + Math.sin(p.life / 9) * 0.4;
          p.y += p.vy;
          p.r += 0.35;
          if (p.life > p.max) { ps.splice(i, 1); continue; }
          const a = (1 - p.life / p.max) * 0.28;
          const g = ctx.createRadialGradient(p.x, p.y, 0, p.x, p.y, p.r);
          g.addColorStop(0, `rgba(255,255,255,${a})`);
          g.addColorStop(1, 'rgba(255,255,255,0)');
          ctx.fillStyle = g;
          ctx.beginPath();
          ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
          ctx.fill();
        }
      }
      raf = requestAnimationFrame(loop);
    };
    raf = requestAnimationFrame(loop);
    return () => cancelAnimationFrame(raf);
  }, []);

  const puff = (x: number, y: number, n = 2) => {
    const dpr = Math.min(2, window.devicePixelRatio || 1);
    for (let i = 0; i < n; i++) {
      particles.current.push({
        x: x * dpr + (Math.random() - 0.5) * 30, y: y * dpr, vx: (Math.random() - 0.5) * 0.6, vy: -(0.8 + Math.random() * 1.2),
        life: 0, max: 60 + Math.random() * 50, r: 6 + Math.random() * 10,
      });
    }
    if (particles.current.length > 260) particles.current.splice(0, particles.current.length - 260);
  };

  const cookAt = (clientX: number, clientY: number, radius = 70) => {
    const c = canvas.current;
    const w = wrap.current;
    if (!c || !w || finishing.current) return;
    const rect = w.getBoundingClientRect();
    const x = clientX - rect.left, y = clientY - rect.top;
    const dpr = c.width / rect.width;
    const ctx = c.getContext('2d')!;
    ctx.globalCompositeOperation = 'destination-out';
    const g = ctx.createRadialGradient(x * dpr, y * dpr, 0, x * dpr, y * dpr, radius * dpr);
    g.addColorStop(0, 'rgba(0,0,0,1)');
    g.addColorStop(0.55, 'rgba(0,0,0,.85)');
    g.addColorStop(1, 'rgba(0,0,0,0)');
    ctx.fillStyle = g;
    ctx.beginPath();
    ctx.arc(x * dpr, y * dpr, radius * dpr, 0, Math.PI * 2);
    ctx.fill();
    // Mirror into the grid.
    const gr = grid.current;
    const r = radius * 0.7;
    let newly = 0;
    const gx0 = Math.max(0, Math.floor(((x - r) / rect.width) * GRID_W)), gx1 = Math.min(GRID_W - 1, Math.ceil(((x + r) / rect.width) * GRID_W));
    const gy0 = Math.max(0, Math.floor(((y - r) / rect.height) * GRID_H)), gy1 = Math.min(GRID_H - 1, Math.ceil(((y + r) / rect.height) * GRID_H));
    for (let gy = gy0; gy <= gy1; gy++) for (let gx = gx0; gx <= gx1; gx++) {
      const cx = ((gx + 0.5) / GRID_W) * rect.width, cy = ((gy + 0.5) / GRID_H) * rect.height;
      if ((cx - x) ** 2 + (cy - y) ** 2 <= r * r && !gr[gy * GRID_W + gx]) { gr[gy * GRID_W + gx] = 1; newly++; }
    }
    if (newly) {
      cooked.current += newly;
      const p = cooked.current / (GRID_W * GRID_H);
      setPct(p);
      puff(x, y, 1 + Math.min(3, newly));
      if (!touched) setTouched(true);
      sizzle(true);
      if (sizzleTimer.current) clearTimeout(sizzleTimer.current);
      sizzleTimer.current = setTimeout(() => sizzle(false), 450);
      if (p >= DONE_AT) finish();
    }
  };

  const finish = () => {
    if (finishing.current) return;
    finishing.current = true;
    const c = canvas.current!;
    const ctx = c.getContext('2d')!;
    const start = performance.now();
    const rect = wrap.current!.getBoundingClientRect();
    const run = (t: number) => {
      const k = Math.min(1, (t - start) / 1100);
      ctx.globalCompositeOperation = 'destination-out';
      ctx.fillStyle = `rgba(0,0,0,${0.08 + k * 0.25})`;
      ctx.fillRect(0, 0, c.width, c.height);
      for (let i = 0; i < 6; i++) puff(Math.random() * rect.width, Math.random() * rect.height * 0.9, 1);
      if (k < 1) requestAnimationFrame(run);
      else {
        ctx.clearRect(0, 0, c.width, c.height);
        grid.current.fill(1);
        cooked.current = GRID_W * GRID_H;
        setPct(1);
        setDone(true);
        sizzle(false);
        ding();
      }
    };
    requestAnimationFrame(run);
  };

  const reset = () => {
    finishing.current = false;
    grid.current.fill(0);
    cooked.current = 0;
    particles.current = [];
    setPct(0);
    setDone(false);
    setTouched(false);
    paintRaw();
  };

  useEffect(() => () => sizzle(false), []);

  const dragging = useRef(false);
  const onPointer = (e: React.PointerEvent) => {
    if (e.pointerType === 'mouse') { cookAt(e.clientX, e.clientY); return; }
    if (dragging.current) { cookAt(e.clientX, e.clientY, 60); }
  };

  return (
    <section className="relative bg-ink text-white" aria-label="Southside Diner">
      <div
        ref={wrap}
        data-griddle
        className="relative aspect-[16/10] w-full select-none overflow-hidden sm:aspect-[16/8] lg:aspect-[16/7] touch-none"
        onPointerMove={onPointer}
        onPointerDown={(e) => {
          // Buttons and links inside the hero keep their clicks (pointer capture would
          // redirect the click to the griddle). Touch/pen drags cook; the mouse hovers.
          if ((e.target as HTMLElement).closest('a, button')) return;
          if (e.pointerType === 'mouse') return;
          dragging.current = true;
          (e.currentTarget as HTMLElement).setPointerCapture(e.pointerId);
          cookAt(e.clientX, e.clientY, 60);
        }}
        onPointerUp={() => { dragging.current = false; }}
        onPointerCancel={() => { dragging.current = false; }}
      >
        {/* cooked twin underneath */}
        <picture>
          <source media="(max-width: 899px)" srcSet="/images/griddle-cooked-1280.webp" />
          <img src="/images/griddle-cooked.webp" alt="" className="absolute inset-0 h-full w-full object-cover" draggable={false} />
        </picture>
        <canvas ref={canvas} className={`absolute inset-0 h-full w-full transition-opacity duration-500 ${ready ? 'opacity-100' : 'opacity-0'}`} />
        <canvas ref={steam} className="pointer-events-none absolute inset-0 h-full w-full" />
        {/* warm vignette so the headline reads */}
        <div className="pointer-events-none absolute inset-0 bg-[linear-gradient(to_top,rgba(22,18,15,.92)_0%,rgba(22,18,15,.35)_40%,transparent_70%)]" />

        {/* copy */}
        <div className="pointer-events-none absolute inset-x-0 bottom-0 px-4 pb-6 sm:px-8 sm:pb-10 lg:px-12">
          <div className="mx-auto max-w-7xl">
            <p className="font-script text-2xl text-mustard sm:text-3xl">
              {done ? "Order's up." : touched ? 'Keep it moving…' : 'Family owned in Parma since 2008'}
            </p>
            <h1 className="mt-1 font-display text-[12vw] leading-[.9] uppercase tracking-[.02em] sm:text-7xl lg:text-8xl">
              <span className={`neon ${done ? '' : ''}`} style={{ ['--neon-color' as string]: done ? 'var(--neon)' : 'var(--neon-blue)' }}>
                {done ? 'Come and get it' : 'Rise and shine,'}
              </span>
              <br />
              <span className="text-cream">{done ? 'Parma.' : 'Parma.'}</span>
            </h1>
            <p className="mt-3 max-w-xl text-base text-white/80 sm:text-lg">
              {done
                ? 'Corned beef hash, two eggs, peppered bacon. Made from scratch every morning, ready for pickup in 20 minutes.'
                : 'Run the spatula over the griddle to cook breakfast. Or let us do it, like always.'}
            </p>
            <div className="pointer-events-auto mt-5 flex flex-wrap items-center gap-3">
              <a
                href={SITE.akeltOrigin}
                data-akelt-order
                data-bell
                className="ticket ticket-edge inline-flex min-h-[52px] items-center px-6 pl-10 font-ticket text-[15px] uppercase tracking-[.12em] text-carbon transition hover:-translate-y-0.5 hover:rotate-[-1deg]"
              >
                Order online
              </a>
              {!done ? (
                <button
                  type="button"
                  onClick={() => { setTouched(true); finish(); }}
                  className="inline-flex min-h-[48px] items-center rounded-full border border-white/30 px-5 text-sm font-semibold text-white/90 backdrop-blur hover:border-mustard hover:text-mustard"
                >
                  Cook it for me
                </button>
              ) : (
                <button
                  type="button"
                  onClick={reset}
                  className="inline-flex min-h-[48px] items-center rounded-full border border-white/30 px-5 text-sm font-semibold text-white/90 backdrop-blur hover:border-mustard hover:text-mustard"
                >
                  Start over
                </button>
              )}
              <span className="ml-1 text-xs font-semibold uppercase tracking-[.2em] text-white/50" aria-live="polite">
                {done ? 'Cooked' : `${Math.round(pct * 100)}% cooked`}
              </span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
