import { randomUUID } from "node:crypto";
import type {
  AnyManagedPageContent,
  PageKey,
} from "@/features/page-content/types/page-content.types";

type PreviewEntry = {
  token: string;
  pageKey: PageKey;
  content: AnyManagedPageContent;
  updatedAt: number;
};

type PreviewStore = Map<string, PreviewEntry>;

const previewTtlMs = 1000 * 60 * 30;
const previewStoreKey = "__syncZonePagePreviewStore";

const getStore = (): PreviewStore => {
  const globalScope = globalThis as typeof globalThis & {
    [previewStoreKey]?: PreviewStore;
  };

  if (!globalScope[previewStoreKey]) {
    globalScope[previewStoreKey] = new Map<string, PreviewEntry>();
  }

  return globalScope[previewStoreKey];
};

const pruneExpiredEntries = () => {
  const now = Date.now();

  getStore().forEach((entry, token) => {
    if (now - entry.updatedAt > previewTtlMs) {
      getStore().delete(token);
    }
  });
};

export const pagePreviewService = {
  saveDraft(pageKey: PageKey, content: AnyManagedPageContent, currentToken?: string) {
    pruneExpiredEntries();

    const token = currentToken && getStore().has(currentToken) ? currentToken : randomUUID();
    const entry: PreviewEntry = {
      token,
      pageKey,
      content,
      updatedAt: Date.now(),
    };

    getStore().set(token, entry);
    return entry;
  },
  getDraft(token: string | null | undefined, pageKey: PageKey) {
    if (!token) {
      return undefined;
    }

    pruneExpiredEntries();

    const entry = getStore().get(token);

    if (!entry || entry.pageKey !== pageKey) {
      return undefined;
    }

    return entry;
  },
  getLatestDraftUpdatedAt(pageKey: PageKey) {
    pruneExpiredEntries();

    let latestUpdatedAt: number | undefined;

    getStore().forEach((entry) => {
      if (entry.pageKey !== pageKey) {
        return;
      }

      if (!latestUpdatedAt || entry.updatedAt > latestUpdatedAt) {
        latestUpdatedAt = entry.updatedAt;
      }
    });

    return latestUpdatedAt;
  },
  clearDrafts(pageKey: PageKey) {
    pruneExpiredEntries();

    getStore().forEach((entry, token) => {
      if (entry.pageKey === pageKey) {
        getStore().delete(token);
      }
    });
  },
};
