import type { APIRoute } from "astro";
import { requireAdminApiAuth } from "@/features/admin/auth/admin-api-auth";
import { siteSettingsService } from "@/features/site-settings/services/site-settings.service";
import { adminConfig } from "@/lib/config/admin";

const parseBool = (value: unknown) =>
  value === "1" || value === "true" || value === true || value === "on";

const parseSocialLinks = (form: FormData) => {
  const map = new Map<string, { platform?: string; label?: string; href?: string }>();
  for (const [key, val] of form.entries()) {
    if (typeof val !== "string") continue;
    const m = key.match(/^extraSocialLinks\[(\d+)\]\[(platform|label|href)\]$/);
    if (!m) continue;
    const [, idx, field] = m;
    const slot = map.get(idx) ?? {};
    slot[field as "platform" | "label" | "href"] = val.trim();
    map.set(idx, slot);
  }
  return [...map.entries()]
    .sort(([a], [b]) => Number(a) - Number(b))
    .map(([, slot]) => slot)
    .filter((s) => s.platform && s.label && s.href);
};

const SECTIONS = ["header", "footer", "all"] as const;
type Section = (typeof SECTIONS)[number];

const REDIRECTS: Record<Section, { saved: string; error: string }> = {
  header: {
    saved: `${adminConfig.basePath}/site/header/?saved=1`,
    error: `${adminConfig.basePath}/site/header/?error=1`,
  },
  footer: {
    saved: `${adminConfig.basePath}/site/footer/?saved=1`,
    error: `${adminConfig.basePath}/site/footer/?error=1`,
  },
  all: {
    saved: `${adminConfig.basePath}/site/header/?saved=1`,
    error: `${adminConfig.basePath}/site/header/?error=1`,
  },
};

export const POST: APIRoute = async (context) => {
  const authError = requireAdminApiAuth(context);
  if (authError) return authError;

  const form = await context.request.formData();
  const sectionRaw = String(form.get("section") ?? "all");
  const section: Section = (SECTIONS as readonly string[]).includes(sectionRaw)
    ? (sectionRaw as Section)
    : "all";

  // Start from current settings, overlay only the submitted section(s).
  const current = await siteSettingsService.get();
  const payload = {
    brand: { ...current.brand },
    footer: { ...current.footer },
  };

  if (section === "header" || section === "all") {
    payload.brand = {
      name: String(form.get("brand.name") ?? "").trim(),
      tagline: String(form.get("brand.tagline") ?? "").trim(),
      logoLight: String(form.get("brand.logoLight") ?? "").trim(),
      logoDark: String(form.get("brand.logoDark") ?? "").trim(),
      hideLogo: parseBool(form.get("brand.hideLogo")),
    };
  }

  if (section === "footer" || section === "all") {
    payload.footer = {
      contactEyebrow: String(form.get("footer.contactEyebrow") ?? "").trim(),
      brandHeading: String(form.get("footer.brandHeading") ?? "").trim(),
      logoLight: String(form.get("footer.logoLight") ?? "").trim(),
      logoDark: String(form.get("footer.logoDark") ?? "").trim(),
      hideLogo: parseBool(form.get("footer.hideLogo")),
      copyright: String(form.get("footer.copyright") ?? "").trim(),
      extraSocialLinks: parseSocialLinks(form),
    };
  }

  try {
    await siteSettingsService.save(payload);
    return context.redirect(REDIRECTS[section].saved);
  } catch (error) {
    console.error(error);
    return context.redirect(REDIRECTS[section].error);
  }
};
