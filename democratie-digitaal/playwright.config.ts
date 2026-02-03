import { defineConfig } from "@playwright/test";

const baseURL =
    process.env.E2E_BASE_URL ||
    process.env.PLAYWRIGHT_BASE_URL ||
    "http://127.0.0.1:3000";

export default defineConfig({
    testDir: "./tests/e2e",
    timeout: 60_000,
    expect: {
        timeout: 10_000,
    },
    fullyParallel: false,
    retries: process.env.CI ? 2 : 0,
    workers: 1,
    use: {
        baseURL,
        trace: "retain-on-failure",
    },
    globalSetup: "./tests/e2e/global-setup",
    webServer: process.env.E2E_BASE_URL || process.env.PLAYWRIGHT_BASE_URL
        ? undefined
        : {
            command: "npm run dev -- --hostname 127.0.0.1 --port 3000",
            url: baseURL,
            reuseExistingServer: !process.env.CI,
            timeout: 120_000,
        },
});
