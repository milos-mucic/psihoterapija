import { mkdirSync } from "node:fs";
import path from "node:path";
import { DatabaseSync } from "node:sqlite";
import { serverEnv } from "@/lib/env";

type GlobalDb = typeof globalThis & {
  __ikarDb?: DatabaseSync;
};

const resolveDatabasePath = () => {
  const configuredUrl = serverEnv.databaseUrl;

  if (!configuredUrl) {
    return path.join(process.cwd(), "data", "app.db");
  }

  if (!configuredUrl.startsWith("file:")) {
    return path.isAbsolute(configuredUrl)
      ? configuredUrl
      : path.join(process.cwd(), configuredUrl);
  }

  try {
    const parsed = new URL(configuredUrl);
    let normalizedPath = decodeURIComponent(parsed.pathname);

    if (process.platform === "win32" && normalizedPath.startsWith("/")) {
      normalizedPath = normalizedPath.slice(1);
    }

    return path.isAbsolute(normalizedPath)
      ? normalizedPath
      : path.join(process.cwd(), normalizedPath);
  } catch {
    const rawPath = configuredUrl.replace(/^file:/, "");
    return path.isAbsolute(rawPath) ? rawPath : path.join(process.cwd(), rawPath);
  }
};

const runMigrations = (db: DatabaseSync) => {
  db.exec(`
    PRAGMA journal_mode = WAL;
    PRAGMA foreign_keys = ON;

    CREATE TABLE IF NOT EXISTS submissions (
      id TEXT PRIMARY KEY,
      type TEXT NOT NULL,
      locale TEXT NOT NULL,
      name TEXT NOT NULL,
      email TEXT NOT NULL,
      phone TEXT,
      format TEXT,
      message TEXT,
      status TEXT NOT NULL,
      created_at TEXT NOT NULL
    );

    CREATE INDEX IF NOT EXISTS idx_submissions_created_at
    ON submissions(created_at DESC);

    CREATE TABLE IF NOT EXISTS cms_content (
      content_key TEXT NOT NULL,
      locale TEXT NOT NULL,
      data_json TEXT NOT NULL,
      created_at TEXT NOT NULL,
      updated_at TEXT NOT NULL,
      PRIMARY KEY (content_key, locale)
    );

    CREATE INDEX IF NOT EXISTS idx_cms_content_updated_at
    ON cms_content(updated_at DESC);

    CREATE TABLE IF NOT EXISTS media_assets (
      id TEXT PRIMARY KEY,
      filename TEXT NOT NULL,
      mime_type TEXT NOT NULL,
      storage_path TEXT NOT NULL,
      alt_text TEXT,
      width INTEGER,
      height INTEGER,
      created_at TEXT NOT NULL
    );

    CREATE INDEX IF NOT EXISTS idx_media_assets_created_at
    ON media_assets(created_at DESC);

    CREATE TABLE IF NOT EXISTS blog_posts (
      id TEXT PRIMARY KEY,
      slug TEXT NOT NULL,
      locale TEXT NOT NULL,
      title TEXT NOT NULL,
      excerpt TEXT NOT NULL,
      body TEXT NOT NULL,
      cover_image TEXT,
      published_at TEXT NOT NULL,
      updated_at TEXT,
      created_at TEXT NOT NULL,
      status TEXT NOT NULL,
      tags_json TEXT NOT NULL,
      seo_title TEXT,
      seo_description TEXT,
      UNIQUE(locale, slug)
    );

    CREATE INDEX IF NOT EXISTS idx_blog_posts_published_at
    ON blog_posts(published_at DESC);

    CREATE INDEX IF NOT EXISTS idx_blog_posts_locale_status
    ON blog_posts(locale, status);
  `);
};

export const getDatabasePath = () => resolveDatabasePath();

export const getDb = () => {
  const globalDb = globalThis as GlobalDb;

  if (globalDb.__ikarDb) {
    return globalDb.__ikarDb;
  }

  const dbPath = resolveDatabasePath();
  mkdirSync(path.dirname(dbPath), { recursive: true });

  const db = new DatabaseSync(dbPath);
  runMigrations(db);
  globalDb.__ikarDb = db;

  return db;
};
