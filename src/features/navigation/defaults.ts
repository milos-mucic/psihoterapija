import { localizePath } from "@/features/i18n/locale";
import { getDictionary } from "@/features/i18n/translate";
import type { SiteLocale } from "@/lib/config/site";
import type { ManagedNavigation } from "@/features/navigation/types";

export const getDefaultNavigation = (locale: SiteLocale): ManagedNavigation => {
  const dictionary = getDictionary(locale);

  return {
    items: [
      {
        id: "home",
        systemKey: "home",
        lockDelete: true,
        lockHref: true,
        label: dictionary.nav.home,
        href: localizePath(locale, "/"),
      },
      {
        id: "about",
        systemKey: "about",
        lockDelete: true,
        lockHref: true,
        label: dictionary.nav.about,
        href: localizePath(locale, "/o-nama/"),
        children: [
          {
            id: "about-idea",
            systemKey: "about",
            lockDelete: true,
            lockHref: true,
            label: dictionary.nav.aboutLinks.about,
            href: localizePath(locale, "/o-nama/"),
          },
          {
            id: "about-biography",
            systemKey: "biography",
            lockDelete: true,
            lockHref: true,
            label: dictionary.nav.aboutLinks.biography,
            href: localizePath(locale, "/biografija/nemanja-zajkeskovic/"),
          },
        ],
      },
      {
        id: "psychotherapy",
        systemKey: "psychotherapy",
        lockDelete: true,
        lockHref: true,
        label: dictionary.nav.psychotherapy,
        href: localizePath(locale, "/psihoterapija/"),
        children: [
          {
            id: "therapy-approach",
            systemKey: "psychotherapy",
            lockDelete: true,
            lockHref: true,
            label: dictionary.nav.therapyLinks.approach,
            href: localizePath(locale, "/psihoterapija/"),
          },
          {
            id: "therapy-pricing",
            label: dictionary.nav.therapyLinks.pricing,
            href: localizePath(locale, "/cena/"),
          },
          {
            id: "therapy-appointment",
            label: dictionary.nav.therapyLinks.appointment,
            href: localizePath(locale, "/zakazivanje/"),
          },
        ],
      },
      {
        id: "blog",
        systemKey: "blog",
        lockDelete: true,
        lockHref: true,
        label: dictionary.nav.blog,
        href: localizePath(locale, "/blog/"),
      },
      {
        id: "faq",
        systemKey: "faq",
        lockDelete: true,
        lockHref: true,
        label: dictionary.nav.faq,
        href: localizePath(locale, "/pitanja/"),
      },
    ],
  };
};
