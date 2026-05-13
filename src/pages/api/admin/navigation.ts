import type { APIRoute } from "astro";
import { ZodError } from "zod";
import { requireAdminApiAuth } from "@/features/admin/auth/admin-api-auth";
import { navigationService } from "@/features/navigation/service";
import { adminConfig } from "@/lib/config/admin";
import type { SiteLocale } from "@/lib/config/site";

export const POST: APIRoute = async (context) => {
  const authError = requireAdminApiAuth(context);

  if (authError) {
    return authError;
  }

  const formData = await context.request.formData();
  const localeValue = formData.get("locale");
  const payloadValue = formData.get("payload");

  const locale: SiteLocale = localeValue === "sr-cyrl" ? "sr-cyrl" : "sr-latn";
  const redirectBase = `${adminConfig.basePath}/navigation/?locale=${locale}`;

  if (typeof payloadValue !== "string") {
    return context.redirect(`${redirectBase}&error=invalid`);
  }

  let parsedPayload: unknown;
  try {
    parsedPayload = JSON.parse(payloadValue);
  } catch {
    return context.redirect(`${redirectBase}&error=invalid`);
  }

  try {
    await navigationService.saveNavigation(locale, parsedPayload);
    return context.redirect(`${redirectBase}&saved=1`);
  } catch (error) {
    if (error instanceof ZodError) {
      return context.redirect(`${redirectBase}&error=validation`);
    }

    console.error("[navigation] save failed", error);
    return context.redirect(`${redirectBase}&error=server`);
  }
};
