import { localizePath } from "@/features/i18n/locale";
import { getDictionary } from "@/features/i18n/translate";
import type { SiteLocale } from "@/lib/config/site";

type LinkCard = {
  title: string;
  copy: string;
  href: string;
  label: string;
};

type HomeServiceCard = LinkCard & {
  image: string;
};

export type HomePageData = {
  hero: {
    titleHtml: string;
    description: string;
    primaryAction: { href: string; label: string };
    secondaryAction: { href: string; label: string };
  };
  prompt: {
    title: string;
    copy: string;
    href: string;
    label: string;
  };
  about: {
    title: string;
    paragraphs: string[];
    bullets: string[];
    href: string;
    label: string;
    image: string;
  };
  services: {
    title: string;
    copy: string;
    items: HomeServiceCard[];
  };
  promo: {
    title: string;
    href: string;
    label: string;
    image: string;
  };
  themes: {
    title: string;
    items: LinkCard[];
  };
  reasons: {
    title: string;
    copy: string;
    items: LinkCard[];
    videoHref: string;
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
    href: string;
    label: string;
    empty: string;
  };
};

export const getHomePageData = (locale: SiteLocale): HomePageData => {
  const content = getDictionary(locale).homePage;

  return {
    hero: {
      titleHtml: content.hero.titleHtml,
      description: content.hero.description,
      primaryAction: {
        href: localizePath(locale, "/zakazivanje/"),
        label: content.hero.primaryActionLabel,
      },
      secondaryAction: {
        href: localizePath(locale, "/o-nama/"),
        label: content.hero.secondaryActionLabel,
      },
    },
    prompt: {
      title: content.prompt.title,
      copy: content.prompt.copy,
      href: localizePath(locale, "/kontakt/"),
      label: content.prompt.label,
    },
    about: {
      title: content.about.title,
      paragraphs: content.about.paragraphs,
      bullets: content.about.bullets,
      href: localizePath(locale, "/o-nama/"),
      label: content.about.label,
      image: "/legacy/images/Doctor--1_1Doctor  (1).webp",
    },
    services: {
      title: content.services.title,
      copy: content.services.copy,
      items: [
        {
          ...content.services.items[0],
          href: localizePath(locale, "/psihoterapija/"),
          image: "/legacy/images/White-Icon-2.png",
        },
        {
          ...content.services.items[2],
          href: localizePath(locale, "/zakazivanje/"),
          image: "/legacy/images/White-Icon-1.png",
        },
      ],
    },
    promo: {
      title: content.promo.title,
      href: localizePath(locale, "/kontakt/"),
      label: content.promo.label,
      image: "/legacy/images/Appointmebt-Img_1Appointmebt Img.webp",
    },
    themes: {
      title: content.themes.title,
      items: [
        { ...content.themes.items[0], href: localizePath(locale, "/psihoterapija/") },
        { ...content.themes.items[1], href: localizePath(locale, "/kontakt/") },
        { ...content.themes.items[2], href: localizePath(locale, "/zakazivanje/") },
      ],
    },
    reasons: {
      title: content.reasons.title,
      copy: content.reasons.copy,
      items: [
        { ...content.reasons.items[0], href: localizePath(locale, "/psihoterapija/") },
        { ...content.reasons.items[1], href: localizePath(locale, "/faq/") },
        { ...content.reasons.items[2], href: localizePath(locale, "/kontakt/") },
      ],
      videoHref: "https://www.youtube.com/watch?v=KGg5cIjHQiw",
      videoImage: "/legacy/images/Video-Home-3-BG_1Video Home 3 BG.webp",
      videoLabel: content.reasons.videoLabel,
    },
    booking: {
      title: content.booking.title,
      copy: content.booking.copy,
      formatLabel: content.booking.formatLabel,
      formats: content.booking.formats,
    },
    recent: {
      title: content.recent.title,
      copy: content.recent.copy,
      href: localizePath(locale, "/blog/"),
      label: content.recent.label,
      empty: content.recent.empty,
    },
  };
};
