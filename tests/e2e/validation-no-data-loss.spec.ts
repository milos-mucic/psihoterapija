import { test, expect } from "@playwright/test";
import { ADMIN_BASE_PATH, loginAsAdmin } from "./utils/admin-auth";
import { createBlogPost, deleteBlogPost } from "./utils/fixtures";

// Regression test: a failed save used to redirect and reload the edit page
// from the stale DB record, silently discarding every unsaved field
// (including all RTF fields). Saves now return a JSON error and the form
// submits via fetch, so a failed save must never navigate or lose content.
test.describe("Failed save does not discard unsaved form content (regression)", () => {
  let postId: string;

  test.beforeEach(async ({ page }) => {
    await loginAsAdmin(page);
    const seed = `${test.info().workerIndex}-${Date.now()}`;
    ({ id: postId } = await createBlogPost(page, seed));
  });

  test.afterEach(async ({ page }) => {
    if (postId) {
      await deleteBlogPost(page, postId);
    }
  });

  test("clearing the required title and saving shows an error and keeps other fields intact", async ({ page }) => {
    await page.goto(`${ADMIN_BASE_PATH}/blog/${postId}/edit/`);
    await page.waitForSelector(".admin-rtf__editor--inline");

    const excerptEditor = page.locator(".admin-rtf textarea[name=\"excerpt\"]");
    const excerptBefore = await excerptEditor.inputValue();

    const titleEditor = page.locator('.admin-rtf', { has: page.locator('textarea[name="title"]') }).locator(".admin-rtf__editor");
    await titleEditor.click();
    await page.keyboard.press("ControlOrMeta+a");
    await page.keyboard.press("Delete");

    const urlBefore = page.url();
    await page.click("[data-admin-form-submit]");
    await page.waitForTimeout(1000);

    expect(page.url()).toBe(urlBefore);
    await expect(page.locator("[data-admin-form-submit-status]")).toContainText("nije validan");

    const excerptAfter = await excerptEditor.inputValue();
    expect(excerptAfter).toBe(excerptBefore);
  });
});
