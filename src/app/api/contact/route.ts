import { NextResponse, type NextRequest } from 'next/server';
import { emailReady, sendLead, rateLimited, clip } from '@/lib/email';

export async function POST(req: NextRequest) {
  const ip = req.headers.get('x-forwarded-for')?.split(',')[0]?.trim() ?? 'local';
  if (rateLimited(ip, 'contact')) return NextResponse.json({ ok: false, error: 'Too many messages — try again in a few minutes.' }, { status: 429 });
  const b = (await req.json().catch(() => ({}))) as Record<string, unknown>;
  if (b.website) return NextResponse.json({ ok: true }); // honeypot
  const name = clip(b.name, 80), email = clip(b.email, 120), phone = clip(b.phone, 40), message = clip(b.message, 2000);
  if (!name || !message || (!email && !phone)) return NextResponse.json({ ok: false, error: 'Add your name, a way to reach you, and your message.' }, { status: 400 });
  if (!emailReady()) return NextResponse.json({ ok: false, error: 'Our contact form is still being set up — please call us.' }, { status: 503 });
  try {
    await sendLead(`Website message from ${name}`, { Name: name, Email: email, Phone: phone, Message: message }, email || undefined);
    return NextResponse.json({ ok: true });
  } catch {
    return NextResponse.json({ ok: false, error: 'That did not go through — please call us.' }, { status: 502 });
  }
}
