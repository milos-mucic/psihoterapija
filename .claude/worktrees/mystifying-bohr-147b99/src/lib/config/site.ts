export const siteConfig = {
  name: "Psihoterapijski kabinet Ikar",
  description:
    "Savremeni sajt za psihoterapijski kabinet sa marketing stranicama, blogom i skrivenim admin segmentom.",
  defaultLocale: "sr-latn" as const,
  locales: ["sr-latn", "sr-cyrl"] as const,
  adminPath: "/studio/ikar-portal-4f27b19a",
  contactEmail: "kontakt@ikar.rs",
  contactPhone: "+381 60 123 4567",
};

export type SiteLocale = (typeof siteConfig.locales)[number];
