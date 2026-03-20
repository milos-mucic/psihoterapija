import { randomUUID } from "node:crypto";
import { BlogPosts, and, db, desc, eq } from "astro:db";
import type { BlogRepository } from "@/features/blog/repositories/blog.repository";
import type {
  BlogListItem,
  BlogPostInput,
  BlogPostRecord,
  BlogPostUpdateInput,
  BlogStatus,
} from "@/features/blog/types/blog.types";
import type { SiteLocale } from "@/lib/config/site";

const toDate = (value: Date | string) => (value instanceof Date ? value : new Date(value));

const parseTags = (value: unknown) =>
  Array.isArray(value) ? value.filter((tag): tag is string => typeof tag === "string") : [];

const toListItem = (row: {
  id: string;
  slug: string;
  locale: SiteLocale;
  title: string;
  excerpt: string;
  coverImage: string | null;
  publishedAt: Date | string;
  updatedAt: Date | string | null;
  status: BlogStatus;
  tags: unknown;
}): BlogListItem => ({
  id: row.id,
  slug: row.slug,
  locale: row.locale,
  title: row.title,
  excerpt: row.excerpt,
  coverImage: row.coverImage ?? undefined,
  publishedAt: toDate(row.publishedAt),
  updatedAt: row.updatedAt ? toDate(row.updatedAt) : undefined,
  status: row.status,
  tags: parseTags(row.tags),
});

const toPostRecord = (row: {
  id: string;
  slug: string;
  locale: SiteLocale;
  title: string;
  excerpt: string;
  body: string;
  coverImage: string | null;
  publishedAt: Date | string;
  updatedAt: Date | string | null;
  createdAt: Date | string;
  status: BlogStatus;
  tags: unknown;
  seoTitle: string | null;
  seoDescription: string | null;
}): BlogPostRecord => ({
  ...toListItem(row),
  body: row.body,
  seoTitle: row.seoTitle ?? undefined,
  seoDescription: row.seoDescription ?? undefined,
  createdAt: toDate(row.createdAt),
});

const normalizeTags = (tags: string[]) =>
  tags
    .map((tag) => tag.trim())
    .filter(Boolean)
    .slice(0, 20);

export class AstroDbBlogRepository implements BlogRepository {
  async listPublished(locale: SiteLocale) {
    const rows = await db
      .select()
      .from(BlogPosts)
      .where(and(eq(BlogPosts.locale, locale), eq(BlogPosts.status, "published")))
      .orderBy(desc(BlogPosts.publishedAt));

    return rows.map(toListItem);
  }

  async listAll() {
    const rows = await db.select().from(BlogPosts).orderBy(desc(BlogPosts.publishedAt));
    return rows.map(toListItem);
  }

  async getBySlug(locale: SiteLocale, slug: string) {
    const rows = await db
      .select()
      .from(BlogPosts)
      .where(and(eq(BlogPosts.locale, locale), eq(BlogPosts.slug, slug)))
      .limit(1);

    const row = rows[0];
    return row ? toPostRecord(row) : undefined;
  }

  async getById(id: string) {
    const rows = await db.select().from(BlogPosts).where(eq(BlogPosts.id, id)).limit(1);
    const row = rows[0];
    return row ? toPostRecord(row) : undefined;
  }

  async create(input: BlogPostInput) {
    const record = {
      id: randomUUID(),
      slug: input.slug,
      locale: input.locale,
      title: input.title,
      excerpt: input.excerpt,
      body: input.body,
      coverImage: input.coverImage?.trim() || undefined,
      publishedAt: input.publishedAt,
      updatedAt: input.updatedAt ?? undefined,
      createdAt: new Date(),
      status: input.status,
      tags: normalizeTags(input.tags),
      seoTitle: input.seoTitle?.trim() || undefined,
      seoDescription: input.seoDescription?.trim() || undefined,
    };

    await db.insert(BlogPosts).values(record);

    return {
      ...record,
      createdAt: record.createdAt,
    };
  }

  async update(id: string, input: BlogPostUpdateInput) {
    const existing = await this.getById(id);

    if (!existing) {
      return undefined;
    }

    const next: BlogPostRecord = {
      ...existing,
      ...input,
      tags: input.tags ? normalizeTags(input.tags) : existing.tags,
      coverImage:
        input.coverImage !== undefined ? input.coverImage?.trim() || undefined : existing.coverImage,
      seoTitle: input.seoTitle !== undefined ? input.seoTitle?.trim() || undefined : existing.seoTitle,
      seoDescription:
        input.seoDescription !== undefined
          ? input.seoDescription?.trim() || undefined
          : existing.seoDescription,
      updatedAt: new Date(),
    };

    await db
      .update(BlogPosts)
      .set({
        slug: next.slug,
        locale: next.locale,
        title: next.title,
        excerpt: next.excerpt,
        body: next.body,
        coverImage: next.coverImage,
        publishedAt: next.publishedAt,
        updatedAt: next.updatedAt,
        status: next.status,
        tags: next.tags,
        seoTitle: next.seoTitle,
        seoDescription: next.seoDescription,
      })
      .where(eq(BlogPosts.id, id));

    return next;
  }

  async delete(id: string) {
    const existing = await this.getById(id);

    if (!existing) {
      return false;
    }

    await db.delete(BlogPosts).where(eq(BlogPosts.id, id));
    return true;
  }
}
