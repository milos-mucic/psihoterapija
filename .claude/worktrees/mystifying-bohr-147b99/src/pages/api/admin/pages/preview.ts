import type { APIRoute } from "astro";
import { ZodError } from "zod";
import { requireAdminApiAuth } from "@/features/admin/auth/admin-api-auth";
import { getAdminPreviewHref } from "@/features/page-content/admin/page-route-map";
import { pageContentService } from "@/features/page-content/services/page-content.service";
import type { PageKey } from "@/features/page-content/types/page-content.types";
import type { SiteLocale } from "@/lib/config/site";

const supportedPages = new Set<PageKey>([
  "home",
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

  const payload = await toPayload(context.request);
  const pageKey = typeof payload.pageKey === "string" ? (payload.pageKey as PageKey) : undefined;
  const locale = payload.locale === "sr-cyrl" ? "sr-cyrl" : "sr-latn";
  const token = typeof payload.previewToken === "string" ? payload.previewToken : undefined;

  if (!pageKey || !supportedPages.has(pageKey)) {
    // i18n-exempt
    return new Response(JSON.stringify({ message: "Unsupported page." }), { status: 400 });
  }

  try {
    const entry = pageContentService.savePreviewDraft(
      pageKey,
      locale as SiteLocale,
      payload,
      token,
    );

    return new Response(
      JSON.stringify({
        token: entry.token,
        previewHref: getAdminPreviewHref(pageKey, locale as SiteLocale, entry.token),
      }),
      {
        headers: {
          "content-type": "application/json",
        },
      },
    );
  } catch (error) {
    if (error instanceof ZodError) {
      // i18n-exempt
      return new Response(JSON.stringify({ message: "Preview payload is invalid." }), {
        status: 422,
        headers: {
          "content-type": "application/json",
        },
      });
    }

    console.error(error);
    // i18n-exempt
    return new Response(JSON.stringify({ message: "Preview update failed." }), {
      status: 500,
      headers: {
        "content-type": "application/json",
      },
    });
  }
};
