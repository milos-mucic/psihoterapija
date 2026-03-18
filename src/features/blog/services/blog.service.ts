import type { BlogRepository } from "@/features/blog/repositories/blog.repository";
import {
  ContentCollectionBlogRepository,
  listContentCollectionBlogPosts,
} from "@/features/blog/repositories/content-collection-blog.repository";
import { SqliteBlogRepository } from "@/features/blog/repositories/sqlite-blog.repository";
import {
  parseBlogPostCreateInput,
  parseBlogPostUpdateInput,
} from "@/features/blog/schemas/blog-post.schema";
import type { SiteLocale } from "@/lib/config/site";

const createSeedInput = (
  post: Awaited<ReturnType<typeof listContentCollectionBlogPosts>>[number],
) => ({
  slug: post.slug,
  locale: post.locale,
  title: post.title,
  excerpt: post.excerpt,
  body: post.body,
  coverImage: post.coverImage,
  publishedAt: post.publishedAt,
  updatedAt: post.updatedAt,
  status: post.status,
  tags: post.tags,
  seoTitle: post.seoTitle,
  seoDescription: post.seoDescription,
});

const seedSqliteBlogRepository = async (repository: BlogRepository) => {
  const existingPosts = await repository.listAll();

  if (existingPosts.length > 0) {
    return;
  }

  const seedPosts = await listContentCollectionBlogPosts();

  for (const post of seedPosts) {
    await repository.create(createSeedInput(post));
  }
};

const initializeRepository = async (): Promise<BlogRepository> => {
  if (process.env.USE_CONTENT_BLOG === "true") {
    return new ContentCollectionBlogRepository();
  }

  try {
    const sqliteRepository = new SqliteBlogRepository();
    await seedSqliteBlogRepository(sqliteRepository);
    return sqliteRepository;
  } catch (error) {
    console.warn("[blog] SQLite init failed, falling back to content collections.", error);
    return new ContentCollectionBlogRepository();
  }
};

let repositoryPromise: Promise<BlogRepository> | undefined;

const getRepository = () => {
  if (!repositoryPromise) {
    repositoryPromise = initializeRepository();
  }

  return repositoryPromise;
};

export const blogService = {
  async listPublishedPosts(locale: SiteLocale) {
    const repository = await getRepository();
    return repository.listPublished(locale);
  },
  async listAllPosts() {
    const repository = await getRepository();
    return repository.listAll();
  },
  async getPostBySlug(locale: SiteLocale, slug: string) {
    const repository = await getRepository();
    return repository.getBySlug(locale, slug);
  },
  async getPostById(id: string) {
    const repository = await getRepository();
    return repository.getById(id);
  },
  async createPost(input: unknown) {
    const repository = await getRepository();
    return repository.create(parseBlogPostCreateInput(input));
  },
  async updatePost(id: string, input: unknown) {
    const repository = await getRepository();
    return repository.update(id, parseBlogPostUpdateInput(input));
  },
  async deletePost(id: string) {
    const repository = await getRepository();
    return repository.delete(id);
  },
};
