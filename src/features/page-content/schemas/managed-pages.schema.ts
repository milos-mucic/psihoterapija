import { z } from "zod";
import { sanitizeRichTextHtml } from "@/features/blog/utils/rich-text";
import type {
  AboutPageManagedContent,
  AppointmentPageManagedContent,
  BlogIndexPageManagedContent,
  BiographyProfileManagedContent,
  BiographyPageManagedContent,
  ContactPageManagedContent,
  FaqPageManagedContent,
  PricingPageManagedContent,
  PsychotherapyPageManagedContent,
  ScopePageManagedContent,
} from "@/features/page-content/types/page-content.types";

const requiredText = z.string().trim().min(1);
const optionalText = z.string().trim();
const richTextRequired = z
  .string()
  .trim()
  .min(1)
  .transform((value) => sanitizeRichTextHtml(value))
  .refine((value) => value.length > 0);

const bannerSchema = z.object({
  title: requiredText,
  description: richTextRequired,
  backgroundImage: optionalText,
});

const seoSchema = z.object({
  title: requiredText,
  description: requiredText,
});

const faqItemSchema = z.object({
  question: requiredText,
  answer: richTextRequired,
});

const mediaTextCardSchema = z.object({
  title: requiredText,
  copy: richTextRequired,
  image: requiredText,
});

const textCardSchema = z.object({
  title: requiredText,
  copy: richTextRequired,
});

const toInputRecord = (input: unknown) =>
  typeof input === "object" && input !== null ? (input as Record<string, unknown>) : {};

const getIndexedFieldMatches = (input: Record<string, unknown>, expression: RegExp) => {
  const indexes = new Set<number>();

  for (const key of Object.keys(input)) {
    const match = expression.exec(key);

    if (match) {
      indexes.add(Number(match[1]));
    }
  }

  return Array.from(indexes).sort((left, right) => left - right);
};

const getIndexedTextValues = (input: Record<string, unknown>, prefix: string) =>
  getIndexedFieldMatches(input, new RegExp(`^${prefix}_(\\d+)$`)).map((index) =>
    requiredText.parse(input[`${prefix}_${index}`]),
  );

export const aboutPageManagedContentSchema: z.ZodType<AboutPageManagedContent> = z.object({
  seo: seoSchema,
  banner: bannerSchema,
  showcase: z.object({
    title: requiredText,
    videoUrl: requiredText,
    videoImage: requiredText,
    cards: z.array(mediaTextCardSchema).min(1),
  }),
  idea: z.object({
    title: requiredText,
    body: richTextRequired,
  }),
  focus: z.object({
    title: requiredText,
    items: z.array(requiredText).min(1),
  }),
  recent: z.object({
    title: requiredText,
    copy: richTextRequired,
    label: requiredText,
    empty: requiredText,
  }),
});

const aboutPageFormSchema = z.object({
  seoTitle: requiredText,
  seoDescription: requiredText,
  bannerTitle: requiredText,
  bannerDescription: richTextRequired,
  bannerBackgroundImage: requiredText,
  showcaseTitle: requiredText,
  showcaseVideoUrl: requiredText,
  showcaseVideoImage: requiredText,
  ideaTitle: requiredText,
  ideaBody: richTextRequired,
  focusTitle: requiredText,
  recentTitle: requiredText,
  recentCopy: richTextRequired,
  recentLabel: requiredText,
  recentEmpty: requiredText,
});

export const parseAboutPageManagedContent = (input: unknown) =>
  aboutPageManagedContentSchema.parse(input);

export const parseAboutPageManagedContentForm = (input: unknown): AboutPageManagedContent => {
  const parsed = aboutPageFormSchema.parse(input);
  const values = toInputRecord(input);
  const showcaseCards = getIndexedFieldMatches(values, /^showcaseCard_(\d+)_title$/).map((index) =>
    mediaTextCardSchema.parse({
      title: values[`showcaseCard_${index}_title`],
      copy: values[`showcaseCard_${index}_copy`],
      image: values[`showcaseCard_${index}_image`],
    }),
  );
  const focusItems = getIndexedTextValues(values, "focusItem");

  return aboutPageManagedContentSchema.parse({
    seo: {
      title: parsed.seoTitle,
      description: parsed.seoDescription,
    },
    banner: {
      title: parsed.bannerTitle,
      description: parsed.bannerDescription,
      backgroundImage: parsed.bannerBackgroundImage,
    },
    showcase: {
      title: parsed.showcaseTitle,
      videoUrl: parsed.showcaseVideoUrl,
      videoImage: parsed.showcaseVideoImage,
      cards: showcaseCards,
    },
    idea: {
      title: parsed.ideaTitle,
      body: parsed.ideaBody,
    },
    focus: {
      title: parsed.focusTitle,
      items: focusItems,
    },
    recent: {
      title: parsed.recentTitle,
      copy: parsed.recentCopy,
      label: parsed.recentLabel,
      empty: parsed.recentEmpty,
    },
  });
};

const biographyCardSchema = z.object({
  slug: requiredText,
  title: requiredText,
  role: requiredText,
  summary: richTextRequired,
  body: richTextRequired,
  image: requiredText,
  highlights: z.array(requiredText).min(1),
});

export const biographyPageManagedContentSchema: z.ZodType<BiographyPageManagedContent> = z.object({
  seo: seoSchema,
  banner: bannerSchema,
  cardsSection: z.object({
    title: requiredText,
    copy: richTextRequired,
    cards: z
      .array(biographyCardSchema)
      .min(1)
      .refine(
        (cards) => new Set(cards.map((card) => card.slug)).size === cards.length,
        "Slugs profila moraju biti jedinstveni.",
      ),
  }),
  approach: z.object({
    title: requiredText,
    copy: richTextRequired,
    points: z.array(requiredText).min(1),
    image: requiredText,
    ctaLabel: requiredText,
  }),
});

const biographyPageFormSchema = z.object({
  seoTitle: requiredText,
  seoDescription: requiredText,
  bannerTitle: requiredText,
  bannerDescription: richTextRequired,
  bannerBackgroundImage: optionalText,
  cardsTitle: requiredText,
  cardsCopy: richTextRequired,
  approachTitle: requiredText,
  approachCopy: richTextRequired,
  approachImage: requiredText,
  approachCtaLabel: requiredText,
});

export const parseBiographyPageManagedContent = (input: unknown) =>
  biographyPageManagedContentSchema.parse(input);

const getBiographyCardIndexes = (input: Record<string, unknown>) => {
  const indexes = new Set<number>();

  for (const key of Object.keys(input)) {
    const match = /^biographyCard_(\d+)_slug$/.exec(key);

    if (match) {
      indexes.add(Number(match[1]));
    }
  }

  return Array.from(indexes).sort((left, right) => left - right);
};

const toBiographyCard = (
  input: Record<string, unknown>,
  index: number,
): BiographyProfileManagedContent => {
  const prefix = `biographyCard_${index}_`;
  const highlights = getIndexedFieldMatches(input, new RegExp(`^${prefix}highlight_(\\d+)$`)).map(
    (highlightIndex) => requiredText.parse(input[`${prefix}highlight_${highlightIndex}`]),
  );

  return biographyCardSchema.parse({
    slug: input[`${prefix}slug`],
    title: input[`${prefix}title`],
    role: input[`${prefix}role`],
    summary: input[`${prefix}summary`],
    body: input[`${prefix}body`],
    image: input[`${prefix}image`],
    highlights,
  });
};

export const parseBiographyPageManagedContentForm = (
  input: unknown,
): BiographyPageManagedContent => {
  const parsed = biographyPageFormSchema.parse(input);
  const values = toInputRecord(input);
  const cards = getBiographyCardIndexes(values).map((index) => toBiographyCard(values, index));
  const approachPoints = getIndexedTextValues(values, "approachPoint");

  return biographyPageManagedContentSchema.parse({
    seo: {
      title: parsed.seoTitle,
      description: parsed.seoDescription,
    },
    banner: {
      title: parsed.bannerTitle,
      description: parsed.bannerDescription,
      backgroundImage: parsed.bannerBackgroundImage,
    },
    cardsSection: {
      title: parsed.cardsTitle,
      copy: parsed.cardsCopy,
      cards,
    },
    approach: {
      title: parsed.approachTitle,
      copy: parsed.approachCopy,
      points: approachPoints,
      image: parsed.approachImage,
      ctaLabel: parsed.approachCtaLabel,
    },
  });
};

export const psychotherapyPageManagedContentSchema: z.ZodType<PsychotherapyPageManagedContent> =
  z.object({
    seo: seoSchema,
    banner: bannerSchema,
    scope: z.object({
      title: requiredText,
      items: z.array(requiredText).min(1),
    }),
    services: z.object({
      cards: z.array(mediaTextCardSchema).min(1),
    }),
    booking: z.object({
      title: requiredText,
      copy: richTextRequired,
      formatLabel: requiredText,
      formats: z.array(requiredText).min(1),
    }),
    faq: z.object({
      items: z.array(faqItemSchema).min(1),
      image: requiredText,
    }),
  });

const psychotherapyPageFormSchema = z.object({
  seoTitle: requiredText,
  seoDescription: requiredText,
  bannerTitle: requiredText,
  bannerDescription: richTextRequired,
  bannerBackgroundImage: requiredText,
  scopeTitle: requiredText,
  bookingTitle: requiredText,
  bookingCopy: richTextRequired,
  bookingFormatLabel: requiredText,
  faqImage: requiredText,
});

export const parsePsychotherapyPageManagedContent = (input: unknown) =>
  psychotherapyPageManagedContentSchema.parse(input);

export const parsePsychotherapyPageManagedContentForm = (
  input: unknown,
): PsychotherapyPageManagedContent => {
  const parsed = psychotherapyPageFormSchema.parse(input);
  const values = toInputRecord(input);
  const scopeItems = getIndexedTextValues(values, "scopeItem");
  const serviceCards = getIndexedFieldMatches(values, /^serviceCard_(\d+)_title$/).map((index) =>
    mediaTextCardSchema.parse({
      title: values[`serviceCard_${index}_title`],
      copy: values[`serviceCard_${index}_copy`],
      image: values[`serviceCard_${index}_image`],
    }),
  );
  const bookingFormats = getIndexedTextValues(values, "bookingFormat");
  const faqItems = getIndexedFieldMatches(values, /^faqItem_(\d+)_question$/).map((index) =>
    faqItemSchema.parse({
      question: values[`faqItem_${index}_question`],
      answer: values[`faqItem_${index}_answer`],
    }),
  );

  return psychotherapyPageManagedContentSchema.parse({
    seo: {
      title: parsed.seoTitle,
      description: parsed.seoDescription,
    },
    banner: {
      title: parsed.bannerTitle,
      description: parsed.bannerDescription,
      backgroundImage: parsed.bannerBackgroundImage,
    },
    scope: {
      title: parsed.scopeTitle,
      items: scopeItems,
    },
    services: {
      cards: serviceCards,
    },
    booking: {
      title: parsed.bookingTitle,
      copy: parsed.bookingCopy,
      formatLabel: parsed.bookingFormatLabel,
      formats: bookingFormats,
    },
    faq: {
      image: parsed.faqImage,
      items: faqItems,
    },
  });
};

const scopeTabSchema = z.object({
  id: requiredText,
  label: requiredText,
  tabMeta: requiredText,
  icon: requiredText,
  summaryTitle: requiredText,
  summaryCopy: richTextRequired,
  panelEyebrow: requiredText,
  panelStatLabel: requiredText,
  panelCtaLabel: requiredText,
  detailImage: requiredText,
  detailBannerDescription: richTextRequired,
  detailEyebrow: requiredText,
  detailLead: richTextRequired,
  detailBackLabel: requiredText,
  detailCtaLabel: requiredText,
  items: z.array(textCardSchema).min(1),
});

export const scopePageManagedContentSchema: z.ZodType<ScopePageManagedContent> = z.object({
  seo: seoSchema,
  banner: bannerSchema,
  intro: z.object({
    title: requiredText,
    items: z.array(requiredText).min(1),
  }),
  tabs: z
    .array(scopeTabSchema)
    .min(1)
    .refine(
      (tabs) => new Set(tabs.map((tab) => tab.id)).size === tabs.length,
      "Slugovi tema moraju biti jedinstveni.",
    ),
  detail: z.object({
    relatedTitle: requiredText,
  }),
  focus: z.object({
    title: requiredText,
    copy: richTextRequired,
    secondaryCopy: richTextRequired,
    image: requiredText,
    ctaLabel: requiredText,
  }),
  recent: z.object({
    title: requiredText,
    copy: richTextRequired,
    label: requiredText,
    empty: requiredText,
  }),
});

const scopePageFormSchema = z.object({
  seoTitle: requiredText,
  seoDescription: requiredText,
  bannerTitle: requiredText,
  bannerDescription: richTextRequired,
  bannerBackgroundImage: requiredText,
  introTitle: requiredText,
  detailRelatedTitle: requiredText,
  focusTitle: requiredText,
  focusCopy: richTextRequired,
  focusSecondaryCopy: richTextRequired,
  focusImage: requiredText,
  focusCtaLabel: requiredText,
  recentTitle: requiredText,
  recentCopy: richTextRequired,
  recentLabel: requiredText,
  recentEmpty: requiredText,
});

const getScopeTabIndexes = (input: Record<string, unknown>) => {
  const indexes = new Set<number>();

  for (const key of Object.keys(input)) {
    const match = /^scopeTab_(\d+)_id$/.exec(key);

    if (match) {
      indexes.add(Number(match[1]));
    }
  }

  return Array.from(indexes).sort((left, right) => left - right);
};

const getScopeTabItemIndexes = (input: Record<string, unknown>, tabIndex: number) => {
  const indexes = new Set<number>();

  for (const key of Object.keys(input)) {
    const match = new RegExp(`^scopeTab_${tabIndex}_item_(\\d+)_title$`).exec(key);

    if (match) {
      indexes.add(Number(match[1]));
    }
  }

  return Array.from(indexes).sort((left, right) => left - right);
};

const toScopeTab = (input: Record<string, unknown>, tabIndex: number) =>
  scopeTabSchema.parse({
    id: input[`scopeTab_${tabIndex}_id`],
    label: input[`scopeTab_${tabIndex}_label`],
    tabMeta: input[`scopeTab_${tabIndex}_tabMeta`],
    icon: input[`scopeTab_${tabIndex}_icon`],
    summaryTitle: input[`scopeTab_${tabIndex}_summaryTitle`],
    summaryCopy: input[`scopeTab_${tabIndex}_summaryCopy`],
    panelEyebrow: input[`scopeTab_${tabIndex}_panelEyebrow`],
    panelStatLabel: input[`scopeTab_${tabIndex}_panelStatLabel`],
    panelCtaLabel: input[`scopeTab_${tabIndex}_panelCtaLabel`],
    detailImage: input[`scopeTab_${tabIndex}_detailImage`],
    detailBannerDescription: input[`scopeTab_${tabIndex}_detailBannerDescription`],
    detailEyebrow: input[`scopeTab_${tabIndex}_detailEyebrow`],
    detailLead: input[`scopeTab_${tabIndex}_detailLead`],
    detailBackLabel: input[`scopeTab_${tabIndex}_detailBackLabel`],
    detailCtaLabel: input[`scopeTab_${tabIndex}_detailCtaLabel`],
    items: getScopeTabItemIndexes(input, tabIndex).map((itemIndex) =>
      textCardSchema.parse({
        title: input[`scopeTab_${tabIndex}_item_${itemIndex}_title`],
        copy: input[`scopeTab_${tabIndex}_item_${itemIndex}_copy`],
      }),
    ),
  });

export const parseScopePageManagedContent = (input: unknown) =>
  scopePageManagedContentSchema.parse(input);

export const parseScopePageManagedContentForm = (input: unknown): ScopePageManagedContent => {
  const parsed = scopePageFormSchema.parse(input);
  const values = toInputRecord(input);
  const tabs = getScopeTabIndexes(values).map((tabIndex) => toScopeTab(values, tabIndex));
  const introItems = getIndexedTextValues(values, "introItem");

  return scopePageManagedContentSchema.parse({
    seo: {
      title: parsed.seoTitle,
      description: parsed.seoDescription,
    },
    banner: {
      title: parsed.bannerTitle,
      description: parsed.bannerDescription,
      backgroundImage: parsed.bannerBackgroundImage,
    },
    intro: {
      title: parsed.introTitle,
      items: introItems,
    },
    tabs,
    detail: {
      relatedTitle: parsed.detailRelatedTitle,
    },
    focus: {
      title: parsed.focusTitle,
      copy: parsed.focusCopy,
      secondaryCopy: parsed.focusSecondaryCopy,
      image: parsed.focusImage,
      ctaLabel: parsed.focusCtaLabel,
    },
    recent: {
      title: parsed.recentTitle,
      copy: parsed.recentCopy,
      label: parsed.recentLabel,
      empty: parsed.recentEmpty,
    },
  });
};

const pricingPlanSchema = z.object({
  title: requiredText,
  price: requiredText,
  outsideSerbiaPrice: requiredText,
  ctaLabel: requiredText,
});

export const pricingPageManagedContentSchema: z.ZodType<PricingPageManagedContent> = z.object({
  seo: seoSchema,
  banner: bannerSchema,
  plans: z.array(pricingPlanSchema).min(1),
  infoCards: z.array(textCardSchema).min(1),
});

const pricingPageFormSchema = z.object({
  seoTitle: requiredText,
  seoDescription: requiredText,
  bannerTitle: requiredText,
  bannerDescription: richTextRequired,
  bannerBackgroundImage: requiredText,
});

export const parsePricingPageManagedContent = (input: unknown) =>
  pricingPageManagedContentSchema.parse(input);

export const parsePricingPageManagedContentForm = (input: unknown): PricingPageManagedContent => {
  const parsed = pricingPageFormSchema.parse(input);
  const values = toInputRecord(input);
  const plans = getIndexedFieldMatches(values, /^pricingPlan_(\d+)_title$/).map((index) =>
    pricingPlanSchema.parse({
      title: values[`pricingPlan_${index}_title`],
      price: values[`pricingPlan_${index}_price`],
      outsideSerbiaPrice: values[`pricingPlan_${index}_outsideSerbiaPrice`],
      ctaLabel: values[`pricingPlan_${index}_ctaLabel`],
    }),
  );
  const infoCards = getIndexedFieldMatches(values, /^pricingInfo_(\d+)_title$/).map((index) =>
    textCardSchema.parse({
      title: values[`pricingInfo_${index}_title`],
      copy: values[`pricingInfo_${index}_copy`],
    }),
  );

  return pricingPageManagedContentSchema.parse({
    seo: {
      title: parsed.seoTitle,
      description: parsed.seoDescription,
    },
    banner: {
      title: parsed.bannerTitle,
      description: parsed.bannerDescription,
      backgroundImage: parsed.bannerBackgroundImage,
    },
    plans,
    infoCards,
  });
};

export const appointmentPageManagedContentSchema: z.ZodType<AppointmentPageManagedContent> =
  z.object({
    seo: seoSchema,
    banner: bannerSchema,
    booking: z.object({
      title: requiredText,
      copy: requiredText,
      formatLabel: requiredText,
      formats: z.array(requiredText).min(1),
    }),
    faq: z.object({
      items: z.array(faqItemSchema).min(1),
      image: requiredText,
    }),
  });

const appointmentPageFormSchema = z.object({
  seoTitle: requiredText,
  seoDescription: requiredText,
  bannerTitle: requiredText,
  bannerDescription: richTextRequired,
  bannerBackgroundImage: requiredText,
  bookingTitle: requiredText,
  bookingCopy: richTextRequired,
  bookingFormatLabel: requiredText,
  faqImage: requiredText,
});

export const parseAppointmentPageManagedContent = (input: unknown) =>
  appointmentPageManagedContentSchema.parse(input);

export const parseAppointmentPageManagedContentForm = (
  input: unknown,
): AppointmentPageManagedContent => {
  const parsed = appointmentPageFormSchema.parse(input);
  const values = toInputRecord(input);
  const bookingFormats = getIndexedTextValues(values, "bookingFormat");
  const faqItems = getIndexedFieldMatches(values, /^faqItem_(\d+)_question$/).map((index) =>
    faqItemSchema.parse({
      question: values[`faqItem_${index}_question`],
      answer: values[`faqItem_${index}_answer`],
    }),
  );

  return appointmentPageManagedContentSchema.parse({
    seo: {
      title: parsed.seoTitle,
      description: parsed.seoDescription,
    },
    banner: {
      title: parsed.bannerTitle,
      description: parsed.bannerDescription,
      backgroundImage: parsed.bannerBackgroundImage,
    },
    booking: {
      title: parsed.bookingTitle,
      copy: parsed.bookingCopy,
      formatLabel: parsed.bookingFormatLabel,
      formats: bookingFormats,
    },
    faq: {
      image: parsed.faqImage,
      items: faqItems,
    },
  });
};

export const faqPageManagedContentSchema: z.ZodType<FaqPageManagedContent> = z.object({
  seo: seoSchema,
  banner: bannerSchema,
  faq: z.object({
    items: z.array(faqItemSchema).min(1),
    image: requiredText,
  }),
  booking: z.object({
    title: requiredText,
    copy: requiredText,
    formatLabel: requiredText,
    formats: z.array(requiredText).min(1),
  }),
});

const faqPageFormSchema = z.object({
  seoTitle: requiredText,
  seoDescription: requiredText,
  bannerTitle: requiredText,
  bannerDescription: richTextRequired,
  bannerBackgroundImage: requiredText,
  faqImage: requiredText,
  bookingTitle: requiredText,
  bookingCopy: richTextRequired,
  bookingFormatLabel: requiredText,
});

export const parseFaqPageManagedContent = (input: unknown) =>
  faqPageManagedContentSchema.parse(input);

export const parseFaqPageManagedContentForm = (input: unknown): FaqPageManagedContent => {
  const parsed = faqPageFormSchema.parse(input);
  const values = toInputRecord(input);
  const faqItems = getIndexedFieldMatches(values, /^faqItem_(\d+)_question$/).map((index) =>
    faqItemSchema.parse({
      question: values[`faqItem_${index}_question`],
      answer: values[`faqItem_${index}_answer`],
    }),
  );
  const bookingFormats = getIndexedTextValues(values, "bookingFormat");

  return faqPageManagedContentSchema.parse({
    seo: {
      title: parsed.seoTitle,
      description: parsed.seoDescription,
    },
    banner: {
      title: parsed.bannerTitle,
      description: parsed.bannerDescription,
      backgroundImage: parsed.bannerBackgroundImage,
    },
    faq: {
      image: parsed.faqImage,
      items: faqItems,
    },
    booking: {
      title: parsed.bookingTitle,
      copy: parsed.bookingCopy,
      formatLabel: parsed.bookingFormatLabel,
      formats: bookingFormats,
    },
  });
};

const socialLinkSchema = z.object({
  platform: requiredText,
  label: requiredText,
  href: requiredText,
});

export const contactPageManagedContentSchema: z.ZodType<ContactPageManagedContent> = z.object({
  seo: seoSchema,
  banner: bannerSchema,
  introTitle: requiredText,
  introCopy: richTextRequired,
  formTitle: requiredText,
  contactLabels: z.object({
    phone: requiredText,
    email: requiredText,
    socials: requiredText,
  }),
  phone: requiredText,
  email: requiredText,
  socialLinks: z.array(socialLinkSchema).min(1),
  officesTitle: requiredText,
  officesCopy: richTextRequired,
  officeGallery: z.array(requiredText).min(1),
});

const contactPageFormSchema = z.object({
  seoTitle: requiredText,
  seoDescription: requiredText,
  bannerTitle: requiredText,
  bannerDescription: richTextRequired,
  bannerBackgroundImage: requiredText,
  introTitle: requiredText,
  introCopy: richTextRequired,
  formTitle: requiredText,
  contactLabelPhone: requiredText,
  contactLabelEmail: requiredText,
  contactLabelSocials: requiredText,
  phone: requiredText,
  email: requiredText,
  officesTitle: requiredText,
  officesCopy: richTextRequired,
});

export const parseContactPageManagedContent = (input: unknown) =>
  contactPageManagedContentSchema.parse(input);

export const parseContactPageManagedContentForm = (input: unknown): ContactPageManagedContent => {
  const parsed = contactPageFormSchema.parse(input);
  const values = toInputRecord(input);
  const socialLinks = getIndexedFieldMatches(values, /^socialLink_(\d+)_platform$/).map((index) =>
    socialLinkSchema.parse({
      platform: values[`socialLink_${index}_platform`],
      label: values[`socialLink_${index}_label`],
      href: values[`socialLink_${index}_href`],
    }),
  );
  const officeGallery = getIndexedFieldMatches(values, /^officeGallery_(\d+)_image$/).map(
    (index) => requiredText.parse(values[`officeGallery_${index}_image`]),
  );

  return contactPageManagedContentSchema.parse({
    seo: {
      title: parsed.seoTitle,
      description: parsed.seoDescription,
    },
    banner: {
      title: parsed.bannerTitle,
      description: parsed.bannerDescription,
      backgroundImage: parsed.bannerBackgroundImage,
    },
    introTitle: parsed.introTitle,
    introCopy: parsed.introCopy,
    formTitle: parsed.formTitle,
    contactLabels: {
      phone: parsed.contactLabelPhone,
      email: parsed.contactLabelEmail,
      socials: parsed.contactLabelSocials,
    },
    phone: parsed.phone,
    email: parsed.email,
    socialLinks,
    officesTitle: parsed.officesTitle,
    officesCopy: parsed.officesCopy,
    officeGallery,
  });
};

export const blogIndexPageManagedContentSchema: z.ZodType<BlogIndexPageManagedContent> = z.object({
  seo: seoSchema,
  banner: bannerSchema,
  allPostsTitle: requiredText,
  postsLabel: requiredText,
  searchTitle: requiredText,
  searchPlaceholder: requiredText,
  searchActionLabel: requiredText,
  recentTitle: requiredText,
  keywordsTitle: requiredText,
  allKeywordsLabel: requiredText,
  noResultsText: requiredText,
});

const blogIndexPageFormSchema = z.object({
  seoTitle: requiredText,
  seoDescription: requiredText,
  bannerTitle: requiredText,
  bannerDescription: richTextRequired,
  bannerBackgroundImage: requiredText,
  allPostsTitle: requiredText,
  postsLabel: requiredText,
  searchTitle: requiredText,
  searchPlaceholder: requiredText,
  searchActionLabel: requiredText,
  recentTitle: requiredText,
  keywordsTitle: requiredText,
  allKeywordsLabel: requiredText,
  noResultsText: requiredText,
});

export const parseBlogIndexPageManagedContent = (input: unknown) =>
  blogIndexPageManagedContentSchema.parse(input);

export const parseBlogIndexPageManagedContentForm = (
  input: unknown,
): BlogIndexPageManagedContent => {
  const parsed = blogIndexPageFormSchema.parse(input);

  return blogIndexPageManagedContentSchema.parse({
    seo: {
      title: parsed.seoTitle,
      description: parsed.seoDescription,
    },
    banner: {
      title: parsed.bannerTitle,
      description: parsed.bannerDescription,
      backgroundImage: parsed.bannerBackgroundImage,
    },
    allPostsTitle: parsed.allPostsTitle,
    postsLabel: parsed.postsLabel,
    searchTitle: parsed.searchTitle,
    searchPlaceholder: parsed.searchPlaceholder,
    searchActionLabel: parsed.searchActionLabel,
    recentTitle: parsed.recentTitle,
    keywordsTitle: parsed.keywordsTitle,
    allKeywordsLabel: parsed.allKeywordsLabel,
    noResultsText: parsed.noResultsText,
  });
};
