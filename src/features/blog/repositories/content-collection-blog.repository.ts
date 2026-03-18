import { getCollection } from "astro:content";
import type { BlogRepository } from "@/features/blog/repositories/blog.repository";
import type { BlogEntry, BlogListItem } from "@/features/blog/types/blog.types";
import type { SiteLocale } from "@/lib/config/site";

const normalizeSlug = (value: string) => value.split("/").at(-1) ?? value;

const toListItem = (entry: BlogEntry): BlogListItem => ({
  id: entry.id,
  slug: normalizeSlug(entry.slug),
  locale: entry.data.locale,
  title: entry.data.title,
  excerpt: entry.data.excerpt,
  coverImage: entry.data.coverImage,
  publishedAt: entry.data.publishedAt,
  updatedAt: entry.data.updatedAt,
  status: entry.data.status,
  tags: entry.data.tags,
});

export class ContentCollectionBlogRepository implements BlogRepository {
  async listPublished(locale: SiteLocale) {
    const entries = await getCollection(
      "blog",
      ({ data }) => data.locale === locale && data.status === "published",
    );

    return entries
      .map(toListItem)
      .sort((a, b) => b.publishedAt.getTime() - a.publishedAt.getTime());
  }

  async listAll() {
    const entries = await getCollection("blog");

    return entries
      .map(toListItem)
      .sort((a, b) => b.publishedAt.getTime() - a.publishedAt.getTime());
  }

  async getBySlug(locale: SiteLocale, slug: string) {
    const entries = await getCollection("blog", ({ data }) => data.locale === locale);
    return entries.find((entry) => normalizeSlug(entry.slug) === slug);
  }
}
