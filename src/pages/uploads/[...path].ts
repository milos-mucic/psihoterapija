import { readFile, stat } from "node:fs/promises";
import path from "node:path";
import type { APIRoute } from "astro";
import { getUploadsDir } from "@/lib/storage/uploads";

const notFoundBody = "Not found"; // i18n-exempt
const immutableCacheControl = "public, max-age=31536000, immutable"; // i18n-exempt

// i18n-exempt
const contentTypes: Record<string, string> = {
  ".avif": "image/avif",
  ".gif": "image/gif",
  ".jpeg": "image/jpeg",
  ".jpg": "image/jpeg",
  ".png": "image/png",
  ".svg": "image/svg+xml", // i18n-exempt
  ".webp": "image/webp",
};

const resolveRequestedPath = (rawPath: string) => {
  const root = path.resolve(getUploadsDir());
  const segments = rawPath
    .split("/")
    .map((segment) => decodeURIComponent(segment))
    .filter(Boolean);

  if (segments.length === 0) {
    return undefined;
  }

  const absolutePath = path.resolve(root, ...segments);

  if (absolutePath !== root && !absolutePath.startsWith(`${root}${path.sep}`)) {
    return undefined;
  }

  return absolutePath;
};

const createNotFoundResponse = () => new Response(notFoundBody, { status: 404 });

export const GET: APIRoute = async ({ params }) => {
  const requestedPath = params.path;

  if (!requestedPath) {
    return createNotFoundResponse();
  }

  const absolutePath = resolveRequestedPath(requestedPath);

  if (!absolutePath) {
    return createNotFoundResponse();
  }

  try {
    const fileStats = await stat(absolutePath);

    if (!fileStats.isFile()) {
      return createNotFoundResponse();
    }

    const body = await readFile(absolutePath);
    const extension = path.extname(absolutePath).toLowerCase();

    return new Response(body, {
      status: 200,
      headers: {
        "Cache-Control": immutableCacheControl,
        "Content-Type": contentTypes[extension] ?? "application/octet-stream",
      },
    });
  } catch {
    return createNotFoundResponse();
  }
};
