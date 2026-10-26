import 'server-only';
import { Resend } from 'resend';
import { SITE } from './site';

// Contact + job application delivery. Without RESEND_API_KEY the routes answer 503 with a
// friendly "being set up" so a half-configured deploy never silently drops a lead.

export function emailReady(): boolean {
  return Boolean(process.env.RESEND_API_KEY && process.env.RESEND_FROM);
}

export async function sendLead(subject: string, fields: Record<string, string>, replyTo?: string): Promise<void> {
  const resend = new Resend(process.env.RESEND_API_KEY);
  const rows = Object.entries(fields)
    .filter(([, v]) => v)
    .map(([k, v]) => `<tr><td style="padding:6px 12px 6px 0;color:#6b6460;white-space:nowrap;vertical-align:top">${esc(k)}</td><td style="padding:6px 0">${esc(v).replace(/\n/g, '<br>')}</td></tr>`)
    .join('');
  const { error } = await resend.emails.send({
    from: process.env.RESEND_FROM!,
    to: (process.env.LEADS_TO ?? SITE.email).split(',').map((s) => s.trim()),
    replyTo,
    subject,
    html: `<div style="font-family:system-ui,sans-serif;font-size:15px;color:#16120f"><h2 style="margin:0 0 12px">${esc(subject)}</h2><table>${rows}</table><p style="margin-top:20px;color:#6b6460;font-size:12px">Sent from ${esc(SITE.url)}</p></div>`,
  });
  if (error) throw new Error(error.message);
}

const esc = (s: string) => s.replace(/[&<>"]/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' })[c] ?? c);

/** Tiny per-IP rate limit (best-effort, per instance). */
const hits = new Map<string, number[]>();
export function rateLimited(ip: string, bucket = 'form', max = 5, windowMs = 10 * 60_000): boolean {
  const key = `${bucket}:${ip}`;
  const now = Date.now();
  const arr = (hits.get(key) ?? []).filter((t) => now - t < windowMs);
  if (arr.length >= max) return true;
  arr.push(now);
  hits.set(key, arr);
  return false;
}

export const clip = (v: unknown, max: number) => String(v ?? '').trim().slice(0, max);
