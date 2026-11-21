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
    page.getByRole("heading", { level: 2, name: /Ideas turned into working applications/i }),
  ).toBeVisible();
  await expect(
    page
      .getByRole("navigation", { name: "Primary navigation" })
      .getByRole("link", { name: /Projects/ }),
  ).toHaveAttribute("aria-current", "location");
});

test("project grid exposes all work and opens a shareable case study", async ({
  page,
}) => {
  await skipOpeningSequence(page);
  await page.goto("/#projects");

  await expect(page.locator(".work-card")).toHaveCount(4);
  await expect(page.getByRole("link", { name: "LinkedIn", exact: true })).toHaveAttribute("href", "https://www.linkedin.com/in/jericho-salvador-986a89432/");
  const trigger = page.getByRole("link", { name: "Read the GabayIskolar case study" });
  await trigger.focus();
  await page.keyboard.press("Enter");

  await expect(page).toHaveURL(/\/projects\/gabayiskolar$/, { timeout: 15_000 });
  await expect(
    page.getByRole("heading", { name: "GabayIskolar", exact: true }),
  ).toBeVisible();
  await expect(
    page.getByRole("link", { name: "View source code" }),
  ).toHaveAttribute("href", "https://github.com/Rikitu03/Hackathon-Da-Prompters-2026");
  await page.getByRole("link", { name: "Back to projects" }).click();
  await expect(page).toHaveURL(/#projects$/);
  await expect(page.locator(".splash-screen")).toHaveCount(0);
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
  await page.getByLabel("Reason for getting in touch").selectOption("Internship / recruitment");
  await page
    .getByLabel("Your message")
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
  { height: 740, label: "small phone", width: 320 },
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

    await expect(page.getByRole("button", { name: "Show Jericho's Leo card back" })).toBeVisible();
    const dimensions = await page.evaluate(() => ({
      clientWidth: document.documentElement.clientWidth,
      scrollWidth: document.documentElement.scrollWidth,
    }));

    expect(dimensions.scrollWidth).toBeLessThanOrEqual(
      dimensions.clientWidth + 1,
    );
  });
}

test("all case studies remain readable at the smallest phone width", async ({ page }) => {
  await page.setViewportSize({ width: 320, height: 740 });
  for (const [slug, title] of [["agrifarm", "AgriFarm"], ["gabayiskolar", "GabayIskolar"], ["loveby-ade", "Loveby Ade"], ["saan-tayo", "Saan Tayo?"]]) {
    await page.goto(`/projects/${slug}`);
    await expect(page.getByRole("heading", { level: 1, name: title, exact: true })).toBeVisible();
    await expect(page.getByRole("link", { name: "View source code" })).toBeVisible();
    const dimensions = await page.evaluate(() => ({ client: document.documentElement.clientWidth, scroll: document.documentElement.scrollWidth }));
    expect(dimensions.scroll).toBeLessThanOrEqual(dimensions.client + 1);
    await expect(page.getByRole("heading", { name: "Where the project stands" })).toBeAttached();
  }
});

test("reduced motion preserves immediate access to every project", async ({ page }) => {
  await page.emulateMedia({ reducedMotion: "reduce" });
  await page.goto("/");
  await expect(page.locator(".splash-screen")).toHaveCount(0);
  await expect(page.locator(".work-card")).toHaveCount(4);
  await expect(page.getByRole("link", { name: "Read the Saan Tayo? case study" })).toBeAttached();
});

test("unknown project routes return the not-found page", async ({ page }) => {
  const response = await page.goto("/projects/not-a-project");
  expect(response?.status()).toBe(404);
  await expect(page.getByRole("link", { name: "Return home", exact: true })).toBeVisible();
});
