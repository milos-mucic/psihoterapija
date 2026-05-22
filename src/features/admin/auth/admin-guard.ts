import type { AstroGlobal } from "astro";
import { adminAuthService } from "./admin-auth.service";
import { adminConfig } from "@/lib/config/admin";

/**
 * Server-side auth gate for admin pages.
 * If not authenticated, returns a Response redirecting to the login page
 * with a `return` query so the user lands back on the originally requested URL.
 *
 *   const guard = adminGuard(Astro);
 *   if (guard) return guard;
 */
export function adminGuard(astro: AstroGlobal): Response | null {
  if (adminAuthService.isAuthenticated(astro.cookies)) {
    return null;
  }
  const back = encodeURIComponent(astro.url.pathname + astro.url.search);
  return astro.redirect(`${adminConfig.basePath}/login/?return=${back}`);
}
