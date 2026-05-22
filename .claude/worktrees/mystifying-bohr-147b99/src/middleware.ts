import { defineMiddleware } from "astro:middleware";
import { adminAuthService } from "@/features/admin/auth/admin-auth.service";
import { adminConfig } from "@/lib/config/admin";

export const onRequest = defineMiddleware(async (context, next) => {
  const pathname = context.url.pathname.replace(/\/$/, "");
  const adminPath = adminConfig.basePath.replace(/\/$/, "");

  if (!pathname.startsWith(adminPath)) {
    return next();
  }

  const isEntryPage = pathname === adminPath;

  if (isEntryPage || adminAuthService.isAuthenticated(context.cookies)) {
    return next();
  }

  return context.redirect(`${adminConfig.basePath}/?auth=required`);
});
