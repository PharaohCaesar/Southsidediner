import { AWARDS, SITE } from '@/lib/site';

/** Restaurant structured data. Hours mirror SITE.hours; the live state lives in Akelt. */
export function JsonLd() {
  const data = {
    '@context': 'https://schema.org',
    '@type': 'Restaurant',
    '@id': `${SITE.url}/#restaurant`,
    name: SITE.name,
    url: SITE.url,
    image: `${SITE.url}/photos/spread.jpg`,
    logo: `${SITE.url}/photos/logo.png`,
    telephone: SITE.phoneE164,
    servesCuisine: ['American', 'Breakfast', 'Diner'],
    priceRange: '$',
    acceptsReservations: false,
    foundingDate: String(SITE.since),
    award: AWARDS.map((a) => `${a.title}, ${a.source} ${a.year}`),
    address: {
      '@type': 'PostalAddress',
      streetAddress: SITE.address.line1,
      addressLocality: SITE.address.city,
      addressRegion: SITE.address.state,
      postalCode: SITE.address.zip,
      addressCountry: 'US',
    },
    openingHoursSpecification: SITE.hours.map((h) => ({
      '@type': 'OpeningHoursSpecification',
      dayOfWeek: ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'][h.day],
      opens: h.open,
      closes: h.close,
    })),
    hasMenu: `${SITE.url}/menu`,
    potentialAction: { '@type': 'OrderAction', target: SITE.akeltOrigin },
    sameAs: [SITE.social.facebook, SITE.social.instagram, SITE.social.yelp],
  };
  return <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(data) }} />;
}
