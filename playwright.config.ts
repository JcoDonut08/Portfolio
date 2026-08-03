import { defineConfig, devices } from "@playwright/test";

const testPort = 3101;
const testBaseUrl = `http://127.0.0.1:${testPort}`;

export default defineConfig({
  expect: {
    timeout: 7_000,
  },
  forbidOnly: Boolean(process.env.CI),
  fullyParallel: true,
  outputDir: "test-results",
  reporter: process.env.CI
    ? [["github"], ["html", { open: "never" }]]
    : "list",
  retries: process.env.CI ? 2 : 0,
  testDir: "./e2e",
  timeout: 35_000,
  use: {
    ...devices["Desktop Chrome"],
    baseURL: testBaseUrl,
    screenshot: "only-on-failure",
    trace: "retain-on-failure",
    video: "retain-on-failure",
  },
  webServer: {
    command: `npm run dev -- --hostname 127.0.0.1 --port ${testPort}`,
    env: {
      NEXT_PUBLIC_TURNSTILE_SITE_KEY: "test-turnstile-site-key",
      PLAYWRIGHT_TEST: "1",
      TURNSTILE_SECRET_KEY: "",
      UPSTASH_REDIS_REST_TOKEN: "",
      UPSTASH_REDIS_REST_URL: "",
    },
    reuseExistingServer: false,
    timeout: 120_000,
    url: testBaseUrl,
  },
  workers: process.env.CI ? 1 : undefined,
});
