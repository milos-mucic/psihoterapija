import { createHmac, timingSafeEqual } from "node:crypto";
import type { AstroCookies } from "astro";
import { adminConfig } from "@/lib/config/admin";
import { serverEnv } from "@/lib/env";

const buildSessionToken = () => {
  return createHmac("sha256", serverEnv.adminSessionSecret)
    .update(`ikar-admin:${serverEnv.adminPassword}`)
    .digest("hex");
};

export const adminAuthService = {
  isAuthenticated(cookies: AstroCookies) {
    const received = cookies.get(adminConfig.cookieName)?.value;

    if (!received) {
      return false;
    }

    const expected = buildSessionToken();
    const receivedBuffer = Buffer.from(received);
    const expectedBuffer = Buffer.from(expected);

    if (receivedBuffer.length !== expectedBuffer.length) {
      return false;
    }

    return timingSafeEqual(receivedBuffer, expectedBuffer);
  },
  validatePassword(password: string) {
    return password === serverEnv.adminPassword;
  },
  getSessionToken() {
    return buildSessionToken();
  },
};
