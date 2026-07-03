import {
  getAdminPreviewHref,
  getPublicPageHref,
} from "@/features/page-content/admin/page-route-map";
import { pageContentService } from "@/features/page-content/services/page-content.service";
import { pagePreviewService } from "@/features/page-content/services/page-preview.service";
import type {
  AnyManagedPageContent,
  PageKey,
} from "@/features/page-content/types/page-content.types";
import { siteConfig } from "@/lib/config/site";

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
  {
    pageKey: "contact",
    title: "Kontakt",
    copy: "Kontakt detalji, mreze i galerija prostora.",
  },
  {
    pageKey: "blog",
    title: "Blog",
    copy: "SEO, banner i filteri za listing blog postova.",
  },
];

const formatUpdatedAt = (date: Date | undefined) =>
  date
    ? date.toLocaleString("sr-RS", {
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

export type PageDashboardSummary = {
  pageKey: PageKey;
  title: string;
  copy: string;
  statusLabel: string;
  statusTone: "success" | "muted";
  updatedAt?: Date;
  updatedAtLabel: string;
  completionPercent: number;
  missingImages: number;
  hasUnpublishedChanges: boolean;
  editorHref: string;
  previewHref: string;
  publicHref: string;
};

export const pageDashboardService = {
  async listPages(): Promise<PageDashboardSummary[]> {
    const storedRecords = await pageContentService.listStoredPageContentRecords();
    const recordMap = new Map(storedRecords.map((record) => [record.pageKey, record]));

    return Promise.all(
      pageDefinitions.map(async (page) => {
        const record = recordMap.get(page.pageKey);
        const content = await pageContentService.getManagedPageContent(page.pageKey);
        const analysis = analyzeContent(content as AnyManagedPageContent);
        const latestDraftUpdatedAt = pagePreviewService.getLatestDraftUpdatedAt(page.pageKey);
        const hasUnpublishedChanges = latestDraftUpdatedAt
          ? !record || latestDraftUpdatedAt > record.updatedAt.getTime()
          : false;

        return {
          pageKey: page.pageKey,
          title: page.title,
          copy: page.copy,
          statusLabel: record ? "Objavljeno" : "Početni sadržaj",
          statusTone: record ? "success" : "muted",
          updatedAt: record?.updatedAt,
          updatedAtLabel: formatUpdatedAt(record?.updatedAt),
          completionPercent: analysis.completionPercent,
          missingImages: analysis.missingImages,
          hasUnpublishedChanges,
          editorHref: `${siteConfig.adminPath}/pages/${page.pageKey}/`,
          previewHref: getAdminPreviewHref(page.pageKey),
          publicHref: getPublicPageHref(page.pageKey),
        } satisfies PageDashboardSummary;
      }),
    );
  },
  getStats(pages: PageDashboardSummary[]) {
    return {
      totalPages: pages.length,
      pagesWithMissingImages: pages.filter((page) => page.missingImages > 0).length,
      pagesWithUnpublishedChanges: pages.filter((page) => page.hasUnpublishedChanges).length,
    };
  },
};
