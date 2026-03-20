const getOptional = (value: string | undefined | null) =>
  typeof value === "string" && value.trim().length > 0 ? value.trim() : undefined;

const getEnv = (name: string) => getOptional(process.env[name]);

export const serverEnv = {
  adminPassword: getEnv("ADMIN_PASSWORD") ?? "change-me-admin-password",
  adminCookieName: getEnv("ADMIN_COOKIE_NAME") ?? "ikar_admin_session",
  adminSessionSecret: getEnv("ADMIN_SESSION_SECRET") ?? "change-me-session-secret",
  publicSiteUrl: getEnv("PUBLIC_SITE_URL") ?? "https://example.com",
  databaseUrl: getEnv("DATABASE_URL"),
  uploadsDir: getEnv("UPLOADS_DIR"),
};
