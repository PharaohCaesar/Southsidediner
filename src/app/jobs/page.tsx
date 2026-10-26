import type { Metadata } from 'next';
import { JOBS, SITE } from '@/lib/site';
import { LeadForm } from '@/components/lead-form';
import { Starburst } from '@/components/fx/starburst';

export const metadata: Metadata = {
  title: 'Join the team',
  description: `${SITE.name} is hiring servers, cooks, bussers and prep cooks in Parma, OH. Excellent pay, employee meals, flexible schedules. Apply online.`,
};

export default function JobsPage() {
  return (
    <div className="bg-cream">
      <header className="relative overflow-hidden bg-cherry py-16 text-white">
        <div className="mx-auto flex max-w-7xl items-center justify-between gap-6 px-4 sm:px-6">
          <div>
            <p className="font-script text-3xl text-mustard">Now hiring</p>
            <h1 className="font-display text-6xl uppercase leading-[.95] tracking-wide sm:text-7xl">Join the team</h1>
            <p className="mt-4 max-w-xl text-lg text-white/85">
              We&apos;re a busy diner looking for self-motivated, reliable people. Apply below and we&apos;ll get back to you fast.
            </p>
          </div>
          <Starburst text="Apply today" tone="mustard" className="hidden sm:grid" />
        </div>
      </header>
      <div className="mx-auto grid max-w-7xl gap-10 px-4 py-14 sm:px-6 lg:grid-cols-[1fr_1.3fr]">
        <div>
          <h2 className="font-display text-3xl uppercase tracking-wide text-ink">What we offer</h2>
          <ul className="mt-4 space-y-3">
            {JOBS.perks.map((p) => (
              <li key={p} className="flex items-center gap-3 text-lg text-ink">
                <span className="grid h-7 w-7 place-items-center rounded-full bg-cherry text-sm font-bold text-white">✓</span>
                {p}
              </li>
            ))}
          </ul>
          <h2 className="mt-8 font-display text-3xl uppercase tracking-wide text-ink">Open positions</h2>
          <ul className="mt-3 flex flex-wrap gap-2">
            {JOBS.positions.map((p) => (
              <li key={p} className="rounded-full border-2 border-ink px-4 py-1.5 font-display text-sm uppercase tracking-[.12em] text-ink">{p}</li>
            ))}
          </ul>
          <p className="mt-8 text-ink-soft">
            Prefer to talk? Stop in any day between 8 and 2 and ask for a manager, or call {SITE.phone}.
          </p>
        </div>
        <LeadForm
          action="/api/jobs"
          submit="Send application"
          success="We'll call you as soon as we can. Thanks for applying!"
          fields={[
            { name: 'name', label: 'Name', required: true },
            { name: 'phone', label: 'Phone', type: 'tel', required: true },
            { name: 'email', label: 'Email', type: 'email' },
            { name: 'position', label: 'Applying for', type: 'select', required: true, options: JOBS.positions },
            { name: 'schedule', label: 'Schedule', type: 'select', options: JOBS.schedules },
            { name: 'experience', label: 'Service-industry experience', placeholder: 'e.g. 3 years serving' },
            { name: 'why', label: 'Why should we hire you?', type: 'textarea', rows: 4 },
          ]}
        />
      </div>
    </div>
  );
}
