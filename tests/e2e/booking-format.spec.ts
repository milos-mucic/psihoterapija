import { test, expect } from "@playwright/test";
import { ADMIN_BASE_PATH, loginAsAdmin } from "./utils/admin-auth";
import { postForm, snapshotForm } from "./utils/form";

// Regression test for the "booking format dumps raw RTF HTML as literal <option>
// text" bug: bookingFormat1/2/3 used to be full AdminRichTextField instances,
// but <option> never renders markup, so any styling showed up as visible tag
// text. They're now plain inputs; this also checks the defensive stripHtmlTags
// on the render side in case older data still has HTML in it.
test.describe("Home booking-format field renders as clean text (regression)", () => {
  test("field is a plain input, and legacy HTML content renders without visible tags", async ({ page }) => {
    await loginAsAdmin(page);
    await page.goto(`${ADMIN_BASE_PATH}/pages/home/`);

    const input = page.locator('input[name="bookingFormat1"]');
    await expect(input).toBeVisible();
    // Must NOT be wrapped in a rich-text editor anymore.
    await expect(page.locator('.admin-rtf textarea[name="bookingFormat1"]')).toHaveCount(0);

    const originalPayload = await snapshotForm(page, "form.admin-form");
    const mutatedPayload = {
      ...originalPayload,
      bookingFormat1: "<strong>Utorak</strong>",
    };

    try {
      const saveResponse = await postForm(page, "/api/admin/pages/home", mutatedPayload);
      expect(saveResponse.ok()).toBeTruthy();

      await page.goto("/");
      const option = page.locator('select[name="format"] option', { hasText: "Utorak" }).first();
      await expect(option).toHaveText("Utorak");
      expect(await option.textContent()).not.toContain("<strong>");
    } finally {
      const restoreResponse = await postForm(page, "/api/admin/pages/home", originalPayload);
      expect(restoreResponse.ok()).toBeTruthy();
    }
  });
});
