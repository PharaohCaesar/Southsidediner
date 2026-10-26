import { test, expect } from '@playwright/test';

test.describe('southsidediner.net', () => {
  test('home: hero cooks the griddle and flips to "Order\'s up"', async ({ page }) => {
    const errors: string[] = [];
    page.on('pageerror', (e) => errors.push(e.message));
    page.on('console', (m) => { if (m.type() === 'error') errors.push(m.text()); });
    await page.goto('/');
    await expect(page.getByRole('heading', { level: 1 })).toContainText('Rise and shine');
    const griddle = page.locator('[data-griddle]');
    await expect(griddle.locator('canvas').first()).toHaveClass(/opacity-100/);
    // Sweep the spatula across the griddle in rows until it's done.
    const box = (await griddle.boundingBox())!;
    for (let r = 0; r < 8; r++) {
      const y = box.y + (r + 0.5) * (box.height / 8);
      await page.mouse.move(box.x + 5, y);
      for (let x = 5; x < box.width; x += 40) await page.mouse.move(box.x + x, y);
    }
    await expect(page.getByRole('heading', { level: 1 })).toContainText('Come and get it', { timeout: 8000 });
    await expect(page.getByText(/^Order's up: .+\.$/)).toBeVisible();
    await page.getByRole('button', { name: /Next dish/ }).click();
    await expect(page.getByRole('heading', { level: 1 })).toContainText('Rise and shine');
    // "Cook it for me" also finishes.
    await page.getByRole('button', { name: 'Cook it for me' }).click();
    await expect(page.getByText('Cooked', { exact: true })).toBeVisible({ timeout: 8000 });
    expect(errors.filter((e) => !/favicon/i.test(e))).toEqual([]);
  });

  test('home: the griddle starts a steaming spot by itself, with a "cook here" tag', async ({ page }) => {
    await page.goto('/');
    // No interaction yet: a starter patch cooks on its own and the tag appears.
    await expect(page.getByText(/\d+% cooked/)).not.toHaveText('0% cooked', { timeout: 8000 });
    const tag = page.locator('.griddle-hint');
    await expect(tag).toContainText('Run the spatula here');
    await expect(page.getByRole('heading', { level: 1 })).toContainText('Rise and shine'); // nothing "done" yet
    // The visitor takes over: the tag gets out of the way.
    const box = (await page.locator('[data-griddle]').boundingBox())!;
    await page.mouse.move(box.x + box.width * 0.8, box.y + box.height * 0.3);
    await page.mouse.move(box.x + box.width * 0.85, box.y + box.height * 0.35);
    await expect(tag).toHaveCount(0);
  });

  test('Our story links to In the news, which has the awards, video and clippings', async ({ page }) => {
    await page.goto('/story');
    await expect(page.getByRole('heading', { name: /Best Diner 2016/ })).toBeVisible();
    await page.getByRole('link', { name: /In the news/ }).first().click();
    await expect(page).toHaveURL(/\/press$/);
    await expect(page.getByRole('heading', { level: 1 })).toContainText('In the news');
    await expect(page.getByRole('heading', { name: 'On camera' })).toBeVisible();
    await expect(page.getByRole('link', { name: /Yelp Cleveland/ })).toHaveAttribute('href', /instagram\.com\/reel\//);
    await expect(page.getByRole('heading', { name: 'In print' })).toBeVisible();
    expect(await page.locator('main a[href*="youtube.com"]').count()).toBe(3);
  });

  test('home: board, jukebox, story, visit band, and receipt all render', async ({ page }) => {
    await page.goto('/');
    await expect(page.getByRole('img', { name: 'Corned Beef Hash & Eggs' })).toBeVisible();
    await page.getByRole('button', { name: /Breakfast Tacos/ }).click();
    await expect(page.getByRole('heading', { level: 3, name: 'Breakfast Tacos' })).toBeVisible();
    await expect(page.getByRole('heading', { name: /A real diner/ })).toBeVisible();
    await page.getByLabel('Receipt with address and hours').scrollIntoViewIfNeeded();
    await expect(page.getByLabel('Receipt with address and hours')).toContainText('THANK YOU, COME AGAIN', { timeout: 8000 });
  });

  test('every "Order online" button opens the real ordering page in the popup', async ({ page }) => {
    const akelt = process.env.NEXT_PUBLIC_AKELT_ORIGIN ?? 'http://localhost:3000';
    await page.goto('/');
    await page.waitForFunction(() => (window as unknown as { Akelt?: unknown }).Akelt, null, { timeout: 20_000 });
    // React renders a bare data-akelt-order as "true"; every marker must carry a real path.
    const markers = await page.$$eval('[data-akelt-order]', (els) => els.map((e) => e.getAttribute('data-akelt-order')));
    expect(markers.length).toBeGreaterThan(2);
    expect(markers.every((m) => m === '/')).toBe(true);
    await page.getByRole('banner').getByRole('link', { name: 'Order online' }).click();
    await expect(page.getByRole('dialog', { name: /Order online from/ })).toBeVisible();
    await expect(page.locator('iframe.akelt-frame')).toHaveAttribute('src', `${akelt}/`);
    await expect(page.frameLocator('iframe.akelt-frame').getByRole('heading', { level: 1 })).toContainText('Southside Diner', { timeout: 20_000 });
    expect(page.url()).not.toContain('akelt'); // visitor never left the diner site
  });

  test('menu page renders the Akelt menu with prices', async ({ page }) => {
    await page.goto('/menu');
    await expect(page.getByRole('heading', { level: 1 })).toContainText('The menu');
    await expect(page.getByText('Corned Beef Hash & Eggs').first()).toBeVisible();
    await expect(page.getByText(/\$\d+\.\d{2}/).first()).toBeVisible();
  });

  test('forms validate and report the not-yet-configured email path honestly', async ({ page, request }) => {
    await page.goto('/contact');
    await page.getByLabel(/Name/).fill('E2E');
    await page.getByLabel(/Phone/).fill('4405551234');
    await page.getByLabel(/Message/).fill('Hello from the test suite');
    await page.getByRole('button', { name: 'Send message' }).click();
    await expect(page.locator('form [role="alert"]')).toContainText(/being set up|call us|try again in a few minutes/i);
    // Fresh "IP" per run so the per-IP rate limit from earlier runs doesn't apply here.
    const headers = { 'x-forwarded-for': `10.9.${Math.floor(Math.random() * 250)}.${Math.floor(Math.random() * 250)}` };
    const bad = await request.post('/api/jobs', { headers, data: { name: 'x', phone: '', position: 'CEO' } });
    expect(bad.status()).toBe(400);
    const bot = await request.post('/api/contact', { headers, data: { website: 'spam', name: 'x', message: 'y', email: 'a@b.c' } });
    expect((await bot.json()).ok).toBe(true); // honeypot swallowed silently
  });

  test('old Webflow URLs redirect; sitemap, robots and structured data exist', async ({ request, page }) => {
    for (const [from, to] of [
      ['/gallery', '/story'], ['/reservation', '/contact'], ['/parties', '/contact'],
      ['/blog/we-have-updated-our-overall-menu-enjoy', '/story'], ['/template-information/licensing', '/'],
    ]) {
      const r = await request.get(from, { maxRedirects: 0 });
      expect([301, 308], from).toContain(r.status());
      expect(new URL(r.headers().location, 'http://x').pathname, from).toBe(to);
    }
    expect((await request.get('/sitemap.xml')).ok()).toBe(true);
    expect((await request.get('/robots.txt')).ok()).toBe(true);
    await page.goto('/');
    const ld = await page.locator('script[type="application/ld+json"]').first().textContent();
    expect(JSON.parse(ld!)['@type']).toBe('Restaurant');
  });

  test('phone: mobile nav opens, hero takes a drag', async ({ browser }) => {
    const ctx = await browser.newContext({ viewport: { width: 390, height: 844 }, hasTouch: true, isMobile: true });
    const page = await ctx.newPage();
    await page.goto('/');
    await page.getByRole('button', { name: 'Open menu' }).click();
    await expect(page.getByRole('navigation', { name: 'Mobile' })).toBeVisible();
    await page.getByRole('button', { name: 'Close menu' }).click();
    const box = (await page.locator('[data-griddle]').boundingBox())!;
    await page.touchscreen.tap(box.x + box.width / 2, box.y + box.height / 2);
    await expect(page.getByText(/\d+% cooked/)).not.toHaveText('0% cooked');
    await ctx.close();
  });

  test('phone: Call / Order / Directions bar slides up after the hero', async ({ browser }) => {
    const ctx = await browser.newContext({ viewport: { width: 390, height: 844 }, hasTouch: true, isMobile: true });
    const page = await ctx.newPage();
    await page.goto('/');
    const bar = page.getByRole('navigation', { name: 'Quick actions' });
    await expect(bar).not.toBeInViewport(); // slid off-screen (and inert) over the hero
    await page.evaluate(() => window.scrollTo(0, 1200));
    await expect(bar.getByRole('link', { name: 'Call' })).toHaveAttribute('href', 'tel:+14408426888');
    await expect(bar.getByRole('link', { name: 'Directions' })).toHaveAttribute('href', /google\.com\/maps/);
    await expect(bar.getByRole('link', { name: /Order online/ })).toBeInViewport();
    await expect(page.locator('header .nav-order')).toBeHidden(); // no duplicate Order button
    await ctx.close();
  });

  test('the board keeps flipping to other dishes from the menu', async ({ page }) => {
    await page.goto('/');
    await page.locator('#board-h').scrollIntoViewIfNeeded();
    const board = page.getByRole('list', { name: 'Now serving' });
    const labels = () => board.getByRole('img').evaluateAll((els) => els.map((e) => e.getAttribute('aria-label')));
    const first = await labels();
    await expect.poll(labels, { timeout: 12_000 }).not.toEqual(first);
  });
});
