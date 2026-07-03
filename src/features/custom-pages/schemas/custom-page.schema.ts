import { z } from "zod";

const blockId = z.string().min(1);

const heroBlock = z.object({
  id: blockId,
  type: z.literal("hero"),
  data: z.object({
    eyebrow: z.string().optional().default(""),
    title: z.string().min(1, "Hero blok mora imati naslov."),
    subtitle: z.string().optional().default(""),
    image: z.string().optional().default(""),
    ctaLabel: z.string().optional().default(""),
    ctaHref: z.string().optional().default(""),
    align: z.enum(["left", "center"]).optional().default("left"),
  }),
});

const richTextBlock = z.object({
  id: blockId,
  type: z.literal("richtext"),
  data: z.object({
    html: z.string().default(""),
  }),
});

const imageBlock = z.object({
  id: blockId,
  type: z.literal("image"),
  data: z.object({
    src: z.string().min(1, "Slika mora imati URL."),
    alt: z.string().optional().default(""),
    layout: z.enum(["full", "side-text-right", "side-text-left"]).default("full"),
    title: z.string().optional().default(""),
    text: z.string().optional().default(""),
    caption: z.string().optional().default(""),
  }),
});

const ctaBlock = z.object({
  id: blockId,
  type: z.literal("cta"),
  data: z.object({
    eyebrow: z.string().optional().default(""),
    title: z.string().min(1, "CTA blok mora imati naslov."),
    copy: z.string().optional().default(""),
    buttonLabel: z.string().min(1, "CTA dugme mora imati labelu."),
    buttonHref: z.string().min(1, "CTA dugme mora imati URL."),
    variant: z.enum(["light", "dark"]).default("light"),
  }),
});

export const customPageBlockSchema = z.discriminatedUnion("type", [
  heroBlock,
  richTextBlock,
  imageBlock,
  ctaBlock,
]);

export const customPageInputSchema = z.object({
  slug: z
    .string()
    .min(1, "Slug je obavezan.")
    .regex(/^[a-z0-9-/]+$/, "Slug može sadržati samo mala slova, brojeve, kose crte i crtice."),
  title: z.string().min(1, "Naslov je obavezan."),
  description: z.string().optional(),
  blocks: z.array(customPageBlockSchema).default([]),
  status: z.enum(["draft", "published"]).default("draft"),
});

export type CustomPageInputParsed = z.infer<typeof customPageInputSchema>;
