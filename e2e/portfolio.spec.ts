import { expect, test, type Page } from "@playwright/test";

const openingSequenceSkipKey = "jps:skip-opening-sequence-once";

async function skipOpeningSequence(page: Page) {
  await page.addInitScript((storageKey) => {
    window.sessionStorage.setItem(storageKey, "true");
  }, openingSequenceSkipKey);
}

async function useHardwareProfile(page: Page, hardwareConcurrency: number) {
  await page.addInitScript((threadCount) => {
    Object.defineProperty(window.navigator, "hardwareConcurrency", {
      configurable: true,
      get: () => threadCount,
    });
  }, hardwareConcurrency);
}

test.beforeEach(async ({ page }) => {
  await page.route(
    "https://challenges.cloudflare.com/turnstile/v0/api.js?render=explicit",
    async (route) => {
      await route.fulfill({
        body: `
          window.turnstile = {
            ready() {
              throw new Error("turnstile.ready() must not be used with an asynchronously loaded script");
            },
            render(_container, options) {
              window.setTimeout(() => options.callback("test-turnstile-token"), 0);
              return "test-turnstile-widget";
            },
            remove() {},
            reset() {},
          };
        `,
        contentType: "application/javascript",
        status: 200,
      });
    },
  );
});

test("Turnstile initializes without crashing the portfolio", async ({ page }) => {
  const pageErrors: string[] = [];
  page.on("pageerror", (error) => pageErrors.push(error.message));

  await skipOpeningSequence(page);
  await page.goto("/#contact");

  await expect(page.getByText("Security check complete.")).toBeVisible();
  await expect(
    page.getByRole("heading", { level: 1, name: /Jericho Paul Salvador/i }),
  ).toBeVisible();
  expect(pageErrors).toEqual([]);
});

test("opening sequence hands off to the portfolio", async ({ page }) => {
  await useHardwareProfile(page, 8);
  await page.goto("/");

  await expect(page.locator(".splash-screen")).toBeVisible();
  await expect(page.locator(".splash-screen")).toHaveCount(0, {
    timeout: 6_000,
  });
  await expect(
    page.getByRole("heading", { level: 1, name: /Jericho Paul Salvador/i }),
  ).toBeVisible();
});

test("low-power devices skip the opening sequence", async ({ page }) => {
  await useHardwareProfile(page, 4);
  await page.goto("/");

  await expect(page.locator(".splash-screen")).toHaveCount(0);
  await expect(page.locator("html")).toHaveAttribute(
    "data-performance",
    "reduced",
  );
  await expect(
    page.getByRole("heading", { level: 1, name: /Jericho Paul Salvador/i }),
  ).toBeVisible();
});

test("project navigation updates the URL and current section", async ({
  page,
}) => {
  await skipOpeningSequence(page);
  await page.goto("/");

  await page.getByRole("link", { name: "View projects" }).click();

  await expect(page).toHaveURL(/#projects$/);
  await expect(
    page.getByRole("heading", { level: 2, name: /Projects in orbit/i }),
  ).toBeVisible();
  await expect(
    page
      .getByRole("navigation", { name: "Primary navigation" })
      .getByRole("link", { name: /Projects/ }),
  ).toHaveAttribute("aria-current", "location");
});

test("AgriSphere opens as a detailed, keyboard-accessible case study", async ({
  page,
}) => {
  await skipOpeningSequence(page);
  await page.goto("/#projects");

  const gallery = page.getByRole("region", { name: "Project gallery" });
  await gallery.focus();
  await page.keyboard.press("ArrowLeft");

  const trigger = page.getByRole("button", {
    name: "Open the AgriSphere case study",
  });
  await trigger.focus();
  await page.keyboard.press("Enter");

  const dialog = page.getByRole("dialog", { name: "AgriSphere" });
  await expect(dialog).toBeVisible();
  await expect(
    dialog.getByRole("heading", { name: "A closer look at the interface." }),
  ).toBeVisible();
  await expect(
    dialog.getByRole("link", { name: "View repository" }),
  ).toHaveAttribute("href", "https://github.com/JcoDonut08/AgriSphere-Grp9");

  await page.keyboard.press("Escape");
  await expect(dialog).not.toBeVisible();
  await expect(trigger).toBeFocused();
});

test("mobile navigation opens, closes, and keeps essential links available", async ({
  page,
}) => {
  await page.setViewportSize({ height: 800, width: 360 });
  await skipOpeningSequence(page);
  await page.goto("/");

  const menuButton = page.getByRole("button", {
    name: /navigation menu/,
  });
  const navigation = page.getByRole("navigation", {
    name: "Primary navigation",
  });

  await menuButton.click();
  await expect(menuButton).toHaveAttribute("aria-expanded", "true");
  await expect(navigation).toBeVisible();
  await expect(navigation.getByRole("link", { name: /Contact/ })).toBeVisible();
  await expect(page.getByText("Viewing", { exact: true })).toHaveCount(0);

  await menuButton.click();
  await expect(menuButton).toHaveAttribute("aria-expanded", "false");
});

test("contact validation displays the server error beside the field and focuses it", async ({
  page,
}) => {
  await skipOpeningSequence(page);
  await page.route("**/api/contact", async (route) => {
    await route.fulfill({
      body: JSON.stringify({
        errors: { name: "Please enter your full name." },
        message: "Check the highlighted contact details and try again.",
        ok: false,
      }),
      contentType: "application/json",
      status: 400,
    });
  });
  await page.goto("/#contact");

  await page.getByLabel("Your name").fill("Jericho Test");
  await page.getByLabel("Your email").fill("visitor@example.com");
  await page.getByLabel("Project category").selectOption({ index: 1 });
  await page
    .getByLabel("Project details")
    .fill("I would like to discuss a responsive portfolio project.");
  await page.getByRole("button", { name: "Send message" }).click();

  await expect(page.getByText("Please enter your full name.")).toBeVisible();
  await expect(page.getByLabel("Your name")).toBeFocused();
  await expect(page.getByLabel("Your name")).toHaveAttribute(
    "aria-invalid",
    "true",
  );
});

test("returning from an unavailable link skips the opening sequence", async ({
  page,
}) => {
  await page.goto("/unavailable");
  await page.getByRole("link", { name: "Back to portfolio" }).click();

  await expect(page).toHaveURL(/\/$/);
  await expect(page.locator(".splash-screen")).toHaveCount(0);
  await expect(
    page.getByRole("heading", { level: 1, name: /Jericho Paul Salvador/i }),
  ).toBeVisible();
});

for (const viewport of [
  { height: 800, label: "phone", width: 360 },
  { height: 900, label: "tablet", width: 768 },
  { height: 1_000, label: "desktop", width: 1_440 },
]) {
  test(`layout has no horizontal overflow at ${viewport.label} width`, async ({
    page,
  }) => {
    await page.setViewportSize({
      height: viewport.height,
      width: viewport.width,
    });
    await skipOpeningSequence(page);
    await page.goto("/");

    const dimensions = await page.evaluate(() => ({
      clientWidth: document.documentElement.clientWidth,
      scrollWidth: document.documentElement.scrollWidth,
    }));

    expect(dimensions.scrollWidth).toBeLessThanOrEqual(
      dimensions.clientWidth + 1,
    );
  });
}
