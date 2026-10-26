import type { Metadata } from 'next';
import { SITE, DAY_NAMES } from '@/lib/site';
import { LeadForm } from '@/components/lead-form';
import { OpenNow } from '@/components/open-now';

export const metadata: Metadata = {
  title: 'Find us',
  description: `${SITE.name}, ${SITE.address.line1}, ${SITE.address.city}, ${SITE.address.state}. ${SITE.hoursSummary}. Call ${SITE.phone}.`,
};

export default function ContactPage() {
  const q = encodeURIComponent(`${SITE.name}, ${SITE.address.line1}, ${SITE.address.city}, ${SITE.address.state} ${SITE.address.zip}`);
  return (
    <div className="bg-cream">
      <header className="bg-ink py-14 text-white">
        <div className="mx-auto max-w-7xl px-4 sm:px-6">
          <p className="font-script text-3xl text-mustard">Find us</p>
          <h1 className="font-display text-6xl uppercase tracking-wide sm:text-7xl">
            <span className="neon" style={{ ['--neon-color' as string]: 'var(--neon-blue)' }}>Parma, Ohio</span>
          </h1>
          <div className="mt-5 inline-block"><OpenNow /></div>
        </div>
      </header>

      <div className="mx-auto grid max-w-7xl gap-10 px-4 py-14 sm:px-6 lg:grid-cols-2">
        <div className="space-y-8">
          <div className="overflow-hidden rounded-3xl border-4 border-chrome-dark shadow-[0_20px_50px_rgba(0,0,0,.25)]">
            <iframe
              title="Map to Southside Diner"
              src={`https://www.google.com/maps?q=${q}&output=embed`}
              className="h-72 w-full sm:h-96"
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
            />
          </div>
          <div className="grid gap-6 sm:grid-cols-2">
            <div>
              <h2 className="font-display text-2xl uppercase tracking-wide text-ink">Address</h2>
              <p className="mt-2 text-ink-soft">{SITE.address.line1}<br />{SITE.address.city}, {SITE.address.state} {SITE.address.zip}</p>
              <a href={SITE.mapsUrl} target="_blank" rel="noreferrer" className="mt-3 inline-flex min-h-[44px] items-center rounded-full bg-ink px-5 font-display text-sm uppercase tracking-[.12em] text-cream">Directions</a>
            </div>
            <div>
              <h2 className="font-display text-2xl uppercase tracking-wide text-ink">Phone</h2>
              <a href={`tel:${SITE.phoneE164}`} className="mt-2 block text-2xl font-semibold text-cherry">{SITE.phone}</a>
              <h2 className="mt-5 font-display text-2xl uppercase tracking-wide text-ink">Hours</h2>
              <ul className="mt-2 font-ticket text-sm text-ink">
                {SITE.hours.map((h) => (
                  <li key={h.day} className="flex justify-between gap-6 border-b border-dotted border-ink/20 py-1">
                    <span>{DAY_NAMES[h.day]}</span><span>8:00 AM – 2:00 PM</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
        <div>
          <h2 className="font-display text-3xl uppercase tracking-wide text-ink">Have a question?</h2>
          <p className="mb-5 mt-1 text-ink-soft">Drop us a note. For orders, use the Order Online button — it&apos;s faster.</p>
          <LeadForm
            action="/api/contact"
            submit="Send message"
            success="Thanks — we'll get back to you soon."
            fields={[
              { name: 'name', label: 'Name', required: true },
              { name: 'phone', label: 'Phone', type: 'tel' },
              { name: 'email', label: 'Email', type: 'email' },
              { name: 'message', label: 'Message', type: 'textarea', required: true, rows: 5 },
            ]}
          />
        </div>
      </div>
    </div>
  );
}
