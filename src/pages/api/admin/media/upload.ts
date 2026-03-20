import { randomUUID } from "node:crypto";
import { mkdir, writeFile } from "node:fs/promises";
import path from "node:path";
import type { APIRoute } from "astro";
import { requireAdminApiAuth } from "@/features/admin/auth/admin-api-auth";
import { getDictionary } from "@/features/i18n/translate";
import { getDb } from "@/lib/db/sqlite";
import { getUploadsDir } from "@/lib/storage/uploads";

const MAX_IMAGE_BYTES = 8 * 1024 * 1024;

const safeBaseName = (raw: string) =>
  raw
    .toLowerCase()
    .replace(/\.[^.]+$/, "")
    .normalize("NFKD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .slice(0, 60);

const extensionFrom = (file: File) => {
  const fromName = path.extname(file.name).toLowerCase();

  if (fromName) {
    return fromName;
  }

  if (file.type === "image/png") {
    return ".png";
  }

  if (file.type === "image/webp") {
    return ".webp";
  }

  if (file.type === "image/gif") {
    return ".gif";
  }

  return ".jpg";
};

const insertMediaAssetSql = `INSERT INTO MEDIA_ASSETS (ID, FILENAME, MIME_TYPE, STORAGE_PATH, ALT_TEXT, WIDTH, HEIGHT, CREATED_AT) VALUES (?, ?, ?, ?, ?, ?, ?, ?)`; // i18n-exempt

export const POST: APIRoute = async (context) => {
  const authError = requireAdminApiAuth(context);

  if (authError) {
    return authError;
  }

  const dictionary = getDictionary("sr-latn");

  try {
    const formData = await context.request.formData();
    const file = formData.get("file");

    if (!(file instanceof File)) {
      return new Response(JSON.stringify({ message: dictionary.api.invalidSubmission }), {
        status: 400,
        headers: { "Content-Type": "application/json" },
      });
    }

    if (!file.type.startsWith("image/")) {
      return new Response(JSON.stringify({ message: dictionary.api.invalidSubmission }), {
        status: 400,
        headers: { "Content-Type": "application/json" },
      });
    }

    if (file.size > MAX_IMAGE_BYTES) {
      return new Response(JSON.stringify({ message: dictionary.api.invalidSubmission }), {
        status: 400,
        headers: { "Content-Type": "application/json" },
      });
    }

    const now = new Date();
    const year = String(now.getFullYear());
    const month = String(now.getMonth() + 1).padStart(2, "0");
    const extension = extensionFrom(file);
    const baseName = safeBaseName(file.name) || "image";
    const id = randomUUID();
    const storageName = `${id}-${baseName}${extension}`;

    const relativeDir = path.join("uploads", "blog", year, month);
    const fullDir = path.join(getUploadsDir(), "blog", year, month);

    await mkdir(fullDir, { recursive: true });

    const bytes = Buffer.from(await file.arrayBuffer());
    const absolutePath = path.join(fullDir, storageName);
    await writeFile(absolutePath, bytes);

    const publicUrl = `/${relativeDir.replaceAll(path.sep, "/")}/${storageName}`;

    const db = getDb();
    db.prepare(insertMediaAssetSql).run(
      id,
      storageName,
      file.type,
      publicUrl,
      null,
      null,
      null,
      new Date().toISOString(),
    );

    return new Response(JSON.stringify({ url: publicUrl }), {
      status: 201,
      headers: { "Content-Type": "application/json" },
    });
  } catch {
    return new Response(JSON.stringify({ message: dictionary.api.submissionSaveFailed }), {
      status: 500,
      headers: { "Content-Type": "application/json" },
    });
  }
};
