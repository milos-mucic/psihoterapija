import { getDefaultNavigation } from "@/features/navigation/defaults";
import { navigationRepository } from "@/features/navigation/repository";
import { parseManagedNavigation } from "@/features/navigation/schema";
import type { ManagedNavigation, ManagedNavItem } from "@/features/navigation/types";
import type { SiteLocale } from "@/lib/config/site";

const mergeWithDefaults = (
  locale: SiteLocale,
  stored: ManagedNavigation | undefined,
): ManagedNavigation => {
  const defaults = getDefaultNavigation(locale);

  if (!stored) {
    return defaults;
  }

  const defaultsBySystemKey = new Map(
    defaults.items.flatMap((item) => {
      const entries: Array<[string, ManagedNavItem]> = item.systemKey
        ? [[item.systemKey, item]]
        : [];

      item.children?.forEach((child) => {
        if (child.systemKey) {
          entries.push([child.systemKey, child as ManagedNavItem]);
        }
      });

      return entries;
    }),
  );

  // Re-apply lock flags from defaults so legacy stored data doesn't accidentally
  // drop the system locks.
  const items = stored.items.map((item) => {
    const sysDefault = item.systemKey ? defaultsBySystemKey.get(item.systemKey) : undefined;

    const merged: ManagedNavItem = {
      ...item,
      lockDelete: sysDefault?.lockDelete ?? item.lockDelete,
      lockHref: sysDefault?.lockHref ?? item.lockHref,
    };

    if (item.children) {
      merged.children = item.children.map((child) => {
        const childDefault = child.systemKey ? defaultsBySystemKey.get(child.systemKey) : undefined;
        return {
          ...child,
          lockDelete: childDefault?.lockDelete ?? child.lockDelete,
          lockHref: childDefault?.lockHref ?? child.lockHref,
        };
      });
    }

    return merged;
  });

  return { items };
};

export const navigationService = {
  async getNavigation(locale: SiteLocale): Promise<ManagedNavigation> {
    try {
      const stored = await navigationRepository.get(locale);
      return mergeWithDefaults(locale, stored);
    } catch (error) {
      console.error("[navigation] failed to load, falling back to defaults", error);
      return getDefaultNavigation(locale);
    }
  },

  async saveNavigation(locale: SiteLocale, input: unknown): Promise<ManagedNavigation> {
    const parsed = parseManagedNavigation(input);
    await navigationRepository.upsert(locale, parsed);
    return mergeWithDefaults(locale, parsed);
  },

  getDefaultNavigation,
};
