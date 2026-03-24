import {
  getAdminPreviewHref,
  getPublicPageHref,
} from "@/features/page-content/admin/page-route-map";
import { pageContentService } from "@/features/page-content/services/page-content.service";
import { pagePreviewService } from "@/features/page-content/services/page-preview.service";
import type {
  AnyManagedPageContent,
  PageContentRecord,
  PageKey,
} from "@/features/page-content/types/page-content.types";
import { siteConfig, type SiteLocale } from "@/lib/config/site";

const translationLagMs = 1000 * 60 * 5;

const pageDefinitions: Array<{ pageKey: PageKey; title: string; copy: string }> = [
  {
    pageKey: "home",
    title: "Početna",
    copy: "Hero, sekcije sa uslugama, razlozi, zakazivanje i blog.",
  },
  {
    pageKey: "about",
    title: "O nama",
    copy: "Video sekcija, glavno objašnjenje kabineta i blog blok.",
  },
  {
    pageKey: "biography",
    title: "Biografija",
    copy: "Stručni profil, kartice i pristup radu.",
  },
  {
    pageKey: "psychotherapy",
    title: "Pristup",
    copy: "Naslovna sekcija, opseg rada, usluge i FAQ.",
  },
  {
    pageKey: "scope",
    title: "Oblast rada",
    copy: "Uvod, fokus sekcija i sve detail teme.",
  },
  {
    pageKey: "pricing",
    title: "Cena",
    copy: "Cenovne kartice i dodatna pojašnjenja.",
  },
  {
    pageKey: "appointment",
    title: "Zakazivanje",
    copy: "Uvod uz formu i donji FAQ blok.",
  },
  {
    pageKey: "faq",
    title: "Pitanja",
    copy: "FAQ lista i blok za zakazivanje.",
  },
];

const localeLabels: Record<SiteLocale, string> = {
  "sr-latn": "Latinica",
  "sr-cyrl": "Ćirilica",
};

const getRecordKey = (pageKey: PageKey, locale: SiteLocale) => `${pageKey}:${locale}`;

const getLocaleTag = (locale: SiteLocale) => (locale === "sr-cyrl" ? "sr-Cyrl-RS" : "sr-RS");

const formatUpdatedAt = (date: Date | undefined, locale: SiteLocale) =>
  date
    ? date.toLocaleString(getLocaleTag(locale), {
        dateStyle: "medium",
        timeStyle: "short",
      })
    : "Nema sačuvanih izmena";

const isImageField = (segment: string) => {
  const normalized = segment.toLowerCase();
  return normalized.includes("image") || normalized === "icon";
};

const analyzeContent = (content: AnyManagedPageContent) => {
  let totalFields = 0;
  let filledFields = 0;
  let missingImages = 0;

  const visit = (value: unknown, path: string[]) => {
    if (typeof value === "string") {
      totalFields += 1;

      if (value.trim().length > 0) {
        filledFields += 1;
      } else if (isImageField(path[path.length - 1] ?? "")) {
        missingImages += 1;
      }

      return;
    }

    if (Array.isArray(value)) {
      value.forEach((item, index) => visit(item, [...path, String(index)]));
      return;
    }

    if (typeof value === "object" && value !== null) {
      Object.entries(value).forEach(([key, nested]) => visit(nested, [...path, key]));
    }
  };

  visit(content, []);

  return {
    completionPercent: totalFields === 0 ? 0 : Math.round((filledFields / totalFields) * 100),
    missingImages,
  };
};

const getNeedsTranslation = (
  currentRecord: PageContentRecord | undefined,
  counterpartRecord: PageContentRecord | undefined,
) => {
  if (!counterpartRecord) {
    return false;
  }

  if (!currentRecord) {
    return true;
  }

  return (
    counterpartRecord.updatedAt.getTime() - currentRecord.updatedAt.getTime() > translationLagMs
  );
};

export type PageDashboardLocaleSummary = {
  locale: SiteLocale;
  label: string;
  statusLabel: string;
  statusTone: "success" | "muted";
  updatedAt?: Date;
  updatedAtLabel: string;
  completionPercent: number;
  missingImages: number;
  needsTranslation: boolean;
  hasUnpublishedChanges: boolean;
  editorHref: string;
  previewHref: string;
  publicHref: string;
};

export type PageDashboardSummary = {
  pageKey: PageKey;
  title: string;
  copy: string;
  updatedAt?: Date;
  completionPercent: number;
  missingImages: number;
  needsTranslation: boolean;
  hasUnpublishedChanges: boolean;
  locales: PageDashboardLocaleSummary[];
};

export const pageDashboardService = {
  async listPages(): Promise<PageDashboardSummary[]> {
    const storedRecords = await pageContentService.listStoredPageContentRecords();
    const recordMap = new Map(
      storedRecords.map((record) => [getRecordKey(record.pageKey, record.locale), record]),
    );

    return Promise.all(
      pageDefinitions.map(async (page) => {
        const locales = await Promise.all(
          siteConfig.locales.map(async (locale) => {
            const record = recordMap.get(getRecordKey(page.pageKey, locale));
            const counterpartLocale = locale === "sr-latn" ? "sr-cyrl" : "sr-latn";
            const counterpartRecord = recordMap.get(getRecordKey(page.pageKey, counterpartLocale));
            const content = await pageContentService.getManagedPageContent(page.pageKey, locale);
            const analysis = analyzeContent(content as AnyManagedPageContent);
            const latestDraftUpdatedAt = pagePreviewService.getLatestDraftUpdatedAt(
              page.pageKey,
              locale,
            );
            const hasUnpublishedChanges = latestDraftUpdatedAt
              ? !record || latestDraftUpdatedAt > record.updatedAt.getTime()
              : false;

            return {
              locale,
              label: localeLabels[locale],
              statusLabel: record ? "Objavljeno" : "Početni sadržaj",
              statusTone: record ? "success" : "muted",
              updatedAt: record?.updatedAt,
              updatedAtLabel: formatUpdatedAt(record?.updatedAt, locale),
              completionPercent: analysis.completionPercent,
              missingImages: analysis.missingImages,
              needsTranslation: getNeedsTranslation(record, counterpartRecord),
              hasUnpublishedChanges,
              editorHref: `${siteConfig.adminPath}/pages/${page.pageKey}/?locale=${locale}`,
              previewHref: getAdminPreviewHref(page.pageKey, locale),
              publicHref: getPublicPageHref(page.pageKey, locale),
            } satisfies PageDashboardLocaleSummary;
          }),
        );

        return {
          pageKey: page.pageKey,
          title: page.title,
          copy: page.copy,
          updatedAt: locales
            .map((locale) => locale.updatedAt)
            .filter((value): value is Date => value instanceof Date)
            .sort((left, right) => right.getTime() - left.getTime())[0],
          completionPercent: Math.round(
            locales.reduce((sum, locale) => sum + locale.completionPercent, 0) / locales.length,
          ),
          missingImages: locales.reduce((sum, locale) => sum + locale.missingImages, 0),
          needsTranslation: locales.some((locale) => locale.needsTranslation),
          hasUnpublishedChanges: locales.some((locale) => locale.hasUnpublishedChanges),
          locales,
        } satisfies PageDashboardSummary;
      }),
    );
  },
  getStats(pages: PageDashboardSummary[]) {
    return {
      totalPages: pages.length,
      pagesNeedingTranslation: pages.filter((page) => page.needsTranslation).length,
      pagesWithMissingImages: pages.filter((page) => page.missingImages > 0).length,
      pagesWithUnpublishedChanges: pages.filter((page) => page.hasUnpublishedChanges).length,
    };
  },
};
