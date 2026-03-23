import { getHomePageData } from "@/data/fixtures/home";
import {
  getAboutPageData,
  getAppointmentPageData,
  getBiographyPageData,
  getFaqPageData,
  getPricingPageData,
  getPsychotherapyPageData,
  getScopeDetailPageData,
  getScopePageData,
} from "@/data/fixtures/public-pages";
import type {
  AboutPageManagedContent,
  AppointmentPageManagedContent,
  BiographyPageManagedContent,
  FaqPageManagedContent,
  PricingPageManagedContent,
  PsychotherapyPageManagedContent,
  ScopePageManagedContent,
} from "@/features/page-content/types/page-content.types";
import { localizePath } from "@/features/i18n/locale";
import { extractPlainTextFromHtml } from "@/features/blog/utils/rich-text";
import type { SiteLocale } from "@/lib/config/site";

const aboutShowcaseHrefs = ["/zakazivanje/", "/psihoterapija/", "/psihoterapija/"];
const defaultScopeSlugs = [
  "anksiozna-stanja",
  "poremecaji-licnosti",
  "depresivna-stanja",
  "trauma",
];

export const getDefaultAboutPageManagedContent = (locale: SiteLocale): AboutPageManagedContent => {
  const content = getAboutPageData(locale);

  return {
    banner: {
      title: content.banner.title,
      description: content.banner.description ?? "",
      backgroundImage: content.banner.backgroundImage ?? "",
    },
    showcase: {
      title: content.showcaseTitle,
      videoUrl: content.showcaseVideoHref,
      videoImage: content.showcaseVideoImage,
      cards: content.showcaseCards.map((card) => ({
        title: card.title,
        copy: card.copy,
        image: card.image,
      })),
    },
    idea: {
      title: content.ideaTitle,
      body: content.ideaHtml,
    },
    focus: {
      title: content.focusTitle,
      items: content.focusItems,
    },
    recent: {
      title: content.recentTitle,
      copy: content.recentCopy,
      label: content.recentLabel,
      empty: content.recentEmptyLabel,
    },
  };
};

export const buildAboutPageData = (locale: SiteLocale, content: AboutPageManagedContent) => ({
  banner: {
    title: content.banner.title,
    description: content.banner.description,
    backgroundImage: content.banner.backgroundImage,
    theme: "dark" as const,
    align: "split" as const,
  },
  showcaseTitle: content.showcase.title,
  showcaseVideoHref: content.showcase.videoUrl,
  showcaseVideoImage: content.showcase.videoImage,
  showcaseCards: content.showcase.cards.map((card, index) => ({
    ...card,
    href: localizePath(locale, aboutShowcaseHrefs[index] ?? "/psihoterapija/"),
  })),
  ideaTitle: content.idea.title,
  ideaHtml: content.idea.body,
  focusTitle: content.focus.title,
  focusItems: content.focus.items,
  recentTitle: content.recent.title,
  recentCopy: content.recent.copy,
  recentHref: localizePath(locale, "/blog/"),
  recentLabel: content.recent.label,
  recentEmptyLabel: content.recent.empty,
});

export const getDefaultBiographyPageManagedContent = (
  locale: SiteLocale,
): BiographyPageManagedContent => {
  const content = getBiographyPageData(locale);

  return {
    banner: {
      title: content.banner.title,
      description: content.banner.description ?? "",
      backgroundImage: content.banner.backgroundImage ?? "",
    },
    cardsSection: {
      title: content.cardsTitle,
      copy: content.cardsCopy,
      cards: content.cards.map((card) => ({
        slug: card.slug,
        title: card.title,
        role: card.role,
        summary: card.summary,
        body: card.body,
        image: card.image,
        highlights: card.highlights,
      })),
    },
    approach: {
      title: content.approachTitle,
      copy: content.approachCopy,
      points: content.approachPoints,
      image: content.approachImage,
      ctaLabel: content.ctaLabel,
    },
  };
};

export const buildBiographyPageData = (
  locale: SiteLocale,
  content: BiographyPageManagedContent,
) => ({
  banner: {
    title: content.banner.title,
    description: content.banner.description,
    backgroundImage: content.banner.backgroundImage,
    theme: "dark" as const,
    align: "split" as const,
  },
  cardsTitle: content.cardsSection.title,
  cardsCopy: content.cardsSection.copy,
  cards: content.cardsSection.cards.map((card) => ({
    ...card,
    href: localizePath(locale, `/biografija/${card.slug}/`),
  })),
  approachTitle: content.approach.title,
  approachCopy: content.approach.copy,
  approachPoints: content.approach.points,
  approachImage: content.approach.image,
  ctaHref: localizePath(locale, "/zakazivanje/"),
  ctaLabel: content.approach.ctaLabel,
});

export const buildBiographyDetailPageData = (
  locale: SiteLocale,
  content: BiographyPageManagedContent,
  slug: string,
) => {
  const cards = content.cardsSection.cards.map((card) => ({
    ...card,
    href: localizePath(locale, `/biografija/${card.slug}/`),
  }));
  const profile = cards.find((card) => card.slug === slug);

  if (!profile) {
    return null;
  }

  return {
    banner: {
      title: profile.title,
      description: profile.role,
      backgroundImage: content.banner.backgroundImage,
      theme: "dark" as const,
      align: "split" as const,
    },
    profile,
    backHref: localizePath(locale, "/biografija/"),
    backLabel: content.banner.title,
    relatedTitle: content.cardsSection.title,
    relatedProfiles: cards.filter((card) => card.slug !== slug),
  };
};

export const getDefaultPsychotherapyPageManagedContent = (
  locale: SiteLocale,
): PsychotherapyPageManagedContent => {
  const content = getPsychotherapyPageData(locale);
  const home = getHomePageData(locale);

  return {
    banner: {
      title: content.banner.title,
      description: content.banner.description ?? "",
      backgroundImage: "",
    },
    scope: {
      title: content.scopeTitle,
      items: content.scopeItems,
    },
    services: {
      cards: content.serviceCards.map((card) => ({
        title: card.title,
        copy: card.copy,
        image: card.image,
      })),
    },
    booking: {
      title: home.booking.title,
      copy: extractPlainTextFromHtml(home.booking.copy),
      formatLabel: home.booking.formatLabel,
      formats: home.booking.formats,
    },
    faq: {
      items: content.faqs.map((item) => ({
        question: item.question,
        answer: item.answer ?? "",
      })),
      image: content.faqImage,
    },
  };
};

export const buildPsychotherapyPageData = (
  locale: SiteLocale,
  content: PsychotherapyPageManagedContent,
) => ({
  banner: {
    title: content.banner.title,
    description: content.banner.description,
    backgroundImage: content.banner.backgroundImage,
    theme: "light" as const,
    align: "split" as const,
  },
  scopeTitle: content.scope.title,
  scopeItems: content.scope.items,
  serviceCards: content.services.cards.map((card) => ({
    ...card,
    href: localizePath(locale, "/zakazivanje/"),
    label: "",
  })),
  booking: {
    title: content.booking.title,
    copy: content.booking.copy,
    formatLabel: content.booking.formatLabel,
    formats: content.booking.formats,
  },
  faqs: content.faq.items.map((item) => ({
    question: item.question,
    answer: item.answer,
  })),
  faqImage: content.faq.image,
});

export const getDefaultScopePageManagedContent = (locale: SiteLocale): ScopePageManagedContent => {
  const content = getScopePageData(locale);
  const firstDetail = getScopeDetailPageData(locale, defaultScopeSlugs[0]);

  return {
    banner: {
      title: content.banner.title,
      description: content.banner.description ?? "",
      backgroundImage: content.banner.backgroundImage ?? "",
    },
    intro: {
      title: content.scopeTitle,
      items: content.scopeItems,
    },
    tabs: content.tabs.map((tab) => ({
      id: tab.id,
      label: tab.label,
      icon: tab.icon,
      detailImage: tab.detailImage,
      detailLead: tab.detailLead,
      items: tab.items,
    })),
    detail: {
      eyebrow: firstDetail?.eyebrow ?? "",
      backLabel: firstDetail?.backLabel ?? "",
      ctaLabel: firstDetail?.ctaLabel ?? "",
      relatedTitle: firstDetail?.relatedTitle ?? "",
    },
    focus: {
      title: content.focusTitle,
      copy: content.focusCopy,
      secondaryCopy: content.focusSecondaryCopy,
      image: content.focusImage,
      ctaLabel: content.focusCtaLabel,
    },
    recent: {
      title: content.recentTitle,
      copy: content.recentCopy,
      label: content.recentLabel,
      empty: content.recentEmpty,
    },
  };
};

export const buildScopePageData = (locale: SiteLocale, content: ScopePageManagedContent) => ({
  banner: {
    title: content.banner.title,
    description: content.banner.description,
    backgroundImage: content.banner.backgroundImage,
    theme: "dark" as const,
    align: "split" as const,
  },
  tabs: content.tabs.map((tab) => ({
    ...tab,
    cardTitle: tab.items[0]?.title ?? tab.label,
    cardCopy: tab.items[0]?.copy ?? "",
    href: localizePath(locale, `/oblast-rada/${tab.id}/`),
  })),
  scopeTitle: content.intro.title,
  scopeItems: content.intro.items,
  focusTitle: content.focus.title,
  focusCopy: content.focus.copy,
  focusSecondaryCopy: content.focus.secondaryCopy,
  focusImage: content.focus.image,
  focusCtaHref: localizePath(locale, "/o-nama/"),
  focusCtaLabel: content.focus.ctaLabel,
  recentTitle: content.recent.title,
  recentCopy: content.recent.copy,
  recentHref: localizePath(locale, "/blog/"),
  recentLabel: content.recent.label,
  recentEmpty: content.recent.empty,
});

export const buildScopeDetailPageData = (
  locale: SiteLocale,
  content: ScopePageManagedContent,
  slug: string,
) => {
  const tabs = content.tabs.map((tab) => ({
    ...tab,
    cardTitle: tab.items[0]?.title ?? tab.label,
    cardCopy: tab.items[0]?.copy ?? "",
    href: localizePath(locale, `/oblast-rada/${tab.id}/`),
  }));
  const currentTab = tabs.find((tab) => tab.id === slug);

  if (!currentTab) {
    return null;
  }

  return {
    banner: {
      title: currentTab.label,
      description: currentTab.cardCopy,
      backgroundImage: content.banner.backgroundImage,
      theme: "dark" as const,
      align: "split" as const,
    },
    eyebrow: content.detail.eyebrow,
    lead: currentTab.detailLead,
    image: currentTab.detailImage,
    items: currentTab.items,
    backHref: localizePath(locale, "/oblast-rada/"),
    backLabel: content.detail.backLabel,
    ctaHref: localizePath(locale, "/zakazivanje/"),
    ctaLabel: content.detail.ctaLabel,
    relatedTitle: content.detail.relatedTitle,
    relatedTabs: tabs.filter((tab) => tab.id !== slug),
  };
};

export const getDefaultPricingPageManagedContent = (
  locale: SiteLocale,
): PricingPageManagedContent => {
  const content = getPricingPageData(locale);

  return {
    banner: {
      title: content.banner.title,
      description: content.banner.description ?? "",
      backgroundImage: content.banner.backgroundImage ?? "",
    },
    plans: content.plans.map((plan) => ({
      title: plan.title,
      price: plan.price,
      outsideSerbiaPrice: plan.outsideSerbiaPrice,
      ctaLabel: plan.ctaLabel,
    })),
    infoCards: content.infoCards,
  };
};

export const buildPricingPageData = (locale: SiteLocale, content: PricingPageManagedContent) => ({
  banner: {
    title: content.banner.title,
    description: content.banner.description,
    backgroundImage: content.banner.backgroundImage,
    theme: "dark" as const,
    align: "split" as const,
  },
  plans: content.plans.map((plan) => ({
    ...plan,
    ctaHref: localizePath(locale, "/zakazivanje/"),
  })),
  infoCards: content.infoCards,
});

export const getDefaultAppointmentPageManagedContent = (
  locale: SiteLocale,
): AppointmentPageManagedContent => {
  const content = getAppointmentPageData(locale);

  return {
    banner: {
      title: content.banner.title,
      description: content.banner.description ?? "",
      backgroundImage: content.banner.backgroundImage ?? "",
    },
    booking: {
      title: content.formTitle,
      copy: content.banner.description ?? "",
      formatLabel: content.formatLabel,
      formats: content.formats,
    },
    faq: {
      items: content.faqs.map((item) => ({
        question: item.question,
        answer: item.answer ?? "",
      })),
      image: content.faqImage,
    },
  };
};

export const buildAppointmentPageData = (
  _locale: SiteLocale,
  content: AppointmentPageManagedContent,
) => ({
  banner: {
    title: content.banner.title,
    description: content.banner.description,
    backgroundImage: content.banner.backgroundImage,
    theme: "dark" as const,
    align: "split" as const,
  },
  formTitle: content.booking.title,
  introCopy: content.booking.copy,
  formatLabel: content.booking.formatLabel,
  formats: content.booking.formats,
  faqs: content.faq.items.map((item) => ({
    question: item.question,
    answer: item.answer,
  })),
  faqImage: content.faq.image,
});

export const getDefaultFaqPageManagedContent = (locale: SiteLocale): FaqPageManagedContent => {
  const content = getFaqPageData(locale);

  return {
    banner: {
      title: content.banner.title,
      description: content.banner.description ?? "",
      backgroundImage: content.banner.backgroundImage ?? "",
    },
    faq: {
      items: content.items.map((item) => ({
        question: item.question,
        answer: item.answer ?? "",
      })),
      image: content.faqImage,
    },
    booking: {
      title: content.bookingTitle,
      copy: content.bookingCopy,
      formatLabel: content.formatLabel,
      formats: content.formats,
    },
  };
};

export const buildFaqPageData = (_locale: SiteLocale, content: FaqPageManagedContent) => ({
  banner: {
    title: content.banner.title,
    description: content.banner.description,
    backgroundImage: content.banner.backgroundImage,
    theme: "dark" as const,
    align: "split" as const,
  },
  items: content.faq.items.map((item) => ({
    question: item.question,
    answer: item.answer,
  })),
  faqImage: content.faq.image,
  bookingTitle: content.booking.title,
  bookingCopy: content.booking.copy,
  formatLabel: content.booking.formatLabel,
  formats: content.booking.formats,
});
