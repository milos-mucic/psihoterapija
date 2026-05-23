/**
 * Idempotent DB migration for the production-persisted SQLite file.
 *
 * The k8s init container copies `bootstrap/astro.db` only the first time. After
 * subsequent deploys the on-disk DB lacks any tables added in the meantime,
 * which crashes the admin (CustomPages, SiteSettings, …).
 *
 * This script runs `CREATE TABLE IF NOT EXISTS` for every table that newer
 * code expects, plus the matching indexes. It can be re-run safely.
 *
 * Schema strings are kept in sync with the SQL Astro DB itself generates (see
 * db/config.ts and inspect via libSQL after a clean build).
 */
import { createClient } from "@libsql/client";

const DB_URL = process.env.ASTRO_DATABASE_FILE || "file:./data/astro.db";

const migrations = [
  {
    name: "CustomPages",
    statements: [
      'CREATE TABLE IF NOT EXISTS "CustomPages" ("id" text PRIMARY KEY, "slug" text NOT NULL, "locale" text NOT NULL, "title" text NOT NULL, "description" text, "blocks" text NOT NULL, "status" text NOT NULL, "createdAt" text NOT NULL, "updatedAt" text NOT NULL)',
      'CREATE UNIQUE INDEX IF NOT EXISTS "CustomPages_locale_slug_idx" ON "CustomPages" ("locale", "slug")',
      'CREATE INDEX IF NOT EXISTS "CustomPages_status_idx" ON "CustomPages" ("status")',
    ],
  },
  {
    name: "SiteSettings",
    statements: [
      'CREATE TABLE IF NOT EXISTS "SiteSettings" ("key" text PRIMARY KEY, "value" text NOT NULL, "updatedAt" text NOT NULL)',
    ],
  },
];

const main = async () => {
  console.log(`[migrate-db] target: ${DB_URL}`);
  const client = createClient({ url: DB_URL });

  for (const migration of migrations) {
    console.log(`[migrate-db] ensuring ${migration.name}…`);
    for (const sql of migration.statements) {
      try {
        await client.execute(sql);
      } catch (error) {
        console.error(`[migrate-db] failed for ${migration.name}:`, error);
        throw error;
      }
    }
  }

  console.log("[migrate-db] all migrations applied.");
  client.close();
};

main().catch((error) => {
  console.error("[migrate-db] aborted:", error);
  process.exit(1);
});
