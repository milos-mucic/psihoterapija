import { z } from "zod";
import { sanitizeInlineRichTextHtml, sanitizeRichTextHtml } from "@/features/blog/utils/rich-text";
import type { HomePageManagedContent } from "@/features/page-content/types/page-content.types";

const requiredText = z.string().trim().min(1);
const inlineRichTextRequired = z
  .string()
  .trim()
  .min(1)
  .transform((value) => sanitizeInlineRichTextHtml(value))
  .refine((value) => value.length > 0);
const richTextRequired = z
  .string()
  .trim()
  .min(1)
  .transform((value) => sanitizeRichTextHtml(value))
  .refine((value) => value.length > 0);

const optionalText = z.union([z.string(), z.undefined(), z.null()]).transform((value) => {
  if (typeof value !== "string") {
    return undefined;
  }

  const normalized = value.trim();
  return normalized.length > 0 ? normalized : undefined;
});

export const homePageManagedContentSchema: z.ZodType<HomePageManagedContent> = z.object({
  seo: z.object({
    title: requiredText,
    description: requiredText,
  }),
  hero: z.object({
    titleHtml: inlineRichTextRequired,
    description: richTextRequired,
    primaryActionLabel: requiredText,
    secondaryActionLabel: requiredText,
  }),
  prompt: z.object({
    title: requiredText,
    copy: richTextRequired,
    label: requiredText,
  }),
  about: z.object({
    title: requiredText,
    body: richTextRequired,
    label: requiredText,
    image: requiredText,
  }),
  services: z.object({
    title: requiredText,
    copy: richTextRequired,
    items: z
      .array(
        z.object({
          title: requiredText,
          copy: richTextRequired,
          image: requiredText,
        }),
      )
      .length(2),
  }),
  themes: z.object({
    title: requiredText,
    items: z
      .array(
        z.object({
          title: requiredText,
          copy: richTextRequired,
          label: requiredText,
          image: requiredText,
        }),
      )
      .length(3),
  }),
  reasons: z.object({
    title: requiredText,
    copy: richTextRequired,
    items: z
      .array(
        z.object({
          title: requiredText,
          copy: richTextRequired,
          label: requiredText,
        }),
      )
      .length(3),
    videoUrl: requiredText,
    videoImage: requiredText,
    videoLabel: requiredText,
  }),
  booking: z.object({
    title: requiredText,
    copy: richTextRequired,
    formatLabel: requiredText,
    formats: z.array(requiredText).min(1),
  }),
  recent: z.object({
    title: requiredText,
    copy: richTextRequired,
    label: requiredText,
    empty: requiredText,
  }),
});

const formPayloadSchema = z.object({
  seoTitle: requiredText,
  seoDescription: requiredText,
  heroTitleHtml: inlineRichTextRequired,
  heroDescription: requiredText,
  heroPrimaryActionLabel: requiredText,
  heroSecondaryActionLabel: requiredText,
  promptTitle: requiredText,
  promptCopy: richTextRequired,
  promptLabel: requiredText,
  aboutTitle: requiredText,
  aboutBody: richTextRequired,
  aboutLabel: requiredText,
  aboutImage: requiredText,
  servicesTitle: requiredText,
  servicesCopy: richTextRequired,
  service1Title: requiredText,
  service1Copy: richTextRequired,
  service1Image: requiredText,
  service2Title: requiredText,
  service2Copy: richTextRequired,
  service2Image: requiredText,
  themesTitle: requiredText,
  theme1Title: requiredText,
  theme1Copy: richTextRequired,
  theme1Label: requiredText,
  theme1Image: requiredText,
  theme2Title: requiredText,
  theme2Copy: richTextRequired,
  theme2Label: requiredText,
  theme2Image: requiredText,
  theme3Title: requiredText,
  theme3Copy: richTextRequired,
  theme3Label: requiredText,
  theme3Image: requiredText,
  reasonsTitle: requiredText,
  reasonsCopy: richTextRequired,
  reason1Title: requiredText,
  reason1Copy: richTextRequired,
  reason1Label: requiredText,
  reason2Title: requiredText,
  reason2Copy: richTextRequired,
  reason2Label: requiredText,
  reason3Title: requiredText,
  reason3Copy: richTextRequired,
  reason3Label: requiredText,
  reasonsVideoUrl: requiredText,
  reasonsVideoImage: requiredText,
  reasonsVideoLabel: requiredText,
  bookingTitle: requiredText,
  bookingCopy: richTextRequired,
  bookingFormatLabel: requiredText,
  bookingFormat1: requiredText,
  bookingFormat2: optionalText,
  bookingFormat3: optionalText,
  recentTitle: requiredText,
  recentCopy: richTextRequired,
  recentLabel: requiredText,
  recentEmpty: requiredText,
});

export const parseHomePageManagedContent = (input: unknown) => {
  return homePageManagedContentSchema.parse(input);
};

export const parseHomePageManagedContentForm = (input: unknown): HomePageManagedContent => {
  const parsed = formPayloadSchema.parse(input);

  return homePageManagedContentSchema.parse({
    seo: {
      title: parsed.seoTitle,
      description: parsed.seoDescription,
    },
    hero: {
      titleHtml: parsed.heroTitleHtml,
      description: parsed.heroDescription,
      primaryActionLabel: parsed.heroPrimaryActionLabel,
      secondaryActionLabel: parsed.heroSecondaryActionLabel,
    },
    prompt: {
      title: parsed.promptTitle,
      copy: parsed.promptCopy,
      label: parsed.promptLabel,
    },
    about: {
      title: parsed.aboutTitle,
      body: parsed.aboutBody,
      label: parsed.aboutLabel,
      image: parsed.aboutImage,
    },
    services: {
      title: parsed.servicesTitle,
      copy: parsed.servicesCopy,
      items: [
        {
          title: parsed.service1Title,
          copy: parsed.service1Copy,
          image: parsed.service1Image,
        },
        {
          title: parsed.service2Title,
          copy: parsed.service2Copy,
          image: parsed.service2Image,
        },
      ],
    },
    themes: {
      title: parsed.themesTitle,
      items: [
        {
          title: parsed.theme1Title,
          copy: parsed.theme1Copy,
          label: parsed.theme1Label,
          image: parsed.theme1Image,
        },
        {
          title: parsed.theme2Title,
          copy: parsed.theme2Copy,
          label: parsed.theme2Label,
          image: parsed.theme2Image,
        },
        {
          title: parsed.theme3Title,
          copy: parsed.theme3Copy,
          label: parsed.theme3Label,
          image: parsed.theme3Image,
        },
      ],
    },
    reasons: {
      title: parsed.reasonsTitle,
      copy: parsed.reasonsCopy,
      items: [
        {
          title: parsed.reason1Title,
          copy: parsed.reason1Copy,
          label: parsed.reason1Label,
        },
        {
          title: parsed.reason2Title,
          copy: parsed.reason2Copy,
          label: parsed.reason2Label,
        },
        {
          title: parsed.reason3Title,
          copy: parsed.reason3Copy,
          label: parsed.reason3Label,
        },
      ],
      videoUrl: parsed.reasonsVideoUrl,
      videoImage: parsed.reasonsVideoImage,
      videoLabel: parsed.reasonsVideoLabel,
    },
    booking: {
      title: parsed.bookingTitle,
      copy: parsed.bookingCopy,
      formatLabel: parsed.bookingFormatLabel,
      formats: [parsed.bookingFormat1, parsed.bookingFormat2, parsed.bookingFormat3].filter(
        (value): value is string => !!value,
      ),
    },
    recent: {
      title: parsed.recentTitle,
      copy: parsed.recentCopy,
      label: parsed.recentLabel,
      empty: parsed.recentEmpty,
    },
  });
};
