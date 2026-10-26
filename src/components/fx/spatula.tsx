'use client';

import { useEffect, useRef } from 'react';

// The pointer is a chrome dot with a neon halo that becomes a spatula over the griddle,
// a counter bell over "order" buttons, and a handset over phone numbers. Fine-pointer
// devices only; touch screens never see it (the hero takes a drag gesture instead).

type Mode = 'dot' | 'spatula' | 'bell' | 'phone';

export function Spatula() {
  const ref = useRef<HTMLDivElement>(null);
  useEffect(() => {
    if (!window.matchMedia('(hover: hover) and (pointer: fine)').matches) return;
    const el = ref.current!;
    document.documentElement.classList.add('has-spatula');
    let x = -100, y = -100, tx = -100, ty = -100, raf = 0, mode: Mode = 'dot', down = false;

    const setMode = (m: Mode) => { if (m !== mode) { mode = m; el.dataset.mode = m; } };
    const onMove = (e: PointerEvent) => {
      tx = e.clientX; ty = e.clientY;
      const t = e.target as HTMLElement | null;
      if (!t) return;
      if (t.closest('[data-griddle]')) setMode('spatula');
      else if (t.closest('[data-akelt-order], [data-bell]')) setMode('bell');
      else if (t.closest('a[href^="tel:"]')) setMode('phone');
      else setMode('dot');
    };
    const onDown = () => { down = true; el.dataset.down = '1'; };
    const onUp = () => { down = false; delete el.dataset.down; };
    const onLeave = () => { tx = -100; ty = -100; };
    const loop = () => {
      x += (tx - x) * 0.22; y += (ty - y) * 0.22;
      el.style.transform = `translate(${x}px, ${y}px)`;
      raf = requestAnimationFrame(loop);
    };
    raf = requestAnimationFrame(loop);
    window.addEventListener('pointermove', onMove, { passive: true });
    window.addEventListener('pointerdown', onDown);
    window.addEventListener('pointerup', onUp);
    document.documentElement.addEventListener('mouseleave', onLeave);
    void down;
    return () => {
      cancelAnimationFrame(raf);
      document.documentElement.classList.remove('has-spatula');
      window.removeEventListener('pointermove', onMove);
      window.removeEventListener('pointerdown', onDown);
      window.removeEventListener('pointerup', onUp);
      document.documentElement.removeEventListener('mouseleave', onLeave);
    };
  }, []);

  return (
    <div ref={ref} data-mode="dot" className="spatula pointer-events-none fixed left-0 top-0 z-[90] will-change-transform" aria-hidden>
      <style>{`
        .spatula{--s:1}
        .spatula .dot{position:absolute;left:-6px;top:-6px;width:12px;height:12px;border-radius:50%;
          background:radial-gradient(circle at 35% 35%,#fff,#b8c0c8 60%,#6b727a);
          box-shadow:0 0 0 2px rgba(255,255,255,.5),0 0 14px #ff2f6d,0 0 28px rgba(255,47,109,.6);
          transition:transform .18s ease,opacity .18s ease}
        .spatula .tool{position:absolute;left:-22px;top:-30px;width:60px;height:60px;opacity:0;transform:scale(.6) rotate(-20deg);
          transition:transform .22s cubic-bezier(.2,.9,.3,1.3),opacity .18s ease;filter:drop-shadow(0 6px 10px rgba(0,0,0,.35))}
        .spatula[data-mode="spatula"] .dot,.spatula[data-mode="bell"] .dot,.spatula[data-mode="phone"] .dot{transform:scale(.35);opacity:.6}
        .spatula[data-mode="spatula"] .tool-spatula,.spatula[data-mode="bell"] .tool-bell,.spatula[data-mode="phone"] .tool-phone{opacity:1;transform:scale(1) rotate(0)}
        .spatula[data-down="1"][data-mode="spatula"] .tool-spatula{transform:scale(.92) rotate(-14deg) translateY(4px)}
        .spatula[data-down="1"][data-mode="bell"] .tool-bell{transform:scale(.9) translateY(5px)}
      `}</style>
      <span className="dot" />
      {/* chrome spatula */}
      <svg className="tool tool-spatula" viewBox="0 0 64 64">
        <defs>
          <linearGradient id="chromeG" x1="0" y1="0" x2="1" y2="1">
            <stop offset="0" stopColor="#fff" /><stop offset=".35" stopColor="#c9ced4" /><stop offset=".55" stopColor="#f5f7f9" /><stop offset="1" stopColor="#7d858d" />
          </linearGradient>
        </defs>
        <path d="M6 30 L26 30 L30 10 L6 10 Z" fill="url(#chromeG)" stroke="#5c636b" strokeWidth="1.2" transform="rotate(-35 18 20)" />
        <path d="M22 36 L50 58" stroke="#c8102e" strokeWidth="7" strokeLinecap="round" />
        <path d="M22 36 L50 58" stroke="#ff5a74" strokeWidth="2" strokeLinecap="round" opacity=".6" />
      </svg>
      {/* counter bell */}
      <svg className="tool tool-bell" viewBox="0 0 64 64">
        <ellipse cx="32" cy="50" rx="24" ry="6" fill="#6b727a" />
        <path d="M12 46 Q32 10 52 46 Z" fill="url(#chromeG)" stroke="#5c636b" strokeWidth="1.2" />
        <circle cx="32" cy="14" r="4" fill="#c8102e" />
      </svg>
      {/* rotary handset */}
      <svg className="tool tool-phone" viewBox="0 0 64 64">
        <path d="M12 22 Q32 8 52 22 L48 32 Q32 24 16 32 Z" fill="#c8102e" />
        <rect x="8" y="18" width="12" height="20" rx="6" fill="#c8102e" />
        <rect x="44" y="18" width="12" height="20" rx="6" fill="#c8102e" />
      </svg>
    </div>
  );
}
