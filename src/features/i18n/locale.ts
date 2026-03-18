import { siteConfig, type SiteLocale } from "@/lib/config/site";

export const isLocale = (value: string): value is SiteLocale => {
  return siteConfig.locales.includes(value as SiteLocale);
};

export const getLocalePrefix = (locale: SiteLocale) => {
  return locale === "sr-cyrl" ? "/cir" : "";
};

export const getLocaleFromPathname = (pathname: string): SiteLocale => {
  return pathname.startsWith("/cir") ? "sr-cyrl" : siteConfig.defaultLocale;
};

export const localizePath = (locale: SiteLocale, path: string) => {
  const normalized = path.startsWith("/") ? path : `/${path}`;
  const prefix = getLocalePrefix(locale);
  return normalized === "/" ? `${prefix}/`.replace("//", "/") : `${prefix}${normalized}`;
};
