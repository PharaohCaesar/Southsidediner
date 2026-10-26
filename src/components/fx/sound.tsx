'use client';

import { useEffect, useState } from 'react';

// Diner sounds, synthesized with Web Audio (no files): a counter bell "ding" on order
// buttons and a short griddle sizzle for the hero. Muted until the visitor flips the
// jukebox toggle; the preference sticks in localStorage.

let ctx: AudioContext | null = null;
function audio() {
  if (!ctx) ctx = new (window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext)();
  if (ctx.state === 'suspended') void ctx.resume();
  return ctx;
}

export function soundOn(): boolean {
  try { return localStorage.getItem('ssd.sound') === '1'; } catch { return false; }
}

export function ding() {
  if (!soundOn()) return;
  const c = audio();
  const t = c.currentTime;
  const master = c.createGain();
  master.gain.setValueAtTime(0.0001, t);
  master.gain.exponentialRampToValueAtTime(0.5, t + 0.004);
  master.gain.exponentialRampToValueAtTime(0.0001, t + 1.4);
  master.connect(c.destination);
  // Bell = a few inharmonic partials.
  for (const [f, g] of [[1960, 1], [3250, 0.45], [4700, 0.22], [1180, 0.3]] as const) {
    const o = c.createOscillator();
    const og = c.createGain();
    o.type = 'sine';
    o.frequency.value = f;
    og.gain.value = g;
    o.connect(og).connect(master);
    o.start(t);
    o.stop(t + 1.4);
  }
}

let sizzleNode: { stop: () => void } | null = null;
export function sizzle(on: boolean) {
  if (!on) { sizzleNode?.stop(); sizzleNode = null; return; }
  if (!soundOn() || sizzleNode) return;
  const c = audio();
  const buf = c.createBuffer(1, c.sampleRate * 2, c.sampleRate);
  const d = buf.getChannelData(0);
  for (let i = 0; i < d.length; i++) d[i] = (Math.random() * 2 - 1) * (0.6 + 0.4 * Math.random());
  const src = c.createBufferSource();
  src.buffer = buf;
  src.loop = true;
  const hp = c.createBiquadFilter();
  hp.type = 'highpass';
  hp.frequency.value = 2400;
  const g = c.createGain();
  g.gain.setValueAtTime(0.0001, c.currentTime);
  g.gain.exponentialRampToValueAtTime(0.12, c.currentTime + 0.3);
  src.connect(hp).connect(g).connect(c.destination);
  src.start();
  sizzleNode = {
    stop: () => {
      g.gain.exponentialRampToValueAtTime(0.0001, c.currentTime + 0.5);
      setTimeout(() => src.stop(), 600);
    },
  };
}

/** Jukebox-style toggle in the nav. Also wires the bell to every [data-bell] element. */
export function SoundToggle() {
  const [on, setOn] = useState(false);
  useEffect(() => {
    const id = requestAnimationFrame(() => setOn(soundOn()));
    return () => cancelAnimationFrame(id);
  }, []);
  useEffect(() => {
    const h = (e: Event) => {
      const t = (e.target as HTMLElement | null)?.closest?.('[data-bell]');
      if (t) ding();
    };
    document.addEventListener('click', h);
    return () => document.removeEventListener('click', h);
  }, []);
  function toggle() {
    const next = !on;
    setOn(next);
    try { localStorage.setItem('ssd.sound', next ? '1' : '0'); } catch {}
    if (next) { audio(); setTimeout(ding, 50); }
  }
  return (
    <button
      type="button"
      onClick={toggle}
      aria-pressed={on}
      aria-label={on ? 'Turn diner sounds off' : 'Turn diner sounds on'}
      title={on ? 'Sounds on' : 'Sounds off'}
      className={`grid h-10 w-10 place-items-center rounded-full border transition ${
        on ? 'border-mustard text-mustard shadow-[0_0_14px_rgba(242,177,52,.6)]' : 'border-white/20 text-white/50 hover:text-white'
      }`}
    >
      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
        <path d="M9 18V6l10-2v12" />
        <circle cx="6" cy="18" r="3" />
        <circle cx="16" cy="16" r="3" />
      </svg>
    </button>
  );
}
