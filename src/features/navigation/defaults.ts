import { getDictionary } from "@/features/i18n/translate";
import type { ManagedNavigation } from "@/features/navigation/types";

export const getDefaultNavigation = (): ManagedNavigation => {
  const dictionary = getDictionary();

  return {
    items: [
      {
        id: "home",
        systemKey: "home",
        lockDelete: true,
        lockHref: true,
        label: dictionary.nav.home,
        href: "/",
      },
      {
        id: "about",
        systemKey: "about",
        lockDelete: true,
        lockHref: true,
        label: dictionary.nav.about,
        href: "/o-nama/",
        children: [
          {
            id: "about-idea",
            systemKey: "about",
            lockDelete: true,
            lockHref: true,
            label: dictionary.nav.aboutLinks.about,
            href: "/o-nama/",
          },
          {
            id: "about-biography",
            systemKey: "biography",
            lockDelete: true,
            lockHref: true,
            label: dictionary.nav.aboutLinks.biography,
            href: "/biografija/nemanja-zajkeskovic/",
          },
        ],
      },
      {
        id: "psychotherapy",
        systemKey: "psychotherapy",
        lockDelete: true,
        lockHref: true,
        label: dictionary.nav.psychotherapy,
        href: "/psihoterapija/",
        children: [
          {
            id: "therapy-approach",
            systemKey: "psychotherapy",
            lockDelete: true,
            lockHref: true,
            label: dictionary.nav.therapyLinks.approach,
            href: "/psihoterapija/",
          },
          {
            id: "therapy-pricing",
            label: dictionary.nav.therapyLinks.pricing,
            href: "/cena/",
          },
          {
            id: "therapy-appointment",
            label: dictionary.nav.therapyLinks.appointment,
            href: "/zakazivanje/",
          },
        ],
      },
      {
        id: "blog",
        systemKey: "blog",
        lockDelete: true,
        lockHref: true,
        label: dictionary.nav.blog,
        href: "/blog/",
      },
      {
        id: "faq",
        systemKey: "faq",
        lockDelete: true,
        lockHref: true,
        label: dictionary.nav.faq,
        href: "/pitanja/",
      },
    ],
  };
};
