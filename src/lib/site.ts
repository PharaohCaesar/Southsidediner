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
  { year: 2016, source: 'Fox 8 New Day Cleveland', title: 'Breakfast at the diner, with David Moss', url: 'https://www.youtube.com/watch?v=PkB4bauE30E&t=490s' },
  { year: 2022, source: 'Fox 8 New Day Cleveland', title: 'A taste of Southside Diner', url: 'https://www.youtube.com/watch?v=Pjww_P7vgLc' },
  { year: 2024, source: 'Fox 8 New Day Cleveland', title: 'In the New Day Cleveland kitchen', url: 'https://www.youtube.com/watch?v=V0a2sjsN5IY&t=265s' },
  { year: 2026, source: 'Yelp Cleveland', title: '#CarbComeback: our must-try, the blueberry muffin French toast', url: 'https://www.instagram.com/reel/DefIMGTt2pl/' },
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
// `spot` = where the griddle starts cooking on its own (fractions of the image) so visitors
// see it's interactive: pick something with a strong raw→cooked change, clear of the copy.
export const GRIDDLE = [
  { slug: 'hash', spot: [0.47, 0.28], dish: 'Corned Beef Hash', line: 'Our signature corned beef hash, scrambled eggs and peppered bacon.' },
  { slug: 'potato', spot: [0.6, 0.55], dish: 'Potato Pancake Combo', line: 'Homemade potato pancakes, two eggs, peppered bacon and sausage links.' },
  { slug: 'sweet', spot: [0.48, 0.26], dish: 'Pancakes & French Toast', line: 'Blueberry buttermilk pancakes and golden French toast, sweet and fluffy.' },
  { slug: 'gyro', spot: [0.62, 0.45], dish: 'Gyro Hash', line: 'Hand-shaved gyro meat on crispy hash browns with tomatoes and two eggs.' },
  { slug: 'chorizo', spot: [0.64, 0.36], dish: 'Chorizo Hash', line: 'Chorizo, crispy hash browns, two eggs, jalapeño and cilantro.' },
] as const;

/**
 * The homepage photo gallery: real plates from the kitchen. `menu` is the dish's exact name on the
 * Akelt menu (its live price is looked up by it); null = not a single menu item. First 12 = the
 * opening spread of "All". w/h are the file's real pixel size (masonry layout, no layout shift).
 */
export const GALLERY_CATEGORIES = [
  { key: 'all', label: 'All' },
  { key: 'breakfast', label: 'Breakfast' },
  { key: 'hashes', label: 'Hashes & tacos' },
  { key: 'benedicts', label: 'Benedicts' },
  { key: 'lunch', label: 'Lunch' },
] as const;

export type GalleryCategory = Exclude<(typeof GALLERY_CATEGORIES)[number]['key'], 'all'>;

export const GALLERY: { src: string; label: string; menu: string | null; cat: GalleryCategory; w: number; h: number }[] = [
  { src: '/photos/corned-beef-hash.jpg', label: 'Corned Beef Hash', menu: 'Corned Beef Hash', cat: 'hashes', w: 889, h: 900 },
  { src: '/photos/chicken-n-waffles.jpg', label: "Chicken n' Waffles", menu: "Chicken n' Waffles", cat: 'breakfast', w: 960, h: 1200 },
  { src: '/photos/cheeseburger.jpg', label: 'Cheeseburger', menu: 'Cheeseburger', cat: 'lunch', w: 1200, h: 1200 },
  { src: '/photos/chorizo-hash.jpg', label: 'Chorizo Hash', menu: 'Chorizo Hash', cat: 'hashes', w: 1189, h: 1200 },
  { src: '/photos/pancakes.jpg', label: 'Blueberry Pancakes', menu: 'Pancakes', cat: 'breakfast', w: 1175, h: 915 },
  { src: '/photos/reuben-tacos.jpg', label: 'Reuben Tacos', menu: 'Reuben Tacos', cat: 'hashes', w: 1200, h: 1180 },
  { src: '/photos/pastrami-benedict.jpg', label: 'Pastrami Benedict', menu: 'Pastrami Benedict', cat: 'benedicts', w: 1200, h: 1053 },
  { src: '/photos/athenian-breakfast.jpg', label: 'Athenian Breakfast', menu: 'Athenian Breakfast', cat: 'breakfast', w: 1200, h: 800 },
  { src: '/photos/southside-reuben.jpg', label: 'Southside Reuben', menu: 'Southside Reuben', cat: 'lunch', w: 1200, h: 800 },
  { src: '/photos/breakfast-quesadilla.jpg', label: 'Breakfast Quesadilla', menu: 'Breakfast Quesadilla', cat: 'breakfast', w: 960, h: 1200 },
  { src: '/photos/gyro.jpg', label: 'Gyro', menu: 'Gyro', cat: 'lunch', w: 1200, h: 896 },
  { src: '/photos/french-toast.jpg', label: 'French Toast', menu: 'French Toast', cat: 'breakfast', w: 1200, h: 800 },
  { src: '/photos/gyro-hash.jpg', label: 'Gyro Hash', menu: 'Gyro Hash', cat: 'hashes', w: 1188, h: 1200 },
  { src: '/photos/barbacoa-hash.jpg', label: 'Barbacoa Hash', menu: 'Barbacoa Hash', cat: 'hashes', w: 1187, h: 1200 },
  { src: '/photos/breakfast-tacos.jpg', label: 'Breakfast Tacos', menu: 'Breakfast Tacos', cat: 'hashes', w: 1200, h: 800 },
  { src: '/photos/gyro-tacos.jpg', label: 'Gyro Tacos', menu: 'Gyro Tacos', cat: 'hashes', w: 1200, h: 676 },
  { src: '/photos/barbacoa-tacos.jpg', label: 'Barbacoa Tacos', menu: 'Barbacoa Tacos', cat: 'hashes', w: 1200, h: 900 },
  { src: '/photos/benedict-florentine.jpg', label: 'Eggs Benedict Florentine', menu: 'Eggs Benedict Florentine', cat: 'benedicts', w: 1200, h: 1200 },
  { src: '/photos/spartan-benedict.jpg', label: 'Spartan Benedict', menu: 'Spartan Benedict', cat: 'benedicts', w: 1200, h: 676 },
  { src: '/photos/corned-beef-hash-omelette.jpg', label: 'Corned Beef Hash Omelette', menu: 'Corned Beef Hash Omelette', cat: 'breakfast', w: 1200, h: 800 },
  { src: '/photos/potato-pancake-combo.jpg', label: 'Potato Pancake Combo', menu: 'Potato Pancake Combo', cat: 'breakfast', w: 1200, h: 800 },
  { src: '/photos/corned-beef-stacker.jpg', label: 'Corned Beef Stacker', menu: 'Corned Beef Stacker', cat: 'breakfast', w: 1200, h: 800 },
  { src: '/photos/breakfast-burrito.jpg', label: 'Breakfast Burrito', menu: 'Breakfast Burrito', cat: 'breakfast', w: 1200, h: 800 },
  { src: '/photos/crazy-8.jpg', label: 'Crazy 8', menu: 'Crazy 8', cat: 'breakfast', w: 1200, h: 715 },
  { src: '/photos/big-country.jpg', label: 'Big Country', menu: 'Big Country', cat: 'breakfast', w: 1200, h: 806 },
  { src: '/photos/bagel-sandwich.jpg', label: 'Bagel Sandwich', menu: 'Bagel Sandwich', cat: 'breakfast', w: 1200, h: 800 },
  { src: '/photos/country-fried-steak.jpg', label: 'Country Fried Steak & Eggs', menu: 'Country Fried Steak & Eggs', cat: 'breakfast', w: 1200, h: 800 },
  { src: '/photos/ham-steak.jpg', label: 'Ham Steak & Eggs', menu: 'Ham Steak & Eggs', cat: 'breakfast', w: 1200, h: 800 },
  { src: '/photos/corned-beef-and-eggs.jpg', label: 'Corned Beef & Eggs', menu: 'Corned Beef & Eggs', cat: 'breakfast', w: 1200, h: 800 },
  { src: '/photos/biscuits-and-gravy.jpg', label: 'Biscuits & Gravy', menu: 'Biscuits & Gravy', cat: 'breakfast', w: 1200, h: 676 },
  { src: '/photos/gyro-omelette.jpg', label: 'Gyro Omelette', menu: null, cat: 'breakfast', w: 1200, h: 692 },
  { src: '/photos/spread.jpg', label: 'The Saturday spread', menu: null, cat: 'breakfast', w: 1800, h: 1200 },
  { src: '/photos/clevelander.jpg', label: 'Clevelander', menu: 'Clevelander', cat: 'lunch', w: 1200, h: 800 },
  { src: '/photos/downtowner.jpg', label: 'Downtowner', menu: 'Downtowner', cat: 'lunch', w: 1200, h: 800 },
  { src: '/photos/reuben.jpg', label: 'Reuben', menu: 'Reuben', cat: 'lunch', w: 667, h: 1000 },
  { src: '/photos/greek-burger.jpg', label: 'Greek Burger', menu: 'Greek Burger', cat: 'lunch', w: 1200, h: 800 },
  { src: '/photos/cajun-bbq-chicken-wrap.jpg', label: 'Cajun BBQ Chicken Wrap', menu: 'Cajun BBQ Chicken Wrap', cat: 'lunch', w: 1200, h: 800 },
  { src: '/photos/chicken-ranch-wrap.jpg', label: 'Chicken Ranch Wrap', menu: 'Chicken Ranch Wrap', cat: 'lunch', w: 1200, h: 676 },
  { src: '/photos/chicken-salad-wrap.jpg', label: 'Chicken Salad Wrap', menu: 'Chicken Salad Wrap', cat: 'lunch', w: 1200, h: 676 },
  { src: '/photos/piggy-dog.jpg', label: 'Piggy Dog', menu: 'Piggy Dog', cat: 'lunch', w: 968, h: 1200 },
];

export const JOBS = {
  positions: ['Server', 'Cook', 'Busser', 'Dishwasher / Prep Cook'],
  schedules: ['Full time', 'Part time', 'Either'],
  perks: ['Excellent pay', 'Employee meals & discounts', 'Flexible schedules'],
} as const;
