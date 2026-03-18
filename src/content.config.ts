import { defineCollection, z } from "astro:content";

const blog = defineCollection({
  schema: z.object({
    locale: z.enum(["sr-latn", "sr-cyrl"]),
    title: z.string(),
    excerpt: z.string(),
    publishedAt: z.coerce.date(),
    updatedAt: z.coerce.date().optional(),
    coverImage: z.string().optional(),
    seoTitle: z.string().optional(),
    seoDescription: z.string().optional(),
    tags: z.array(z.string()).default([]),
    status: z.enum(["draft", "published"]).default("published"),
  }),
});

export const collections = { blog };
