import type { APIRoute } from "astro";
import { ZodError } from "zod";
import { requireAdminApiAuth } from "@/features/admin/auth/admin-api-auth";
import { pageContentService } from "@/features/page-content/services/page-content.service";
import { adminConfig } from "@/lib/config/admin";
import type { SiteLocale } from "@/lib/config/site";

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
  const locale = payload.locale === "sr-cyrl" ? "sr-cyrl" : "sr-latn";

  try {
    await pageContentService.updateHomeContent(locale as SiteLocale, payload);
    return context.redirect(`${adminConfig.basePath}/pages/home/?locale=${locale}&saved=1`);
  } catch (error) {
    if (error instanceof ZodError) {
      return context.redirect(`${adminConfig.basePath}/pages/home/?locale=${locale}&error=validation`);
    }

    console.error(error);
    return context.redirect(`${adminConfig.basePath}/pages/home/?locale=${locale}&error=validation`);
  }
};
