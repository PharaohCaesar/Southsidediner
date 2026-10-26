/** Googie starburst badge, slowly rotating, with the text held upright. */
export function Starburst({ text, className = '', tone = 'cherry' }: { text: string; className?: string; tone?: 'cherry' | 'mustard' }) {
  return (
    <div className={`relative grid h-32 w-32 place-items-center ${className}`} aria-hidden>
      <div
        className={`absolute inset-0 spin-slow ${tone === 'mustard' ? 'bg-mustard drop-shadow-[0_8px_18px_rgba(0,0,0,.3)]' : 'bg-cherry drop-shadow-[0_8px_18px_rgba(200,16,46,.45)]'}`}
        style={{
          clipPath:
            'polygon(50% 0%,59% 14%,74% 5%,76% 22%,93% 19%,86% 34%,100% 40%,89% 52%,100% 65%,84% 69%,88% 86%,72% 80%,66% 97%,54% 85%,41% 100%,36% 83%,20% 91%,23% 74%,7% 72%,16% 58%,0% 50%,13% 40%,3% 25%,20% 24%,15% 8%,31% 14%,37% 0%)',
        }}
      />
      <span className={`relative px-5 text-center font-script text-xl leading-tight ${tone === 'mustard' ? 'text-ink' : 'text-cream'}`}>{text}</span>
    </div>
  );
}
