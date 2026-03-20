import { mkdir } from "node:fs/promises";
import type { APIRoute } from "astro";
import { getDb } from "@/lib/db/sqlite";
import { getUploadsDir } from "@/lib/storage/uploads";

const plainTextContentType = "text/plain; charset=utf-8"; // i18n-exempt
const notReadyBody = "not ready"; // i18n-exempt

export const GET: APIRoute = async () => {
  try {
    await mkdir(getUploadsDir(), { recursive: true });
    getDb().prepare("SELECT 1").get();

    // i18n-exempt
    return new Response("ready", {
      status: 200,
      headers: {
        "Cache-Control": "no-store",
        "Content-Type": plainTextContentType,
      },
    });
  } catch {
    return new Response(notReadyBody, {
      status: 503,
      headers: {
        "Cache-Control": "no-store",
        "Content-Type": plainTextContentType,
      },
    });
  }
};
