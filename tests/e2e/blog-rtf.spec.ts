import { test, expect } from "@playwright/test";
import { ADMIN_BASE_PATH, loginAsAdmin } from "./utils/admin-auth";
import { createBlogPost, deleteBlogPost } from "./utils/fixtures";
import { applyRichTextStyling } from "./utils/form";

test.describe("Blog post RTF styling persists and renders", () => {
  let postId: string;
  let slug: string;

  test.beforeEach(async ({ page }) => {
    await loginAsAdmin(page);
    const seed = `${test.info().workerIndex}-${Date.now()}`;
    ({ id: postId, slug } = await createBlogPost(page, seed));
  });

  test.afterEach(async ({ page }) => {
    if (postId) {
      await deleteBlogPost(page, postId);
    }
  });

  test("title (inline) and body (full) formatting round-trips and renders on the public page", async ({ page }) => {
    await page.goto(`${ADMIN_BASE_PATH}/blog/${postId}/edit/`);
    await page.waitForSelector(".admin-rtf__editor--inline");

    const titleHtml = await applyRichTextStyling(page, "title", {
      fontSize: "24px",
      color: "#ff0000",
      bold: true,
    });
    expect(titleHtml).toContain("font-size: 24px");
    expect(titleHtml).toContain("color: rgb(255, 0, 0)");

    const bodyHtml = await applyRichTextStyling(page, "body", {
      fontFamily: "Castoro, Georgia, serif",
      italic: true,
    });
    expect(bodyHtml).toContain("Castoro");

    await page.click("[data-admin-form-submit]");
    await page.waitForURL(/saved=1/);

    // Round-trip through the DB: reload the edit page and confirm the editor still shows the styling.
    // The sanitizer re-serializes the style attribute (drops whitespace), so compare with
    // whitespace stripped rather than an exact substring match.
    await page.goto(`${ADMIN_BASE_PATH}/blog/${postId}/edit/`);
    const titleHtmlAfterReload = (
      await page.locator('.admin-rtf textarea[name="title"]').inputValue()
    ).replace(/\s+/g, "");
    expect(titleHtmlAfterReload).toContain("font-size:24px");
    expect(titleHtmlAfterReload).toContain("color:rgb(255,0,0)");

    const bodyHtmlAfterReload = await page.locator('.admin-rtf textarea[name="body"]').inputValue();
    expect(bodyHtmlAfterReload).toContain("Castoro");

    // Render-side proof: visit the public post and check computed styles.
    await page.goto(`/blog/${slug}/`);
    const titleStyle = await page.locator("h1.section-title [style]").first().evaluate((el) => {
      const cs = getComputedStyle(el);
      return { fontSize: cs.fontSize, color: cs.color, fontWeight: cs.fontWeight };
    });
    expect(titleStyle.fontSize).toBe("24px");
    expect(titleStyle.color).toBe("rgb(255, 0, 0)");
    expect(Number(titleStyle.fontWeight)).toBeGreaterThanOrEqual(700);

    const bodyStyle = await page.locator(".prose-shell [style]").first().evaluate((el) => {
      const cs = getComputedStyle(el);
      return { fontFamily: cs.fontFamily, fontStyle: cs.fontStyle };
    });
    expect(bodyStyle.fontFamily).toContain("Castoro");
    expect(bodyStyle.fontStyle).toBe("italic");
  });
});
