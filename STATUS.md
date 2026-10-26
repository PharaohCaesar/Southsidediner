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
next/font (Anton = Googie display, Barlow = body, Pacifico = script, Special Elite = guest-check).

## Routes

`/` (griddle hero → split-flap board + live open state → jukebox dishes → polaroid story + press →
mint visit band → receipt footer) · `/menu` (Akelt `/api/menu`, prices never stale, every dish opens
the ordering popup) · `/story` · `/jobs` (application → `/api/jobs`) · `/contact` (map, hours,
form → `/api/contact`) · `sitemap.xml` · `robots.txt`. `/gallery` → `/story`, `/reservation` → `/contact`.

## Effects (all built)

- **Griddle hero** `components/hero/griddle-hero.tsx`: raw frame on a canvas over its cooked twin;
  hover (desktop) or drag (touch) erases with a soft brush; a 64×36 grid computes "% cooked";
  at 70% the rest sizzles through, the headline swaps to "Come and get it, Parma / Order's up";
  steam particles rise wherever you've cooked; "Cook it for me" / "Start over".
  Images: `assets-src/griddle-{cooked,raw}.jpg` (AI, GPT Image 2.5 via Higgsfield; kept as q93 JPEG masters in git; raw derived
  from cooked with "keep camera identical"; alignment checked with a 50/50 blend) →
  `npm run images` → `public/images/griddle-*.webp` (+ `-1280` for phones). **Replace with a real
  tripod pair when shot** (same filenames = zero code change).
- **Spatula cursor** `fx/spatula.tsx`: chrome dot + neon halo; spatula over the griddle, counter
  bell over order buttons, handset over phone links. Fine-pointer devices only.
- **Split-flap board** `fx/split-flap.tsx` (aria-hidden flaps, resolved text is the a11y text).
- **Jukebox** `jukebox.tsx`: 7 signature dishes as title cards, 45 spins, dish swings in.
- **Neon** utilities (`.neon`, `.neon-tube`, flicker), **checkerboard floor** in perspective,
  **chrome strips** with a glint, **guest-check tickets** (`.ticket`), **starburst** badges,
  **polaroids** + Kodachrome filter, CSS **steam**, **milkshake** scroll progress,
  **receipt** footer printing line by line.
- **Sounds** `fx/sound.tsx`: Web Audio bell (`[data-bell]`) + griddle sizzle, off by default, toggle
  in the nav, remembered in localStorage.
- **Live open/closed** `open-now.tsx` from Akelt `/api/site` (honours "Closed today").

## Current state (2026-10-26)

Built and verified locally against the Akelt mock env: tsc + eslint clean; **6/6 Playwright e2e**
(`npm run test:e2e`: hero cooks → flips → resets, board/jukebox/receipt, menu from Akelt, forms
validation + honeypot + 503-until-configured, redirects/sitemap/schema, phone nav + touch cook).
Desktop + phone screenshots reviewed.

**Not yet:** Vercel project + domain (southsidediner.net is on Webflow), Resend env
(`RESEND_API_KEY`, `RESEND_FROM`, `LEADS_TO`) so the forms deliver, `NEXT_PUBLIC_AKELT_ORIGIN`
pointed at the production Akelt host, Google Business Profile hours check.

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
- Always use absolute paths in scripted file writes; a `cd` that silently fails sends files to the wrong project.
