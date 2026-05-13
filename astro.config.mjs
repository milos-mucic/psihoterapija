import { defineConfig } from "astro/config";
import mdx from "@astrojs/mdx";
import node from "@astrojs/node";
import react from "@astrojs/react";
import sitemap from "@astrojs/sitemap";
import tailwindcss from "@tailwindcss/vite";

import db from "@astrojs/db";

const site = process.env.PUBLIC_SITE_URL ?? "https://example.com";

export default defineConfig({
  site,
  output: "server",
  adapter: node({
    mode: "standalone",
  }),
  security: {
    checkOrigin: false,
  },
  redirects: {
    "/oblast-rada/": "/psihoterapija/",
    "/oblast-rada/[slug]": "/psihoterapija/",
    "/cir/oblast-rada/": "/cir/psihoterapija/",
    "/cir/oblast-rada/[slug]": "/cir/psihoterapija/",
  },
  integrations: [react(), mdx(), sitemap(), db()],
  vite: {
    plugins: [tailwindcss()],
  },
});