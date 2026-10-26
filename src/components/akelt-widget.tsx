import Script from 'next/script';
import { SITE } from '@/lib/site';

/**
 * The Akelt website widget: one script, and every link to the ordering site opens
 * in a popup over this page, plus the restaurant's pop-up messages and "closed today"
 * notice from Admin → Website. No floating button — the site has its own CTAs.
 */
export function AkeltWidget() {
  return <Script src={`${SITE.akeltOrigin}/embed.js`} strategy="lazyOnload" data-button="none" />;
}
