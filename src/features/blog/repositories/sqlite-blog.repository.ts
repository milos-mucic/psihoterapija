import { randomUUID } from "node:crypto";
import type { BlogRepository } from "@/features/blog/repositories/blog.repository";
import type {
  BlogListItem,
  BlogPostInput,
  BlogPostRecord,
  BlogPostUpdateInput,
  BlogStatus,
} from "@/features/blog/types/blog.types";
import type { SiteLocale } from "@/lib/config/site";
import { getDb } from "@/lib/db/sqlite";

type BlogRow = {
  id: string;
  slug: string;
  locale: SiteLocale;
  title: string;
  excerpt: string;
  body: string;
  cover_image: string | null;
  published_at: string;
  updated_at: string | null;
  created_at: string;
  status: BlogStatus;
  tags_json: string;
  seo_title: string | null;
  seo_description: string | null;
};

const parseTags = (raw: string) => {
  try {
    const parsed = JSON.parse(raw) as string[];
    return Array.isArray(parsed) ? parsed.filter((tag) => typeof tag === "string") : [];
  } catch {
    return [];
  }
};

const toListItem = (row: BlogRow): BlogListItem => ({
  id: row.id,
  slug: row.slug,
  locale: row.locale,
  title: row.title,
  excerpt: row.excerpt,
  coverImage: row.cover_image ?? undefined,
  publishedAt: new Date(row.published_at),
  updatedAt: row.updated_at ? new Date(row.updated_at) : undefined,
  status: row.status,
  tags: parseTags(row.tags_json),
});

const toPostRecord = (row: BlogRow): BlogPostRecord => ({
  ...toListItem(row),
  body: row.body,
  seoTitle: row.seo_title ?? undefined,
  seoDescription: row.seo_description ?? undefined,
  createdAt: new Date(row.created_at),
});

const normalizeTags = (tags: string[]) =>
  tags
    .map((tag) => tag.trim())
    .filter(Boolean)
    .slice(0, 20);

export class SqliteBlogRepository implements BlogRepository {
  async listPublished(locale: SiteLocale) {
    const db = getDb();
    const rows = db
      .prepare(
        `
          SELECT *
          FROM blog_posts
          WHERE locale = ? AND status = 'published'
          ORDER BY published_at DESC
        `,
      )
      .all(locale) as BlogRow[];

    return rows.map(toListItem);
  }

  async listAll() {
    const db = getDb();
    const rows = db
      .prepare(
        `
          SELECT *
          FROM blog_posts
          ORDER BY published_at DESC
        `,
      )
      .all() as BlogRow[];

    return rows.map(toListItem);
  }

  async getBySlug(locale: SiteLocale, slug: string) {
    const db = getDb();
    const row = db
      .prepare(
        `
          SELECT *
          FROM blog_posts
          WHERE locale = ? AND slug = ?
          LIMIT 1
        `,
      )
      .get(locale, slug) as BlogRow | undefined;

    return row ? toPostRecord(row) : undefined;
  }

  async getById(id: string) {
    const db = getDb();
    const row = db
      .prepare(
        `
          SELECT *
          FROM blog_posts
          WHERE id = ?
          LIMIT 1
        `,
      )
      .get(id) as BlogRow | undefined;

    return row ? toPostRecord(row) : undefined;
  }

  async create(input: BlogPostInput) {
    const db = getDb();
    const record: BlogPostRecord = {
      id: randomUUID(),
      ...input,
      tags: normalizeTags(input.tags),
      coverImage: input.coverImage?.trim() || undefined,
      seoTitle: input.seoTitle?.trim() || undefined,
      seoDescription: input.seoDescription?.trim() || undefined,
      createdAt: new Date(),
      updatedAt: input.updatedAt ?? undefined,
    };

    db.prepare(
      `
        INSERT INTO blog_posts (
          id,
          slug,
          locale,
          title,
          excerpt,
          body,
          cover_image,
          published_at,
          updated_at,
          created_at,
          status,
          tags_json,
          seo_title,
          seo_description
        ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
      `,
    ).run(
      record.id,
      record.slug,
      record.locale,
      record.title,
      record.excerpt,
      record.body,
      record.coverImage ?? null,
      record.publishedAt.toISOString(),
      record.updatedAt ? record.updatedAt.toISOString() : null,
      record.createdAt.toISOString(),
      record.status,
      JSON.stringify(record.tags),
      record.seoTitle ?? null,
      record.seoDescription ?? null,
    );

    return record;
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

    const db = getDb();
    db.prepare(
      `
        UPDATE blog_posts
        SET
          slug = ?,
          locale = ?,
          title = ?,
          excerpt = ?,
          body = ?,
          cover_image = ?,
          published_at = ?,
          updated_at = ?,
          status = ?,
          tags_json = ?,
          seo_title = ?,
          seo_description = ?
        WHERE id = ?
      `,
    ).run(
      next.slug,
      next.locale,
      next.title,
      next.excerpt,
      next.body,
      next.coverImage ?? null,
      next.publishedAt.toISOString(),
      next.updatedAt ? next.updatedAt.toISOString() : null,
      next.status,
      JSON.stringify(next.tags),
      next.seoTitle ?? null,
      next.seoDescription ?? null,
      id,
    );

    return next;
  }

  async delete(id: string) {
    const db = getDb();
    const result = db.prepare(`DELETE FROM blog_posts WHERE id = ?`).run(id);
    return result.changes > 0;
  }
}
