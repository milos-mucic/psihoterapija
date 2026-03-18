import { localizePath } from "@/features/i18n/locale";
import type { SiteLocale } from "@/lib/config/site";

export const getNavigation = (locale: SiteLocale) => [
  { label: "Pocetna", href: localizePath(locale, "/") },
  { label: locale === "sr-cyrl" ? "О нама" : "O nama", href: localizePath(locale, "/o-nama/") },
  {
    label: locale === "sr-cyrl" ? "Психотерапија" : "Psihoterapija",
    href: localizePath(locale, "/psihoterapija/"),
  },
  { label: locale === "sr-cyrl" ? "Блог" : "Blog", href: localizePath(locale, "/blog/") },
  { label: "FAQ", href: localizePath(locale, "/faq/") },
  { label: locale === "sr-cyrl" ? "Контакт" : "Kontakt", href: localizePath(locale, "/kontakt/") },
];
