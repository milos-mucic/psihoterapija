import { test, expect } from "@playwright/test";
import { ADMIN_BASE_PATH, loginAsAdmin } from "./utils/admin-auth";
import { applyRichTextStyling, postForm, snapshotForm } from "./utils/form";

// Contact is a config-driven managed page (AdminManagedField promotion path),
// a singleton — same snapshot/save/restore approach as the home page test.
// Its repeatable groups (socialLink, officeGallery) have no rich-text
// sub-fields, so they're plain SSR-rendered inputs (unlike e.g. "about"'s
// showcase cards, whose rich-text sub-fields mount dynamically via
// client-side JS and can race a form snapshot taken too early).
test.describe("Config-driven managed page RTF styling persists and renders (contact, save+restore)", () => {
  test("introCopy (auto-promoted full-mode field) formatting round-trips and renders on /kontakt/", async ({
    page,
  }) => {
    await loginAsAdmin(page);
    await page.goto(`${ADMIN_BASE_PATH}/pages/contact/`);
    await page.waitForSelector('.admin-rtf textarea[name="introCopy"]', { state: "attached" });

    const originalPayload = await snapshotForm(page, "form.admin-form");
    // This dev DB's contact record predates `bannerDescription` becoming a
    // required field, so it's currently blank — which makes even an
    // unmodified re-save fail validation. Patch it to a placeholder for both
    // the save and the restore so this test doesn't depend on fixing that
    // unrelated pre-existing data issue.
    if (!originalPayload.bannerDescription) {
      originalPayload.bannerDescription = "Placeholder banner description.";
    }

    const styledHtml = await applyRichTextStyling(page, "introCopy", {
      fontFamily: "Georgia, 'Times New Roman', serif",
      italic: true,
    });
    expect(styledHtml).toContain("Georgia");

    const mutatedPayload = await snapshotForm(page, "form.admin-form");
    mutatedPayload.bannerDescription = originalPayload.bannerDescription;

    try {
      const saveResponse = await postForm(page, "/api/admin/pages/contact", mutatedPayload);
      if (!saveResponse.ok()) {
        throw new Error(`Save failed: ${saveResponse.status()} ${await saveResponse.text()}`);
      }

      await page.goto("/kontakt/");
      const style = await page
        .locator(".contact-details .richtext-shell [style]")
        .first()
        .evaluate((el) => {
          const cs = getComputedStyle(el);
          return { fontFamily: cs.fontFamily, fontStyle: cs.fontStyle };
        });
      expect(style.fontFamily).toContain("Georgia");
      expect(style.fontStyle).toBe("italic");
    } finally {
      const restoreResponse = await postForm(page, "/api/admin/pages/contact", originalPayload);
      if (!restoreResponse.ok()) {
        throw new Error(`Restore failed: ${restoreResponse.status()} ${await restoreResponse.text()}`);
      }
    }
  });
});
