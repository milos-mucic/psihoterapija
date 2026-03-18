import { defineConfig } from "astro/config";
import mdx from "@astrojs/mdx";
import node from "@astrojs/node";
import react from "@astrojs/react";
import sitemap from "@astrojs/sitemap";
import tailwindcss from "@tailwindcss/vite";

const site = process.env.PUBLIC_SITE_URL ?? "https://example.com";

export default defineConfig({
  site,
  output: "server",
  adapter: node({
    mode: "standalone",
  }),
  integrations: [react(), mdx(), sitemap()],
  vite: {
    plugins: [tailwindcss()],
  },
});
