import type { APIRoute } from "astro";
import { adminConfig } from "@/lib/config/admin";

export const POST: APIRoute = async ({ cookies, redirect }) => {
  cookies.delete(adminConfig.cookieName, { path: "/" });
  return redirect(`${adminConfig.basePath}/`);
};
