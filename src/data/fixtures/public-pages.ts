import { localizePath } from "@/features/i18n/locale";
import { getDictionary } from "@/features/i18n/translate";
import type { SiteLocale } from "@/lib/config/site";

export type BannerData = {
  title: string;
  description?: string;
  theme?: "light" | "dark";
  backgroundImage?: string;
  align?: "split" | "center";
};

export type FaqAccordionItem = {
  question: string;
  answer?: string;
  answerHtml?: string;
};

export const getAboutPageData = (locale: SiteLocale) => {
  const dictionary = getDictionary(locale);
  const content = dictionary.pages.about;
  const serviceItems = dictionary.homePage.services.items;

  return {
    banner: {
      ...content.banner,
      theme: "dark" as const,
      backgroundImage: "/legacy/images/BG-Video-2_1BG Video (2).webp",
      align: "split" as const,
    },
    showcaseTitle: content.showcaseTitle,
    showcaseVideoHref: "https://www.youtube.com/watch?v=KGg5cIjHQiw",
    showcaseVideoImage: "/legacy/images/Video-BG-About-Us-1_1Video BG About Us (1).webp",
    showcaseEmptyLabel: content.showcaseEmptyLabel,
    showcaseCards: [
      {
        title: serviceItems[2].title,
        copy: serviceItems[2].copy,
        href: localizePath(locale, "/zakazivanje/"),
        image:
          "https://cdn.prod.website-files.com/689b44011832e2b57d6920e4/689b44011832e2b57d692288_Logo%20Service%201.png",
      },
      {
        title: serviceItems[0].title,
        copy: serviceItems[0].copy,
        href: localizePath(locale, "/psihoterapija/"),
        image:
          "https://cdn.prod.website-files.com/689b44011832e2b57d6920e4/689b44011832e2b57d692289_Logo%20Service%202.png",
      },
      {
        title: serviceItems[1].title,
        copy: serviceItems[1].copy,
        href: localizePath(locale, "/psihoterapija/"),
        image:
          "https://cdn.prod.website-files.com/689b44011832e2b57d6920e4/689b44011832e2b57d69228a_Logo%20Service%203.png",
      },
    ],
    ideaTitle: content.ideaTitle,
    ideaHtml: content.ideaHtml,
    focusTitle: content.focusTitle,
    focusItems: content.focusItems,
    recentTitle: content.recentTitle,
    recentCopy: content.recentCopy,
    recentHref: localizePath(locale, "/blog/"),
    recentLabel: content.recentLabel,
    recentReadMoreLabel: content.recentReadMoreLabel,
    recentEmptyLabel: content.recentEmptyLabel,
  };
};

export const getPsychotherapyPageData = (locale: SiteLocale) => {
  const content = getDictionary(locale).pages.psychotherapy;

  return {
    banner: {
      ...content.banner,
      theme: "light" as const,
      align: "split" as const,
    },
    scopeTitle: content.scopeTitle,
    scopeItems: content.scopeItems,
    servicesEmptyLabel: content.servicesEmptyLabel,
    bookingTitleHtml: content.bookingTitleHtml,
    formatLabel: content.formatLabel,
    formats: content.formats,
    faqs: content.faqs satisfies FaqAccordionItem[],
    faqImage: "/legacy/images/FAQ_1FAQ.webp",
  };
};

export const getFaqPageData = (locale: SiteLocale) => {
  const content = getDictionary(locale).pages.faq;

  return {
    banner: {
      ...content.banner,
      theme: "light" as const,
      align: "split" as const,
    },
    items: content.items satisfies FaqAccordionItem[],
    bookingTitle: content.bookingTitle,
    formatLabel: content.formatLabel,
    formats: content.formats,
  };
};

export const getContactPageData = (locale: SiteLocale) => {
  const content = getDictionary(locale).pages.contact;

  return {
    banner: {
      ...content.banner,
      theme: "dark" as const,
      backgroundImage: "/legacy/images/Banner-Contact-1_1Banner Contact (1).webp",
      align: "center" as const,
    },
    introTitle: content.introTitle,
    introCopy: content.introCopy,
    formTitle: content.formTitle,
    contactLabels: content.contactLabels,
    officesTitle: content.officesTitle,
    officesCopy: content.officesCopy,
  };
};

export const getAppointmentPageData = (locale: SiteLocale) => {
  const content = getDictionary(locale).pages.appointment;

  return {
    banner: {
      ...content.banner,
      theme: "dark" as const,
      align: "center" as const,
    },
    formTitle: content.formTitle,
    formatLabel: content.formatLabel,
    formats: content.formats,
    faqs: content.faqs satisfies FaqAccordionItem[],
    faqImage: "/legacy/images/Appointmebt-Img_1Appointmebt Img.webp",
  };
};

export const officeGallery = [
  "/legacy/images/Office-1-1_1Office 1 (1).webp",
  "/legacy/images/Office-2-1_1Office 2 (1).webp",
  "/legacy/images/Office-3-1_1Office 3 (1).webp",
];
