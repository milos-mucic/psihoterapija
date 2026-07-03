export type PageKey =
  | "home"
  | "about"
  | "biography"
  | "psychotherapy"
  | "scope"
  | "services"
  | "pricing"
  | "appointment"
  | "faq"
  | "contact"
  | "blog";

export type PageSeoManagedContent = {
  title: string;
  description: string;
};

export type PageBannerManagedContent = {
  title: string;
  description: string;
  backgroundImage: string;
};

export type ManagedTextCard = {
  title: string;
  copy: string;
};

export type ManagedMediaTextCard = ManagedTextCard & {
  image: string;
};

export type ManagedFaqItem = {
  question: string;
  answer: string;
};

export type BiographyProfileManagedContent = {
  slug: string;
  title: string;
  role: string;
  bannerTitle?: string;
  bannerDescription?: string;
  summary: string;
  body: string;
  image: string;
  highlights: string[];
};

export type HomeEditableLinkCard = {
  title: string;
  copy: string;
  label: string;
};

export type HomeEditableMediaCard = HomeEditableLinkCard & {
  image: string;
};

export type BlockBackgroundsManagedContent = Record<string, string>;

export type HomePageManagedContent = {
  seo: PageSeoManagedContent;
  hiddenBlocks?: string[];
  blockBackgrounds?: BlockBackgroundsManagedContent;
  hero: {
    titleHtml: string;
    description: string;
    primaryActionLabel: string;
    secondaryActionLabel: string;
  };
  prompt: {
    title: string;
    copy: string;
    label: string;
  };
  about: {
    title: string;
    body: string;
    label: string;
    image: string;
  };
  services: {
    title: string;
    copy: string;
    items: Array<{
      title: string;
      copy: string;
      image: string;
    }>;
  };
  themes: {
    title: string;
    items: HomeEditableMediaCard[];
  };
  reasons: {
    title: string;
    copy: string;
    items: HomeEditableLinkCard[];
    videoUrl: string;
    videoImage: string;
    videoLabel: string;
  };
  booking: {
    title: string;
    copy: string;
    formatLabel: string;
    formats: string[];
  };
  recent: {
    title: string;
    copy: string;
    label: string;
    empty: string;
  };
};

export type AboutPageManagedContent = {
  seo: PageSeoManagedContent;
  hiddenBlocks?: string[];
  blockBackgrounds?: BlockBackgroundsManagedContent;
  banner: PageBannerManagedContent;
  showcase: {
    title: string;
    videoUrl: string;
    videoImage: string;
    cards: ManagedMediaTextCard[];
  };
  idea: {
    title: string;
    body: string;
  };
  focus: {
    title: string;
    items: string[];
  };
  recent: {
    title: string;
    copy: string;
    label: string;
    empty: string;
  };
};

export type BiographyPageManagedContent = {
  seo: PageSeoManagedContent;
  hiddenBlocks?: string[];
  blockBackgrounds?: BlockBackgroundsManagedContent;
  banner: PageBannerManagedContent;
  cardsSection: {
    title: string;
    copy: string;
    cards: BiographyProfileManagedContent[];
  };
  approach: {
    title: string;
    copy: string;
    points: string[];
    image: string;
    ctaLabel: string;
  };
};

export type PsychotherapyPageManagedContent = {
  seo: PageSeoManagedContent;
  hiddenBlocks?: string[];
  blockBackgrounds?: BlockBackgroundsManagedContent;
  banner: PageBannerManagedContent;
  scope: {
    title: string;
    items: string[];
  };
  services: {
    cards: ManagedMediaTextCard[];
  };
  booking: {
    title: string;
    copy: string;
    formatLabel: string;
    formats: string[];
  };
  faq: {
    items: ManagedFaqItem[];
    image: string;
  };
};

export type ScopePageManagedContent = {
  seo: PageSeoManagedContent;
  hiddenBlocks?: string[];
  blockBackgrounds?: BlockBackgroundsManagedContent;
  banner: PageBannerManagedContent;
  intro: {
    title: string;
    items: string[];
  };
  tabs: Array<{
    id: string;
    label: string;
    tabMeta: string;
    icon: string;
    summaryTitle: string;
    summaryCopy: string;
    panelEyebrow: string;
    panelStatLabel: string;
    panelCtaLabel: string;
    detailImage: string;
    detailBannerDescription: string;
    detailEyebrow: string;
    detailLead: string;
    detailBackLabel: string;
    detailCtaLabel: string;
    items: ManagedTextCard[];
  }>;
  detail: {
    relatedTitle: string;
  };
  focus: {
    title: string;
    copy: string;
    secondaryCopy: string;
    image: string;
    ctaLabel: string;
  };
  recent: {
    title: string;
    copy: string;
    label: string;
    empty: string;
  };
};

export type PricingPageManagedContent = {
  seo: PageSeoManagedContent;
  hiddenBlocks?: string[];
  blockBackgrounds?: BlockBackgroundsManagedContent;
  banner: PageBannerManagedContent;
  plans: Array<{
    title: string;
    price: string;
    outsideSerbiaPrice: string;
    ctaLabel: string;
  }>;
  infoCards: ManagedTextCard[];
};

export type AppointmentPageManagedContent = {
  seo: PageSeoManagedContent;
  hiddenBlocks?: string[];
  blockBackgrounds?: BlockBackgroundsManagedContent;
  banner: PageBannerManagedContent;
  booking: {
    title: string;
    copy: string;
    formatLabel: string;
    formats: string[];
  };
  faq: {
    items: ManagedFaqItem[];
    image: string;
  };
};

export type FaqPageManagedContent = {
  seo: PageSeoManagedContent;
  hiddenBlocks?: string[];
  blockBackgrounds?: BlockBackgroundsManagedContent;
  banner: PageBannerManagedContent;
  faq: {
    items: ManagedFaqItem[];
    image: string;
  };
  booking: {
    title: string;
    copy: string;
    formatLabel: string;
    formats: string[];
  };
};

export type ContactSocialLinkManagedContent = {
  platform: string;
  label: string;
  href: string;
};

export type ContactPageManagedContent = {
  seo: PageSeoManagedContent;
  hiddenBlocks?: string[];
  blockBackgrounds?: BlockBackgroundsManagedContent;
  banner: PageBannerManagedContent;
  introTitle: string;
  introCopy: string;
  formTitle: string;
  contactLabels: {
    phone: string;
    email: string;
    socials: string;
  };
  phone: string;
  email: string;
  socialLinks: ContactSocialLinkManagedContent[];
  officesTitle: string;
  officesCopy: string;
  officeGallery: string[];
};

export type ServiceItemManagedContent = {
  slug: string;
  seo: PageSeoManagedContent;
  banner: PageBannerManagedContent;
  intro: {
    title: string;
    body: string;
    image: string;
    highlights: string[];
  };
  faqs: ManagedFaqItem[];
};

export type ServicesPageManagedContent = {
  seo: PageSeoManagedContent;
  hiddenBlocks?: string[];
  blockBackgrounds?: BlockBackgroundsManagedContent;
  services: ServiceItemManagedContent[];
};

export type BlogIndexPageManagedContent = {
  seo: PageSeoManagedContent;
  hiddenBlocks?: string[];
  blockBackgrounds?: BlockBackgroundsManagedContent;
  banner: PageBannerManagedContent;
  allPostsTitle: string;
  postsLabel: string;
  searchTitle: string;
  searchPlaceholder: string;
  searchActionLabel: string;
  recentTitle: string;
  keywordsTitle: string;
  allKeywordsLabel: string;
  noResultsText: string;
};

export type PageContentRecord = {
  id: string;
  pageKey: PageKey;
  content: unknown;
  createdAt: Date;
  updatedAt: Date;
};

export type ManagedPageContentMap = {
  home: HomePageManagedContent;
  about: AboutPageManagedContent;
  biography: BiographyPageManagedContent;
  psychotherapy: PsychotherapyPageManagedContent;
  scope: ScopePageManagedContent;
  services: ServicesPageManagedContent;
  pricing: PricingPageManagedContent;
  appointment: AppointmentPageManagedContent;
  faq: FaqPageManagedContent;
  contact: ContactPageManagedContent;
  blog: BlogIndexPageManagedContent;
};

export type AnyManagedPageContent = ManagedPageContentMap[PageKey];
