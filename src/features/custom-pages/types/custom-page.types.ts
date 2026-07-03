export type CustomPageStatus = "draft" | "published";

export type HeroBlockData = {
  eyebrow?: string;
  title: string;
  subtitle?: string;
  image?: string;
  ctaLabel?: string;
  ctaHref?: string;
  align?: "left" | "center";
};

export type RichTextBlockData = {
  html: string;
};

export type ImageBlockData = {
  src: string;
  alt?: string;
  layout: "full" | "side-text-right" | "side-text-left";
  title?: string;
  text?: string;
  caption?: string;
};

export type CtaBlockData = {
  eyebrow?: string;
  title: string;
  copy?: string;
  buttonLabel: string;
  buttonHref: string;
  variant: "light" | "dark";
};

export type CustomPageBlock =
  | { id: string; type: "hero"; data: HeroBlockData }
  | { id: string; type: "richtext"; data: RichTextBlockData }
  | { id: string; type: "image"; data: ImageBlockData }
  | { id: string; type: "cta"; data: CtaBlockData };

export type CustomPageBlockType = CustomPageBlock["type"];

export type CustomPageRecord = {
  id: string;
  slug: string;
  title: string;
  description?: string;
  blocks: CustomPageBlock[];
  status: CustomPageStatus;
  createdAt: Date;
  updatedAt: Date;
};

export type CustomPageListItem = Pick<
  CustomPageRecord,
  "id" | "slug" | "title" | "status" | "updatedAt"
>;

export type CustomPageInput = {
  slug: string;
  title: string;
  description?: string;
  blocks: CustomPageBlock[];
  status: CustomPageStatus;
};
