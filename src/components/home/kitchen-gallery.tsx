import { GALLERY } from '@/lib/site';
import { fetchMenu, formatPrice } from '@/lib/akelt';
// Only the component and a type come from the client module (a VALUE imported from a
// 'use client' file arrives here as a client-reference proxy).
import { PhotoGallery, type GalleryItem } from '@/components/photo-gallery';

const norm = (s: string) => s.toLowerCase().replace(/[’‘`]/g, "'").replace(/\s+/g, ' ').trim();

/** "From the kitchen": the homepage photo wall, priced from the live Akelt menu. */
export async function KitchenGallery() {
  const menu = await fetchMenu();
  const prices = new Map<string, number>();
  for (const c of menu?.categories ?? [])
    for (const i of c.items) if (i.available && !prices.has(norm(i.name))) prices.set(norm(i.name), i.price_cents);

  const items: GalleryItem[] = GALLERY.map(({ menu: name, ...p }) => {
    const cents = name ? prices.get(norm(name)) : undefined;
    return { ...p, price: cents != null ? formatPrice(cents, menu?.restaurant.currency) : null };
  });

  return (
    <section className="relative overflow-hidden bg-ink py-20 text-white" aria-labelledby="kitchen-h">
      <div className="checker-floor opacity-20" />
      {/* The floor shows behind the heading only, then fades out so the food has a quiet backdrop. */}
      <div className="absolute inset-0 bg-gradient-to-b from-transparent via-ink via-[38%] to-ink" aria-hidden />
      <div className="relative mx-auto max-w-7xl px-4 sm:px-6">
        <div className="flex flex-wrap items-end justify-between gap-6">
          <div>
            <p className="font-script text-3xl text-mustard">Hot off the griddle</p>
            <h2 id="kitchen-h" className="font-display text-5xl uppercase leading-[.95] tracking-wide sm:text-6xl">
              From the kitchen
            </h2>
            <p className="mt-3 max-w-xl text-white/70">
              Real plates, photographed in our kitchen.
            </p>
          </div>
        </div>
      </div>
      {/* Full-bleed: the strip runs edge to edge; its controls line up with the page column. */}
      <div className="relative mt-8">
        <PhotoGallery items={items} />
      </div>
    </section>
  );
}
