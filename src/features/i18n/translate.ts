import srCyrl from "@/features/i18n/dictionaries/sr-cyrl.json";
import srLatn from "@/features/i18n/dictionaries/sr-latn.json";
import type { SiteLocale } from "@/lib/config/site";

export type Dictionary = typeof srLatn;

export const getDictionary = (locale: SiteLocale) => {
  return locale === "sr-cyrl" ? srCyrl : srLatn;
};
