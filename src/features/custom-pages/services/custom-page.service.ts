import { customPageInputSchema } from "@/features/custom-pages/schemas/custom-page.schema";
import { customPageRepository } from "@/features/custom-pages/repositories/custom-page.repository";
import type {
  CustomPageInput,
  CustomPageListItem,
  CustomPageRecord,
} from "@/features/custom-pages/types/custom-page.types";

export class CustomPageValidationError extends Error {
  constructor(public issues: { path: string; message: string }[]) {
    super("Custom page validation failed");
    this.name = "CustomPageValidationError";
  }
}

export class CustomPageSlugConflictError extends Error {
  constructor(public slug: string) {
    super(`Slug "${slug}" already exists.`);
    this.name = "CustomPageSlugConflictError";
  }
}

const parseInput = (input: unknown): CustomPageInput => {
  const result = customPageInputSchema.safeParse(input);
  if (!result.success) {
    throw new CustomPageValidationError(
      result.error.issues.map((i) => ({
        path: i.path.join("."),
        message: i.message,
      })),
    );
  }
  return result.data;
};

/**
 * Read methods fall back to empty results when the underlying table doesn't
 * exist yet — this happens on production deployments where the persisted
 * SQLite file was created before the CustomPages table was introduced. The
 * fallback keeps the admin and public catch-all routes from crashing; the
 * operator can fix the schema separately (see scripts/migrate-db.mjs).
 */
const isMissingTableError = (error: unknown) =>
  error instanceof Error && /no such table|does not exist/i.test(error.message);

const logMissingTable = (op: string, error: unknown) => {
  if (isMissingTableError(error)) {
    // eslint-disable-next-line no-console
    console.warn(
      `[custom-page.service] ${op}: CustomPages table not present — falling back. ` +
        `Run the DB migration to enable custom pages.`,
    );
    return true;
  }
  return false;
};

export const customPageService = {
  async listAll(): Promise<CustomPageListItem[]> {
    try {
      return await customPageRepository.listAll();
    } catch (error) {
      if (logMissingTable("listAll", error)) return [];
      throw error;
    }
  },

  async listPublished(): Promise<CustomPageListItem[]> {
    try {
      return await customPageRepository.listPublished();
    } catch (error) {
      if (logMissingTable("listPublished", error)) return [];
      throw error;
    }
  },

  async getById(id: string): Promise<CustomPageRecord | undefined> {
    try {
      return await customPageRepository.getById(id);
    } catch (error) {
      if (logMissingTable("getById", error)) return undefined;
      throw error;
    }
  },

  async getBySlug(slug: string): Promise<CustomPageRecord | undefined> {
    try {
      return await customPageRepository.getBySlug(slug);
    } catch (error) {
      if (logMissingTable("getBySlug", error)) return undefined;
      throw error;
    }
  },

  async create(input: unknown): Promise<CustomPageRecord> {
    const parsed = parseInput(input);
    const existing = await customPageRepository.getBySlug(parsed.slug);
    if (existing) {
      throw new CustomPageSlugConflictError(parsed.slug);
    }
    return customPageRepository.create(parsed);
  },

  async update(id: string, input: unknown): Promise<CustomPageRecord | undefined> {
    const parsed = parseInput(input);
    const existing = await customPageRepository.getBySlug(parsed.slug);
    if (existing && existing.id !== id) {
      throw new CustomPageSlugConflictError(parsed.slug);
    }
    return customPageRepository.update(id, parsed);
  },

  delete(id: string): Promise<boolean> {
    return customPageRepository.delete(id);
  },
};
