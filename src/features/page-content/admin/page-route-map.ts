import { localizePath } from "@/features/i18n/locale";
import type { PageKey } from "@/features/page-content/types/page-content.types";
import type { SiteLocale } from "@/lib/config/site";

export const getPublicPageHref = (pageKey: PageKey, locale: SiteLocale) => {
  switch (pageKey) {
    case "home":
      return localizePath(locale, "/");
    case "about":
      return localizePath(locale, "/o-nama/");
    case "biography":
      return localizePath(locale, "/biografija/");
    case "psychotherapy":
      return localizePath(locale, "/psihoterapija/");
    case "scope":
      return localizePath(locale, "/oblast-rada/");
    case "pricing":
      return localizePath(locale, "/cena/");
    case "appointment":
      return localizePath(locale, "/zakazivanje/");
    case "faq":
      return localizePath(locale, "/pitanja/");
    case "contact":
      return localizePath(locale, "/kontakt/");
    case "blog":
      return localizePath(locale, "/blog/");
  }
};

export const getAdminPreviewHref = (
  pageKey: PageKey,
  locale: SiteLocale,
  token?: string | null,
) => {
  const search = new URLSearchParams();
  search.set("locale", locale);

  if (token) {
    search.set("token", token);
  }

  return `/studio/ikar-portal-4f27b19a/preview/${pageKey}/?${search.toString()}`;
};
