import { z } from "zod";
import type { BlogPostInput } from "@/features/blog/types/blog.types";
import {
  extractPlainTextFromHtml,
  sanitizeInlineRichTextHtml,
  sanitizeRichTextHtml,
} from "@/features/blog/utils/rich-text";

const optionalTextSchema = z.union([z.string(), z.undefined(), z.null()]).transform((value) => {
  if (typeof value !== "string") {
    return undefined;
  }

  const normalized = value.trim();
  return normalized.length > 0 ? normalized : undefined;
});

const tagsSchema = z
  .union([z.string(), z.array(z.string()), z.undefined(), z.null()])
  .transform((value) => {
    const rawValues = Array.isArray(value)
      ? value
      : typeof value === "string"
        ? value.split(",")
        : [];

    const unique = new Set<string>();

    for (const tag of rawValues) {
      const normalized = tag.trim();
      if (normalized.length > 0) {
        unique.add(normalized);
      }
    }

    return Array.from(unique).slice(0, 20);
  });

const publishedAtSchema = z
  .union([z.string(), z.date(), z.undefined(), z.null()])
  .transform((value, context) => {
    if (value === undefined || value === null || value === "") {
      return new Date();
    }

    const parsed = value instanceof Date ? value : new Date(value);

    if (Number.isNaN(parsed.getTime())) {
      context.addIssue({ code: z.ZodIssueCode.custom, message: "Invalid publishedAt date." });
      return z.NEVER;
    }

    return parsed;
  });

const blogPostPayloadSchema = z.object({
  locale: z.enum(["sr-latn", "sr-cyrl"]).default("sr-latn"),
  title: z.string().trim().min(1),
  slug: optionalTextSchema,
  excerpt: optionalTextSchema,
  body: z.string().trim().min(1),
  coverImage: optionalTextSchema,
  status: z.enum(["draft", "published", "archived"]).default("draft"),
  tags: tagsSchema,
  publishedAt: publishedAtSchema,
  seoTitle: optionalTextSchema,
  seoDescription: optionalTextSchema,
});

const toSlug = (value: string) =>
  value
    .toLowerCase()
    .normalize("NFKD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .slice(0, 80);

const toExcerpt = (bodyHtml: string) => {
  const normalized = extractPlainTextFromHtml(bodyHtml);

  if (normalized.length === 0) {
    return "";
  }

  if (normalized.length <= 220) {
    return normalized;
  }

  return `${normalized.slice(0, 217).trimEnd()}...`;
};

const normalizeInput = (
  parsed: z.infer<typeof blogPostPayloadSchema>,
  fallbackSlugSeed: string,
): BlogPostInput => {
  const body = sanitizeRichTextHtml(parsed.body);
  const excerpt = parsed.excerpt ? sanitizeInlineRichTextHtml(parsed.excerpt) : undefined;
  const slug = toSlug(parsed.slug ?? parsed.title);
  const fallbackSlug = `post-${Date.now()}`;

  return {
    locale: parsed.locale,
    title: parsed.title,
    slug: slug || toSlug(fallbackSlugSeed) || fallbackSlug,
    excerpt: excerpt ?? sanitizeInlineRichTextHtml(toExcerpt(body) || parsed.title),
    body,
    coverImage: parsed.coverImage,
    publishedAt: parsed.publishedAt,
    status: parsed.status,
    tags: parsed.tags,
    seoTitle: parsed.seoTitle,
    seoDescription: parsed.seoDescription,
  };
};

export const parseBlogPostCreateInput = (input: unknown): BlogPostInput => {
  const parsed = blogPostPayloadSchema.parse(input);
  return normalizeInput(parsed, parsed.title);
};

export const parseBlogPostUpdateInput = (input: unknown): BlogPostInput => {
  const parsed = blogPostPayloadSchema.parse(input);
  return normalizeInput(parsed, parsed.slug ?? parsed.title);
};
