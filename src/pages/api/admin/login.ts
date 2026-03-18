import type { APIRoute } from "astro";
import { adminAuthService } from "@/features/admin/auth/admin-auth.service";
import { adminConfig } from "@/lib/config/admin";

export const POST: APIRoute = async ({ request, cookies }) => {
  const body = await request.json().catch(() => null);
  const password = typeof body?.password === "string" ? body.password : "";

  if (!adminAuthService.validatePassword(password)) {
    return new Response(JSON.stringify({ message: "Pogresna sifra." }), {
      status: 401,
      headers: { "Content-Type": "application/json" },
    });
  }

  cookies.set(adminConfig.cookieName, adminAuthService.getSessionToken(), {
    httpOnly: true,
    sameSite: "lax",
    path: "/",
    maxAge: adminConfig.sessionDurationSeconds,
    secure: import.meta.env.PROD,
  });

  return new Response(JSON.stringify({ success: true }), {
    status: 200,
    headers: { "Content-Type": "application/json" },
  });
};
