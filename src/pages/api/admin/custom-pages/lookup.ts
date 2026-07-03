import type { APIRoute } from "astro";
import { requireAdminApiAuth } from "@/features/admin/auth/admin-api-auth";
import { customPageService } from "@/features/custom-pages/services/custom-page.service";

/**
 * GET /api/admin/custom-pages/lookup?href=<url>
 *
 * Used by the navigation editor to check whether a URL maps to:
 *  - a system page (predefined in routing)
 *  - an existing custom page
 *  - an orphan URL (doesn't exist — admin should be offered to create one)
 */

const SYSTEM_PATHS = new Set<string>([
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
]);

const normalizeHref = (raw: string): string => {
  if (!raw) return "";
  let href = raw.trim();
  if (!href.startsWith("/")) href = "/" + href;
  if (!href.endsWith("/")) href = href + "/";
  return href.toLowerCase();
};

const extractSlug = (href: string): string | null => {
  const path = href.replace(/^\//, "");
  return path.replace(/\/+$/, "").toLowerCase();
};

export const GET: APIRoute = async (context) => {
  const authError = requireAdminApiAuth(context);
  if (authError) return authError;

  const href = normalizeHref(context.url.searchParams.get("href") ?? "");

  if (!href || !href.startsWith("/")) {
    return new Response(JSON.stringify({ status: "external" }), {
      status: 200,
      headers: { "Content-Type": "application/json" },
    });
  }

  if (SYSTEM_PATHS.has(href)) {
    return new Response(JSON.stringify({ status: "system" }), {
      status: 200,
      headers: { "Content-Type": "application/json" },
    });
  }

  const slug = extractSlug(href);
  if (!slug) {
    return new Response(JSON.stringify({ status: "external" }), {
      status: 200,
      headers: { "Content-Type": "application/json" },
    });
  }

  const page = await customPageService.getBySlug(slug);

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
