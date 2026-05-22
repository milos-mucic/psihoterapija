import type { APIRoute } from "astro";
import { requireAdminApiAuth } from "@/features/admin/auth/admin-api-auth";
import { customPageService } from "@/features/custom-pages/services/custom-page.service";
import type { SiteLocale } from "@/lib/config/site";

/**
 * GET /api/admin/custom-pages/lookup?href=<url>&locale=<sr-latn|sr-cyrl>
 *
 * Used by the navigation editor to check whether a URL maps to:
 *  - a system page (predefined in routing)
 *  - an existing custom page
 *  - an orphan URL (doesn't exist — admin should be offered to create one)
 */

const SYSTEM_PATHS: Record<SiteLocale, Set<string>> = {
  "sr-latn": new Set([
    "",
    "/",
    "/o-nama/",
    "/biografija/",
    "/usluge/",
    "/usluge/psihoterapija/",
    "/usluge/oblast-rada/",
    "/usluge/cena/",
    "/zakazivanje/",
    "/pitanja/",
    "/kontakt/",
    "/blog/",
  ]),
  "sr-cyrl": new Set([
    "/cir/",
    "/cir/o-nama/",
    "/cir/biografija/",
    "/cir/usluge/",
    "/cir/usluge/psihoterapija/",
    "/cir/usluge/oblast-rada/",
    "/cir/usluge/cena/",
    "/cir/zakazivanje/",
    "/cir/pitanja/",
    "/cir/kontakt/",
    "/cir/blog/",
  ]),
};

const normalizeHref = (raw: string): string => {
  if (!raw) return "";
  let href = raw.trim();
  if (!href.startsWith("/")) href = "/" + href;
  if (!href.endsWith("/")) href = href + "/";
  return href.toLowerCase();
};

const extractSlug = (href: string, locale: SiteLocale): string | null => {
  let path = href;
  if (locale === "sr-cyrl") {
    if (!path.startsWith("/cir/")) return null;
    path = path.slice(5); // strip "/cir/"
  } else {
    path = path.replace(/^\//, "");
  }
  return path.replace(/\/+$/, "").toLowerCase();
};

export const GET: APIRoute = async (context) => {
  const authError = requireAdminApiAuth(context);
  if (authError) return authError;

  const href = normalizeHref(context.url.searchParams.get("href") ?? "");
  const localeRaw = context.url.searchParams.get("locale");
  const locale: SiteLocale = localeRaw === "sr-cyrl" ? "sr-cyrl" : "sr-latn";

  if (!href || !href.startsWith("/")) {
    return new Response(JSON.stringify({ status: "external" }), {
      status: 200,
      headers: { "Content-Type": "application/json" },
    });
  }

  if (SYSTEM_PATHS[locale].has(href)) {
    return new Response(JSON.stringify({ status: "system" }), {
      status: 200,
      headers: { "Content-Type": "application/json" },
    });
  }

  const slug = extractSlug(href, locale);
  if (!slug) {
    return new Response(JSON.stringify({ status: "external" }), {
      status: 200,
      headers: { "Content-Type": "application/json" },
    });
  }

  const page = await customPageService.getBySlug(locale, slug);

  if (page) {
    return new Response(
      JSON.stringify({
        status: "custom",
        id: page.id,
        title: page.title,
        slug: page.slug,
        published: page.status === "published",
      }),
      { status: 200, headers: { "Content-Type": "application/json" } },
    );
  }

  return new Response(JSON.stringify({ status: "orphan", slug }), {
    status: 200,
    headers: { "Content-Type": "application/json" },
  });
};
