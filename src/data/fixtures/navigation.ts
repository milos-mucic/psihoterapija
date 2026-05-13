import { localizePath } from "@/features/i18n/locale";
import { getDictionary } from "@/features/i18n/translate";
import type { SiteLocale } from "@/lib/config/site";

export type NavLeaf = {
  label: string;
  href: string;
};

export type NavGroup = {
  label: string;
  href: string;
  children: NavLeaf[];
};

export type NavItem = NavLeaf | NavGroup;

export const isNavGroup = (item: NavItem): item is NavGroup =>
  "children" in item && Array.isArray((item as NavGroup).children);

export const getNavigation = (locale: SiteLocale): NavItem[] => {
  const dictionary = getDictionary(locale);
  const biographyHref = localizePath(locale, "/biografija/nemanja-zajkeskovic/");
  const aboutHref = localizePath(locale, "/o-nama/");

  return [
    { label: dictionary.nav.home, href: localizePath(locale, "/") },
    {
      label: dictionary.nav.about,
      href: aboutHref,
      children: [
        { label: dictionary.nav.aboutLinks.about, href: aboutHref },
        { label: dictionary.nav.aboutLinks.biography, href: biographyHref },
      ],
    },
    { label: dictionary.nav.psychotherapy, href: localizePath(locale, "/psihoterapija/") },
    { label: dictionary.nav.blog, href: localizePath(locale, "/blog/") },
    { label: dictionary.nav.faq, href: localizePath(locale, "/pitanja/") },
  ];
};
