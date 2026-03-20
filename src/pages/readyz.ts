import { mkdir } from "node:fs/promises";
import { Submissions, db } from "astro:db";
import type { APIRoute } from "astro";
import { getUploadsDir } from "@/lib/storage/uploads";

const plainTextContentType = "text/plain; charset=utf-8"; // i18n-exempt
const notReadyBody = "not ready"; // i18n-exempt

export const GET: APIRoute = async () => {
  try {
    await mkdir(getUploadsDir(), { recursive: true });
    await db.select().from(Submissions).limit(1);

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
