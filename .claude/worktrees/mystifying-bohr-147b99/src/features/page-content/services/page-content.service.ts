import { buildHomePageData, getDefaultHomePageManagedContent } from "@/data/fixtures/home";
import {
  buildAboutPageData,
  buildAppointmentPageData,
  buildBlogIndexPageData,
  buildBiographyPageData,
  buildBiographyDetailPageData,
  buildContactPageData,
  buildFaqPageData,
  buildPricingPageData,
  buildPsychotherapyPageData,
  buildScopeDetailPageData,
  buildScopePageData,
  getDefaultAboutPageManagedContent,
  getDefaultAppointmentPageManagedContent,
  getDefaultBlogIndexPageManagedContent,
  getDefaultBiographyPageManagedContent,
  getDefaultContactPageManagedContent,
  getDefaultFaqPageManagedContent,
  getDefaultPricingPageManagedContent,
  getDefaultPsychotherapyPageManagedContent,
  getDefaultScopePageManagedContent,
} from "@/data/fixtures/managed-pages";
import { AstroDbPageContentRepository } from "@/features/page-content/repositories/astro-db-page-content.repository";
import {
  parseAboutPageManagedContent,
  parseAboutPageManagedContentForm,
  parseAppointmentPageManagedContent,
  parseAppointmentPageManagedContentForm,
  parseBlogIndexPageManagedContent,
  parseBlogIndexPageManagedContentForm,
  parseBiographyPageManagedContent,
  parseBiographyPageManagedContentForm,
  parseContactPageManagedContent,
  parseContactPageManagedContentForm,
  parseFaqPageManagedContent,
  parseFaqPageManagedContentForm,
  parsePricingPageManagedContent,
  parsePricingPageManagedContentForm,
  parsePsychotherapyPageManagedContent,
  parsePsychotherapyPageManagedContentForm,
  parseScopePageManagedContent,
  parseScopePageManagedContentForm,
} from "@/features/page-content/schemas/managed-pages.schema";
import {
  parseHomePageManagedContent,
  parseHomePageManagedContentForm,
} from "@/features/page-content/schemas/home-page.schema";
import type {
  AboutPageManagedContent,
  AnyManagedPageContent,
  AppointmentPageManagedContent,
  BlogIndexPageManagedContent,
  BiographyPageManagedContent,
  ContactPageManagedContent,
  FaqPageManagedContent,
  HomePageManagedContent,
  ManagedPageContentMap,
  PageKey,
  PricingPageManagedContent,
  PsychotherapyPageManagedContent,
  ScopePageManagedContent,
} from "@/features/page-content/types/page-content.types";
import type { SiteLocale } from "@/lib/config/site";
import { pagePreviewService } from "@/features/page-content/services/page-preview.service";

const repository = new AstroDbPageContentRepository();

const parseManagedPageContentForm = <TPageKey extends PageKey>(
  pageKey: TPageKey,
  input: unknown,
): ManagedPageContentMap[TPageKey] => {
  switch (pageKey) {
    case "home":
      return parseHomePageManagedContentForm(input) as ManagedPageContentMap[TPageKey];
    case "about":
      return parseAboutPageManagedContentForm(input) as ManagedPageContentMap[TPageKey];
    case "biography":
      return parseBiographyPageManagedContentForm(input) as ManagedPageContentMap[TPageKey];
    case "psychotherapy":
      return parsePsychotherapyPageManagedContentForm(input) as ManagedPageContentMap[TPageKey];
    case "scope":
      return parseScopePageManagedContentForm(input) as ManagedPageContentMap[TPageKey];
    case "pricing":
      return parsePricingPageManagedContentForm(input) as ManagedPageContentMap[TPageKey];
    case "appointment":
      return parseAppointmentPageManagedContentForm(input) as ManagedPageContentMap[TPageKey];
    case "faq":
      return parseFaqPageManagedContentForm(input) as ManagedPageContentMap[TPageKey];
    case "contact":
      return parseContactPageManagedContentForm(input) as ManagedPageContentMap[TPageKey];
    case "blog":
      return parseBlogIndexPageManagedContentForm(input) as ManagedPageContentMap[TPageKey];
  }
};

const buildManagedPageData = <TPageKey extends PageKey>(
  pageKey: TPageKey,
  locale: SiteLocale,
  content: ManagedPageContentMap[TPageKey],
) => {
  switch (pageKey) {
    case "home":
      return buildHomePageData(locale, content as HomePageManagedContent);
    case "about":
      return buildAboutPageData(locale, content as AboutPageManagedContent);
    case "biography":
      return buildBiographyPageData(locale, content as BiographyPageManagedContent);
    case "psychotherapy":
      return buildPsychotherapyPageData(locale, content as PsychotherapyPageManagedContent);
    case "scope":
      return buildScopePageData(locale, content as ScopePageManagedContent);
    case "pricing":
      return buildPricingPageData(locale, content as PricingPageManagedContent);
    case "appointment":
      return buildAppointmentPageData(locale, content as AppointmentPageManagedContent);
    case "faq":
      return buildFaqPageData(locale, content as FaqPageManagedContent);
    case "contact":
      return buildContactPageData(locale, content as ContactPageManagedContent);
    case "blog":
      return buildBlogIndexPageData(locale, content as BlogIndexPageManagedContent);
  }
};

const getPreviewManagedContent = <TPageKey extends PageKey>(
  pageKey: TPageKey,
  locale: SiteLocale,
  token?: string | null,
): ManagedPageContentMap[TPageKey] | undefined => {
  const entry = pagePreviewService.getDraft(token, pageKey, locale);
  return entry?.content as ManagedPageContentMap[TPageKey] | undefined;
};

const getStoredHomeContent = async (locale: SiteLocale) => {
  const record = await repository.get("home", locale);

  if (!record) {
    return undefined;
  }

  try {
    return parseHomePageManagedContent(record.content);
  } catch {
    return undefined;
  }
};

export const pageContentService = {
  parsePageContentForm<TPageKey extends PageKey>(pageKey: TPageKey, input: unknown) {
    return parseManagedPageContentForm(pageKey, input);
  },
  async listStoredPageContentRecords() {
    return repository.listAll();
  },
  async getManagedPageContent<TPageKey extends PageKey>(
    pageKey: TPageKey,
    locale: SiteLocale,
  ): Promise<ManagedPageContentMap[TPageKey]> {
    switch (pageKey) {
      case "home":
        return (await this.getManagedHomeContent(locale)) as ManagedPageContentMap[TPageKey];
      case "about":
        return (await this.getManagedAboutContent(locale)) as ManagedPageContentMap[TPageKey];
      case "biography":
        return (await this.getManagedBiographyContent(locale)) as ManagedPageContentMap[TPageKey];
      case "psychotherapy":
        return (await this.getManagedPsychotherapyContent(
          locale,
        )) as ManagedPageContentMap[TPageKey];
      case "scope":
        return (await this.getManagedScopeContent(locale)) as ManagedPageContentMap[TPageKey];
      case "pricing":
        return (await this.getManagedPricingContent(locale)) as ManagedPageContentMap[TPageKey];
      case "appointment":
        return (await this.getManagedAppointmentContent(locale)) as ManagedPageContentMap[TPageKey];
      case "faq":
        return (await this.getManagedFaqContent(locale)) as ManagedPageContentMap[TPageKey];
      case "contact":
        return (await this.getManagedContactContent(locale)) as ManagedPageContentMap[TPageKey];
      case "blog":
        return (await this.getManagedBlogIndexContent(locale)) as ManagedPageContentMap[TPageKey];
    }
  },
  savePreviewDraft<TPageKey extends PageKey>(
    pageKey: TPageKey,
    locale: SiteLocale,
    input: unknown,
    currentToken?: string,
  ) {
    const content = parseManagedPageContentForm(pageKey, input);
    return pagePreviewService.saveDraft(
      pageKey,
      locale,
      content as AnyManagedPageContent,
      currentToken,
    );
  },
  async getPreviewPageData<TPageKey extends PageKey>(
    pageKey: TPageKey,
    locale: SiteLocale,
    token?: string | null,
  ) {
    const previewContent = getPreviewManagedContent(pageKey, locale, token);

    if (previewContent) {
      return buildManagedPageData(pageKey, locale, previewContent);
    }

    switch (pageKey) {
      case "home":
        return await this.getHomePageData(locale);
      case "about":
        return await this.getAboutPageData(locale);
      case "biography":
        return await this.getBiographyPageData(locale);
      case "psychotherapy":
        return await this.getPsychotherapyPageData(locale);
      case "scope":
        return await this.getScopePageData(locale);
      case "pricing":
        return await this.getPricingPageData(locale);
      case "appointment":
        return await this.getAppointmentPageData(locale);
      case "faq":
        return await this.getFaqPageData(locale);
      case "contact":
        return await this.getContactPageData(locale);
      case "blog":
        return await this.getBlogIndexPageData(locale);
    }
  },
  async getManagedHomeContent(locale: SiteLocale): Promise<HomePageManagedContent> {
    const stored = await getStoredHomeContent(locale);
    return stored ?? getDefaultHomePageManagedContent(locale);
  },
  async getHomePageData(locale: SiteLocale) {
    const content = await this.getManagedHomeContent(locale);
    return buildHomePageData(locale, content);
  },
  async updateHomeContent(locale: SiteLocale, input: unknown) {
    const content = parseHomePageManagedContentForm(input);
    await repository.upsert("home", locale, content);
    pagePreviewService.clearDrafts("home", locale);
    return content;
  },
  async getManagedAboutContent(locale: SiteLocale): Promise<AboutPageManagedContent> {
    const record = await repository.get("about", locale);

    if (!record) {
      return getDefaultAboutPageManagedContent(locale);
    }

    try {
      return parseAboutPageManagedContent(record.content);
    } catch {
      return getDefaultAboutPageManagedContent(locale);
    }
  },
  async getAboutPageData(locale: SiteLocale) {
    return buildAboutPageData(locale, await this.getManagedAboutContent(locale));
  },
  async updateAboutContent(locale: SiteLocale, input: unknown) {
    const content = parseAboutPageManagedContentForm(input);
    await repository.upsert("about", locale, content);
    pagePreviewService.clearDrafts("about", locale);
    return content;
  },
  async getManagedBiographyContent(locale: SiteLocale): Promise<BiographyPageManagedContent> {
    const record = await repository.get("biography", locale);

    if (!record) {
      return getDefaultBiographyPageManagedContent(locale);
    }

    try {
      return parseBiographyPageManagedContent(record.content);
    } catch {
      return getDefaultBiographyPageManagedContent(locale);
    }
  },
  async getBiographyPageData(locale: SiteLocale) {
    return buildBiographyPageData(locale, await this.getManagedBiographyContent(locale));
  },
  async getBiographyProfilePageData(locale: SiteLocale, slug: string) {
    return buildBiographyDetailPageData(
      locale,
      await this.getManagedBiographyContent(locale),
      slug,
    );
  },
  async updateBiographyContent(locale: SiteLocale, input: unknown) {
    const content = parseBiographyPageManagedContentForm(input);
    await repository.upsert("biography", locale, content);
    pagePreviewService.clearDrafts("biography", locale);
    return content;
  },
  async getManagedPsychotherapyContent(
    locale: SiteLocale,
  ): Promise<PsychotherapyPageManagedContent> {
    const record = await repository.get("psychotherapy", locale);

    if (!record) {
      return getDefaultPsychotherapyPageManagedContent(locale);
    }

    try {
      return parsePsychotherapyPageManagedContent(record.content);
    } catch {
      return getDefaultPsychotherapyPageManagedContent(locale);
    }
  },
  async getPsychotherapyPageData(locale: SiteLocale) {
    return buildPsychotherapyPageData(locale, await this.getManagedPsychotherapyContent(locale));
  },
  async updatePsychotherapyContent(locale: SiteLocale, input: unknown) {
    const content = parsePsychotherapyPageManagedContentForm(input);
    await repository.upsert("psychotherapy", locale, content);
    pagePreviewService.clearDrafts("psychotherapy", locale);
    return content;
  },
  async getManagedScopeContent(locale: SiteLocale): Promise<ScopePageManagedContent> {
    const record = await repository.get("scope", locale);

    if (!record) {
      return getDefaultScopePageManagedContent(locale);
    }

    try {
      return parseScopePageManagedContent(record.content);
    } catch {
      return getDefaultScopePageManagedContent(locale);
    }
  },
  async getScopePageData(locale: SiteLocale) {
    return buildScopePageData(locale, await this.getManagedScopeContent(locale));
  },
  async getScopeDetailPageData(locale: SiteLocale, slug: string) {
    return buildScopeDetailPageData(locale, await this.getManagedScopeContent(locale), slug);
  },
  async updateScopeContent(locale: SiteLocale, input: unknown) {
    const content = parseScopePageManagedContentForm(input);
    await repository.upsert("scope", locale, content);
    pagePreviewService.clearDrafts("scope", locale);
    return content;
  },
  async getManagedPricingContent(locale: SiteLocale): Promise<PricingPageManagedContent> {
    const record = await repository.get("pricing", locale);

    if (!record) {
      return getDefaultPricingPageManagedContent(locale);
    }

    try {
      return parsePricingPageManagedContent(record.content);
    } catch {
      return getDefaultPricingPageManagedContent(locale);
    }
  },
  async getPricingPageData(locale: SiteLocale) {
    return buildPricingPageData(locale, await this.getManagedPricingContent(locale));
  },
  async updatePricingContent(locale: SiteLocale, input: unknown) {
    const content = parsePricingPageManagedContentForm(input);
    await repository.upsert("pricing", locale, content);
    pagePreviewService.clearDrafts("pricing", locale);
    return content;
  },
  async getManagedAppointmentContent(locale: SiteLocale): Promise<AppointmentPageManagedContent> {
    const record = await repository.get("appointment", locale);

    if (!record) {
      return getDefaultAppointmentPageManagedContent(locale);
    }

    try {
      return parseAppointmentPageManagedContent(record.content);
    } catch {
      return getDefaultAppointmentPageManagedContent(locale);
    }
  },
  async getAppointmentPageData(locale: SiteLocale) {
    return buildAppointmentPageData(locale, await this.getManagedAppointmentContent(locale));
  },
  async updateAppointmentContent(locale: SiteLocale, input: unknown) {
    const content = parseAppointmentPageManagedContentForm(input);
    await repository.upsert("appointment", locale, content);
    pagePreviewService.clearDrafts("appointment", locale);
    return content;
  },
  async getManagedFaqContent(locale: SiteLocale): Promise<FaqPageManagedContent> {
    const record = await repository.get("faq", locale);

    if (!record) {
      return getDefaultFaqPageManagedContent(locale);
    }

    try {
      return parseFaqPageManagedContent(record.content);
    } catch {
      return getDefaultFaqPageManagedContent(locale);
    }
  },
  async getFaqPageData(locale: SiteLocale) {
    return buildFaqPageData(locale, await this.getManagedFaqContent(locale));
  },
  async updateFaqContent(locale: SiteLocale, input: unknown) {
    const content = parseFaqPageManagedContentForm(input);
    await repository.upsert("faq", locale, content);
    pagePreviewService.clearDrafts("faq", locale);
    return content;
  },
  async getManagedContactContent(locale: SiteLocale): Promise<ContactPageManagedContent> {
    const record = await repository.get("contact", locale);

    if (!record) {
      return getDefaultContactPageManagedContent(locale);
    }

    try {
      return parseContactPageManagedContent(record.content);
    } catch {
      return getDefaultContactPageManagedContent(locale);
    }
  },
  async getContactPageData(locale: SiteLocale) {
    return buildContactPageData(locale, await this.getManagedContactContent(locale));
  },
  async updateContactContent(locale: SiteLocale, input: unknown) {
    const content = parseContactPageManagedContentForm(input);
    await repository.upsert("contact", locale, content);
    pagePreviewService.clearDrafts("contact", locale);
    return content;
  },
  async getManagedBlogIndexContent(locale: SiteLocale): Promise<BlogIndexPageManagedContent> {
    const record = await repository.get("blog", locale);

    if (!record) {
      return getDefaultBlogIndexPageManagedContent(locale);
    }

    try {
      return parseBlogIndexPageManagedContent(record.content);
    } catch {
      return getDefaultBlogIndexPageManagedContent(locale);
    }
  },
  async getBlogIndexPageData(locale: SiteLocale) {
    return buildBlogIndexPageData(locale, await this.getManagedBlogIndexContent(locale));
  },
  async updateBlogIndexContent(locale: SiteLocale, input: unknown) {
    const content = parseBlogIndexPageManagedContentForm(input);
    await repository.upsert("blog", locale, content);
    pagePreviewService.clearDrafts("blog", locale);
    return content;
  },
};
