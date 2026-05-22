import { defineMiddleware } from "astro:middleware";
import { adminAuthService } from "@/features/admin/auth/admin-auth.service";
import { adminConfig } from "@/lib/config/admin";

export const onRequest = defineMiddleware(async (context, next) => {
  const pathname = context.url.pathname.replace(/\/$/, "");
  const adminPath = adminConfig.basePath.replace(/\/$/, "");

  // Only guard admin pages
  if (!pathname.startsWith(adminPath)) {
    return next();
  }

  // Always allow the login page itself
  if (pathname === `${adminPath}/login`) {
    return next();
  }

  if (adminAuthService.isAuthenticated(context.cookies)) {
    return next();
  }

  const back = encodeURIComponent(context.url.pathname + context.url.search);
  return context.redirect(`${adminConfig.basePath}/login/?return=${back}`);
});
