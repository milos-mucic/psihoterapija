import type { Page } from "@playwright/test";

export const ADMIN_BASE_PATH = "/studio/ikar-portal-4f27b19a";
const ADMIN_PASSWORD = process.env.ADMIN_PASSWORD ?? "change-me-admin-password";

/**
 * Logs into the admin via the JSON login endpoint. `page.request` shares the
 * browser context's cookie jar with `page.goto(...)`, so this is enough to
 * make subsequent admin page navigations authenticated.
 */
export const loginAsAdmin = async (page: Page) => {
  const response = await page.request.post("/api/admin/login", {
    data: { password: ADMIN_PASSWORD },
  });

  if (!response.ok()) {
    throw new Error(`Admin login failed: ${response.status()} ${await response.text()}`);
  }
};
