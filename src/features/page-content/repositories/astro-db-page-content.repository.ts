import { randomUUID } from "node:crypto";
import { PageContent, db, eq, and } from "astro:db";
import { sql } from "drizzle-orm";
import type { PageContentRepository } from "@/features/page-content/repositories/page-content.repository";
import type { PageContentRecord, PageKey } from "@/features/page-content/types/page-content.types";
import type { SiteLocale } from "@/lib/config/site";

const toDate = (value: Date | string) => (value instanceof Date ? value : new Date(value));

const toRecord = (row: {
  id: string;
  pageKey: string;
  locale: SiteLocale;
  content: unknown;
  createdAt: Date | string;
  updatedAt: Date | string;
}): PageContentRecord => ({
  id: row.id,
  pageKey: row.pageKey as PageKey,
  locale: row.locale,
  content: row.content,
  createdAt: toDate(row.createdAt),
  updatedAt: toDate(row.updatedAt),
});

let ensurePageContentSchemaPromise: Promise<void> | undefined;

const ensurePageContentSchema = async () => {
  if (!ensurePageContentSchemaPromise) {
    ensurePageContentSchemaPromise = (async () => {
      await db.run(
        sql.raw(
          'CREATE TABLE IF NOT EXISTS "PageContent" ("id" text PRIMARY KEY, "pageKey" text NOT NULL, "locale" text NOT NULL, "content" text NOT NULL, "createdAt" text NOT NULL, "updatedAt" text NOT NULL)',
        ),
      );
      await db.run(
        sql.raw(
          'CREATE UNIQUE INDEX IF NOT EXISTS "PageContent_locale_pageKey_idx" ON "PageContent" ("locale", "pageKey")',
        ),
      );
    })().catch((error) => {
      ensurePageContentSchemaPromise = undefined;
      throw error;
    });
  }

  return ensurePageContentSchemaPromise;
};

export class AstroDbPageContentRepository implements PageContentRepository {
  async get(pageKey: PageKey, locale: SiteLocale) {
    await ensurePageContentSchema();

    const rows = await db
      .select()
      .from(PageContent)
      .where(and(eq(PageContent.pageKey, pageKey), eq(PageContent.locale, locale)))
      .limit(1);

    const row = rows[0];
    return row ? toRecord(row) : undefined;
  }

  async listAll() {
    await ensurePageContentSchema();

    const rows = await db.select().from(PageContent);
    return rows.map((row) => toRecord(row));
  }

  async upsert(pageKey: PageKey, locale: SiteLocale, content: unknown) {
    await ensurePageContentSchema();

    const existing = await this.get(pageKey, locale);
    const now = new Date();

    if (!existing) {
      const record = {
        id: randomUUID(),
        pageKey,
        locale,
        content,
        createdAt: now,
        updatedAt: now,
      };

      await db.insert(PageContent).values(record);

      return record;
    }

    await db
      .update(PageContent)
      .set({
        content,
        updatedAt: now,
      })
      .where(eq(PageContent.id, existing.id));

    return {
      ...existing,
      content,
      updatedAt: now,
    };
  }
}
