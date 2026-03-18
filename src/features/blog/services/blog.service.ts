import { ContentCollectionBlogRepository } from "@/features/blog/repositories/content-collection-blog.repository";
import type { SiteLocale } from "@/lib/config/site";

const blogRepository = new ContentCollectionBlogRepository();

export const blogService = {
  listPublishedPosts(locale: SiteLocale) {
    return blogRepository.listPublished(locale);
  },
  listAllPosts() {
    return blogRepository.listAll();
  },
  getPostBySlug(locale: SiteLocale, slug: string) {
    return blogRepository.getBySlug(locale, slug);
  },
};
