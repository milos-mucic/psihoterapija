import { test, expect } from "@playwright/test";
import { ADMIN_BASE_PATH, loginAsAdmin } from "./utils/admin-auth";
import { applyRichTextStyling, postForm, snapshotForm } from "./utils/form";

// Home is a singleton page (no create/delete) — this test snapshots the whole
// form before mutating, saves through the real API, asserts on the public
// page, then restores the original snapshot so the live home page is
// unaffected afterward.
test.describe("Home page RTF styling persists and renders (singleton, save+restore)", () => {
  test("aboutBody (full-mode field) formatting round-trips and renders on /", async ({ page }) => {
    await loginAsAdmin(page);
    await page.goto(`${ADMIN_BASE_PATH}/pages/home/`);
    await page.waitForSelector('.admin-rtf textarea[name="aboutBody"]', { state: "attached" });

    const originalPayload = await snapshotForm(page, "form.admin-form");

    const styledHtml = await applyRichTextStyling(page, "aboutBody", {
      fontSize: "28px",
      color: "#0000ff",
    });
    expect(styledHtml).toContain("font-size: 28px");
    expect(styledHtml).toContain("color: #0000ff");

    const mutatedPayload = await snapshotForm(page, "form.admin-form");
    expect(mutatedPayload.aboutBody).toContain("font-size: 28px");

    try {
      const saveResponse = await postForm(page, "/api/admin/pages/home", mutatedPayload);
      if (!saveResponse.ok()) {
        throw new Error(`Save failed: ${saveResponse.status()} ${await saveResponse.text()}`);
      }

      await page.goto("/");
      const style = await page.locator(".home-about .home-richtext [style]").first().evaluate((el) => {
        const cs = getComputedStyle(el);
        return { fontSize: cs.fontSize, color: cs.color };
      });
      expect(style.fontSize).toBe("28px");
      expect(style.color).toBe("rgb(0, 0, 255)");
    } finally {
      const restoreResponse = await postForm(page, "/api/admin/pages/home", originalPayload);
      if (!restoreResponse.ok()) {
        throw new Error(`Restore failed: ${restoreResponse.status()} ${await restoreResponse.text()}`);
      }
    }
  });
});
