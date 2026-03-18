import type { BlogEntry, BlogListItem } from "@/features/blog/types/blog.types";
import type { SiteLocale } from "@/lib/config/site";

export interface BlogRepository {
  listPublished(locale: SiteLocale): Promise<BlogListItem[]>;
  listAll(): Promise<BlogListItem[]>;
  getBySlug(locale: SiteLocale, slug: string): Promise<BlogEntry | undefined>;
}
