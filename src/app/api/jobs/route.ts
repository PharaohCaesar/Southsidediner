import { NextResponse, type NextRequest } from 'next/server';
import { emailReady, sendLead, rateLimited, clip } from '@/lib/email';
import { JOBS } from '@/lib/site';

export async function POST(req: NextRequest) {
  const ip = req.headers.get('x-forwarded-for')?.split(',')[0]?.trim() ?? 'local';
  if (rateLimited(ip, 'jobs')) return NextResponse.json({ ok: false, error: 'Too many submissions — try again in a few minutes.' }, { status: 429 });
  const b = (await req.json().catch(() => ({}))) as Record<string, unknown>;
  if (b.website) return NextResponse.json({ ok: true });
  const name = clip(b.name, 80), phone = clip(b.phone, 40), email = clip(b.email, 120);
  const position = clip(b.position, 40), schedule = clip(b.schedule, 20), experience = clip(b.experience, 600), why = clip(b.why, 2000);
  if (!name || !phone || !(JOBS.positions as readonly string[]).includes(position))
    return NextResponse.json({ ok: false, error: 'Add your name, phone number, and the job you are applying for.' }, { status: 400 });
  if (!emailReady()) return NextResponse.json({ ok: false, error: 'Applications are still being set up online — stop in and ask for a manager.' }, { status: 503 });
  try {
    await sendLead(`Job application: ${position} — ${name}`, { Name: name, Phone: phone, Email: email, Position: position, Schedule: schedule, Experience: experience, 'Why hire you': why }, email || undefined);
    return NextResponse.json({ ok: true });
  } catch {
    return NextResponse.json({ ok: false, error: 'That did not go through — stop in and ask for a manager.' }, { status: 502 });
  }
}
