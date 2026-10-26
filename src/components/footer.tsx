import Link from 'next/link';
import { SITE, DAY_NAMES } from '@/lib/site';
import { Receipt } from '@/components/fx/receipt';

/** The footer is a receipt printing out of a dot-matrix printer as it scrolls in. */
export function Footer() {
  const year = new Date().getFullYear();
  const lines: { l: string; r?: string; bold?: boolean; gap?: boolean }[] = [
    { l: SITE.name.toUpperCase(), bold: true },
    { l: `${SITE.address.line1}` },
    { l: `${SITE.address.city}, ${SITE.address.state} ${SITE.address.zip}` },
    { l: `TEL ${SITE.phone}`, gap: true },
    { l: 'HOURS', bold: true },
    ...SITE.hours.map((h) => ({ l: DAY_NAMES[h.day].slice(0, 3).toUpperCase(), r: '8:00 AM - 2:00 PM' })),
    { l: 'SERVER: THE WHOLE FAMILY', gap: true },
    { l: 'SINCE', r: String(SITE.since) },
    { l: 'MADE FROM SCRATCH', r: 'ALWAYS' },
    { l: 'COFFEE', r: 'GROUND IN-HOUSE' },
    { l: 'TOTAL', r: 'A HAPPY MORNING', bold: true, gap: true },
    { l: '*** THANK YOU, COME AGAIN ***', gap: true },
  ];

  return (
    <footer className="relative overflow-hidden bg-ink pt-16 text-white">
      <div className="mx-auto grid max-w-7xl gap-12 px-4 pb-16 sm:px-6 lg:grid-cols-[1fr_360px]">
        <div className="space-y-8">
          <p className="font-script text-3xl text-mustard">Thanks for stopping in.</p>
          <nav aria-label="Footer" className="grid grid-cols-2 gap-x-8 gap-y-2 text-sm sm:grid-cols-3">
            <Link href="/menu" className="hover:text-mustard">Menu</Link>
            <Link href="/story" className="hover:text-mustard">Our story</Link>
            <Link href="/jobs" className="hover:text-mustard">Join the team</Link>
            <Link href="/contact" className="hover:text-mustard">Find us</Link>
            <a href={SITE.akeltOrigin} data-akelt-order="/" className="hover:text-mustard">Order online</a>
            <a href={SITE.mapsUrl} target="_blank" rel="noreferrer" className="hover:text-mustard">Directions</a>
          </nav>
          <div className="flex flex-wrap gap-3 text-sm">
            <a href={SITE.social.facebook} target="_blank" rel="noreferrer" className="rounded-full border border-white/15 px-4 py-2 hover:border-mustard hover:text-mustard">Facebook</a>
            <a href={SITE.social.instagram} target="_blank" rel="noreferrer" className="rounded-full border border-white/15 px-4 py-2 hover:border-mustard hover:text-mustard">Instagram</a>
            <a href={SITE.social.yelp} target="_blank" rel="noreferrer" className="rounded-full border border-white/15 px-4 py-2 hover:border-mustard hover:text-mustard">Yelp</a>
          </div>
          <p className="text-xs text-white/40">
            © {year} {SITE.name}. Family owned and operated in {SITE.city}, Ohio since {SITE.since}.
          </p>
        </div>
        <Receipt lines={lines} />
      </div>
    </footer>
  );
}
