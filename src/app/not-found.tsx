import Link from 'next/link';

export default function NotFound() {
  return (
    <div className="mx-auto max-w-2xl px-4 py-24 text-center">
      <p className="font-script text-3xl text-cherry">86&apos;d</p>
      <h1 className="font-display text-5xl uppercase tracking-wide">That page is off the menu.</h1>
      <Link href="/" className="mt-6 inline-flex min-h-[46px] items-center rounded-full bg-ink px-6 font-display uppercase tracking-[.12em] text-cream">
        Back to the counter
      </Link>
    </div>
  );
}
