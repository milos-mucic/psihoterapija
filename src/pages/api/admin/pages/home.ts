import type { APIRoute } from "astro";
import { ZodError } from "zod";
import { requireAdminApiAuth } from "@/features/admin/auth/admin-api-auth";
import { pageContentService } from "@/features/page-content/services/page-content.service";
import { getDictionary } from "@/features/i18n/translate";
import { adminConfig } from "@/lib/config/admin";

const dictionary = getDictionary();

const toPayload = async (request: Request) => {
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

  const payload = await toPayload(context.request);

  try {
    await pageContentService.updateHomeContent(payload);
    return context.redirect(`${adminConfig.basePath}/pages/home/?saved=1`);
  } catch (error) {
    if (error instanceof ZodError) {
      return new Response(
        JSON.stringify({ message: dictionary.admin.pages.messages.validationError }),
        { status: 400, headers: { "Content-Type": "application/json" } },
      );
    }

    console.error(error);
    return new Response(
      JSON.stringify({ message: dictionary.admin.pages.messages.validationError }),
      { status: 500, headers: { "Content-Type": "application/json" } },
    );
  }
};
