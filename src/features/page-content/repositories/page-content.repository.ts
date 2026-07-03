import type { PageContentRecord, PageKey } from "@/features/page-content/types/page-content.types";

export interface PageContentRepository {
  get(pageKey: PageKey): Promise<PageContentRecord | undefined>;
  listAll(): Promise<PageContentRecord[]>;
  upsert(pageKey: PageKey, content: unknown): Promise<PageContentRecord>;
}
