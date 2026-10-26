'use client';

import { useEffect, useState } from 'react';
import { SITE } from '@/lib/site';

const btn = 'flex min-h-[56px] flex-1 flex-col items-center justify-center gap-1 text-[11px] font-bold uppercase tracking-[.14em]';

/**
 * Phone-only "Call · Order · Directions" bar pinned to the bottom of the screen (thumb
 * reach). It slides up once you've scrolled past the hero, so it never covers the griddle
 * or the hero's own buttons; while it's up the nav hides its own Order button (globals.css).
 * Desktop has these in the nav instead.
 */
export function ActionBar() {
  const [show, setShow] = useState(false);
  useEffect(() => {
    const on = () => {
      const up = window.scrollY > window.innerHeight * 0.55;
      setShow(up);
      document.documentElement.toggleAttribute('data-bar-up', up);
    };
    const id = requestAnimationFrame(on);
    window.addEventListener('scroll', on, { passive: true });
    return () => {
      cancelAnimationFrame(id);
      window.removeEventListener('scroll', on);
      document.documentElement.removeAttribute('data-bar-up');
    };
  }, []);

  return (
    <nav
      aria-label="Quick actions"
      data-action-bar
      inert={!show}
      className={`fixed inset-x-0 bottom-0 z-40 border-t border-white/10 bg-ink/95 pb-[env(safe-area-inset-bottom)] text-white shadow-[0_-10px_30px_rgba(0,0,0,.45)] backdrop-blur-md transition-transform duration-300 md:hidden ${
        show ? 'translate-y-0' : 'translate-y-full'
      }`}
    >
      <div className="chrome-strip h-[3px]" aria-hidden />
      <div className="flex items-stretch">
        <a href={`tel:${SITE.phoneE164}`} className={`${btn} text-white/85 active:bg-white/5`}>
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
            <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.8 19.8 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6A19.8 19.8 0 0 1 2.1 4.18 2 2 0 0 1 4.1 2h3a2 2 0 0 1 2 1.72c.13.96.36 1.9.7 2.81a2 2 0 0 1-.45 2.11L8.1 9.9a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45c.9.34 1.85.57 2.81.7A2 2 0 0 1 22 16.92z" />
          </svg>
          Call
        </a>
        <a
          href={SITE.akeltOrigin}
          data-akelt-order="/"
          data-bell
          className={`${btn} -mt-3 mx-1 rounded-t-xl bg-cherry text-[13px] text-white shadow-[0_0_18px_rgba(200,16,46,.65)] active:bg-cherry-deep`}
        >
          <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
            <path d="M4 18h16M5 18a7 7 0 0 1 14 0M12 8V6M10 6h4" />
          </svg>
          <span className="font-display tracking-[.12em]">Order online</span>
        </a>
        <a href={SITE.mapsUrl} target="_blank" rel="noopener" className={`${btn} text-white/85 active:bg-white/5`}>
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
            <path d="M12 22s-7-6.2-7-12a7 7 0 0 1 14 0c0 5.8-7 12-7 12z" /><circle cx="12" cy="10" r="2.5" />
          </svg>
          Directions
        </a>
      </div>
    </nav>
  );
}
