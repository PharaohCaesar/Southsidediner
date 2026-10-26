'use client';

import { useState, type FormEvent } from 'react';
import { ding } from '@/components/fx/sound';

type Field =
  | { name: string; label: string; type?: 'text' | 'email' | 'tel'; required?: boolean; placeholder?: string }
  | { name: string; label: string; type: 'textarea'; required?: boolean; placeholder?: string; rows?: number }
  | { name: string; label: string; type: 'select'; required?: boolean; options: readonly string[] };

/** Guest-check styled form that posts JSON to an API route and announces the result. */
const ticketNo = (s: string) => { let h = 0; for (const c of s) h = (h * 31 + c.charCodeAt(0)) | 0; return 1000 + (Math.abs(h) % 9000); };

export function LeadForm({ action, fields, submit, success }: { action: string; fields: Field[]; submit: string; success: string }) {
  const [state, setState] = useState<'idle' | 'busy' | 'ok' | 'err'>('idle');
  const [msg, setMsg] = useState('');

  async function onSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setState('busy');
    const data = Object.fromEntries(new FormData(e.currentTarget).entries());
    try {
      const r = await fetch(action, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(data) });
      const j = (await r.json()) as { ok: boolean; error?: string };
      if (j.ok) { setState('ok'); setMsg(success); ding(); }
      else { setState('err'); setMsg(j.error ?? 'Something went wrong.'); }
    } catch {
      setState('err'); setMsg('No connection — please try again.');
    }
  }

  if (state === 'ok')
    return (
      <div role="status" className="ticket ticket-edge px-8 pb-8 pl-12 pt-8">
        <p className="text-xs font-bold uppercase tracking-[.2em]">Guest check · paid</p>
        <p className="mt-3 text-xl uppercase">Got it.</p>
        <p className="mt-1">{msg}</p>
      </div>
    );

  return (
    <form onSubmit={onSubmit} className="ticket ticket-edge px-6 pb-8 pl-12 pt-7 sm:px-8 sm:pl-14" noValidate>
      <p className="border-b-[3px] border-double border-cherry/70 pb-1 text-xs font-bold uppercase tracking-[.2em]">Guest check · No. {ticketNo(action)}</p>
      <input type="text" name="website" tabIndex={-1} autoComplete="off" className="hidden" aria-hidden />
      <div className="mt-4 grid gap-4 sm:grid-cols-2">
        {fields.map((f) => {
          const cls = 'mt-1 w-full border-0 border-b-2 border-carbon/40 bg-transparent px-0 py-2 font-sans text-base text-ink focus:border-cherry focus:outline-none';
          const full = f.type === 'textarea';
          return (
            <label key={f.name} className={`block ${full ? 'sm:col-span-2' : ''}`}>
              <span className="text-xs font-bold uppercase tracking-[.16em]">
                {f.label}{f.required && <span className="text-cherry"> *</span>}
              </span>
              {f.type === 'textarea' ? (
                <textarea name={f.name} required={f.required} rows={f.rows ?? 4} placeholder={f.placeholder} className={cls} />
              ) : f.type === 'select' ? (
                <select name={f.name} required={f.required} className={cls} defaultValue="">
                  <option value="" disabled>Choose…</option>
                  {f.options.map((o) => <option key={o} value={o}>{o}</option>)}
                </select>
              ) : (
                <input name={f.name} type={f.type ?? 'text'} required={f.required} placeholder={f.placeholder} className={cls} autoComplete={f.type === 'email' ? 'email' : f.type === 'tel' ? 'tel' : 'on'} />
              )}
            </label>
          );
        })}
      </div>
      {state === 'err' && <p role="alert" className="mt-4 rounded bg-cherry/10 px-3 py-2 text-sm font-semibold text-cherry">{msg}</p>}
      <button
        type="submit"
        disabled={state === 'busy'}
        data-bell
        className="mt-6 inline-flex min-h-[48px] items-center rounded bg-cherry px-6 text-sm font-bold uppercase tracking-[.14em] text-white hover:bg-cherry-deep disabled:opacity-60"
      >
        {state === 'busy' ? 'Sending…' : submit}
      </button>
    </form>
  );
}
