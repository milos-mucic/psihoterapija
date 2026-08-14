import { test, expect } from "@playwright/test";
import { ADMIN_BASE_PATH, loginAsAdmin } from "./utils/admin-auth";
import { createCustomPage, deleteCustomPage } from "./utils/fixtures";
import { applyRichTextStyling } from "./utils/form";

// Regression test for the "Custom Pages strip all RTF styling" bug: before the
// fix, CustomPageBlocks.astro sanitized with a local allowlist that dropped
// every `style` attribute and the `span` tag entirely.
test.describe("Custom Page RTF styling persists and renders (regression)", () => {
  let pageId: string;
  let slug: string;

  test.beforeEach(async ({ page }) => {
    await loginAsAdmin(page);
    const seed = `${test.info().workerIndex}-${Date.now()}`;
    ({ id: pageId, slug } = await createCustomPage(page, seed));
  });

  test.afterEach(async ({ page }) => {
    if (pageId) {
      await deleteCustomPage(page, pageId);
    }
  });

  test("richtext block formatting round-trips and renders on the public custom page", async ({ page }) => {
    await page.goto(`${ADMIN_BASE_PATH}/pages/custom/${pageId}/`);
    await page.waitForSelector('.admin-rtf textarea[name="rtf-block-1-html"]', { state: "attached" });

    const styledHtml = await applyRichTextStyling(page, "rtf-block-1-html", {
      fontSize: "20px",
      color: "#00aa00",
      bold: true,
    });
    expect(styledHtml).toContain("font-size: 20px");
    expect(styledHtml).toContain("color: rgb(0, 170, 0)");

    await page.click("button.cpb__save[type=submit]");
    await page.waitForURL(/saved=1|created=1/);

    await page.goto(`/${slug}/`);
    const style = await page.locator(".cp-richtext__body [style]").first().evaluate((el) => {
      const cs = getComputedStyle(el);
      return { fontSize: cs.fontSize, color: cs.color, fontWeight: cs.fontWeight };
    });
    expect(style.fontSize).toBe("20px");
    expect(style.color).toBe("rgb(0, 170, 0)");
    expect(Number(style.fontWeight)).toBeGreaterThanOrEqual(700);
  });
});
