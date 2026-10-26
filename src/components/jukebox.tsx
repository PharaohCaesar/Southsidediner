'use client';

import Image from 'next/image';
import { useState } from 'react';
import { SIGNATURES, SITE } from '@/lib/site';
import { ding } from '@/components/fx/sound';

/**
 * The seven signature dishes behind jukebox title cards. Pick one: the mechanism
 * selects it, a 45 spins up, and the dish swings in.
 */
export function Jukebox() {
  const [i, setI] = useState(0);
  const [spin, setSpin] = useState(0);
  const dish = SIGNATURES[i];
  const pick = (n: number) => {
    if (n === i) return;
    setI(n);
    setSpin((s) => s + 1);
    ding();
  };

  return (
    <section className="relative overflow-hidden bg-ink py-20 text-white" aria-labelledby="juke-h">
      <div className="checker-floor opacity-30" />
      <div className="relative mx-auto grid max-w-7xl gap-10 px-4 sm:px-6 lg:grid-cols-[420px_1fr] lg:items-center">
        {/* the box */}
        <div className="rounded-[28px] border-[6px] border-chrome-dark bg-[#2a1b1b] p-5 shadow-[0_30px_80px_rgba(0,0,0,.6),inset_0_0_40px_rgba(0,0,0,.6)]">
          <div className="mb-4 flex items-center justify-between">
            <p className="font-script text-2xl text-mustard">Our dishes</p>
            <span className="neon-tube rounded-full px-3 py-1 font-display text-xs tracking-[.2em]" style={{ ['--neon-color' as string]: 'var(--neon-blue)' }}>
              SELECT
            </span>
          </div>
          <h2 id="juke-h" className="sr-only">Signature dishes</h2>
          <ol className="grid grid-cols-1 gap-1.5">
            {SIGNATURES.map((d, n) => (
              <li key={d.slug}>
                <button
                  type="button"
                  onClick={() => pick(n)}
                  aria-pressed={n === i}
                  className={`flex w-full items-center gap-3 rounded-md border px-3 py-2 text-left font-ticket text-[15px] transition ${
                    n === i
                      ? 'border-mustard bg-paper text-ink shadow-[0_0_18px_rgba(242,177,52,.5)]'
                      : 'border-white/10 bg-white/5 text-white/80 hover:border-white/30 hover:bg-white/10'
                  }`}
                >
                  <span className={`grid h-7 w-9 place-items-center rounded-sm text-xs font-bold ${n === i ? 'bg-cherry text-white' : 'bg-black/40 text-mustard'}`}>
                    {d.track}
                  </span>
                  <span className="flex-1 truncate uppercase tracking-wide">{d.name}</span>
                  <span className={`h-2 w-2 rounded-full ${n === i ? 'bg-cherry shadow-[0_0_8px_#ff2f6d]' : 'bg-white/20'}`} aria-hidden />
                </button>
              </li>
            ))}
          </ol>
          <div className="mt-4 flex items-center justify-between text-[11px] uppercase tracking-[.25em] text-white/40">
            <span>Southside · Hi-Fi</span>
            <span>5¢ a play</span>
          </div>
        </div>

        {/* the record + dish */}
        <div className="relative mx-auto w-full max-w-[560px]">
          <div
            key={spin}
            className="relative mx-auto aspect-square w-full animate-[rise_.5s_ease-out] rounded-full bg-[radial-gradient(circle,#2b2b2b_0_18%,#0e0e0e_18%_19%,#1a1a1a_19%_100%)] shadow-[0_30px_60px_rgba(0,0,0,.6)]"
          >
            <div className="absolute inset-0 rounded-full bg-[repeating-radial-gradient(circle,transparent_0_3px,rgba(255,255,255,.035)_3px_4px)] spin-slow" style={{ animationDuration: '6s' }} aria-hidden />
            <div className="absolute inset-[12%] overflow-hidden rounded-full ring-8 ring-cherry">
              <Image key={dish.slug} src={dish.photo} alt={dish.name} fill sizes="(max-width: 1024px) 90vw, 560px" className="kodachrome object-cover animate-rise" />
            </div>
            <div className="absolute left-1/2 top-1/2 h-5 w-5 -translate-x-1/2 -translate-y-1/2 rounded-full bg-cream" aria-hidden />
          </div>
          {/* tonearm: pivot top-right, head resting on the groove */}
          <svg className="pointer-events-none absolute -right-4 -top-4 hidden h-[62%] w-[38%] sm:block" viewBox="0 0 120 200" aria-hidden>
            <circle cx="96" cy="22" r="16" fill="#9aa3ad" stroke="#5c636b" strokeWidth="2" />
            <circle cx="96" cy="22" r="6" fill="#d9dde2" />
            <g transform="rotate(16 96 22)">
              <rect x="92" y="22" width="8" height="140" rx="4" fill="url(#armG)" />
              <rect x="80" y="156" width="30" height="18" rx="4" fill="#2a2a2e" stroke="#9aa3ad" strokeWidth="1.5" />
              <rect x="92" y="172" width="6" height="8" fill="#c8102e" />
            </g>
            <defs>
              <linearGradient id="armG" x1="0" x2="1">
                <stop offset="0" stopColor="#6b727a" /><stop offset=".5" stopColor="#f5f7f9" /><stop offset="1" stopColor="#6b727a" />
              </linearGradient>
            </defs>
          </svg>
          <div className="mt-6 text-center lg:text-left">
            <h3 className="font-display text-4xl uppercase tracking-wide">{dish.name}</h3>
            <p className="mx-auto mt-2 max-w-md text-white/75 lg:mx-0">{dish.blurb}</p>
            <a href={SITE.akeltOrigin} data-akelt-order data-bell className="mt-4 inline-flex min-h-[46px] items-center rounded-full bg-cherry px-6 font-display text-[15px] uppercase tracking-[.12em] text-white shadow-[0_0_18px_rgba(200,16,46,.6)] hover:bg-[#e01636]">
              Order this
            </a>
          </div>
        </div>
      </div>
    </section>
  );
}
