'use client';

import Link from 'next/link';
import Image from 'next/image';
import { useEffect, useState } from 'react';
import { usePathname } from 'next/navigation';
import { SITE } from '@/lib/site';
import { SoundToggle } from '@/components/fx/sound';

const LINKS = [
  { href: '/menu', label: 'Menu' },
  { href: '/story', label: 'Our story' },
  { href: '/jobs', label: 'Join the team' },
  { href: '/contact', label: 'Find us' },
];

export function Nav() {
  const path = usePathname();
  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  useEffect(() => {
    const on = () => setScrolled(window.scrollY > 24);
    const id = requestAnimationFrame(on);
    window.addEventListener('scroll', on, { passive: true });
    return () => { cancelAnimationFrame(id); window.removeEventListener('scroll', on); };
  }, []);

  return (
    <header
      className={`sticky top-0 z-40 transition-colors duration-300 ${
        scrolled || open ? 'bg-ink/95 backdrop-blur-md shadow-[0_8px_30px_rgba(0,0,0,.35)]' : 'bg-ink'
      }`}
    >
      <div className="mx-auto flex max-w-7xl items-center gap-4 px-4 py-3 sm:px-6">
        <Link href="/" className="flex items-center gap-3" aria-label={`${SITE.name} home`}>
          <Image src="/photos/logo.png" alt="" width={46} height={46} priority className="drop-shadow-[0_0_12px_rgba(255,47,109,.55)]" />
          <span className="hidden flex-col leading-none sm:flex">
            <span className="font-display text-xl tracking-[.08em] text-white">SOUTHSIDE DINER</span>
            <span className="font-script text-[13px] text-mustard">{SITE.tagline}</span>
          </span>
        </Link>

        <nav aria-label="Primary" className="ml-auto hidden items-center gap-1 md:flex">
          {LINKS.map((l) => {
            const active = path.startsWith(l.href);
            return (
              <Link
                key={l.href}
                href={l.href}
                aria-current={active ? 'page' : undefined}
                className={`nav-tube rounded-full px-4 py-2 font-display text-[15px] uppercase tracking-[.14em] transition ${
                  active ? 'text-white neon' : 'text-white/70 hover:text-white hover:neon'
                }`}
                style={{ ['--neon-color' as string]: 'var(--neon-blue)' }}
              >
                {l.label}
              </Link>
            );
          })}
        </nav>

        <div className="ml-auto flex items-center gap-2 md:ml-3">
          <SoundToggle />
          <a
            href={`tel:${SITE.phoneE164}`}
            className="hidden rounded-full px-3 py-2 text-sm font-semibold text-white/80 hover:text-white lg:inline-flex"
          >
            {SITE.phone}
          </a>
          <a
            href={SITE.akeltOrigin}
            data-akelt-order="/"
            data-bell
            className="inline-flex min-h-[42px] items-center gap-2 rounded-full bg-cherry px-4 font-display text-[15px] uppercase tracking-[.12em] text-white shadow-[0_0_18px_rgba(200,16,46,.65)] transition hover:bg-[#e01636] hover:shadow-[0_0_28px_rgba(255,47,109,.8)]"
          >
            Order online
          </a>
          <button
            type="button"
            onClick={() => setOpen((v) => !v)}
            aria-expanded={open}
            aria-controls="mobile-nav"
            aria-label={open ? 'Close menu' : 'Open menu'}
            className="grid h-11 w-11 place-items-center rounded-full text-white md:hidden"
          >
            <span className="relative block h-4 w-6">
              <span className={`absolute left-0 top-0 h-0.5 w-6 bg-current transition ${open ? 'translate-y-[7px] rotate-45' : ''}`} />
              <span className={`absolute left-0 top-[7px] h-0.5 w-6 bg-current transition ${open ? 'opacity-0' : ''}`} />
              <span className={`absolute left-0 top-[14px] h-0.5 w-6 bg-current transition ${open ? '-translate-y-[7px] -rotate-45' : ''}`} />
            </span>
          </button>
        </div>
      </div>

      <div id="mobile-nav" hidden={!open} className="border-t border-white/10 bg-ink px-4 pb-5 pt-2 md:hidden">
        <nav aria-label="Mobile" className="flex flex-col">
          {LINKS.map((l) => (
            <Link key={l.href} href={l.href} onClick={() => setOpen(false)} className="py-3 font-display text-2xl uppercase tracking-[.12em] text-white">
              {l.label}
            </Link>
          ))}
          <a href={`tel:${SITE.phoneE164}`} className="py-3 text-base font-semibold text-mustard">
            Call {SITE.phone}
          </a>
        </nav>
      </div>
    </header>
  );
}
