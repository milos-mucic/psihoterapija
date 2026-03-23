import { column, defineDb, defineTable } from "astro:db";

export const Submissions = defineTable({
  columns: {
    id: column.text({ primaryKey: true }),
    type: column.text({ enum: ["contact", "appointment"] }),
    locale: column.text({ enum: ["sr-latn", "sr-cyrl"] }),
    name: column.text(),
    email: column.text(),
    phone: column.text({ optional: true }),
    format: column.text({ optional: true }),
    message: column.text({ optional: true }),
    status: column.text({ enum: ["new", "reviewed", "archived"] }),
    createdAt: column.date(),
  },
  indexes: [{ on: ["createdAt"] }],
});

export const MediaAssets = defineTable({
  columns: {
    id: column.text({ primaryKey: true }),
    filename: column.text(),
    mimeType: column.text(),
    storagePath: column.text(),
    altText: column.text({ optional: true }),
    width: column.number({ optional: true }),
    height: column.number({ optional: true }),
    createdAt: column.date(),
  },
  indexes: [{ on: ["createdAt"] }],
});

export const BlogPosts = defineTable({
  columns: {
    id: column.text({ primaryKey: true }),
    slug: column.text(),
    locale: column.text({ enum: ["sr-latn", "sr-cyrl"] }),
    title: column.text(),
    excerpt: column.text(),
    body: column.text({ multiline: true }),
    coverImage: column.text({ optional: true }),
    publishedAt: column.date(),
    updatedAt: column.date({ optional: true }),
    createdAt: column.date(),
    status: column.text({ enum: ["draft", "published", "archived"] }),
    tags: column.json(),
    seoTitle: column.text({ optional: true }),
    seoDescription: column.text({ optional: true }),
  },
  indexes: [
    { on: ["publishedAt"] },
    { on: ["locale", "status"] },
    { on: ["locale", "slug"], unique: true },
  ],
});

export const PageContent = defineTable({
  columns: {
    id: column.text({ primaryKey: true }),
    pageKey: column.text(),
    locale: column.text({ enum: ["sr-latn", "sr-cyrl"] }),
    content: column.json(),
    createdAt: column.date(),
    updatedAt: column.date(),
  },
  indexes: [{ on: ["pageKey", "locale"], unique: true }],
});

export default defineDb({
  tables: {
    Submissions,
    MediaAssets,
    BlogPosts,
    PageContent,
  },
});
