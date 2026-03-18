const getOptional = (value: string | undefined) =>
  typeof value === "string" && value.trim().length > 0 ? value.trim() : undefined;

export const serverEnv = {
  adminPassword: getOptional(import.meta.env.ADMIN_PASSWORD) ?? "change-me-admin-password",
  adminCookieName:
    getOptional(import.meta.env.ADMIN_COOKIE_NAME) ?? "ikar_admin_session",
  adminSessionSecret:
    getOptional(import.meta.env.ADMIN_SESSION_SECRET) ?? "change-me-session-secret",
  publicSiteUrl: getOptional(import.meta.env.PUBLIC_SITE_URL) ?? "https://example.com",
  databaseUrl: getOptional(import.meta.env.DATABASE_URL),
};
