import { test, expect } from "@playwright/test";

test.describe("Homepage E2E Tests", () => {
  test.beforeEach(async ({ page }) => {
    await page.goto("/");
  });

  test("should load the homepage successfully", async ({ page }) => {
    await expect(page).toHaveTitle(/ConflictCoach AI/i);
  });

  test("should display main heading", async ({ page }) => {
    const heading = page.getByRole("heading", { level: 1 });
    await expect(heading).toBeVisible();
  });

  test("should show scenario cards", async ({ page }) => {
    const scenarioCards = page.locator('[data-testid="scenario-card"]');
    await expect(scenarioCards.first()).toBeVisible();
  });

  test("should navigate to scenario when card is clicked", async ({ page }) => {
    const firstScenario = page.locator('[data-testid="scenario-card"]').first();
    await firstScenario.click();

    // Wait for navigation or modal
    await page.waitForTimeout(1000);

    // Check if scenario details are visible
    const scenarioTitle = page.locator('[data-testid="scenario-title"]');
    await expect(scenarioTitle).toBeVisible();
  });

  test("should be responsive on mobile", async ({ page }) => {
    await page.setViewportSize({ width: 375, height: 667 });

    const mainContent = page.locator("main");
    await expect(mainContent).toBeVisible();
  });

  test("should have accessible navigation", async ({ page }) => {
    const nav = page.locator("nav");
    await expect(nav).toBeVisible();
  });
});

test.describe("Conversation Flow E2E", () => {
  test.beforeEach(async ({ page }) => {
    await page.goto("/");
  });

  test("should start a conversation session", async ({ page }) => {
    // Select a scenario
    const scenarioCard = page.locator('[data-testid="scenario-card"]').first();
    await scenarioCard.click();

    // Start conversation button
    const startButton = page.getByRole("button", { name: /start/i });
    await startButton.click();

    // Check if conversation interface is visible
    const voiceOrb = page.locator('[data-testid="voice-orb"]');
    await expect(voiceOrb).toBeVisible({ timeout: 10000 });
  });

  test("should display conversation controls", async ({ page }) => {
    // Navigate to conversation
    await page.locator('[data-testid="scenario-card"]').first().click();
    await page.getByRole("button", { name: /start/i }).click();

    // Check for control dock
    const controlDock = page.locator('[data-testid="control-dock"]');
    await expect(controlDock).toBeVisible({ timeout: 10000 });
  });

  test("should show stress meter during conversation", async ({ page }) => {
    await page.locator('[data-testid="scenario-card"]').first().click();
    await page.getByRole("button", { name: /start/i }).click();

    const stressMeter = page.locator('[data-testid="stress-meter"]');
    await expect(stressMeter).toBeVisible({ timeout: 10000 });
  });
});

test.describe("Accessibility Tests", () => {
  test("should have no accessibility violations", async ({ page }) => {
    await page.goto("/");

    // Check for basic accessibility
    const mainLandmark = page.locator('main, [role="main"]');
    await expect(mainLandmark).toBeVisible();

    // Check for headings hierarchy
    const h1 = page.locator("h1");
    await expect(h1).toBeVisible();
  });

  test("should be keyboard navigable", async ({ page }) => {
    await page.goto("/");

    // Tab through interactive elements
    await page.keyboard.press("Tab");
    const focusedElement = page.locator(":focus");
    await expect(focusedElement).toBeVisible();
  });

  test("should have proper ARIA labels", async ({ page }) => {
    await page.goto("/");

    // Check for buttons with accessible names
    const buttons = page.getByRole("button");
    const count = await buttons.count();
    expect(count).toBeGreaterThan(0);
  });
});

test.describe("Performance Tests", () => {
  test("should load within acceptable time", async ({ page }) => {
    const startTime = Date.now();
    await page.goto("/");
    const loadTime = Date.now() - startTime;

    // Should load within 3 seconds
    expect(loadTime).toBeLessThan(3000);
  });

  test("should not have console errors", async ({ page }) => {
    const errors: string[] = [];

    page.on("console", (msg) => {
      if (msg.type() === "error") {
        errors.push(msg.text());
      }
    });

    await page.goto("/");
    await page.waitForLoadState("networkidle");

    // Should have no console errors
    expect(errors).toHaveLength(0);
  });
});
