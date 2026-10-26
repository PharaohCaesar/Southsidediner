# STATUS — southsidediner.net (diner-themed marketing site)

> Session bridge. Read this first; update **Current state** + **Next up** before you walk away.

## Where things live

| | |
|---|---|
| **Repo (source of truth)** | https://github.com/PharaohCaesar/southsidediner — private |
| **Ordering platform (data source)** | https://github.com/PharaohCaesar/akelt-ordering → https://akelt-ordering.vercel.app |
| **Production** | southsidediner.net — still on Webflow until the DNS cut-over (see Next up) |
| **Host** | Vercel (git-connected: pushes to `main` deploy) |
| **Email** | Resend, under JP's existing account (same one as blackagavegroup / mirabella) |

History: first built inside akelt-ordering as `sites/southsidediner/` (commit cafd8d5 on branch
`ccr-7b8d5726-vgq10m`), then moved here on 2026-10-26.

## What this is

The new southsidediner.net: a 1950s/60s diner experience that replaces the 2018 Webflow site.
Ordering, pop-ups, "closed today" and the menu all come from **Akelt** (the ordering platform in
the repo root) via `/embed.js`, `/api/site` and `/api/menu` — the site itself has no database.

Pilot facts live in ONE file: `src/lib/site.ts` (address, phone, hours, socials, signature dishes,
press, the specials board, job perks). Components never hardcode them.

## Stack

Next.js 16 (App Router, Turbopack) · React 19 · Tailwind v4 · Lenis · Resend (forms) ·
next/font (Anton = Googie display, Barlow = body, Pacifico = script, Special Elite = typewriter notes,
Kalam = guest-check ink,
UnifrakturMaguntia = press-archive masthead).

## Routes

`/` (griddle hero → story + awards + press → split-flap board + live open state → jukebox dishes →
mint visit band → receipt footer) · `/menu` (Akelt `/api/menu`, prices never stale, every dish opens
the ordering popup) · `/story` · `/jobs` (application → `/api/jobs`) · `/contact` (map, hours,
form → `/api/contact`) · `sitemap.xml` · `robots.txt`. `/gallery` → `/story`, `/reservation` → `/contact`.

## Effects (all built)

- **Griddle hero** `components/hero/griddle-hero.tsx`: raw frame on a canvas over its cooked twin;
  hover (desktop) or drag (touch) erases with a soft brush; a 64×36 grid computes "% cooked";
  at 70% the rest sizzles through, the headline swaps to "Come and get it" + "Order's up: <dish>.";
  steam particles rise wherever you've cooked; "Cook it for me" / "Next dish →".
  **Starter spot:** ~0.65 s after the dish appears, a small spiral cooks through at the dish's `spot`
  (GRIDDLE in site.ts, fractions of the image, chosen for a strong raw→cooked change and clear of the
  desktop headline), thick steam keeps rising from it, and a pulsing "Run the spatula here" / "Drag to
  cook" (touch) tag sits on it until the visitor takes over. Doesn't count as touched, no sound.
  **Five real dishes rotate** (`GRIDDLE` in `site.ts`: hash, potato pancakes, sweet/pancakes +
  French toast, gyro, chorizo), next one per visit (localStorage `ssd.dish`), chosen client-side so
  there's no hydration mismatch. Masters `assets-src/griddle-<slug>-{raw,cooked}.jpg` (AI, GPT Image
  2.5 via Higgsfield, dish photos from the Dropbox as references; raw derived from cooked with "keep
  camera identical") → `npm run images` → `public/images/griddle-<slug>-*.webp` (+ `-1280` for phones).
  **Phones:** the photo is a 4:3 frame with the copy + buttons BELOW it (nothing covers the food);
  from `sm` up the copy overlays the photo. Replace with real tripod pairs when shot (same filenames).
- **Spatula cursor** `fx/spatula.tsx`: chrome dot + neon halo; spatula over the griddle, counter
  bell over order buttons, handset over phone links. Fine-pointer devices only.
- **Split-flap board** `fx/split-flap.tsx` + `home/rotating-board.tsx`: starts with `BOARD` (site.ts),
  then endlessly re-flaps one row every 3.2 s to another dish from the live Akelt `/api/menu`
  (sides, drinks and kids' menu skipped; names over 26 chars skipped), price note fades in after the
  flip. Pauses off-screen / in background tabs. Signature dishes are the fallback if the feed is down.
  aria-hidden flaps; the resolved text is the a11y text.
- **Phone action bar** `action-bar.tsx`: Call · Order online · Directions pinned to the bottom on
  phones, slides up after the hero; while it's up the nav hides its own Order button
  (`html[data-bar-up]`). Footer is padded so the bar never covers it. Not shown from `md` up.
- **Jukebox** `jukebox.tsx`: 7 signature dishes as title cards, 45 spins, dish swings in.
- **Neon** utilities (`.neon`, `.neon-tube`, flicker), **checkerboard floor** in perspective,
  **chrome strips** with a glint, **guest checks** modeled on the restaurant's real FMP 2-part pads (`components/guest-check.tsx`,
  `.guest-check`: mint sheet, blue "Guest Check", Date/Table/Guests/Server boxes, red number, course
  line, green rules, "Thank You — Please Come Again"; yellow `--kitchen` copy; Kalam handwriting) — used
  by the forms, the visit band, the menu fallback and the hero's torn-off "Order online" tab, **starburst** badges,
  **polaroids** + Kodachrome filter, CSS **steam**, **milkshake** scroll progress,
  **receipt** footer printing line by line.
- **Sounds** `fx/sound.tsx`: Web Audio bell (`[data-bell]`) + griddle sizzle, off by default, toggle
  in the nav, remembered in localStorage.
- **Live open/closed** `open-now.tsx` from Akelt `/api/site` (honours "Closed today").

## Current state (2026-10-26)

Built and verified locally against the Akelt mock env: tsc + eslint clean; **7/7 Playwright e2e**
(`npm run test:e2e`). Desktop + phone screenshots reviewed.

- **Press + awards** (from the Dropbox "Southside-Diner-12-Frame-Newsprint-Collection.pdf"):
  `AWARDS` (Best Diner, Scene Best of Cleveland 2016; Ohio's Best Diner, PureWow 2017), `TV` (three
  Fox 8 New Day Cleveland segments), `PRESS` (9 clippings, VERBATIM quotes + article links), `LISTS`
  (Stacker). Home story strip shows awards + 3 quotes; `/story` has a newsprint press archive; JSON-LD
  carries `award`.
- **"Family", not names** — the owners are never named on the site (JP's call).
- Guest checks + five-dish hero + phone hero layout (see Effects).

**Not yet:** custom domain (southsidediner.net is on Webflow), Resend env (`RESEND_API_KEY`,
`RESEND_FROM`, `LEADS_TO`) so the forms deliver, `NEXT_PUBLIC_AKELT_ORIGIN` check on Vercel,
Google Business Profile hours check.

## Next up

1. Vercel project + env (Akelt origin, site URL, Resend keys), then DNS cut-over from Webflow.
2. Shoot the real griddle pair on a tripod (raw → cooked, same frame) and drop into `assets-src/`.
3. Cut the 2018 film into a "33 seconds inside Southside" section + 3–5 s micro-loops (see notes).
4. When the Akelt specials editor ships, feed `BOARD` from it instead of `site.ts`.
5. DNS cut-over: move southsidediner.net from Webflow to Vercel; keep the redirects above.

## Hard-won lessons

- **Pointer capture steals clicks.** `setPointerCapture` on the griddle during pointerdown made the
  click land on the griddle, so "Order online" / "Start over" inside the hero never fired on desktop.
  Only capture for touch/pen, and never when the pointerdown target is a link or button.
- `role="alert"` test selectors must be scoped to the form (Next's route announcer is an alert).
- Ticket numbers and image sources must be deterministic at render (hydration mismatch otherwise).
- **Never paraphrase inside quotation marks.** Press quotes are verbatim from the clippings; two
  invented "quotes" had to be pulled. If it isn't in the article, it isn't in quotes.
- Always use absolute paths in scripted file writes; a `cd` that silently fails sends files to the wrong project.
