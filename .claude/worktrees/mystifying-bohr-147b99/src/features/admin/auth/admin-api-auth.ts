import type { APIRoute } from "astro";
import { getDictionary } from "@/features/i18n/translate";
import { adminAuthService } from "@/features/admin/auth/admin-auth.service";

type ApiContext = Parameters<APIRoute>[0];

export const requireAdminApiAuth = (context: Pick<ApiContext, "cookies">) => {
  if (adminAuthService.isAuthenticated(context.cookies)) {
    return undefined;
  }

  const dictionary = getDictionary("sr-latn");

  return new Response(JSON.stringify({ message: dictionary.api.adminAccessDenied }), {
    status: 403,
    headers: { "Content-Type": "application/json" },
  });
};
