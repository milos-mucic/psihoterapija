import type { APIRoute } from "astro";
import { ZodError } from "zod";
import { requireAdminApiAuth } from "@/features/admin/auth/admin-api-auth";
import { pageContentService } from "@/features/page-content/services/page-content.service";
import { adminConfig } from "@/lib/config/admin";
import type { SiteLocale } from "@/lib/config/site";

const supportedPages = new Set([
  "about",
  "biography",
  "psychotherapy",
  "scope",
  "pricing",
  "appointment",
  "faq",
  "contact",
  "blog",
]);

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

  const page = context.params.page;

  if (!page || !supportedPages.has(page)) {
    return context.redirect(`${adminConfig.basePath}/pages/`);
  }

  const payload = await toPayload(context.request);
  const locale = payload.locale === "sr-cyrl" ? "sr-cyrl" : "sr-latn";
  const localeValue = locale as SiteLocale;

  try {
    switch (page) {
      case "about":
        await pageContentService.updateAboutContent(localeValue, payload);
        break;
      case "biography":
        await pageContentService.updateBiographyContent(localeValue, payload);
        break;
      case "psychotherapy":
        await pageContentService.updatePsychotherapyContent(localeValue, payload);
        break;
      case "scope":
        await pageContentService.updateScopeContent(localeValue, payload);
        break;
      case "pricing":
        await pageContentService.updatePricingContent(localeValue, payload);
        break;
      case "appointment":
        await pageContentService.updateAppointmentContent(localeValue, payload);
        break;
      case "faq":
        await pageContentService.updateFaqContent(localeValue, payload);
        break;
      case "contact":
        await pageContentService.updateContactContent(localeValue, payload);
        break;
      case "blog":
        await pageContentService.updateBlogIndexContent(localeValue, payload);
        break;
      default:
        return context.redirect(`${adminConfig.basePath}/pages/`);
    }

    return context.redirect(`${adminConfig.basePath}/pages/${page}/?locale=${locale}&saved=1`);
  } catch (error) {
    if (error instanceof ZodError) {
      return context.redirect(
        `${adminConfig.basePath}/pages/${page}/?locale=${locale}&error=validation`,
      );
    }

    console.error(error);
    return context.redirect(
      `${adminConfig.basePath}/pages/${page}/?locale=${locale}&error=validation`,
    );
  }
};
