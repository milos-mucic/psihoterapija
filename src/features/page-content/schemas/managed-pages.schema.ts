import { z } from "zod";
import { sanitizeRichTextHtml } from "@/features/blog/utils/rich-text";
import type {
  AboutPageManagedContent,
  AppointmentPageManagedContent,
  BiographyProfileManagedContent,
  BiographyPageManagedContent,
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

export const aboutPageManagedContentSchema: z.ZodType<AboutPageManagedContent> = z.object({
  banner: bannerSchema,
  showcase: z.object({
    title: requiredText,
    videoUrl: requiredText,
    videoImage: requiredText,
    cards: z.array(mediaTextCardSchema).length(3),
  }),
  idea: z.object({
    title: requiredText,
    body: richTextRequired,
  }),
  focus: z.object({
    title: requiredText,
    items: z.array(requiredText).length(5),
  }),
  recent: z.object({
    title: requiredText,
    copy: richTextRequired,
    label: requiredText,
    empty: requiredText,
  }),
});

const aboutPageFormSchema = z.object({
  bannerTitle: requiredText,
  bannerDescription: richTextRequired,
  bannerBackgroundImage: requiredText,
  showcaseTitle: requiredText,
  showcaseVideoUrl: requiredText,
  showcaseVideoImage: requiredText,
  showcaseCard1Title: requiredText,
  showcaseCard1Copy: richTextRequired,
  showcaseCard1Image: requiredText,
  showcaseCard2Title: requiredText,
  showcaseCard2Copy: richTextRequired,
  showcaseCard2Image: requiredText,
  showcaseCard3Title: requiredText,
  showcaseCard3Copy: richTextRequired,
  showcaseCard3Image: requiredText,
  ideaTitle: requiredText,
  ideaBody: richTextRequired,
  focusTitle: requiredText,
  focusItem1: requiredText,
  focusItem2: requiredText,
  focusItem3: requiredText,
  focusItem4: requiredText,
  focusItem5: requiredText,
  recentTitle: requiredText,
  recentCopy: richTextRequired,
  recentLabel: requiredText,
  recentEmpty: requiredText,
});

export const parseAboutPageManagedContent = (input: unknown) =>
  aboutPageManagedContentSchema.parse(input);

export const parseAboutPageManagedContentForm = (input: unknown): AboutPageManagedContent => {
  const parsed = aboutPageFormSchema.parse(input);

  return aboutPageManagedContentSchema.parse({
    banner: {
      title: parsed.bannerTitle,
      description: parsed.bannerDescription,
      backgroundImage: parsed.bannerBackgroundImage,
    },
    showcase: {
      title: parsed.showcaseTitle,
      videoUrl: parsed.showcaseVideoUrl,
      videoImage: parsed.showcaseVideoImage,
      cards: [
        {
          title: parsed.showcaseCard1Title,
          copy: parsed.showcaseCard1Copy,
          image: parsed.showcaseCard1Image,
        },
        {
          title: parsed.showcaseCard2Title,
          copy: parsed.showcaseCard2Copy,
          image: parsed.showcaseCard2Image,
        },
        {
          title: parsed.showcaseCard3Title,
          copy: parsed.showcaseCard3Copy,
          image: parsed.showcaseCard3Image,
        },
      ],
    },
    idea: {
      title: parsed.ideaTitle,
      body: parsed.ideaBody,
    },
    focus: {
      title: parsed.focusTitle,
      items: [
        parsed.focusItem1,
        parsed.focusItem2,
        parsed.focusItem3,
        parsed.focusItem4,
        parsed.focusItem5,
      ],
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
  highlights: z.array(requiredText).length(3),
});

export const biographyPageManagedContentSchema: z.ZodType<BiographyPageManagedContent> = z.object({
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
    points: z.array(requiredText).length(3),
    image: requiredText,
    ctaLabel: requiredText,
  }),
});

const biographyPageFormSchema = z.object({
  bannerTitle: requiredText,
  bannerDescription: richTextRequired,
  bannerBackgroundImage: optionalText,
  cardsTitle: requiredText,
  cardsCopy: richTextRequired,
  approachTitle: requiredText,
  approachCopy: richTextRequired,
  approachPoint1: requiredText,
  approachPoint2: requiredText,
  approachPoint3: requiredText,
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

  return biographyCardSchema.parse({
    slug: input[`${prefix}slug`],
    title: input[`${prefix}title`],
    role: input[`${prefix}role`],
    summary: input[`${prefix}summary`],
    body: input[`${prefix}body`],
    image: input[`${prefix}image`],
    highlights: [
      input[`${prefix}highlight1`],
      input[`${prefix}highlight2`],
      input[`${prefix}highlight3`],
    ],
  });
};

export const parseBiographyPageManagedContentForm = (
  input: unknown,
): BiographyPageManagedContent => {
  const parsed = biographyPageFormSchema.parse(input);
  const values = parsed as Record<string, unknown>;
  const cards = getBiographyCardIndexes(values).map((index) => toBiographyCard(values, index));

  return biographyPageManagedContentSchema.parse({
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
      points: [parsed.approachPoint1, parsed.approachPoint2, parsed.approachPoint3],
      image: parsed.approachImage,
      ctaLabel: parsed.approachCtaLabel,
    },
  });
};

export const psychotherapyPageManagedContentSchema: z.ZodType<PsychotherapyPageManagedContent> =
  z.object({
    banner: bannerSchema,
    scope: z.object({
      title: requiredText,
      items: z.array(requiredText).length(7),
    }),
    services: z.object({
      cards: z.array(mediaTextCardSchema).length(3),
    }),
    booking: z.object({
      title: requiredText,
      copy: richTextRequired,
      formatLabel: requiredText,
      formats: z.array(requiredText).length(3),
    }),
    faq: z.object({
      items: z.array(faqItemSchema).length(4),
      image: requiredText,
    }),
  });

const psychotherapyPageFormSchema = z.object({
  bannerTitle: requiredText,
  bannerDescription: richTextRequired,
  bannerBackgroundImage: requiredText,
  scopeTitle: requiredText,
  scopeItem1: requiredText,
  scopeItem2: requiredText,
  scopeItem3: requiredText,
  scopeItem4: requiredText,
  scopeItem5: requiredText,
  scopeItem6: requiredText,
  scopeItem7: requiredText,
  service1Title: requiredText,
  service1Copy: richTextRequired,
  service1Image: requiredText,
  service2Title: requiredText,
  service2Copy: richTextRequired,
  service2Image: requiredText,
  service3Title: requiredText,
  service3Copy: richTextRequired,
  service3Image: requiredText,
  bookingTitle: requiredText,
  bookingCopy: richTextRequired,
  bookingFormatLabel: requiredText,
  bookingFormat1: requiredText,
  bookingFormat2: requiredText,
  bookingFormat3: requiredText,
  faqImage: requiredText,
  faq1Question: requiredText,
  faq1Answer: richTextRequired,
  faq2Question: requiredText,
  faq2Answer: richTextRequired,
  faq3Question: requiredText,
  faq3Answer: richTextRequired,
  faq4Question: requiredText,
  faq4Answer: richTextRequired,
});

export const parsePsychotherapyPageManagedContent = (input: unknown) =>
  psychotherapyPageManagedContentSchema.parse(input);

export const parsePsychotherapyPageManagedContentForm = (
  input: unknown,
): PsychotherapyPageManagedContent => {
  const parsed = psychotherapyPageFormSchema.parse(input);

  return psychotherapyPageManagedContentSchema.parse({
    banner: {
      title: parsed.bannerTitle,
      description: parsed.bannerDescription,
      backgroundImage: parsed.bannerBackgroundImage,
    },
    scope: {
      title: parsed.scopeTitle,
      items: [
        parsed.scopeItem1,
        parsed.scopeItem2,
        parsed.scopeItem3,
        parsed.scopeItem4,
        parsed.scopeItem5,
        parsed.scopeItem6,
        parsed.scopeItem7,
      ],
    },
    services: {
      cards: [
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
        {
          title: parsed.service3Title,
          copy: parsed.service3Copy,
          image: parsed.service3Image,
        },
      ],
    },
    booking: {
      title: parsed.bookingTitle,
      copy: parsed.bookingCopy,
      formatLabel: parsed.bookingFormatLabel,
      formats: [parsed.bookingFormat1, parsed.bookingFormat2, parsed.bookingFormat3],
    },
    faq: {
      image: parsed.faqImage,
      items: [
        { question: parsed.faq1Question, answer: parsed.faq1Answer },
        { question: parsed.faq2Question, answer: parsed.faq2Answer },
        { question: parsed.faq3Question, answer: parsed.faq3Answer },
        { question: parsed.faq4Question, answer: parsed.faq4Answer },
      ],
    },
  });
};

const scopeTabSchema = z.object({
  id: requiredText,
  label: requiredText,
  icon: requiredText,
  detailImage: requiredText,
  detailLead: richTextRequired,
  items: z.array(textCardSchema).length(3),
});

export const scopePageManagedContentSchema: z.ZodType<ScopePageManagedContent> = z.object({
  banner: bannerSchema,
  intro: z.object({
    title: requiredText,
    items: z.array(requiredText).length(7),
  }),
  tabs: z.array(scopeTabSchema).length(4),
  detail: z.object({
    eyebrow: requiredText,
    backLabel: requiredText,
    ctaLabel: requiredText,
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
  bannerTitle: requiredText,
  bannerDescription: richTextRequired,
  bannerBackgroundImage: requiredText,
  introTitle: requiredText,
  introItem1: requiredText,
  introItem2: requiredText,
  introItem3: requiredText,
  introItem4: requiredText,
  introItem5: requiredText,
  introItem6: requiredText,
  introItem7: requiredText,
  detailEyebrow: requiredText,
  detailBackLabel: requiredText,
  detailCtaLabel: requiredText,
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
  tab1Id: requiredText,
  tab1Label: requiredText,
  tab1Icon: requiredText,
  tab1DetailImage: requiredText,
  tab1DetailLead: richTextRequired,
  tab1Item1Title: requiredText,
  tab1Item1Copy: richTextRequired,
  tab1Item2Title: requiredText,
  tab1Item2Copy: richTextRequired,
  tab1Item3Title: requiredText,
  tab1Item3Copy: richTextRequired,
  tab2Id: requiredText,
  tab2Label: requiredText,
  tab2Icon: requiredText,
  tab2DetailImage: requiredText,
  tab2DetailLead: richTextRequired,
  tab2Item1Title: requiredText,
  tab2Item1Copy: richTextRequired,
  tab2Item2Title: requiredText,
  tab2Item2Copy: richTextRequired,
  tab2Item3Title: requiredText,
  tab2Item3Copy: richTextRequired,
  tab3Id: requiredText,
  tab3Label: requiredText,
  tab3Icon: requiredText,
  tab3DetailImage: requiredText,
  tab3DetailLead: richTextRequired,
  tab3Item1Title: requiredText,
  tab3Item1Copy: richTextRequired,
  tab3Item2Title: requiredText,
  tab3Item2Copy: richTextRequired,
  tab3Item3Title: requiredText,
  tab3Item3Copy: richTextRequired,
  tab4Id: requiredText,
  tab4Label: requiredText,
  tab4Icon: requiredText,
  tab4DetailImage: requiredText,
  tab4DetailLead: richTextRequired,
  tab4Item1Title: requiredText,
  tab4Item1Copy: richTextRequired,
  tab4Item2Title: requiredText,
  tab4Item2Copy: richTextRequired,
  tab4Item3Title: requiredText,
  tab4Item3Copy: richTextRequired,
});

const toScopeTab = (
  parsed: z.infer<typeof scopePageFormSchema>,
  prefix: "tab1" | "tab2" | "tab3" | "tab4",
) => {
  const values = parsed as Record<string, string>;

  return {
    id: values[`${prefix}Id`],
    label: values[`${prefix}Label`],
    icon: values[`${prefix}Icon`],
    detailImage: values[`${prefix}DetailImage`],
    detailLead: values[`${prefix}DetailLead`],
    items: [
      {
        title: values[`${prefix}Item1Title`],
        copy: values[`${prefix}Item1Copy`],
      },
      {
        title: values[`${prefix}Item2Title`],
        copy: values[`${prefix}Item2Copy`],
      },
      {
        title: values[`${prefix}Item3Title`],
        copy: values[`${prefix}Item3Copy`],
      },
    ],
  };
};

export const parseScopePageManagedContent = (input: unknown) =>
  scopePageManagedContentSchema.parse(input);

export const parseScopePageManagedContentForm = (input: unknown): ScopePageManagedContent => {
  const parsed = scopePageFormSchema.parse(input);

  return scopePageManagedContentSchema.parse({
    banner: {
      title: parsed.bannerTitle,
      description: parsed.bannerDescription,
      backgroundImage: parsed.bannerBackgroundImage,
    },
    intro: {
      title: parsed.introTitle,
      items: [
        parsed.introItem1,
        parsed.introItem2,
        parsed.introItem3,
        parsed.introItem4,
        parsed.introItem5,
        parsed.introItem6,
        parsed.introItem7,
      ],
    },
    tabs: [
      toScopeTab(parsed, "tab1"),
      toScopeTab(parsed, "tab2"),
      toScopeTab(parsed, "tab3"),
      toScopeTab(parsed, "tab4"),
    ],
    detail: {
      eyebrow: parsed.detailEyebrow,
      backLabel: parsed.detailBackLabel,
      ctaLabel: parsed.detailCtaLabel,
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

export const pricingPageManagedContentSchema: z.ZodType<PricingPageManagedContent> = z.object({
  banner: bannerSchema,
  plans: z
    .array(
      z.object({
        title: requiredText,
        price: requiredText,
        outsideSerbiaPrice: requiredText,
        ctaLabel: requiredText,
      }),
    )
    .length(3),
  infoCards: z.array(textCardSchema).length(3),
});

const pricingPageFormSchema = z.object({
  bannerTitle: requiredText,
  bannerDescription: richTextRequired,
  bannerBackgroundImage: requiredText,
  plan1Title: requiredText,
  plan1Price: requiredText,
  plan1OutsideSerbiaPrice: richTextRequired,
  plan1CtaLabel: requiredText,
  plan2Title: requiredText,
  plan2Price: requiredText,
  plan2OutsideSerbiaPrice: richTextRequired,
  plan2CtaLabel: requiredText,
  plan3Title: requiredText,
  plan3Price: requiredText,
  plan3OutsideSerbiaPrice: richTextRequired,
  plan3CtaLabel: requiredText,
  info1Title: requiredText,
  info1Copy: richTextRequired,
  info2Title: requiredText,
  info2Copy: richTextRequired,
  info3Title: requiredText,
  info3Copy: richTextRequired,
});

export const parsePricingPageManagedContent = (input: unknown) =>
  pricingPageManagedContentSchema.parse(input);

export const parsePricingPageManagedContentForm = (input: unknown): PricingPageManagedContent => {
  const parsed = pricingPageFormSchema.parse(input);

  return pricingPageManagedContentSchema.parse({
    banner: {
      title: parsed.bannerTitle,
      description: parsed.bannerDescription,
      backgroundImage: parsed.bannerBackgroundImage,
    },
    plans: [
      {
        title: parsed.plan1Title,
        price: parsed.plan1Price,
        outsideSerbiaPrice: parsed.plan1OutsideSerbiaPrice,
        ctaLabel: parsed.plan1CtaLabel,
      },
      {
        title: parsed.plan2Title,
        price: parsed.plan2Price,
        outsideSerbiaPrice: parsed.plan2OutsideSerbiaPrice,
        ctaLabel: parsed.plan2CtaLabel,
      },
      {
        title: parsed.plan3Title,
        price: parsed.plan3Price,
        outsideSerbiaPrice: parsed.plan3OutsideSerbiaPrice,
        ctaLabel: parsed.plan3CtaLabel,
      },
    ],
    infoCards: [
      { title: parsed.info1Title, copy: parsed.info1Copy },
      { title: parsed.info2Title, copy: parsed.info2Copy },
      { title: parsed.info3Title, copy: parsed.info3Copy },
    ],
  });
};

export const appointmentPageManagedContentSchema: z.ZodType<AppointmentPageManagedContent> =
  z.object({
    banner: bannerSchema,
    booking: z.object({
      title: requiredText,
      copy: requiredText,
      formatLabel: requiredText,
      formats: z.array(requiredText).length(3),
    }),
    faq: z.object({
      items: z.array(faqItemSchema).length(4),
      image: requiredText,
    }),
  });

const appointmentPageFormSchema = z.object({
  bannerTitle: requiredText,
  bannerDescription: richTextRequired,
  bannerBackgroundImage: requiredText,
  bookingTitle: requiredText,
  bookingCopy: richTextRequired,
  bookingFormatLabel: requiredText,
  bookingFormat1: requiredText,
  bookingFormat2: requiredText,
  bookingFormat3: requiredText,
  faqImage: requiredText,
  faq1Question: requiredText,
  faq1Answer: richTextRequired,
  faq2Question: requiredText,
  faq2Answer: richTextRequired,
  faq3Question: requiredText,
  faq3Answer: richTextRequired,
  faq4Question: requiredText,
  faq4Answer: richTextRequired,
});

export const parseAppointmentPageManagedContent = (input: unknown) =>
  appointmentPageManagedContentSchema.parse(input);

export const parseAppointmentPageManagedContentForm = (
  input: unknown,
): AppointmentPageManagedContent => {
  const parsed = appointmentPageFormSchema.parse(input);

  return appointmentPageManagedContentSchema.parse({
    banner: {
      title: parsed.bannerTitle,
      description: parsed.bannerDescription,
      backgroundImage: parsed.bannerBackgroundImage,
    },
    booking: {
      title: parsed.bookingTitle,
      copy: parsed.bookingCopy,
      formatLabel: parsed.bookingFormatLabel,
      formats: [parsed.bookingFormat1, parsed.bookingFormat2, parsed.bookingFormat3],
    },
    faq: {
      image: parsed.faqImage,
      items: [
        { question: parsed.faq1Question, answer: parsed.faq1Answer },
        { question: parsed.faq2Question, answer: parsed.faq2Answer },
        { question: parsed.faq3Question, answer: parsed.faq3Answer },
        { question: parsed.faq4Question, answer: parsed.faq4Answer },
      ],
    },
  });
};

export const faqPageManagedContentSchema: z.ZodType<FaqPageManagedContent> = z.object({
  banner: bannerSchema,
  faq: z.object({
    items: z.array(faqItemSchema).length(4),
    image: requiredText,
  }),
  booking: z.object({
    title: requiredText,
    copy: requiredText,
    formatLabel: requiredText,
    formats: z.array(requiredText).length(3),
  }),
});

const faqPageFormSchema = z.object({
  bannerTitle: requiredText,
  bannerDescription: richTextRequired,
  bannerBackgroundImage: requiredText,
  faqImage: requiredText,
  faq1Question: requiredText,
  faq1Answer: richTextRequired,
  faq2Question: requiredText,
  faq2Answer: richTextRequired,
  faq3Question: requiredText,
  faq3Answer: richTextRequired,
  faq4Question: requiredText,
  faq4Answer: richTextRequired,
  bookingTitle: requiredText,
  bookingCopy: richTextRequired,
  bookingFormatLabel: requiredText,
  bookingFormat1: requiredText,
  bookingFormat2: requiredText,
  bookingFormat3: requiredText,
});

export const parseFaqPageManagedContent = (input: unknown) =>
  faqPageManagedContentSchema.parse(input);

export const parseFaqPageManagedContentForm = (input: unknown): FaqPageManagedContent => {
  const parsed = faqPageFormSchema.parse(input);

  return faqPageManagedContentSchema.parse({
    banner: {
      title: parsed.bannerTitle,
      description: parsed.bannerDescription,
      backgroundImage: parsed.bannerBackgroundImage,
    },
    faq: {
      image: parsed.faqImage,
      items: [
        { question: parsed.faq1Question, answer: parsed.faq1Answer },
        { question: parsed.faq2Question, answer: parsed.faq2Answer },
        { question: parsed.faq3Question, answer: parsed.faq3Answer },
        { question: parsed.faq4Question, answer: parsed.faq4Answer },
      ],
    },
    booking: {
      title: parsed.bookingTitle,
      copy: parsed.bookingCopy,
      formatLabel: parsed.bookingFormatLabel,
      formats: [parsed.bookingFormat1, parsed.bookingFormat2, parsed.bookingFormat3],
    },
  });
};
