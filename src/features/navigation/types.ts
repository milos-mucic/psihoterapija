export type NavSystemKey =
  | "home"
  | "about"
  | "biography"
  | "psychotherapy"
  | "blog"
  | "faq";

export type ManagedNavChild = {
  id: string;
  label: string;
  href: string;
  systemKey?: NavSystemKey;
  lockDelete?: boolean;
  lockHref?: boolean;
};

export type ManagedNavItem = ManagedNavChild & {
  children?: ManagedNavChild[];
};

export type ManagedNavigation = {
  items: ManagedNavItem[];
};
