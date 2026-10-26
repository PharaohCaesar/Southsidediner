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

/** Awards. Source: the Southside press archive (Dropbox, "12-Frame Newsprint Collection"). */
export const AWARDS = [
  {
    title: 'Best Diner',
    source: 'Cleveland Scene · Best of Cleveland',
    year: 2016,
    quote: 'first-time visitors at Southside Diner feel at home',
    url: null,
  },
  {
    title: "Ohio's Best Diner",
    source: 'PureWow · The Best Diner in Every State',
    year: 2017,
    quote: "It's time you've met the corned beef stacker",
    url: 'https://www.purewow.com/food/best-diner-in-every-state',
  },
] as const;

/** Fox 8 New Day Cleveland segments. */
export const TV = [
  { year: 2016, title: 'Breakfast at the diner, with David Moss', url: 'https://www.youtube.com/watch?v=V0a2sjsN5IY&t=265s' },
  { year: 2022, title: 'A taste of Southside Diner', url: 'https://www.youtube.com/watch?v=Pjww_P7vgLc' },
  { year: 2024, title: 'In the New Day Cleveland kitchen', url: 'https://www.youtube.com/watch?v=PkB4bauE30E&t=490s' },
] as const;

/**
 * Press, newest first. Every quote is verbatim from the article (as captured in the press
 * archive); never paraphrase inside quotation marks.
 */
export const PRESS = [
  {
    year: 2026, outlet: 'Cleveland Magazine', title: "Parma's Best Restaurants",
    quote: 'Red counter stools, checkered floors and an open kitchen',
    url: 'https://www.clevelandmagazine.com/articles/parmas-best-restaurants/',
  },
  {
    year: 2023, outlet: 'Cleveland Scene', title: '32 Cleveland Diners and Delis You Should Have Tried by Now',
    quote: 'this little Parma treasure',
    url: 'https://www.clevescene.com/food-drink/32-cleveland-diners-and-delis-you-should-have-tried-by-now-41432542/',
  },
  {
    year: 2023, outlet: 'Cleveland Scene', title: '25 Essential Parma Restaurants, According to Reddit',
    quote: 'Southside Diner is my favorite breakfast place.',
    url: 'https://www.clevescene.com/news/24-essential-parma-restaurants-according-to-reddit-41211735/',
  },
  {
    year: 2021, outlet: 'Cleveland Magazine', title: "Cleveland Taco Guide: Southside Diner's Breakfast Tacos Wake You Up Right",
    quote: 'simple, balanced breakfast tacos that pack a punch',
    url: 'https://clevelandmagazine.com/articles/cleveland-taco-guide-southside-diners-breakfast-tacos-wake-you-up-right/',
  },
  {
    year: 2021, outlet: 'Cleveland Scene', title: '32 Spots to Grab Some of the Best Corned Beef in Cleveland',
    quote: 'some of the best corned beef hash in town',
    url: 'https://www.clevescene.com/arts/32-spots-to-grab-some-of-the-best-corned-beef-in-cleveland-38342914/',
  },
  {
    year: 2020, outlet: 'Cleveland Scene', title: '21 Hole-in-the-Wall Cleveland Burger Spots You Should Have Tried By Now',
    quote: "it's the burgers we love.",
    url: 'https://www.clevescene.com/arts/21-hole-in-the-wall-cleveland-burger-spots-you-should-have-tried-by-now-38342860/',
  },
  {
    year: 2016, outlet: 'Cleveland Magazine', title: 'Grab a Quick Bite at Southside Diner',
    quote: 'the lost art of customer service',
    url: 'https://clevelandmagazine.com/articles/grab-a-quick-bite-at-southside-diner/',
  },
  {
    year: 2016, outlet: 'Patch', title: '4 Best Breakfasts Near Strongsville',
    quote: "I'm obsessed with breakfast here.",
    url: 'https://patch.com/ohio/strongsville/4-best-breakfasts-near-strongsville-0',
  },
  {
    year: 2015, outlet: 'Cleveland Scene', title: 'The Best Restaurants in Cleveland, According to Yelp',
    quote: '7. Southside Diner – 63 reviews, 4.5 stars',
    url: 'https://www.clevescene.com/food-drink/the-best-restaurants-in-cleveland-according-to-yelp-4488954/',
  },
] as const;

/** The three quotes featured on the home page (indexes into PRESS). */
export const FEATURED_PRESS = [PRESS[4], PRESS[6], PRESS[1]] as const;

/** Stacker's Yelp-based Cleveland lists. */
export const LISTS = [
  { year: 2025, label: '#8 highest-rated café in the Cleveland area', url: 'https://stacker.com/stories/ohio/cleveland/highest-rated-cafes-cleveland-area-diners' },
  { year: 2022, label: '#22 highest-rated cheap eats in Cleveland', url: 'https://stacker.com/stories/ohio/cleveland/highest-rated-cheap-eats-cleveland-diners' },
] as const;

/**
 * Hero griddle scenes, each built from a real Southside dish photo (AI, GPT Image 2.5 via
 * Higgsfield; raw twin derived from the cooked frame). Files: public/images/griddle-<slug>-{raw,cooked}[-1280].webp
 */
export const GRIDDLE = [
  { slug: 'hash', dish: 'Corned Beef Hash', line: 'Our signature corned beef hash, scrambled eggs and peppered bacon.' },
  { slug: 'potato', dish: 'Potato Pancake Combo', line: 'Homemade potato pancakes, two eggs, peppered bacon and sausage links.' },
  { slug: 'sweet', dish: 'Pancakes & French Toast', line: 'Blueberry buttermilk pancakes and golden French toast, sweet and fluffy.' },
  { slug: 'gyro', dish: 'Gyro Hash', line: 'Hand-shaved gyro meat on crispy hash browns with tomatoes and two eggs.' },
  { slug: 'chorizo', dish: 'Chorizo Hash', line: 'Chorizo, crispy hash browns, two eggs, jalapeño and cilantro.' },
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
