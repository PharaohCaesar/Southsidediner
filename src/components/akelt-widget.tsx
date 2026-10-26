import Script from 'next/script';
import { SITE } from '@/lib/site';

declare global {
  interface Window {
    /** Set by Akelt's /embed.js once loaded: opens/closes the ordering popup. */
    Akelt?: { open: (path?: string) => void; close: () => void };
  }
}

/**
 * The Akelt website widget: one script, and every link to the ordering site opens
 * in a popup over this page, plus the restaurant's pop-up messages and "closed today"
 * notice from Admin → Website. No floating button — the site has its own CTAs.
 */
export function AkeltWidget() {
  return <Script src={`${SITE.akeltOrigin}/embed.js`} strategy="lazyOnload" data-button="none" />;
}
