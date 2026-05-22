import type { APIRoute } from "astro";
import { requireAdminApiAuth } from "@/features/admin/auth/admin-api-auth";
import { blogService } from "@/features/blog/services/blog.service";
import { adminConfig } from "@/lib/config/admin";

export const POST: APIRoute = async (context) => {
  const authError = requireAdminApiAuth(context);

  if (authError) {
    return authError;
  }

  const { id } = context.params;

  if (!id) {
    return context.redirect(`${adminConfig.basePath}/blog/?error=not-found`);
  }

  const existingPost = await blogService.getPostById(id);

  if (!existingPost) {
    return context.redirect(`${adminConfig.basePath}/blog/?error=not-found`);
  }

  if (existingPost.status === "archived") {
    return context.redirect(`${adminConfig.basePath}/blog/?archived=1`);
  }

  const archivedPost = await blogService.updatePost(id, {
    slug: existingPost.slug,
    locale: existingPost.locale,
    title: existingPost.title,
    excerpt: existingPost.excerpt,
    body: existingPost.body,
    coverImage: existingPost.coverImage,
    publishedAt: existingPost.publishedAt,
    status: "archived",
    tags: existingPost.tags,
    seoTitle: existingPost.seoTitle,
    seoDescription: existingPost.seoDescription,
  });

  if (!archivedPost) {
    return context.redirect(`${adminConfig.basePath}/blog/?error=not-found`);
  }

  return context.redirect(`${adminConfig.basePath}/blog/?archived=1`);
};
