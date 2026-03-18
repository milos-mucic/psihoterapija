import type { CollectionEntry } from "astro:content";
import type { SiteLocale } from "@/lib/config/site";

export type BlogEntry = CollectionEntry<"blog">;

export type BlogListItem = {
  id: string;
  slug: string;
  locale: SiteLocale;
  title: string;
  excerpt: string;
  publishedAt: Date;
  updatedAt?: Date;
  status: "draft" | "published";
  tags: string[];
};
