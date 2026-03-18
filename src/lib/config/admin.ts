import { siteConfig } from "@/lib/config/site";

export const adminConfig = {
  basePath: siteConfig.adminPath,
  cookieName: "ikar_admin_session",
  sessionDurationSeconds: 60 * 60 * 8,
};
