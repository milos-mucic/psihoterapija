import { getDictionary } from "@/features/i18n/translate";
import { sanitizeInlineRichTextHtml, sanitizeRichTextHtml } from "@/features/blog/utils/rich-text";
import type { HomePageManagedContent } from "@/features/page-content/types/page-content.types";

type LinkCard = {
  title: string;
  copy: string;
  href?: string;
  label?: string;
};

type HomeServiceCard = LinkCard & {
  image: string;
};

type HomeThemeCard = LinkCard & {
  image: string;
};

export type HomePageData = {
  seo: {
    title: string;
    description: string;
  };
  hiddenBlocks: string[];
  blockBackgrounds: Record<string, string>;
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
    body: string;
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
    items: HomeThemeCard[];
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

const toParagraphHtml = (value: string) => sanitizeRichTextHtml(value);

const ensureServiceItems = (
  items: HomePageManagedContent["services"]["items"],
) => {
  const dictionaryItems = getDictionary().homePage.services.items;
  const defaultImages = [
    "/legacy/images/White-Icon-2.png",
    "/legacy/images/mirrored/logo-service-3.png",
    "/legacy/images/White-Icon-1.png",
  ];

  return Array.from({ length: 3 }, (_, index) => ({
    title: items[index]?.title ?? dictionaryItems[index]?.title ?? "",
    copy:
      items[index]?.copy ??
      toParagraphHtml(dictionaryItems[index]?.copy ?? ""),
    image: items[index]?.image ?? defaultImages[index] ?? defaultImages[0],
  }));
};

const toCombinedRichTextHtml = (paragraphs: string[], bullets: string[]) => {
  const paragraphHtml = paragraphs.map((paragraph) => `<p>${paragraph}</p>`).join("");
  const listHtml =
    bullets.length > 0 ? `<ul>${bullets.map((bullet) => `<li>${bullet}</li>`).join("")}</ul>` : "";

  return sanitizeRichTextHtml(`${paragraphHtml}${listHtml}`);
};

export const getDefaultHomePageManagedContent = (): HomePageManagedContent => {
  const content = getDictionary().homePage;
  const dictionary = getDictionary();

  return {
    seo: {
      title: dictionary.meta.home.title,
      description: dictionary.meta.home.description,
    },
    hero: {
      titleHtml: sanitizeInlineRichTextHtml(content.hero.titleHtml),
      description: toParagraphHtml(content.hero.description),
      primaryActionLabel: content.hero.primaryActionLabel,
      secondaryActionLabel: content.hero.secondaryActionLabel,
    },
    prompt: {
      title: content.prompt.title,
      copy: toParagraphHtml(content.prompt.copy),
      label: content.prompt.label,
    },
    about: {
      title: content.about.title,
      body: toCombinedRichTextHtml(content.about.paragraphs, content.about.bullets),
      label: content.about.label,
      image: "/legacy/images/Doctor--1_1Doctor  (1).webp",
    },
    services: {
      title: content.services.title,
      copy: toParagraphHtml(content.services.copy),
      items: ensureServiceItems([
        {
          title: content.services.items[0].title,
          copy: toParagraphHtml(content.services.items[0].copy),
          image: "/legacy/images/White-Icon-2.png",
        },
        {
          title: content.services.items[1].title,
          copy: toParagraphHtml(content.services.items[1].copy),
          image: "/legacy/images/mirrored/logo-service-3.png",
        },
        {
          title: content.services.items[2].title,
          copy: toParagraphHtml(content.services.items[2].copy),
          image: "/legacy/images/White-Icon-1.png",
        },
      ]),
    },
    themes: {
      title: content.themes.title,
      items: [
        {
          title: content.themes.items[0].title,
          copy: toParagraphHtml(content.themes.items[0].copy),
          label: content.themes.items[0].label,
          image: "/legacy/images/Service-Img-2.png",
        },
        {
          title: content.themes.items[1].title,
          copy: toParagraphHtml(content.themes.items[1].copy),
          label: content.themes.items[1].label,
          image: "/legacy/images/Session-Img-2.png",
        },
        {
          title: content.themes.items[2].title,
          copy: toParagraphHtml(content.themes.items[2].copy),
          label: content.themes.items[2].label,
          image: "/legacy/images/Service-Img-3.png",
        },
      ],
    },
    reasons: {
      title: content.reasons.title,
      copy: toParagraphHtml(content.reasons.copy),
      items: [
        { ...content.reasons.items[0], copy: toParagraphHtml(content.reasons.items[0].copy) },
        { ...content.reasons.items[1], copy: toParagraphHtml(content.reasons.items[1].copy) },
        { ...content.reasons.items[2], copy: toParagraphHtml(content.reasons.items[2].copy) },
      ],
      videoUrl: "https://www.youtube.com/watch?v=KGg5cIjHQiw",
      videoImage: "/legacy/images/Video-Home-3-BG_1Video Home 3 BG.webp",
      videoLabel: content.reasons.videoLabel,
    },
    booking: {
      title: content.booking.title,
      copy: toParagraphHtml(content.booking.copy),
      formatLabel: content.booking.formatLabel,
      formats: content.booking.formats,
    },
    recent: {
      title: content.recent.title,
      copy: toParagraphHtml(content.recent.copy),
      label: content.recent.label,
      empty: content.recent.empty,
    },
  };
};

export const buildHomePageData = (
  content: HomePageManagedContent,
): HomePageData => {
  const dictionary = getDictionary();
  const serviceItems = ensureServiceItems(content.services.items);

  return {
    seo: content.seo,
    hiddenBlocks: content.hiddenBlocks ?? [],
    blockBackgrounds: content.blockBackgrounds ?? {},
    hero: {
      titleHtml: content.hero.titleHtml,
      description: content.hero.description,
      primaryAction: {
        href: "/zakazivanje/",
        label: content.hero.primaryActionLabel,
      },
      secondaryAction: {
        href: "/o-nama/",
        label: content.hero.secondaryActionLabel,
      },
    },
    prompt: {
      title: content.prompt.title,
      copy: content.prompt.copy,
      href: "/kontakt/",
      label: content.prompt.label,
    },
    about: {
      title: content.about.title,
      body: content.about.body,
      href: "/biografija/nemanja-zajkeskovic/",
      label: content.about.label,
      image: content.about.image,
    },
    services: {
      title: content.services.title,
      copy: content.services.copy,
      items: [
        {
          ...serviceItems[0],
          href: "/usluge/psihoterapija/",
          label: dictionary.homePage.services.items[0].label,
        },
        {
          ...serviceItems[1],
          href: "/usluge/psiholosko-savetovanje/",
          label: dictionary.homePage.services.items[1].label,
        },
        {
          ...serviceItems[2],
          href: "/usluge/konsultacije/",
          label: dictionary.homePage.services.items[2].label,
        },
      ],
    },
    promo: {
      title: dictionary.homePage.promo.title,
      href: "/kontakt/",
      label: dictionary.homePage.promo.label,
      image: "/legacy/images/Appointmebt-Img_1Appointmebt Img.webp",
    },
    themes: {
      title: content.themes.title,
      items: [
        {
          ...content.themes.items[0],
          href: "/psihoterapija/#tema-anksiozna-stanja",
        },
        {
          ...content.themes.items[1],
          href: "/psihoterapija/#tema-poremecaji-licnosti",
        },
        {
          ...content.themes.items[2],
          href: "/psihoterapija/#tema-traume",
        },
      ],
    },
    reasons: {
      title: content.reasons.title,
      copy: content.reasons.copy,
      items: [
        { ...content.reasons.items[0], href: "/psihoterapija/" },
        { ...content.reasons.items[1], href: "/pitanja/" },
        { ...content.reasons.items[2], href: "/kontakt/" },
      ],
      videoHref: content.reasons.videoUrl,
      videoImage: content.reasons.videoImage,
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
      href: "/blog/",
      label: content.recent.label,
      empty: content.recent.empty,
    },
  };
};

export const getHomePageData = (): HomePageData =>
  buildHomePageData(getDefaultHomePageManagedContent());
