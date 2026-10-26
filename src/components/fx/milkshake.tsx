'use client';

import { useEffect, useState } from 'react';

/** Scroll progress as a milkshake glass filling up. Cherry on top at the footer. */
export function Milkshake() {
  const [p, setP] = useState(0);
  useEffect(() => {
    const on = () => {
      const max = document.documentElement.scrollHeight - window.innerHeight;
      setP(max > 0 ? Math.min(1, window.scrollY / max) : 0);
    };
    on();
    window.addEventListener('scroll', on, { passive: true });
    window.addEventListener('resize', on);
    return () => { window.removeEventListener('scroll', on); window.removeEventListener('resize', on); };
  }, []);
  const fill = 68 * p;
  return (
    <div className="pointer-events-none fixed bottom-6 right-5 z-30 hidden md:block" aria-hidden>
      <svg width="44" height="110" viewBox="0 0 44 110">
        <defs>
          <clipPath id="glass">
            <path d="M8 24 L36 24 L32 96 Q22 102 12 96 Z" />
          </clipPath>
        </defs>
        {/* straw */}
        <rect x="26" y="2" width="4" height="40" rx="2" transform="rotate(14 28 2)" fill="#fff" stroke="#c8102e" strokeWidth="1.2" />
        {/* shake */}
        <g clipPath="url(#glass)">
          <rect x="0" y={96 - fill} width="44" height={fill + 10} fill="#ff9fb8" />
          <rect x="0" y={96 - fill} width="44" height="4" fill="#ffd6e1" />
        </g>
        {/* glass */}
        <path d="M8 24 L36 24 L32 96 Q22 102 12 96 Z" fill="rgba(255,255,255,.18)" stroke="#9aa3ad" strokeWidth="2" />
        {/* whipped cream + cherry at the end */}
        <g style={{ opacity: p > 0.97 ? 1 : 0, transition: 'opacity .4s' }}>
          <ellipse cx="22" cy="22" rx="15" ry="8" fill="#fff" />
          <circle cx="22" cy="12" r="5" fill="#c8102e" />
          <path d="M22 8 q3 -6 7 -5" stroke="#2f7d32" strokeWidth="1.5" fill="none" />
        </g>
      </svg>
    </div>
  );
}
