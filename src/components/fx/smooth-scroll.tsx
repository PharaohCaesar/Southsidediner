'use client';

import { useEffect } from 'react';
import Lenis from 'lenis';

declare global {
  interface Window {
    /** The page's Lenis instance, so overlays (the photo viewer) can pause scrolling. */
    __lenis?: Lenis;
  }
}

/** Buttery scroll like Vagón / Mirabella. Cleans up on unmount. */
export function SmoothScroll() {
  useEffect(() => {
    const lenis = new Lenis({ lerp: 0.11, smoothWheel: true });
    window.__lenis = lenis;
    let raf = 0;
    const loop = (t: number) => {
      lenis.raf(t);
      raf = requestAnimationFrame(loop);
    };
    raf = requestAnimationFrame(loop);
    return () => {
      cancelAnimationFrame(raf);
      lenis.destroy();
      if (window.__lenis === lenis) delete window.__lenis;
    };
  }, []);
  return null;
}
