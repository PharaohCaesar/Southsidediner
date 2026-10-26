// Every business fact in one place. Components never hardcode these.

export const SITE = {
  name: 'Southside Diner',
  tagline: 'Breakfast · Lunch',
  since: 2008,
  city: 'Parma',
  state: 'OH',
  address: { line1: '10705 W. Pleasant Valley Rd.', city: 'Parma', state: 'OH', zip: '44130' },
  phone: '(440) 842-6888',
  phoneE164: '+14408426888',
  email: 'southsidedinerparma@gmail.com',
  hoursSummary: 'Open every day · 8 AM – 2 PM',
  // Fallback only: the live open/closed state comes from the Akelt feed (/api/site).
  hours: [0, 1, 2, 3, 4, 5, 6].map((d) => ({ day: d, open: '08:00', close: '14:00' })),
  timezone: 'America/New_York',
  social: {
    facebook: 'https://www.facebook.com/southsidedinerparma',
    instagram: 'https://www.instagram.com/southsidedinercle',
    yelp: 'https://www.yelp.com/biz/southside-diner-parma',
  },
  mapsUrl:
    'https://www.google.com/maps/search/?api=1&query=' +
    encodeURIComponent('Southside Diner 10705 W. Pleasant Valley Rd., Parma, OH 44130'),
  akeltOrigin: process.env.NEXT_PUBLIC_AKELT_ORIGIN ?? 'https://akelt-ordering.vercel.app',
  url: process.env.NEXT_PUBLIC_SITE_URL ?? 'https://southsidediner.net',
  owners: 'Caesar Farah and his son John-Paul',
} as const;

export const DAY_NAMES = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];

/** The seven signature dishes from the jukebox selector. Photos live in /public/photos. */
export const SIGNATURES = [
  {
    slug: 'corned-beef-hash-omelette',
    name: 'Corned Beef Hash Omelette',
    blurb: 'Our house-made corned beef hash rolled into a four-egg omelette, topped with American cheese.',
    photo: '/photos/corned-beef-hash-omelette.jpg',
    track: 'A1',
  },
  {
    slug: 'bagel-sandwich',
    name: 'Bagel Sandwich',
    blurb: 'Eggs, cheese and peppered bacon on a toasted bagel, served with home fries.',
    photo: '/photos/bagel-sandwich.jpg',
    track: 'A2',
  },
  {
    slug: 'potato-pancake-combo',
    name: 'Potato Pancake Combo',
    blurb: 'Two homemade potato pancakes, two eggs, two peppered bacon and two sausage links.',
    photo: '/photos/potato-pancake-combo.jpg',
    track: 'A3',
  },
  {
    slug: 'breakfast-burrito',
    name: 'Breakfast Burrito',
    blurb: 'Peppered bacon, diced sausage, home fries and scrambled eggs rolled in a tortilla, smothered in house sausage gravy and cheddar.',
    photo: '/photos/breakfast-burrito.jpg',
    track: 'B1',
  },
  {
    slug: 'breakfast-tacos',
    name: 'Breakfast Tacos',
    blurb: 'Chorizo, grilled pineapple, pepper jack, fried egg, red onion, cilantro and homemade chipotle sauce.',
    photo: '/photos/breakfast-tacos.jpg',
    track: 'B2',
  },
  {
    slug: 'chicken-n-waffles',
    name: "Chicken n' Waffles",
    blurb: 'Belgian waffle with homemade glaze and Sriracha, breaded chicken and powdered sugar.',
    photo: '/photos/chicken-n-waffles.jpg',
    track: 'B3',
  },
  {
    slug: 'gyro',
    name: 'Gyro',
    blurb: 'Hand-shaven seasoned gyro meat with homemade garlicky tzatziki, red onion and tomato.',
    photo: '/photos/gyro.jpg',
    track: 'C1',
  },
] as const;

/** Press. Quotes are short excerpts; each links to the source. */
export const PRESS = [
  {
    outlet: 'Cleveland Magazine',
    quote: 'While it may not technically be a time machine, Southside transports us back to our childhood.',
    url: 'https://clevelandmagazine.com/food-drink/grab-a-quick-bite-at-southside-diner',
  },
  {
    outlet: 'Cleveland Scene',
    quote: 'Praise for the burgers — the Ranchero is the pick.',
    url: 'https://www.clevescene.com/?p=106724',
  },
  {
    outlet: 'Family Destinations Guide',
    quote: 'Beloved homemade breakfast — the corned beef hash is the reason to drive out.',
    url: 'https://familydestinationsguide.com/ohio-corned-beef-diner/',
  },
] as const;

/** The specials board. Edited here until the Akelt specials editor ships. */
export const BOARD = [
  { label: 'Corned Beef Hash & Eggs', note: 'Signature · all day' },
  { label: 'Athenian Breakfast', note: 'Feta eggs · gyro · tzatziki' },
  { label: 'Chicken Ranch Wrap', note: 'Lunch favorite' },
  { label: 'Ground-in-house coffee', note: 'Bottomless' },
] as const;

export const JOBS = {
  positions: ['Server', 'Cook', 'Busser', 'Dishwasher / Prep Cook'],
  schedules: ['Full time', 'Part time', 'Either'],
  perks: ['Excellent pay', 'Employee meals & discounts', 'Flexible schedules'],
} as const;
