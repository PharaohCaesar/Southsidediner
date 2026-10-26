'use client';

// The griddle sizzle for the hero, synthesized with Web Audio (no files). Plays while the
// visitor cooks; browsers only allow it after a tap/click on the page (a touch drag counts,
// a mouse hover doesn't), so desktop hover-cooking stays silent until they've clicked once.

let ctx: AudioContext | null = null;
function audio() {
  if (!ctx) ctx = new (window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext)();
  if (ctx.state === 'suspended') void ctx.resume();
  return ctx;
}

let sizzleNode: { stop: () => void } | null = null;
export function sizzle(on: boolean) {
  if (!on) { sizzleNode?.stop(); sizzleNode = null; return; }
  if (sizzleNode) return;
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
