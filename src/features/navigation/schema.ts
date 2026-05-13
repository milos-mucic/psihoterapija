import { z } from "zod";
import type { ManagedNavigation } from "@/features/navigation/types";

const navSystemKeySchema = z
  .enum(["home", "about", "biography", "psychotherapy", "blog", "faq"])
  .optional();

const navChildSchema = z.object({
  id: z.string().min(1),
  label: z.string().min(1, "Labela ne sme biti prazna."),
  href: z.string().min(1, "URL ne sme biti prazan."),
  systemKey: navSystemKeySchema,
  lockDelete: z.boolean().optional(),
  lockHref: z.boolean().optional(),
});

const navItemSchema = navChildSchema.extend({
  children: z.array(navChildSchema).optional(),
});

export const managedNavigationSchema: z.ZodType<ManagedNavigation> = z.object({
  items: z.array(navItemSchema).min(1, "Nav mora imati barem jednu stavku."),
});

export const parseManagedNavigation = (input: unknown): ManagedNavigation =>
  managedNavigationSchema.parse(input);
