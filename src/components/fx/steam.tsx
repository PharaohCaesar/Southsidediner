/** A coffee cup with CSS steam. Pure CSS, no JS. */
export function Steam() {
  return (
    <div className="relative h-24 w-20" aria-hidden>
      <style>{`
        @keyframes steam-rise { 0% { transform: translateY(0) scaleX(1); opacity: 0; } 20% { opacity: .55; } 100% { transform: translateY(-46px) scaleX(1.6); opacity: 0; } }
        .steam-w { position:absolute; bottom:52px; width:8px; height:26px; border-radius:50%; background:rgba(255,255,255,.9); filter: blur(4px); animation: steam-rise 2.6s ease-out infinite; }
      `}</style>
      <span className="steam-w" style={{ left: 22, animationDelay: '0s' }} />
      <span className="steam-w" style={{ left: 34, animationDelay: '.9s' }} />
      <span className="steam-w" style={{ left: 46, animationDelay: '1.7s' }} />
      <svg viewBox="0 0 80 60" className="absolute bottom-0 left-0 h-14 w-20 drop-shadow-[0_8px_14px_rgba(0,0,0,.25)]">
        <path d="M8 10 H58 Q58 46 33 46 Q8 46 8 10 Z" fill="#fff" stroke="#c8102e" strokeWidth="3" />
        <path d="M58 16 Q76 16 74 30 Q72 42 56 40" fill="none" stroke="#c8102e" strokeWidth="3" />
        <ellipse cx="33" cy="52" rx="30" ry="5" fill="#fff" stroke="#c8102e" strokeWidth="2" />
      </svg>
    </div>
  );
}
