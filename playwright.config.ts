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
  webServer: { command: 'npm run dev', url: 'http://localhost:3010', reuseExistingServer: true, timeout: 60_000 },
});
