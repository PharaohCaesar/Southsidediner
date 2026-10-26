/**
 * A guest check modeled on the FMP 2-part pads Southside uses: "Guest Check" heading,
 * Date / Table / Guests / Server boxes with the red check number, the course line,
 * ruled lines (optionally with a price column) and the "Thank You" footer. The yellow
 * kitchen copy is `kitchen`. Anything handwritten on it should use the `.ink` class.
 */
export function GuestCheck({
  number = '6001001',
  date,
  table,
  guests,
  server,
  prices = false,
  kitchen = false,
  footer = true,
  className = '',
  children,
}: {
  number?: string;
  date?: string;
  table?: string;
  guests?: string;
  server?: string;
  prices?: boolean;
  kitchen?: boolean;
  footer?: boolean;
  className?: string;
  children: React.ReactNode;
}) {
  return (
    <div className={`guest-check ${kitchen ? 'guest-check--kitchen' : ''} ${className}`}>
      <span className="gc-title">{kitchen ? 'Kitchen Check' : 'Guest Check'}</span>
      <div className="gc-boxes">
        <div><span>Date</span><b>{date ?? ' '}</b></div>
        <div><span>Table</span><b>{table ?? ' '}</b></div>
        <div><span>Guests</span><b>{guests ?? ' '}</b></div>
        <div><span>Server</span><b>{server ?? ' '}</b></div>
        <div className="gc-no">{number}</div>
      </div>
      <div className="gc-courses">APPT - SOUP/SAL - ENTREE - VEG/POT - DESSERT - BEV</div>
      <div className={`gc-body ${prices ? 'gc-body--prices' : ''}`}>{children}</div>
      {footer && <div className="gc-foot">Thank You — Please Come Again</div>}
    </div>
  );
}

/** Deterministic 7-digit check number from a string (stable across server/client renders). */
export function checkNumber(seed: string): string {
  let h = 0;
  for (const c of seed) h = (h * 31 + c.charCodeAt(0)) | 0;
  return String(6000000 + (Math.abs(h) % 999999));
}
