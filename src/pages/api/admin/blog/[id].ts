import type { APIRoute } from "astro";
import { ZodError } from "zod";
import { requireAdminApiAuth } from "@/features/admin/auth/admin-api-auth";
import { blogService } from "@/features/blog/services/blog.service";
import { getDictionary } from "@/features/i18n/translate";
import { adminConfig } from "@/lib/config/admin";

const dictionary = getDictionary();

const isUniqueConstraintError = (error: unknown) =>
  error instanceof Error && /UNIQUE constraint failed/i.test(error.message);

const toPayload = async (request: Request) => {
  const contentType = request.headers.get("content-type") ?? "";

  if (contentType.includes("application/json")) {
    return request.json().catch(() => ({}));
  }

  const formData = await request.formData();
  const payload: Record<string, unknown> = {};

  for (const [key, value] of formData.entries()) {
    payload[key] = typeof value === "string" ? value : value.name;
  }

  return payload;
};

export const POST: APIRoute = async (context) => {
  const authError = requireAdminApiAuth(context);

  if (authError) {
    return authError;
  }

  const { id } = context.params;

  if (!id) {
    return context.redirect(`${adminConfig.basePath}/blog/?error=not-found`);
  }

  try {
    const payload = await toPayload(context.request);
    const post = await blogService.updatePost(id, payload);

    if (!post) {
      return context.redirect(`${adminConfig.basePath}/blog/?error=not-found`);
    }

    return context.redirect(`${adminConfig.basePath}/blog/${id}/edit/?saved=1`);
  } catch (error) {
    if (error instanceof ZodError) {
      return new Response(JSON.stringify({ message: dictionary.admin.blogMessages.validationError }), {
        status: 400,
        headers: { "Content-Type": "application/json" },
      });
    }

    if (isUniqueConstraintError(error)) {
      return new Response(JSON.stringify({ message: dictionary.admin.blogMessages.slugConflict }), {
        status: 409,
        headers: { "Content-Type": "application/json" },
      });
    }

    console.error(error);

    return new Response(JSON.stringify({ message: dictionary.api.submissionSaveFailed }), {
      status: 500,
      headers: { "Content-Type": "application/json" },
    });
  }
};
