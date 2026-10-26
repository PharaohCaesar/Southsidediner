'use client';

import { useEffect, useState } from 'react';
import { SITE } from '@/lib/site';
import type { SiteFeed } from '@/lib/akelt';

/**
 * Live "open now" from the Akelt feed (the same hours and "closed today" switch the
 * ordering page uses). Falls back to the static hours line if the feed is unreachable.
 */
export function OpenNow({ compact = false }: { compact?: boolean }) {
  const [feed, setFeed] = useState<SiteFeed | null>(null);
  const [time, setTime] = useState('');
  useEffect(() => {
    fetch(`${SITE.akeltOrigin}/api/site`, { mode: 'cors' })
      .then((r) => (r.ok ? r.json() : null))
      .then((d) => d && setFeed(d))
      .catch(() => {});
    const tick = () =>
      setTime(new Date().toLocaleTimeString('en-US', { timeZone: SITE.timezone, hour: 'numeric', minute: '2-digit' }));
    tick();
    const t = setInterval(tick, 15_000);
    return () => clearInterval(t);
  }, []);

  const closed = feed?.closed;
  const open = feed ? feed.restaurant.open : null;

  return (
    <div className={`flex items-center gap-3 ${compact ? '' : 'rounded-2xl border border-white/10 bg-white/5 px-4 py-3'}`} role="status">
      <span className="relative flex h-3 w-3">
        {open && <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-emerald-400 opacity-75" />}
        <span className={`relative inline-flex h-3 w-3 rounded-full ${open ? 'bg-emerald-400 shadow-[0_0_10px_#34d399]' : open === false ? 'bg-cherry shadow-[0_0_10px_#ff2f6d]' : 'bg-white/30'}`} />
      </span>
      <span className="text-sm">
        {closed ? (
          <strong className="text-cream">{closed.text}</strong>
        ) : open === null ? (
          <span className="text-white/70">{SITE.hoursSummary}</span>
        ) : open ? (
          <>
            <strong className="text-cream">Open now</strong>
            <span className="text-white/60"> · until {feed!.restaurant.closes_at}</span>
          </>
        ) : (
          <>
            <strong className="text-cream">Closed</strong>
            <span className="text-white/60">{feed!.restaurant.opens_at ? ` · opens ${feed!.restaurant.opens_at}` : ''}</span>
          </>
        )}
        {time && <span className="ml-2 font-ticket text-xs text-white/40">{time} in Parma</span>}
      </span>
    </div>
  );
}
