/**
 * Idempotent DB migration for the production-persisted SQLite file.
 *
 * The k8s init container copies `bootstrap/astro.db` only the FIRST time the
 * persistent volume is empty. On every later deploy the on-disk DB keeps its
 * old schema, so schema changes shipped in code must be applied here.
 *
 * This script:
 *   1. Ensures tables added by newer code exist (CustomPages, SiteSettings…).
 *   2. Removes the legacy `locale` column (Cyrillic/i18n removal): drops any
 *      index that references `locale`, deletes non-Latin rows, drops the column,
 *      and recreates the current (locale-free) indexes.
 *
 * It is safe to re-run: every step is guarded so an already-migrated DB is a
 * no-op, and the locale migration never aborts pod startup (failures are logged
 * and the atomic batch rolls back, leaving the table untouched).
 *
 * Schema strings are kept in sync with the SQL Astro DB generates — inspect a
 * fresh build with `sqlite_master` after `astro build` when db/config.ts changes.
 */
import { createClient } from "@libsql/client";

const DB_URL = process.env.ASTRO_DATABASE_FILE || "file:./data/astro.db";

// Tables that need any missing structure created (for older persisted DBs).
const ensureMigrations = [
  {
    name: "CustomPages",
    statements: [
      'CREATE TABLE IF NOT EXISTS "CustomPages" ("id" text PRIMARY KEY, "slug" text NOT NULL, "title" text NOT NULL, "description" text, "blocks" text NOT NULL, "status" text NOT NULL, "createdAt" text NOT NULL, "updatedAt" text NOT NULL)',
      'CREATE UNIQUE INDEX IF NOT EXISTS "CustomPages_slug_idx" ON "CustomPages" ("slug")',
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

// Legacy `locale` removal. For each table: if a `locale` column still exists,
// drop indexes referencing it, keep only sr-latn rows (where a unique key would
// otherwise collide), drop the column, and (re)create the current indexes.
const localeMigrations = [
  {
    name: "PageContent",
    dedupe: true, // unique on pageKey → keep one row per pageKey (the Latin one)
    indexes: ['CREATE UNIQUE INDEX IF NOT EXISTS "PageContent_pageKey_idx" ON "PageContent" ("pageKey")'],
  },
  {
    name: "BlogPosts",
    dedupe: true, // unique on slug
    indexes: [
      'CREATE INDEX IF NOT EXISTS "BlogPosts_publishedAt_idx" ON "BlogPosts" ("publishedAt")',
      'CREATE INDEX IF NOT EXISTS "BlogPosts_status_idx" ON "BlogPosts" ("status")',
      'CREATE UNIQUE INDEX IF NOT EXISTS "BlogPosts_slug_idx" ON "BlogPosts" ("slug")',
    ],
  },
  {
    name: "CustomPages",
    dedupe: true, // unique on slug
    indexes: [
      'CREATE UNIQUE INDEX IF NOT EXISTS "CustomPages_slug_idx" ON "CustomPages" ("slug")',
      'CREATE INDEX IF NOT EXISTS "CustomPages_status_idx" ON "CustomPages" ("status")',
    ],
  },
  {
    name: "Submissions",
    dedupe: false, // no unique key on locale → keep all rows
    indexes: ['CREATE INDEX IF NOT EXISTS "Submissions_createdAt_idx" ON "Submissions" ("createdAt")'],
  },
];

const tableColumns = async (client, table) => {
  const res = await client.execute(`PRAGMA table_info("${table}")`);
  return res.rows.map((row) => row.name);
};

const localeIndexNames = async (client, table) => {
  const res = await client.execute({
    sql: "SELECT name FROM sqlite_master WHERE type = 'index' AND tbl_name = ? AND sql LIKE '%locale%'",
    args: [table],
  });
  return res.rows.map((row) => row.name);
};

const applyEnsureMigrations = async (client) => {
  for (const migration of ensureMigrations) {
    console.log(`[migrate-db] ensuring ${migration.name}…`);
    for (const sql of migration.statements) {
      // Best-effort: a lingering duplicate (e.g. an un-migrated unique key) must
      // never abort pod startup. CREATE TABLE/INDEX IF NOT EXISTS are no-ops once
      // the locale migration has run.
      try {
        await client.execute(sql);
      } catch (error) {
        console.error(`[migrate-db] ensure step for ${migration.name} skipped:`, error);
      }
    }
  }
};

const applyLocaleMigrations = async (client) => {
  for (const migration of localeMigrations) {
    const { name } = migration;

    let columns;
    try {
      columns = await tableColumns(client, name);
    } catch (error) {
      console.error(`[migrate-db] could not inspect ${name}, skipping:`, error);
      continue;
    }

    if (columns.length === 0) {
      console.log(`[migrate-db] ${name} does not exist, skipping locale migration.`);
      continue;
    }

    if (!columns.includes("locale")) {
      console.log(`[migrate-db] ${name} already locale-free.`);
      continue;
    }

    console.log(`[migrate-db] removing legacy 'locale' column from ${name}…`);

    try {
      const indexesToDrop = await localeIndexNames(client, name);
      const batch = [
        ...indexesToDrop.map((idx) => `DROP INDEX IF EXISTS "${idx}"`),
        ...(migration.dedupe ? [`DELETE FROM "${name}" WHERE "locale" <> 'sr-latn'`] : []),
        `ALTER TABLE "${name}" DROP COLUMN "locale"`,
        ...migration.indexes,
      ];

      // Atomic: if any statement fails, the whole batch rolls back and the
      // table is left exactly as it was (pod still starts).
      await client.batch(batch, "write");
      console.log(`[migrate-db] ${name} migrated (dropped ${indexesToDrop.length} locale index(es)).`);
    } catch (error) {
      console.error(
        `[migrate-db] locale migration for ${name} failed and was rolled back:`,
        error,
      );
    }
  }
};

const main = async () => {
  console.log(`[migrate-db] target: ${DB_URL}`);
  const client = createClient({ url: DB_URL });

  try {
    // Locale removal first: dedupe + drop the legacy column + (re)create the
    // current indexes. Only then ensure any still-missing tables, so the new
    // unique indexes are never created on top of un-deduped legacy data.
    await applyLocaleMigrations(client);
    await applyEnsureMigrations(client);
    console.log("[migrate-db] all migrations applied.");
  } finally {
    client.close();
  }
};

main().catch((error) => {
  console.error("[migrate-db] aborted:", error);
  process.exit(1);
});
