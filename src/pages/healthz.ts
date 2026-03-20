import type { APIRoute } from "astro";

const plainTextContentType = "text/plain; charset=utf-8"; // i18n-exempt

// i18n-exempt
export const GET: APIRoute = () =>
  new Response("ok", {
    status: 200,
    headers: {
      "Cache-Control": "no-store",
      "Content-Type": plainTextContentType,
    },
  });
