import { SiteSettings, db, eq } from "astro:db";
import {
  DEFAULT_SITE_SETTINGS,
  SITE_SETTINGS_KEY,
  type SiteSettingsRecord,
  type BrandSettings,
  type FooterSettings,
  type ExtraSocialLink,
} from "@/features/site-settings/types/site-settings.types";

const isObject = (v: unknown): v is Record<string, unknown> =>
  typeof v === "object" && v !== null && !Array.isArray(v);

const str = (v: unknown, fallback = ""): string =>
  typeof v === "string" ? v : fallback;

const bool = (v: unknown, fallback = false): boolean =>
  typeof v === "boolean" ? v : fallback;

const parseSocialLink = (v: unknown): ExtraSocialLink | null => {
  if (!isObject(v)) return null;
  const platform = str(v.platform).trim();
  const label = str(v.label).trim();
  const href = str(v.href).trim();
  if (!platform || !label || !href) return null;
  return { platform, label, href };
};

const parseBrand = (raw: unknown): BrandSettings => {
  const v = isObject(raw) ? raw : {};
  return {
    name: str(v.name, DEFAULT_SITE_SETTINGS.brand.name),
    tagline: str(v.tagline, DEFAULT_SITE_SETTINGS.brand.tagline),
    logoLight: str(v.logoLight, DEFAULT_SITE_SETTINGS.brand.logoLight),
    logoDark: str(v.logoDark, DEFAULT_SITE_SETTINGS.brand.logoDark),
    hideLogo: bool(v.hideLogo, DEFAULT_SITE_SETTINGS.brand.hideLogo),
  };
};

const parseFooter = (raw: unknown): FooterSettings => {
  const v = isObject(raw) ? raw : {};
  const links = Array.isArray(v.extraSocialLinks)
    ? (v.extraSocialLinks
        .map(parseSocialLink)
        .filter((x): x is ExtraSocialLink => x !== null))
    : [];
  // Backward-compat: older saved records may have `logo` field; treat it as logoLight.
  const legacyLogo = str((v as { logo?: unknown }).logo);
  return {
    contactEyebrow: str(v.contactEyebrow, DEFAULT_SITE_SETTINGS.footer.contactEyebrow),
    brandHeading: str(v.brandHeading, DEFAULT_SITE_SETTINGS.footer.brandHeading),
    logoLight: str(v.logoLight, legacyLogo || DEFAULT_SITE_SETTINGS.footer.logoLight),
    logoDark: str(v.logoDark, DEFAULT_SITE_SETTINGS.footer.logoDark),
    hideLogo: bool(v.hideLogo, DEFAULT_SITE_SETTINGS.footer.hideLogo),
    extraSocialLinks: links,
    copyright: str(v.copyright, DEFAULT_SITE_SETTINGS.footer.copyright),
  };
};

const parseRecord = (raw: unknown): SiteSettingsRecord => {
  const v = isObject(raw) ? raw : {};
  return {
    brand: parseBrand(v.brand),
    footer: parseFooter(v.footer),
  };
};

export const siteSettingsService = {
  async get(): Promise<SiteSettingsRecord> {
    try {
      const rows = await db
        .select()
        .from(SiteSettings)
        .where(eq(SiteSettings.key, SITE_SETTINGS_KEY))
        .limit(1);
      const row = rows[0];
      if (!row) return DEFAULT_SITE_SETTINGS;
      return parseRecord(row.value);
    } catch {
      return DEFAULT_SITE_SETTINGS;
    }
  },

  async save(input: unknown): Promise<SiteSettingsRecord> {
    const parsed = parseRecord(input);
    const now = new Date();
    const existing = await db
      .select()
      .from(SiteSettings)
      .where(eq(SiteSettings.key, SITE_SETTINGS_KEY))
      .limit(1);
    if (existing.length > 0) {
      await db
        .update(SiteSettings)
        .set({ value: parsed, updatedAt: now })
        .where(eq(SiteSettings.key, SITE_SETTINGS_KEY));
    } else {
      await db.insert(SiteSettings).values({
        key: SITE_SETTINGS_KEY,
        value: parsed,
        updatedAt: now,
      });
    }
    return parsed;
  },
};
