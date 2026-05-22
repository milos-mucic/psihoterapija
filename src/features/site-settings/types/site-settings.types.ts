export type BrandSettings = {
  /** Text shown next to the logo. If empty, only the logo image is rendered. */
  name: string;
  /** Smaller secondary line under or after the brand name. */
  tagline: string;
  /** Image URL for use on light backgrounds (appbar default). */
  logoLight: string;
  /** Image URL for use on dark backgrounds (appbar scrolled, footer). */
  logoDark: string;
  /** Hide the logo image entirely (text-only brand). */
  hideLogo: boolean;
};

export type ExtraSocialLink = {
  platform: string;
  label: string;
  href: string;
};

export type FooterSettings = {
  /** Eyebrow above the CTA in the footer ("Pišite nam"). */
  contactEyebrow: string;
  /** Big footer heading. Falls back to brand name when empty. */
  brandHeading: string;
  /** Logo shown when the footer has a dark background (currently the default). */
  logoLight: string;
  /** Logo shown when the footer has a light background. */
  logoDark: string;
  /** Hide the footer logo entirely. */
  hideLogo: boolean;
  /** Extra social links shown in the footer (in addition to any from Contact page). */
  extraSocialLinks: ExtraSocialLink[];
  /** Copyright text shown at the very bottom (left side). */
  copyright: string;
};

export type SiteSettingsRecord = {
  brand: BrandSettings;
  footer: FooterSettings;
};

export const SITE_SETTINGS_KEY = "default";

export const DEFAULT_SITE_SETTINGS: SiteSettingsRecord = {
  brand: {
    name: "",
    tagline: "",
    logoLight: "/legacy/images/Logo-White.svg",
    logoDark: "/legacy/images/Logo-Dark.svg",
    hideLogo: false,
  },
  footer: {
    contactEyebrow: "",
    brandHeading: "",
    logoLight: "",
    logoDark: "",
    hideLogo: false,
    extraSocialLinks: [],
    copyright: "",
  },
};
