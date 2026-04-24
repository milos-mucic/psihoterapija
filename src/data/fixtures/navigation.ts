import { localizePath } from "@/features/i18n/locale";
import { getDictionary } from "@/features/i18n/translate";
import type { SiteLocale } from "@/lib/config/site";

export const getNavigation = (locale: SiteLocale) => {
  const dictionary = getDictionary(locale);
  const biographyHref = localizePath(locale, "/biografija/nemanja-zajkeskovic/");

  return [
    { label: dictionary.nav.home, href: localizePath(locale, "/") },
    { label: dictionary.nav.about, href: localizePath(locale, "/o-nama/") },
    { label: dictionary.nav.psychotherapy, href: localizePath(locale, "/psihoterapija/") },
    { label: dictionary.nav.blog, href: localizePath(locale, "/blog/") },
    { label: dictionary.nav.faq, href: localizePath(locale, "/pitanja/") },
    { label: dictionary.nav.biography, href: biographyHref },
  ];
};
