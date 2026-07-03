import { getDictionary } from "@/features/i18n/translate";

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

export const getNavigation = (): NavItem[] => {
  const dictionary = getDictionary();
  const biographyHref = "/biografija/nemanja-zajkeskovic/";
  const aboutHref = "/o-nama/";

  return [
    { label: dictionary.nav.home, href: "/" },
    {
      label: dictionary.nav.about,
      href: aboutHref,
      children: [
        { label: dictionary.nav.aboutLinks.about, href: aboutHref },
        { label: dictionary.nav.aboutLinks.biography, href: biographyHref },
      ],
    },
    { label: dictionary.nav.psychotherapy, href: "/psihoterapija/" },
    { label: dictionary.nav.blog, href: "/blog/" },
    { label: dictionary.nav.faq, href: "/pitanja/" },
  ];
};
