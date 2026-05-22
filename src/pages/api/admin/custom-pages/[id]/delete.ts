import type { APIRoute } from "astro";
import { requireAdminApiAuth } from "@/features/admin/auth/admin-api-auth";
import { customPageService } from "@/features/custom-pages/services/custom-page.service";
import { adminConfig } from "@/lib/config/admin";

export const POST: APIRoute = async (context) => {
  const authError = requireAdminApiAuth(context);
  if (authError) return authError;

  const id = context.params.id;
  if (id) {
    await customPageService.delete(id);
  }
  return context.redirect(`${adminConfig.basePath}/pages/?deleted=1`);
};
