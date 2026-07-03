import type { PageKey } from "@/features/page-content/types/page-content.types";

export const getPublicPageHref = (pageKey: PageKey) => {
  switch (pageKey) {
    case "home":
      return "/";
    case "about":
      return "/o-nama/";
    case "biography":
      return "/biografija/";
    case "psychotherapy":
      return "/psihoterapija/";
    case "scope":
      return "/psihoterapija/";
    case "services":
      return "/usluge/psihoterapija/";
    case "pricing":
      return "/cena/";
    case "appointment":
      return "/zakazivanje/";
    case "faq":
      return "/pitanja/";
    case "contact":
      return "/kontakt/";
    case "blog":
      return "/blog/";
  }
};

export const getAdminPreviewHref = (pageKey: PageKey, token?: string | null) => {
  const search = new URLSearchParams();

  if (token) {
    search.set("token", token);
  }

  const query = search.toString();
  return `/studio/ikar-portal-4f27b19a/preview/${pageKey}/${query ? `?${query}` : ""}`;
};
