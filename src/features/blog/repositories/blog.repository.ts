import type {
  BlogListItem,
  BlogPostInput,
  BlogPostRecord,
  BlogPostUpdateInput,
} from "@/features/blog/types/blog.types";

export interface BlogRepository {
  listPublished(): Promise<BlogListItem[]>;
  listAll(): Promise<BlogListItem[]>;
  getBySlug(slug: string): Promise<BlogPostRecord | undefined>;
  getById(id: string): Promise<BlogPostRecord | undefined>;
  create(input: BlogPostInput): Promise<BlogPostRecord>;
  update(id: string, input: BlogPostUpdateInput): Promise<BlogPostRecord | undefined>;
  delete(id: string): Promise<boolean>;
}
