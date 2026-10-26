'use client';

import { useState, type FormEvent } from 'react';
import { ding } from '@/components/fx/sound';
import { GuestCheck, checkNumber } from '@/components/guest-check';

type Field =
  | { name: string; label: string; type?: 'text' | 'email' | 'tel'; required?: boolean; placeholder?: string }
  | { name: string; label: string; type: 'textarea'; required?: boolean; placeholder?: string; rows?: number }
  | { name: string; label: string; type: 'select'; required?: boolean; options: readonly string[] };

/**
 * A form written on a guest check, like the FMP pads the diner uses: labels in the pad's
 * printed blue, answers in ballpoint ink sitting on the ruled lines. Posts JSON to an API
 * route and announces the result.
 */
export function LeadForm({ action, fields, submit, success, server = 'Web' }: {
  action: string; fields: Field[]; submit: string; success: string; server?: string;
}) {
  const [state, setState] = useState<'idle' | 'busy' | 'ok' | 'err'>('idle');
  const [msg, setMsg] = useState('');
  const no = checkNumber(action);

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
      <div role="status">
        <GuestCheck number={no} server={server} kitchen>
          <p className="ink text-2xl font-bold">Got it — thank you!</p>
          <p className="ink text-xl">{msg}</p>
          <p className="ink text-xl">&nbsp;</p>
        </GuestCheck>
      </div>
    );

  // Each field takes two ruled lines: the printed label, then the handwritten answer.
  const input = 'ink block h-8 w-full border-0 bg-transparent p-0 text-xl leading-8 placeholder:text-[#7d9a8c] focus:outline-none focus:ring-0';
  return (
    <form onSubmit={onSubmit} noValidate>
      <GuestCheck number={no} server={server}>
        <input type="text" name="website" tabIndex={-1} autoComplete="off" className="hidden" aria-hidden />
        <div className="grid gap-x-6 sm:grid-cols-2">
          {fields.map((f) => (
            <label key={f.name} className={`block ${f.type === 'textarea' ? 'sm:col-span-2' : ''}`}>
              <span className="block h-8 text-[11px] font-bold uppercase leading-8 tracking-[.14em]">
                {f.label}{f.required && <span className="text-[#d8432e]"> *</span>}
              </span>
              {f.type === 'textarea' ? (
                <textarea name={f.name} required={f.required} rows={f.rows ?? 4} placeholder={f.placeholder} className={`${input} h-auto resize-none`} />
              ) : f.type === 'select' ? (
                <select name={f.name} required={f.required} className={input} defaultValue="">
                  <option value="" disabled>Choose…</option>
                  {f.options.map((o) => <option key={o} value={o}>{o}</option>)}
                </select>
              ) : (
                <input name={f.name} type={f.type ?? 'text'} required={f.required} placeholder={f.placeholder} className={input}
                  autoComplete={f.type === 'email' ? 'email' : f.type === 'tel' ? 'tel' : 'on'} />
              )}
            </label>
          ))}
        </div>
        {state === 'err' && <p role="alert" className="ink text-lg font-bold leading-8 text-[#d8432e]">{msg}</p>}
        <div className="py-3">
          <button
            type="submit"
            disabled={state === 'busy'}
            data-bell
            className="inline-flex min-h-[46px] items-center rounded-sm bg-[#2d4f9e] px-6 font-display text-[15px] uppercase tracking-[.14em] text-white shadow hover:bg-[#223e80] disabled:opacity-60"
          >
            {state === 'busy' ? 'Sending…' : submit}
          </button>
        </div>
      </GuestCheck>
    </form>
  );
}
