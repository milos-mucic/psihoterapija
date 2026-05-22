import { customPageInputSchema } from "@/features/custom-pages/schemas/custom-page.schema";
import { customPageRepository } from "@/features/custom-pages/repositories/custom-page.repository";
import type {
  CustomPageInput,
  CustomPageListItem,
  CustomPageRecord,
} from "@/features/custom-pages/types/custom-page.types";
import type { SiteLocale } from "@/lib/config/site";

export class CustomPageValidationError extends Error {
  constructor(public issues: { path: string; message: string }[]) {
    super("Custom page validation failed");
    this.name = "CustomPageValidationError";
  }
}

export class CustomPageSlugConflictError extends Error {
  constructor(public slug: string, public locale: SiteLocale) {
    super(`Slug "${slug}" already exists for ${locale}.`);
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

export const customPageService = {
  listAll(): Promise<CustomPageListItem[]> {
    return customPageRepository.listAll();
  },

  listPublished(locale: SiteLocale): Promise<CustomPageListItem[]> {
    return customPageRepository.listPublished(locale);
  },

  getById(id: string): Promise<CustomPageRecord | undefined> {
    return customPageRepository.getById(id);
  },

  getBySlug(locale: SiteLocale, slug: string): Promise<CustomPageRecord | undefined> {
    return customPageRepository.getBySlug(locale, slug);
  },

  async create(input: unknown): Promise<CustomPageRecord> {
    const parsed = parseInput(input);
    const existing = await customPageRepository.getBySlug(parsed.locale, parsed.slug);
    if (existing) {
      throw new CustomPageSlugConflictError(parsed.slug, parsed.locale);
    }
    return customPageRepository.create(parsed);
  },

  async update(id: string, input: unknown): Promise<CustomPageRecord | undefined> {
    const parsed = parseInput(input);
    const existing = await customPageRepository.getBySlug(parsed.locale, parsed.slug);
    if (existing && existing.id !== id) {
      throw new CustomPageSlugConflictError(parsed.slug, parsed.locale);
    }
    return customPageRepository.update(id, parsed);
  },

  delete(id: string): Promise<boolean> {
    return customPageRepository.delete(id);
  },
};
