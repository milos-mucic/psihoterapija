import type { APIRoute } from "astro";
import { requireAdminApiAuth } from "@/features/admin/auth/admin-api-auth";
import {
  CustomPageSlugConflictError,
  CustomPageValidationError,
  customPageService,
} from "@/features/custom-pages/services/custom-page.service";
import { adminConfig } from "@/lib/config/admin";

const readPayload = async (request: Request): Promise<unknown> => {
  const contentType = request.headers.get("content-type") ?? "";

  if (contentType.includes("application/json")) {
    return request.json().catch(() => ({}));
  }

  const formData = await request.formData();
  const raw = formData.get("payload");
  if (typeof raw === "string") {
    try {
      return JSON.parse(raw);
    } catch {
      return {};
    }
  }
  const out: Record<string, unknown> = {};
  for (const [key, value] of formData.entries()) {
    out[key] = typeof value === "string" ? value : value.name;
  }
  return out;
};

export const POST: APIRoute = async (context) => {
  const authError = requireAdminApiAuth(context);
  if (authError) return authError;

  const id = context.params.id;
  if (!id) {
    return new Response(JSON.stringify({ message: "Missing id." }), {
      status: 400,
      headers: { "Content-Type": "application/json" },
    });
  }

  try {
    const payload = await readPayload(context.request);
    const updated = await customPageService.update(id, payload);
    if (!updated) {
      return new Response(JSON.stringify({ message: "Stranica nije pronađena." }), {
        status: 404,
        headers: { "Content-Type": "application/json" },
      });
    }
    return context.redirect(
      `${adminConfig.basePath}/pages/custom/${updated.id}/?saved=1`,
    );
  } catch (error) {
    if (error instanceof CustomPageValidationError) {
      return new Response(
        JSON.stringify({ message: "Validacija nije prošla.", issues: error.issues }),
        { status: 400, headers: { "Content-Type": "application/json" } },
      );
    }
    if (error instanceof CustomPageSlugConflictError) {
      return new Response(
        JSON.stringify({ message: `Stranica sa URL-om "${error.slug}" već postoji.` }),
        { status: 409, headers: { "Content-Type": "application/json" } },
      );
    }
    console.error(error);
    return new Response(JSON.stringify({ message: "Greška na serveru." }), {
      status: 500,
      headers: { "Content-Type": "application/json" },
    });
  }
};

export const DELETE: APIRoute = async (context) => {
  const authError = requireAdminApiAuth(context);
  if (authError) return authError;

  const id = context.params.id;
  if (!id) {
    return new Response(JSON.stringify({ message: "Missing id." }), {
      status: 400,
      headers: { "Content-Type": "application/json" },
    });
  }

  const ok = await customPageService.delete(id);
  if (!ok) {
    return new Response(JSON.stringify({ message: "Stranica nije pronađena." }), {
      status: 404,
      headers: { "Content-Type": "application/json" },
    });
  }
  return new Response(JSON.stringify({ success: true }), {
    status: 200,
    headers: { "Content-Type": "application/json" },
  });
};
