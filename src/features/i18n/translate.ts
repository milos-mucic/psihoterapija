import { srCyrl } from "@/features/i18n/dictionaries/sr-cyrl";
import { srLatn } from "@/features/i18n/dictionaries/sr-latn";
import type { SiteLocale } from "@/lib/config/site";

export const getDictionary = (locale: SiteLocale) => {
  return locale === "sr-cyrl" ? srCyrl : srLatn;
};
