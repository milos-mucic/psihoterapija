import { getHomePageData } from "@/data/fixtures/home";
import {
  getAboutPageData,
  getAppointmentPageData,
  getBiographyPageData,
  getContactPageData,
  getFaqPageData,
  getPricingPageData,
  getPsychotherapyPageData,
  getScopeDetailPageData,
  getScopePageData,
} from "@/data/fixtures/public-pages";
import type {
  AboutPageManagedContent,
  AppointmentPageManagedContent,
  BlogIndexPageManagedContent,
  BiographyPageManagedContent,
  ContactPageManagedContent,
  FaqPageManagedContent,
  PricingPageManagedContent,
  PsychotherapyPageManagedContent,
  ScopePageManagedContent,
} from "@/features/page-content/types/page-content.types";
import { localizePath } from "@/features/i18n/locale";
import { getDictionary } from "@/features/i18n/translate";
import { siteConfig, type SiteLocale } from "@/lib/config/site";

const aboutShowcaseHrefs = ["/zakazivanje/", "/psihoterapija/", "/psihoterapija/"];
const defaultScopeSlugs = [
  "anksiozna-stanja",
  "poremecaji-licnosti",
  "depresivna-stanja",
  "trauma",
];

export const getDefaultAboutPageManagedContent = (locale: SiteLocale): AboutPageManagedContent => {
  const content = getAboutPageData(locale);
  const dictionary = getDictionary(locale);

  return {
    seo: {
      title: dictionary.meta.about.title,
      description: dictionary.meta.about.description,
    },
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
  seo: content.seo,
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
  const dictionary = getDictionary(locale);

  return {
    seo: {
      title: dictionary.meta.biography.title,
      description: dictionary.meta.biography.description,
    },
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
  seo: content.seo,
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
  const dictionary = getDictionary(locale);

  return {
    seo: {
      title: dictionary.meta.psychotherapy.title,
      description: dictionary.meta.psychotherapy.description,
    },
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
      copy: home.booking.copy,
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
  seo: content.seo,
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
    answerHtml: item.answer,
  })),
  faqImage: content.faq.image,
});

export const getDefaultScopePageManagedContent = (locale: SiteLocale): ScopePageManagedContent => {
  const content = getScopePageData(locale);
  const firstDetail = getScopeDetailPageData(locale, defaultScopeSlugs[0]);
  const dictionary = getDictionary(locale);

  return {
    seo: {
      title: `${dictionary.nav.therapyLinks.scope} | ${siteConfig.name}`,
      description: content.banner.description ?? "",
    },
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
      tabMeta: tab.tabMeta,
      icon: tab.icon,
      summaryTitle: tab.summaryTitle,
      summaryCopy: tab.summaryCopy,
      panelEyebrow: tab.panelEyebrow,
      panelStatLabel: tab.panelStatLabel,
      panelCtaLabel: tab.panelCtaLabel,
      detailImage: tab.detailImage,
      detailBannerDescription: tab.detailBannerDescription,
      detailEyebrow: tab.detailEyebrow,
      detailLead: tab.detailLead,
      detailBackLabel: tab.detailBackLabel,
      detailCtaLabel: tab.detailCtaLabel,
      items: tab.items,
    })),
    detail: {
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
  seo: content.seo,
  banner: {
    title: content.banner.title,
    description: content.banner.description,
    backgroundImage: undefined,
    theme: "light" as const,
    align: "split" as const,
  },
  tabs: content.tabs.map((tab) => ({
    ...tab,
    cardTitle: tab.summaryTitle,
    cardCopy: tab.summaryCopy,
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
    cardTitle: tab.summaryTitle,
    cardCopy: tab.summaryCopy,
    href: localizePath(locale, `/oblast-rada/${tab.id}/`),
  }));
  const currentTab = tabs.find((tab) => tab.id === slug);

  if (!currentTab) {
    return null;
  }

  return {
    banner: {
      title: currentTab.label,
      description: currentTab.detailBannerDescription,
      backgroundImage: undefined,
      theme: "dark" as const,
      align: "split" as const,
    },
    eyebrow: currentTab.detailEyebrow,
    lead: currentTab.detailLead,
    image: currentTab.detailImage,
    items: currentTab.items,
    backHref: localizePath(locale, "/oblast-rada/"),
    backLabel: currentTab.detailBackLabel,
    ctaHref: localizePath(locale, "/zakazivanje/"),
    ctaLabel: currentTab.detailCtaLabel,
    relatedTitle: content.detail.relatedTitle,
    relatedTabs: tabs.filter((tab) => tab.id !== slug),
  };
};

export const getDefaultPricingPageManagedContent = (
  locale: SiteLocale,
): PricingPageManagedContent => {
  const content = getPricingPageData(locale);
  const dictionary = getDictionary(locale);

  return {
    seo: {
      title: `${dictionary.nav.therapyLinks.pricing} | ${siteConfig.name}`,
      description: content.banner.description ?? "",
    },
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
  seo: content.seo,
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
  const dictionary = getDictionary(locale);

  return {
    seo: {
      title: dictionary.meta.appointment.title,
      description: dictionary.meta.appointment.description,
    },
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
  seo: content.seo,
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
    answerHtml: item.answer,
  })),
  faqImage: content.faq.image,
});

export const getDefaultFaqPageManagedContent = (locale: SiteLocale): FaqPageManagedContent => {
  const content = getFaqPageData(locale);
  const dictionary = getDictionary(locale);

  return {
    seo: {
      title: dictionary.meta.faq.title,
      description: dictionary.meta.faq.description,
    },
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
  seo: content.seo,
  banner: {
    title: content.banner.title,
    description: content.banner.description,
    backgroundImage: content.banner.backgroundImage,
    theme: "dark" as const,
    align: "split" as const,
  },
  items: content.faq.items.map((item) => ({
    question: item.question,
    answerHtml: item.answer,
  })),
  faqImage: content.faq.image,
  bookingTitle: content.booking.title,
  bookingCopy: content.booking.copy,
  formatLabel: content.booking.formatLabel,
  formats: content.booking.formats,
});

export const getDefaultContactPageManagedContent = (
  locale: SiteLocale,
): ContactPageManagedContent => {
  const content = getContactPageData(locale);
  const dictionary = getDictionary(locale);
  const bannerDescription =
    "description" in content.banner && typeof content.banner.description === "string"
      ? content.banner.description
      : "";

  return {
    seo: {
      title: dictionary.meta.contact.title,
      description: dictionary.meta.contact.description,
    },
    banner: {
      title: content.banner.title,
      description: bannerDescription,
      backgroundImage: content.banner.backgroundImage ?? "",
    },
    introTitle: content.introTitle,
    introCopy: content.introCopy,
    formTitle: content.formTitle,
    contactLabels: content.contactLabels,
    phone: siteConfig.contactPhone,
    email: siteConfig.contactEmail,
    socialLinks: [
      {
        platform: "facebook",
        label: locale === "sr-cyrl" ? "Фејсбук профил" : "Fejsbuk profil",
        href: "https://www.facebook.com/",
      },
      {
        platform: "instagram",
        label: locale === "sr-cyrl" ? "Инстаграм профил" : "Instagram profil",
        href: "https://www.instagram.com/",
      },
      {
        platform: "linkedin",
        label: locale === "sr-cyrl" ? "Линкедин профил" : "LinkedIn profil",
        href: "https://www.linkedin.com/",
      },
    ],
    officesTitle: content.officesTitle,
    officesCopy: content.officesCopy,
    officeGallery: [
      "/legacy/images/Office-1-1_1Office 1 (1).webp",
      "/legacy/images/Office-2-1_1Office 2 (1).webp",
      "/legacy/images/Office-3-1_1Office 3 (1).webp",
    ],
  };
};

export const buildContactPageData = (_locale: SiteLocale, content: ContactPageManagedContent) => ({
  seo: content.seo,
  banner: {
    title: content.banner.title,
    description: content.banner.description,
    backgroundImage: content.banner.backgroundImage,
    theme: "dark" as const,
    align: "center" as const,
  },
  introTitle: content.introTitle,
  introCopy: content.introCopy,
  formTitle: content.formTitle,
  contactLabels: content.contactLabels,
  phone: content.phone,
  email: content.email,
  socialLinks: content.socialLinks,
  officesTitle: content.officesTitle,
  officesCopy: content.officesCopy,
  officeGallery: content.officeGallery,
});

export const getDefaultBlogIndexPageManagedContent = (
  locale: SiteLocale,
): BlogIndexPageManagedContent => {
  const dictionary = getDictionary(locale);
  const ui = dictionary.blog.index;

  return {
    seo: {
      title: dictionary.meta.blog.title,
      description: dictionary.meta.blog.description,
    },
    banner: {
      title: dictionary.blog.title,
      description: ui.bannerDescription,
      backgroundImage: "/legacy/images/blog-header-hero.svg",
    },
    allPostsTitle: ui.allPosts,
    postsLabel: ui.postsLabel,
    searchTitle: ui.searchTitle,
    searchPlaceholder: ui.searchPlaceholder,
    searchActionLabel: ui.searchAction,
    recentTitle: ui.recentTitle,
    keywordsTitle: ui.keywordsTitle,
    allKeywordsLabel: ui.allKeywords,
    noResultsText: ui.noResults,
  };
};

export const buildBlogIndexPageData = (
  _locale: SiteLocale,
  content: BlogIndexPageManagedContent,
) => ({
  seo: content.seo,
  banner: {
    title: content.banner.title,
    description: content.banner.description,
    backgroundImage: content.banner.backgroundImage,
    theme: "dark" as const,
    align: "split" as const,
  },
  allPostsTitle: content.allPostsTitle,
  postsLabel: content.postsLabel,
  searchTitle: content.searchTitle,
  searchPlaceholder: content.searchPlaceholder,
  searchActionLabel: content.searchActionLabel,
  recentTitle: content.recentTitle,
  keywordsTitle: content.keywordsTitle,
  allKeywordsLabel: content.allKeywordsLabel,
  noResultsText: content.noResultsText,
});
