import { execSync } from "node:child_process";

export default async function globalSetup() {
    const hasCustomBaseUrl = Boolean(
        process.env.E2E_BASE_URL || process.env.PLAYWRIGHT_BASE_URL
    );
    const shouldSeed =
        process.env.E2E_SEED === "1" ||
        (!hasCustomBaseUrl && process.env.E2E_SKIP_SEED !== "1");

    if (!shouldSeed) {
        return;
    }

    if (!process.env.POSTGRES_PRISMA_URL) {
        throw new Error(
            "POSTGRES_PRISMA_URL is required for seeding the e2e database."
        );
    }

    execSync("npx prisma db push --skip-generate", { stdio: "inherit" });
    execSync("node scripts/seed-e2e.js", { stdio: "inherit" });
}
