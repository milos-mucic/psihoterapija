import type { APIRoute } from "astro";
import { requireAdminApiAuth } from "@/features/admin/auth/admin-api-auth";
import { blogService } from "@/features/blog/services/blog.service";
import { adminConfig } from "@/lib/config/admin";

export const POST: APIRoute = async (context) => {
  const authError = requireAdminApiAuth(context);

  if (authError) {
    return authError;
  }

  const { id } = context.params;

  if (!id) {
    return context.redirect(`${adminConfig.basePath}/blog/?error=not-found`);
  }

  const deleted = await blogService.deletePost(id);

  if (!deleted) {
    return context.redirect(`${adminConfig.basePath}/blog/?error=not-found`);
  }

  return context.redirect(`${adminConfig.basePath}/blog/?deleted=1`);
};
