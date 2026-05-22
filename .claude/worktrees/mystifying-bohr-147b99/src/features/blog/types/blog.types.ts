import type { SiteLocale } from "@/lib/config/site";

export type BlogStatus = "draft" | "published" | "archived";

export type BlogListItem = {
  id: string;
  slug: string;
  locale: SiteLocale;
  title: string;
  excerpt: string;
  coverImage?: string;
  publishedAt: Date;
  updatedAt?: Date;
  status: BlogStatus;
  tags: string[];
};

export type BlogPostRecord = BlogListItem & {
  body: string;
  seoTitle?: string;
  seoDescription?: string;
  createdAt: Date;
};

export type BlogPostInput = {
  slug: string;
  locale: SiteLocale;
  title: string;
  excerpt: string;
  body: string;
  coverImage?: string;
  publishedAt: Date;
  updatedAt?: Date;
  status: BlogStatus;
  tags: string[];
  seoTitle?: string;
  seoDescription?: string;
};

export type BlogPostUpdateInput = Partial<BlogPostInput>;
