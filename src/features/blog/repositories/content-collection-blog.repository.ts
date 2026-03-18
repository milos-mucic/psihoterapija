import { getCollection, type CollectionEntry } from "astro:content";
import type { BlogRepository } from "@/features/blog/repositories/blog.repository";
import type {
  BlogListItem,
  BlogPostInput,
  BlogPostRecord,
  BlogPostUpdateInput,
} from "@/features/blog/types/blog.types";
import type { SiteLocale } from "@/lib/config/site";

const normalizeSlug = (value: string) => value.split("/").at(-1) ?? value;

type BlogCollectionEntry = CollectionEntry<"blog">;

const toListItem = (entry: BlogCollectionEntry): BlogListItem => ({
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

const toPostRecord = (entry: BlogCollectionEntry): BlogPostRecord => ({
  ...toListItem(entry),
  body: entry.body,
  seoTitle: entry.data.seoTitle,
  seoDescription: entry.data.seoDescription,
  createdAt: entry.data.publishedAt,
});

export const listContentCollectionBlogPosts = async (): Promise<BlogPostRecord[]> => {
  const entries = await getCollection("blog");

  return entries
    .map(toPostRecord)
    .sort((a, b) => b.publishedAt.getTime() - a.publishedAt.getTime());
};

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
    const entry = entries.find((candidate) => normalizeSlug(candidate.slug) === slug);
    return entry ? toPostRecord(entry) : undefined;
  }

  async getById(id: string) {
    const entries = await getCollection("blog");
    const entry = entries.find((candidate) => candidate.id === id);
    return entry ? toPostRecord(entry) : undefined;
  }

  async create(_input: BlogPostInput) {
    throw new Error("Content collection repository is read-only.");
  }

  async update(_id: string, _input: BlogPostUpdateInput) {
    throw new Error("Content collection repository is read-only.");
  }

  async delete(_id: string) {
    throw new Error("Content collection repository is read-only.");
  }
}
