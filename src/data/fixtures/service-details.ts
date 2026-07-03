export const serviceDetailSlugs = [
  "psihoterapija",
  "psiholosko-savetovanje",
  "konsultacije",
] as const;

export type ServiceDetailSlug = (typeof serviceDetailSlugs)[number];

export const isServiceDetailSlug = (value: string): value is ServiceDetailSlug =>
  (serviceDetailSlugs as readonly string[]).includes(value);

/**
 * Shape consumed by ServiceDetailPage. Built from the managed "services" page
 * content (see buildServiceDetailData in public-pages.ts).
 */
export type ServiceDetailData = {
  slug: ServiceDetailSlug;
  seo: {
    title: string;
    description: string;
  };
  banner: {
    title: string;
    description: string;
    backgroundImage: string;
    theme: "dark";
    align: "split";
  };
  intro: {
    title: string;
    body: string;
    image: string;
    highlights: string[];
  };
  faqs: Array<{
    question: string;
    answerHtml: string;
  }>;
};
