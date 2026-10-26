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
    const r = await request.get('/gallery', { maxRedirects: 0 });
    expect([301, 308]).toContain(r.status());
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
});
