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
  content: ManagedPageContentMap[TPageKey],
) => {
  switch (pageKey) {
    case "home":
      return buildHomePageData(content as HomePageManagedContent);
    case "about":
      return buildAboutPageData(content as AboutPageManagedContent);
    case "biography":
      return buildBiographyPageData(content as BiographyPageManagedContent);
    case "psychotherapy":
      return buildPsychotherapyPageData(content as PsychotherapyPageManagedContent);
    case "scope":
      return buildScopePageData(content as ScopePageManagedContent);
    case "pricing":
      return buildPricingPageData(content as PricingPageManagedContent);
    case "appointment":
      return buildAppointmentPageData(content as AppointmentPageManagedContent);
    case "faq":
      return buildFaqPageData(content as FaqPageManagedContent);
    case "contact":
      return buildContactPageData(content as ContactPageManagedContent);
    case "blog":
      return buildBlogIndexPageData(content as BlogIndexPageManagedContent);
  }
};

const getPreviewManagedContent = <TPageKey extends PageKey>(
  pageKey: TPageKey,
  token?: string | null,
): ManagedPageContentMap[TPageKey] | undefined => {
  const entry = pagePreviewService.getDraft(token, pageKey);
  return entry?.content as ManagedPageContentMap[TPageKey] | undefined;
};

const getStoredHomeContent = async () => {
  const record = await repository.get("home");

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
  ): Promise<ManagedPageContentMap[TPageKey]> {
    switch (pageKey) {
      case "home":
        return (await this.getManagedHomeContent()) as ManagedPageContentMap[TPageKey];
      case "about":
        return (await this.getManagedAboutContent()) as ManagedPageContentMap[TPageKey];
      case "biography":
        return (await this.getManagedBiographyContent()) as ManagedPageContentMap[TPageKey];
      case "psychotherapy":
        return (await this.getManagedPsychotherapyContent()) as ManagedPageContentMap[TPageKey];
      case "scope":
        return (await this.getManagedScopeContent()) as ManagedPageContentMap[TPageKey];
      case "pricing":
        return (await this.getManagedPricingContent()) as ManagedPageContentMap[TPageKey];
      case "appointment":
        return (await this.getManagedAppointmentContent()) as ManagedPageContentMap[TPageKey];
      case "faq":
        return (await this.getManagedFaqContent()) as ManagedPageContentMap[TPageKey];
      case "contact":
        return (await this.getManagedContactContent()) as ManagedPageContentMap[TPageKey];
      case "blog":
        return (await this.getManagedBlogIndexContent()) as ManagedPageContentMap[TPageKey];
    }
  },
  savePreviewDraft<TPageKey extends PageKey>(
    pageKey: TPageKey,
    input: unknown,
    currentToken?: string,
  ) {
    const content = parseManagedPageContentForm(pageKey, input);
    return pagePreviewService.saveDraft(
      pageKey,
      content as AnyManagedPageContent,
      currentToken,
    );
  },
  async getPreviewPageData<TPageKey extends PageKey>(
    pageKey: TPageKey,
    token?: string | null,
  ) {
    const previewContent = getPreviewManagedContent(pageKey, token);

    if (previewContent) {
      return buildManagedPageData(pageKey, previewContent);
    }

    switch (pageKey) {
      case "home":
        return await this.getHomePageData();
      case "about":
        return await this.getAboutPageData();
      case "biography":
        return await this.getBiographyPageData();
      case "psychotherapy":
        return await this.getPsychotherapyPageData();
      case "scope":
        return await this.getScopePageData();
      case "pricing":
        return await this.getPricingPageData();
      case "appointment":
        return await this.getAppointmentPageData();
      case "faq":
        return await this.getFaqPageData();
      case "contact":
        return await this.getContactPageData();
      case "blog":
        return await this.getBlogIndexPageData();
    }
  },
  async getManagedHomeContent(): Promise<HomePageManagedContent> {
    const stored = await getStoredHomeContent();
    return stored ?? getDefaultHomePageManagedContent();
  },
  async getHomePageData() {
    const content = await this.getManagedHomeContent();
    return buildHomePageData(content);
  },
  async updateHomeContent(input: unknown) {
    const content = parseHomePageManagedContentForm(input);
    await repository.upsert("home", content);
    pagePreviewService.clearDrafts("home");
    return content;
  },
  async getManagedAboutContent(): Promise<AboutPageManagedContent> {
    const record = await repository.get("about");

    if (!record) {
      return getDefaultAboutPageManagedContent();
    }

    try {
      return parseAboutPageManagedContent(record.content);
    } catch {
      return getDefaultAboutPageManagedContent();
    }
  },
  async getAboutPageData() {
    return buildAboutPageData(await this.getManagedAboutContent());
  },
  async updateAboutContent(input: unknown) {
    const content = parseAboutPageManagedContentForm(input);
    await repository.upsert("about", content);
    pagePreviewService.clearDrafts("about");
    return content;
  },
  async getManagedBiographyContent(): Promise<BiographyPageManagedContent> {
    const record = await repository.get("biography");

    if (!record) {
      return getDefaultBiographyPageManagedContent();
    }

    try {
      return parseBiographyPageManagedContent(record.content);
    } catch {
      return getDefaultBiographyPageManagedContent();
    }
  },
  async getBiographyPageData() {
    return buildBiographyPageData(await this.getManagedBiographyContent());
  },
  async getBiographyProfilePageData(slug: string) {
    return buildBiographyDetailPageData(
      await this.getManagedBiographyContent(),
      slug,
    );
  },
  async updateBiographyContent(input: unknown) {
    const content = parseBiographyPageManagedContentForm(input);
    await repository.upsert("biography", content);
    pagePreviewService.clearDrafts("biography");
    return content;
  },
  async getManagedPsychotherapyContent(): Promise<PsychotherapyPageManagedContent> {
    const record = await repository.get("psychotherapy");

    if (!record) {
      return getDefaultPsychotherapyPageManagedContent();
    }

    try {
      return parsePsychotherapyPageManagedContent(record.content);
    } catch {
      return getDefaultPsychotherapyPageManagedContent();
    }
  },
  async getPsychotherapyPageData() {
    return buildPsychotherapyPageData(await this.getManagedPsychotherapyContent());
  },
  async updatePsychotherapyContent(input: unknown) {
    const content = parsePsychotherapyPageManagedContentForm(input);
    await repository.upsert("psychotherapy", content);
    pagePreviewService.clearDrafts("psychotherapy");
    return content;
  },
  async getManagedScopeContent(): Promise<ScopePageManagedContent> {
    const record = await repository.get("scope");

    if (!record) {
      return getDefaultScopePageManagedContent();
    }

    try {
      return parseScopePageManagedContent(record.content);
    } catch {
      return getDefaultScopePageManagedContent();
    }
  },
  async getScopePageData() {
    return buildScopePageData(await this.getManagedScopeContent());
  },
  async getScopeDetailPageData(slug: string) {
    return buildScopeDetailPageData(await this.getManagedScopeContent(), slug);
  },
  async updateScopeContent(input: unknown) {
    const content = parseScopePageManagedContentForm(input);
    await repository.upsert("scope", content);
    pagePreviewService.clearDrafts("scope");
    return content;
  },
  async getManagedPricingContent(): Promise<PricingPageManagedContent> {
    const record = await repository.get("pricing");

    if (!record) {
      return getDefaultPricingPageManagedContent();
    }

    try {
      return parsePricingPageManagedContent(record.content);
    } catch {
      return getDefaultPricingPageManagedContent();
    }
  },
  async getPricingPageData() {
    return buildPricingPageData(await this.getManagedPricingContent());
  },
  async updatePricingContent(input: unknown) {
    const content = parsePricingPageManagedContentForm(input);
    await repository.upsert("pricing", content);
    pagePreviewService.clearDrafts("pricing");
    return content;
  },
  async getManagedAppointmentContent(): Promise<AppointmentPageManagedContent> {
    const record = await repository.get("appointment");

    if (!record) {
      return getDefaultAppointmentPageManagedContent();
    }

    try {
      return parseAppointmentPageManagedContent(record.content);
    } catch {
      return getDefaultAppointmentPageManagedContent();
    }
  },
  async getAppointmentPageData() {
    return buildAppointmentPageData(await this.getManagedAppointmentContent());
  },
  async updateAppointmentContent(input: unknown) {
    const content = parseAppointmentPageManagedContentForm(input);
    await repository.upsert("appointment", content);
    pagePreviewService.clearDrafts("appointment");
    return content;
  },
  async getManagedFaqContent(): Promise<FaqPageManagedContent> {
    const record = await repository.get("faq");

    if (!record) {
      return getDefaultFaqPageManagedContent();
    }

    try {
      return parseFaqPageManagedContent(record.content);
    } catch {
      return getDefaultFaqPageManagedContent();
    }
  },
  async getFaqPageData() {
    return buildFaqPageData(await this.getManagedFaqContent());
  },
  async updateFaqContent(input: unknown) {
    const content = parseFaqPageManagedContentForm(input);
    await repository.upsert("faq", content);
    pagePreviewService.clearDrafts("faq");
    return content;
  },
  async getManagedContactContent(): Promise<ContactPageManagedContent> {
    const record = await repository.get("contact");

    if (!record) {
      return getDefaultContactPageManagedContent();
    }

    try {
      return parseContactPageManagedContent(record.content);
    } catch {
      return getDefaultContactPageManagedContent();
    }
  },
  async getContactPageData() {
    return buildContactPageData(await this.getManagedContactContent());
  },
  async updateContactContent(input: unknown) {
    const content = parseContactPageManagedContentForm(input);
    await repository.upsert("contact", content);
    pagePreviewService.clearDrafts("contact");
    return content;
  },
  async getManagedBlogIndexContent(): Promise<BlogIndexPageManagedContent> {
    const record = await repository.get("blog");

    if (!record) {
      return getDefaultBlogIndexPageManagedContent();
    }

    try {
      return parseBlogIndexPageManagedContent(record.content);
    } catch {
      return getDefaultBlogIndexPageManagedContent();
    }
  },
  async getBlogIndexPageData() {
    return buildBlogIndexPageData(await this.getManagedBlogIndexContent());
  },
  async updateBlogIndexContent(input: unknown) {
    const content = parseBlogIndexPageManagedContentForm(input);
    await repository.upsert("blog", content);
    pagePreviewService.clearDrafts("blog");
    return content;
  },
};
