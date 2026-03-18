import type {
  BlogListItem,
  BlogPostInput,
  BlogPostRecord,
  BlogPostUpdateInput,
} from "@/features/blog/types/blog.types";
import type { SiteLocale } from "@/lib/config/site";

export interface BlogRepository {
  listPublished(locale: SiteLocale): Promise<BlogListItem[]>;
  listAll(): Promise<BlogListItem[]>;
  getBySlug(locale: SiteLocale, slug: string): Promise<BlogPostRecord | undefined>;
  getById(id: string): Promise<BlogPostRecord | undefined>;
  create(input: BlogPostInput): Promise<BlogPostRecord>;
  update(id: string, input: BlogPostUpdateInput): Promise<BlogPostRecord | undefined>;
  delete(id: string): Promise<boolean>;
}
