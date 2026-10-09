import { defineConfig, devices } from '@playwright/test'

export default defineConfig({
  testDir: './e2e',
  fullyParallel: true,
  // Live PokéAPI suite: cap workers so parallel detail batches stay within
  // the API's fair-use envelope (Cloudflare throttles aggressive bursts).
  // Two workers proved the stable point: three still produced timeout flakes.
  workers: 2,
  forbidOnly: !!process.env.CI,
  // Live PokéAPI suite: one retry absorbs transient throttling (429) under
  // parallel load. Trace is kept on retry for diagnosis.
  retries: 1,
  reporter: 'list',
  use: {
    baseURL: 'http://127.0.0.1:5173',
    trace: 'on-first-retry',
  },
  projects: [{ name: 'chromium', use: { ...devices['Desktop Chrome'] } }],
  webServer: {
    command: 'npm run dev -- --host 127.0.0.1 --port 5173',
    url: 'http://127.0.0.1:5173',
    reuseExistingServer: !process.env.CI,
    timeout: 60_000,
  },
})
