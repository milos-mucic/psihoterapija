import { defineConfig, devices } from "@playwright/test";

// First-time local setup: `npx playwright install chromium`.
// On a bare Ubuntu box this may also need system libraries that
// `playwright install-deps` can't install if `apt-get update` fails
// (e.g. an unrelated broken third-party apt repo). If so, install
// directly instead of via Playwright's installer:
//   sudo apt-get install -y --no-install-recommends \
//     libnspr4 libnss3 libdbus-1-3 libatk1.0-0 libatk-bridge2.0-0 libatspi2.0-0 \
//     libx11-6 libxcomposite1 libxdamage1 libxext6 libxfixes3 libxrandr2 libxkbcommon0 \
//     libgbm1 libxcb1 libpango-1.0-0 libcairo2 libasound2 libcups2 libdrm2

const PORT = 4322;

export default defineConfig({
  testDir: "./tests/e2e",
  fullyParallel: false,
  workers: 1,
  retries: 0,
  timeout: 60_000,
  reporter: [["list"]],
  use: {
    baseURL: `http://localhost:${PORT}`,
    trace: "retain-on-failure",
    screenshot: "only-on-failure",
  },
  projects: [
    {
      name: "chromium",
      use: { ...devices["Desktop Chrome"] },
    },
  ],
  webServer: {
    command: `ASTRO_DATABASE_FILE=file:./data/astro.db npx astro dev --port ${PORT}`,
    url: `http://localhost:${PORT}`,
    reuseExistingServer: !process.env.CI,
    timeout: 60_000,
  },
});
