import { defineConfig } from '@playwright/test';

// Runs against the dev server (port 3010). The Akelt feeds come from NEXT_PUBLIC_AKELT_ORIGIN
// (the Akelt mock env on :3000 locally); the site must render fine without them too.
export default defineConfig({
  testDir: './e2e',
  timeout: 45_000,
  workers: 1,
  use: {
    baseURL: 'http://localhost:3010',
    launchOptions: { executablePath: process.env.PW_CHROMIUM || undefined },
  },
  webServer: {
    command: 'npm run dev',
    url: 'http://localhost:3010',
    reuseExistingServer: true,
    timeout: 60_000,
    // The Akelt mock backend's seeded website key, so the forms post into its inbox end to end.
    env: { AKELT_INBOX_KEY: process.env.AKELT_INBOX_KEY ?? 'sk_site_e2e_mock_key_0000000000000000000000000' },
  },
});
