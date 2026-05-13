import { randomUUID } from "node:crypto";
import { PageContent, db, eq, and } from "astro:db";
import { sql } from "drizzle-orm";
import type { SiteLocale } from "@/lib/config/site";
import type { ManagedNavigation } from "@/features/navigation/types";

const NAV_PAGE_KEY = "navigation";

let ensureSchemaPromise: Promise<void> | undefined;

const ensureSchema = async () => {
  if (!ensureSchemaPromise) {
    ensureSchemaPromise = (async () => {
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
      ensureSchemaPromise = undefined;
      throw error;
    });
  }

  return ensureSchemaPromise;
};

export class NavigationRepository {
  async get(locale: SiteLocale): Promise<ManagedNavigation | undefined> {
    await ensureSchema();

    const rows = await db
      .select()
      .from(PageContent)
      .where(and(eq(PageContent.pageKey, NAV_PAGE_KEY), eq(PageContent.locale, locale)))
      .limit(1);

    const row = rows[0];

    if (!row) {
      return undefined;
    }

    return row.content as ManagedNavigation;
  }

  async upsert(locale: SiteLocale, content: ManagedNavigation): Promise<void> {
    await ensureSchema();

    const existing = await db
      .select()
      .from(PageContent)
      .where(and(eq(PageContent.pageKey, NAV_PAGE_KEY), eq(PageContent.locale, locale)))
      .limit(1);

    const now = new Date();

    if (existing.length === 0) {
      await db.insert(PageContent).values({
        id: randomUUID(),
        pageKey: NAV_PAGE_KEY,
        locale,
        content,
        createdAt: now,
        updatedAt: now,
      });
      return;
    }

    await db
      .update(PageContent)
      .set({
        content,
        updatedAt: now,
      })
      .where(eq(PageContent.id, existing[0].id));
  }
}

export const navigationRepository = new NavigationRepository();
