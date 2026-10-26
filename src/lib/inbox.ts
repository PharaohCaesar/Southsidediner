import 'server-only';
import { SITE } from './site';

// Hands contact messages and job applications to Akelt → Admin → Inbox, server to server, with
// the restaurant's website key (Admin → Inbox → "Connect your website"). Runs alongside the
// Resend email; a lead is delivered when either one lands.

export function inboxReady(): boolean {
  return Boolean(process.env.AKELT_INBOX_KEY);
}

export type InboxMessage = {
  kind: 'contact' | 'job';
  name: string;
  email?: string;
  phone?: string;
  subject?: string;
  message?: string;
  fields?: Record<string, string>;
};

export async function saveToInbox(m: InboxMessage): Promise<void> {
  const res = await fetch(`${SITE.akeltOrigin}/api/site/messages`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${process.env.AKELT_INBOX_KEY}` },
    body: JSON.stringify({ ...m, source: SITE.url }),
    cache: 'no-store',
    signal: AbortSignal.timeout(8000),
  });
  if (!res.ok) throw new Error(`Inbox answered ${res.status}`);
}
