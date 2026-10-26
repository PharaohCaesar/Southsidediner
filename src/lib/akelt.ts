// Reads from the Akelt ordering platform's public feeds. Both are best-effort: the site
// renders without them (static hours / no board), so an Akelt hiccup never takes the
// marketing site down.
import { SITE } from './site';

export type SiteFeed = {
  restaurant: {
    name: string;
    phone: string | null;
    address: string | null;
    maps_url: string | null;
    timezone: string;
    open: boolean;
    opens_at: string | null;
    closes_at: string | null;
  };
  closed: { until: string; message: string | null; text: string } | null;
  popups: unknown[];
  /** Today's specials from Admin → Website (absent on Akelt builds before the specials board). */
  specials?: { title: string; note: string | null; price_cents: number | null }[];
};

export type MenuFeed = {
  restaurant: { name: string; currency: string };
  categories: {
    id: string;
    name: string;
    description: string | null;
    image_url: string | null;
    items: {
      id: string;
      name: string;
      description: string | null;
      price_cents: number;
      image_url: string | null;
      available: boolean;
    }[];
  }[];
};

async function getJson<T>(path: string, revalidate: number): Promise<T | null> {
  try {
    const res = await fetch(`${SITE.akeltOrigin}${path}`, { next: { revalidate } });
    if (!res.ok) return null;
    return (await res.json()) as T;
  } catch {
    return null;
  }
}

export const fetchSiteFeed = () => getJson<SiteFeed>('/api/site', 60);
export const fetchMenu = () => getJson<MenuFeed>('/api/menu', 300);

export function formatPrice(cents: number, currency = 'USD'): string {
  return new Intl.NumberFormat('en-US', { style: 'currency', currency, minimumFractionDigits: 2 }).format(cents / 100);
}
