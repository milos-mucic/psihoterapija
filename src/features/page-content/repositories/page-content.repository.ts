import type { PageContentRecord, PageKey } from "@/features/page-content/types/page-content.types";
import type { SiteLocale } from "@/lib/config/site";

export interface PageContentRepository {
  get(pageKey: PageKey, locale: SiteLocale): Promise<PageContentRecord | undefined>;
  listAll(): Promise<PageContentRecord[]>;
  upsert(pageKey: PageKey, locale: SiteLocale, content: unknown): Promise<PageContentRecord>;
}
