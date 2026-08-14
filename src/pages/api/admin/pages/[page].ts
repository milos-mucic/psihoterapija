import type { APIRoute } from "astro";
import { ZodError } from "zod";
import { requireAdminApiAuth } from "@/features/admin/auth/admin-api-auth";
import { pageContentService } from "@/features/page-content/services/page-content.service";
import { getDictionary } from "@/features/i18n/translate";
import { adminConfig } from "@/lib/config/admin";

const dictionary = getDictionary();

const supportedPages = new Set([
  "about",
  "biography",
  "psychotherapy",
  "scope",
  "services",
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

  try {
    switch (page) {
      case "about":
        await pageContentService.updateAboutContent(payload);
        break;
      case "biography":
        await pageContentService.updateBiographyContent(payload);
        break;
      case "psychotherapy":
        await pageContentService.updatePsychotherapyContent(payload);
        break;
      case "scope":
        await pageContentService.updateScopeContent(payload);
        break;
      case "services":
        await pageContentService.updateServicesContent(payload);
        break;
      case "pricing":
        await pageContentService.updatePricingContent(payload);
        break;
      case "appointment":
        await pageContentService.updateAppointmentContent(payload);
        break;
      case "faq":
        await pageContentService.updateFaqContent(payload);
        break;
      case "contact":
        await pageContentService.updateContactContent(payload);
        break;
      case "blog":
        await pageContentService.updateBlogIndexContent(payload);
        break;
      default:
        return context.redirect(`${adminConfig.basePath}/pages/`);
    }

    return context.redirect(`${adminConfig.basePath}/pages/${page}/?saved=1`);
  } catch (error) {
    if (error instanceof ZodError) {
      return new Response(
        JSON.stringify({
          message: dictionary.admin.pages.messages.validationError,
          issues: error.issues.map((issue) => ({ path: issue.path.join("."), message: issue.message })),
        }),
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
