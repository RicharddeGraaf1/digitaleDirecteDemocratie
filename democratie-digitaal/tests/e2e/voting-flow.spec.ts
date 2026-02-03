import { test, expect } from "@playwright/test";

test("guest can start voting flow", async ({ page }) => {
    await page.goto("/");
    await page.getByRole("link", { name: /doorgaan als gast/i }).click();
    await expect(page).toHaveURL(/\/vote/);

    const intro = page.locator("text=Kennisvraag").or(page.locator("text=Thema:"));
    await expect(intro.first()).toBeVisible();
});

test("login -> onboarding -> vote", async ({ page }) => {
    await page.goto("/login");
    await page.getByLabel(/gebruikersnaam/i).fill("admin");
    await page.getByLabel(/wachtwoord/i).fill("Admin");
    await page.getByRole("button", { name: /inloggen/i }).click();

    await expect(page).toHaveURL(/\/onboarding/);
    await page.getByRole("link", { name: /start met het geven van je mening/i }).click();
    await expect(page).toHaveURL(/\/onboarding\/topics/);

    await page.getByRole("button", { name: /verder naar stellingen/i }).click();
    await expect(page).toHaveURL(/\/vote/);
});

test("legacy /voting redirects to /vote", async ({ page }) => {
    await page.goto("/voting");
    await expect(page).toHaveURL(/\/vote/);
});
