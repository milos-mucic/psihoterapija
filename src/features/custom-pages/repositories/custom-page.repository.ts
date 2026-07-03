import { randomUUID } from "node:crypto";
import { CustomPages, db, desc, eq } from "astro:db";
import type {
  CustomPageBlock,
  CustomPageInput,
  CustomPageListItem,
  CustomPageRecord,
  CustomPageStatus,
} from "@/features/custom-pages/types/custom-page.types";

const toDate = (value: Date | string) => (value instanceof Date ? value : new Date(value));

const parseBlocks = (value: unknown): CustomPageBlock[] => {
  if (!Array.isArray(value)) return [];
  return value.filter(
    (b): b is CustomPageBlock =>
      typeof b === "object" &&
      b !== null &&
      typeof (b as any).id === "string" &&
      typeof (b as any).type === "string",
  );
};

const toListItem = (row: {
  id: string;
  slug: string;
  title: string;
  status: CustomPageStatus;
  updatedAt: Date | string;
}): CustomPageListItem => ({
  id: row.id,
  slug: row.slug,
  title: row.title,
  status: row.status,
  updatedAt: toDate(row.updatedAt),
});

const toRecord = (row: {
  id: string;
  slug: string;
  title: string;
  description: string | null;
  blocks: unknown;
  status: CustomPageStatus;
  createdAt: Date | string;
  updatedAt: Date | string;
}): CustomPageRecord => ({
  id: row.id,
  slug: row.slug,
  title: row.title,
  description: row.description ?? undefined,
  blocks: parseBlocks(row.blocks),
  status: row.status,
  createdAt: toDate(row.createdAt),
  updatedAt: toDate(row.updatedAt),
});

const normalizeSlug = (slug: string): string => {
  return slug
    .replace(/^\/+/, "")
    .replace(/\/+$/, "")
    .replace(/\/+/g, "/")
    .toLowerCase();
};

export const customPageRepository = {
  async listAll(): Promise<CustomPageListItem[]> {
    const rows = await db.select().from(CustomPages).orderBy(desc(CustomPages.updatedAt));
    return rows.map(toListItem);
  },

  async listPublished(): Promise<CustomPageListItem[]> {
    const rows = await db
      .select()
      .from(CustomPages)
      .where(eq(CustomPages.status, "published"))
      .orderBy(desc(CustomPages.updatedAt));
    return rows.map(toListItem);
  },

  async getById(id: string): Promise<CustomPageRecord | undefined> {
    const rows = await db.select().from(CustomPages).where(eq(CustomPages.id, id)).limit(1);
    const row = rows[0];
    return row ? toRecord(row) : undefined;
  },

  async getBySlug(slug: string): Promise<CustomPageRecord | undefined> {
    const normalized = normalizeSlug(slug);
    const rows = await db
      .select()
      .from(CustomPages)
      .where(eq(CustomPages.slug, normalized))
      .limit(1);
    const row = rows[0];
    return row ? toRecord(row) : undefined;
  },

  async create(input: CustomPageInput): Promise<CustomPageRecord> {
    const now = new Date();
    const id = randomUUID();
    const normalizedSlug = normalizeSlug(input.slug);
    await db.insert(CustomPages).values({
      id,
      slug: normalizedSlug,
      title: input.title,
      description: input.description ?? null,
      blocks: input.blocks,
      status: input.status,
      createdAt: now,
      updatedAt: now,
    });
    return {
      id,
      slug: normalizedSlug,
      title: input.title,
      description: input.description,
      blocks: input.blocks,
      status: input.status,
      createdAt: now,
      updatedAt: now,
    };
  },

  async update(id: string, input: CustomPageInput): Promise<CustomPageRecord | undefined> {
    const existing = await customPageRepository.getById(id);
    if (!existing) return undefined;
    const now = new Date();
    const normalizedSlug = normalizeSlug(input.slug);
    await db
      .update(CustomPages)
      .set({
        slug: normalizedSlug,
        title: input.title,
        description: input.description ?? null,
        blocks: input.blocks,
        status: input.status,
        updatedAt: now,
      })
      .where(eq(CustomPages.id, id));
    return {
      ...existing,
      slug: normalizedSlug,
      title: input.title,
      description: input.description,
      blocks: input.blocks,
      status: input.status,
      updatedAt: now,
    };
  },

  async delete(id: string): Promise<boolean> {
    const existing = await customPageRepository.getById(id);
    if (!existing) return false;
    await db.delete(CustomPages).where(eq(CustomPages.id, id));
    return true;
  },
};

export { normalizeSlug };
