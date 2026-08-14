import type { Page } from "@playwright/test";

/** Creates a throwaway blog post via the admin API and returns its id/slug. Call `deleteBlogPost` in a finally/afterEach. */
export const createBlogPost = async (page: Page, seed: string) => {
  const response = await page.request.post("/api/admin/blog/", {
    data: {
      title: `E2E test post ${seed}`,
      slug: `e2e-test-post-${seed}`,
      excerpt: "Fixture excerpt for automated testing.",
      body: "<p>Fixture body for automated testing.</p>",
      status: "published",
      publishedAt: new Date(0).toISOString(),
    },
  });

  if (!response.ok()) {
    throw new Error(`Failed to create fixture blog post: ${response.status()}`);
  }

  const match = /\/blog\/([a-f0-9-]+)\/edit/.exec(response.url());
  const id = match?.[1];
  if (!id) {
    throw new Error(`Could not extract blog post id from redirect URL: ${response.url()}`);
  }

  return { id, slug: `e2e-test-post-${seed}` };
};

export const deleteBlogPost = async (page: Page, id: string) => {
  await page.request.post(`/api/admin/blog/${id}/delete`);
};

/** Creates a throwaway custom page via the admin API and returns its id/slug. Call `deleteCustomPage` in a finally/afterEach. */
export const createCustomPage = async (page: Page, seed: string) => {
  const slug = `e2e-test-page-${seed}`;

  const response = await page.request.post("/api/admin/custom-pages/", {
    data: {
      slug,
      title: `E2E test page ${seed}`,
      description: "",
      status: "published",
      blocks: [
        {
          id: "block-1",
          type: "richtext",
          data: { html: "<p>Fixture richtext block.</p>" },
        },
      ],
    },
  });

  if (!response.ok()) {
    throw new Error(`Failed to create fixture custom page: ${response.status()} ${await response.text()}`);
  }

  const match = /\/pages\/custom\/([a-f0-9-]+)\//.exec(response.url());
  const id = match?.[1];
  if (!id) {
    throw new Error(`Could not extract custom page id from redirect URL: ${response.url()}`);
  }

  return { id, slug };
};

export const deleteCustomPage = async (page: Page, id: string) => {
  await page.request.delete(`/api/admin/custom-pages/${id}/`);
};
