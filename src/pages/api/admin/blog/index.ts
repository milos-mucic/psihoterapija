import type { APIRoute } from "astro";
import { ZodError } from "zod";
import { requireAdminApiAuth } from "@/features/admin/auth/admin-api-auth";
import { blogService } from "@/features/blog/services/blog.service";
import { getDictionary } from "@/features/i18n/translate";
import { adminConfig } from "@/lib/config/admin";

const dictionary = getDictionary("sr-latn");

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

  try {
    const payload = await toPayload(context.request);
    const post = await blogService.createPost(payload);

    return context.redirect(`${adminConfig.basePath}/blog/${post.id}/edit/?created=1`);
  } catch (error) {
    if (error instanceof ZodError) {
      return context.redirect(`${adminConfig.basePath}/blog/new/?error=validation`);
    }

    if (isUniqueConstraintError(error)) {
      return context.redirect(`${adminConfig.basePath}/blog/new/?error=slug-conflict`);
    }

    console.error(error);

    return new Response(JSON.stringify({ message: dictionary.api.submissionSaveFailed }), {
      status: 500,
      headers: { "Content-Type": "application/json" },
    });
  }
};
