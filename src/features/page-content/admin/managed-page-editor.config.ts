import type {
  AboutPageManagedContent,
  AppointmentPageManagedContent,
  BlogIndexPageManagedContent,
  BiographyPageManagedContent,
  BiographyProfileManagedContent,
  ContactPageManagedContent,
  FaqPageManagedContent,
  PageKey,
  PricingPageManagedContent,
  PsychotherapyPageManagedContent,
  ScopePageManagedContent,
  ServicesPageManagedContent,
} from "@/features/page-content/types/page-content.types";
import { stripHtmlTags } from "@/features/page-content/admin/technical-fields";

export type SupportedManagedPage = Exclude<PageKey, "home">;

export type ManagedPageEditorField =
  | {
      kind: "text";
      label: string;
      name: string;
      value: string;
      full?: boolean;
      /** Force an inline rich-text editor even for a name that would otherwise stay a plain input. */
      rich?: boolean;
    }
  | {
      kind: "textarea";
      label: string;
      name: string;
      value: string;
      full?: boolean;
      rows?: number;
    }
  | {
      kind: "richText";
      label: string;
      name: string;
      value: string;
      full?: boolean;
    }
  | {
      kind: "media";
      label: string;
      name: string;
      value: string;
      accept?: string;
      helpText?: string;
      uploadLabel?: string;
    }
  | {
      kind: "toggle";
      label: string;
      name: string;
      value: boolean;
      full?: boolean;
    };

export type ManagedPageEditorFieldGroup = {
  kind: "group";
  title: string;
  fields: ManagedPageEditorField[];
};

export type ManagedPageEditorStandardSection = {
  kind: "standard";
  fragment: string;
  title: string;
  copy: string;
  previewCopy?: string;
  entries: Array<ManagedPageEditorField | ManagedPageEditorFieldGroup>;
};

export type ManagedPageEditorBiographyCardsSection = {
  kind: "biographyCards";
  fragment: string;
  title: string;
  copy: string;
  sectionTitleValue: string;
  sectionCopyValue: string;
  cards: BiographyProfileManagedContent[];
};

export type ManagedPageEditorScopeTabsSection = {
  kind: "scopeTabs";
  fragment: string;
  title: string;
  copy: string;
  tabs: ScopePageManagedContent["tabs"];
};

export type ManagedPageEditorRepeatableTextSection = {
  kind: "repeatableText";
  fragment: string;
  title: string;
  copy: string;
  itemLabel: string;
  itemNamePrefix: string;
  values: string[];
  addButtonLabel: string;
  minItems?: number;
};

export type ManagedPageEditorRepeatableGroupField = {
  key: string;
  kind: "text" | "richText" | "media";
  label: string;
  full?: boolean;
  accept?: string;
  helpText?: string;
  uploadLabel?: string;
  /** For kind "text": force an inline rich-text editor instead of a plain input. */
  rich?: boolean;
};

export type ManagedPageEditorRepeatableGroupSection = {
  kind: "repeatableGroup";
  fragment: string;
  title: string;
  copy: string;
  itemLabel: string;
  itemNamePrefix: string;
  fields: ManagedPageEditorRepeatableGroupField[];
  items: Array<Record<string, string>>;
  addButtonLabel: string;
  minItems?: number;
};

export type ManagedPageEditorSection =
  | ManagedPageEditorStandardSection
  | ManagedPageEditorBiographyCardsSection
  | ManagedPageEditorScopeTabsSection
  | ManagedPageEditorRepeatableTextSection
  | ManagedPageEditorRepeatableGroupSection;

export type ManagedPageEditorConfig = {
  uploadFolder: string;
  sections: ManagedPageEditorSection[];
};

type ManagedPageEditorContent =
  | AboutPageManagedContent
  | BiographyPageManagedContent
  | PsychotherapyPageManagedContent
  | ScopePageManagedContent
  | ServicesPageManagedContent
  | PricingPageManagedContent
  | AppointmentPageManagedContent
  | FaqPageManagedContent
  | ContactPageManagedContent
  | BlogIndexPageManagedContent;

const text = (
  name: string,
  label: string,
  value: string,
  options: { full?: boolean; rich?: boolean } = {},
): ManagedPageEditorField => ({
  kind: "text",
  label,
  name,
  value,
  ...options,
});

const textarea = (
  name: string,
  label: string,
  value: string,
  options: { full?: boolean; rows?: number } = {},
): ManagedPageEditorField => ({
  kind: "textarea",
  label,
  name,
  value,
  rows: options.rows ?? 2,
  ...options,
});

const richText = (
  name: string,
  label: string,
  value: string,
  options: { full?: boolean } = {},
): ManagedPageEditorField => ({
  kind: "richText",
  label,
  name,
  value,
  full: options.full ?? true,
});

const media = (
  name: string,
  label: string,
  value: string,
  options: { accept?: string; helpText?: string; uploadLabel?: string } = {},
): ManagedPageEditorField => ({
  kind: "media",
  label,
  name,
  value,
  uploadLabel: options.uploadLabel ?? "Otpremi sliku",
  ...options,
});

const toggle = (
  name: string,
  label: string,
  value: boolean,
  options: { full?: boolean } = {},
): ManagedPageEditorField => ({
  kind: "toggle",
  label,
  name,
  value,
  ...options,
});

const group = (title: string, fields: ManagedPageEditorField[]): ManagedPageEditorFieldGroup => ({
  kind: "group",
  title,
  fields,
});

const seoSection = (
  value: { title: string; description: string },
  options: { fragment: string; previewCopy?: string } = { fragment: "seo" },
): ManagedPageEditorStandardSection => ({
  kind: "standard",
  fragment: options.fragment,
  title: "SEO",
  copy: "Naslov i meta opis koje Astro isporucuje pretrazivacima i deljenju na drustvenim mrezama.",
  previewCopy: options.previewCopy,
  entries: [
    text("seoTitle", "SEO naslov", value.title, { full: true }),
    textarea("seoDescription", "Meta opis", value.description, { full: true, rows: 3 }),
  ],
});

const buildAboutEditor = (content: AboutPageManagedContent): ManagedPageEditorConfig => ({
  uploadFolder: "pages/about",
  sections: [
    seoSection(content.seo, { fragment: "about-banner" }),
    {
      kind: "standard",
      fragment: "about-banner",
      title: "Banner",
      copy: "Naslov, opis i pozadinska slika vrha stranice.",
      entries: [
        text("bannerTitle", "Naslov", content.banner.title),
        richText("bannerDescription", "Opis", content.banner.description),
        media("bannerBackgroundImage", "Pozadinska slika", content.banner.backgroundImage),
      ],
    },
    {
      kind: "standard",
      fragment: "about-showcase",
      title: "Video i kartice",
      copy: "Video prikaz sekcije.",
      entries: [
        text("showcaseTitle", "Naslov sekcije", content.showcase.title, { full: true }),
        text("showcaseVideoUrl", "Video URL", content.showcase.videoUrl, { full: true }),
        media("showcaseVideoImage", "Poster slika videa", content.showcase.videoImage),
      ],
    },
    {
      kind: "repeatableGroup",
      fragment: "about-showcase",
      title: "Showcase kartice",
      copy: "Dodavanje, uklanjanje i uređivanje kartica ispod videa.",
      itemLabel: "Kartica",
      itemNamePrefix: "showcaseCard",
      addButtonLabel: "Dodaj karticu",
      minItems: 1,
      fields: [
        { key: "title", kind: "text", label: "Naslov" },
        { key: "copy", kind: "richText", label: "Opis", full: true },
        { key: "image", kind: "media", label: "Slika" },
      ],
      items: content.showcase.cards.map((card) => ({
        title: card.title,
        copy: card.copy,
        image: card.image,
      })),
    },
    {
      kind: "standard",
      fragment: "about-idea",
      title: "Glavna ideja",
      copy: "Naslov i rich text sadržaj centralnog objašnjenja.",
      entries: [
        text("ideaTitle", "Naslov", content.idea.title, { full: true }),
        richText("ideaBody", "Sadržaj", content.idea.body),
      ],
    },
    {
      kind: "standard",
      fragment: "about-idea",
      title: "Fokus",
      copy: "Naslov fokus kartice.",
      entries: [text("focusTitle", "Naslov", content.focus.title, { full: true })],
    },
    {
      kind: "repeatableText",
      fragment: "about-idea",
      title: "Fokus stavke",
      copy: "Dodajte i uklanjajte stavke fokus kartice.",
      itemLabel: "Stavka",
      itemNamePrefix: "focusItem",
      values: content.focus.items,
      addButtonLabel: "Dodaj stavku",
      minItems: 1,
    },
    {
      kind: "standard",
      fragment: "about-blog",
      title: "Blog sekcija",
      copy: "Tekstualni blok iznad poslednjih blog postova.",
      entries: [
        text("recentTitle", "Naslov", content.recent.title),
        text("recentLabel", "Labela dugmeta", content.recent.label, { rich: true }),
        richText("recentCopy", "Opis", content.recent.copy),
        textarea("recentEmpty", "Poruka kada nema postova", content.recent.empty, {
          full: true,
        }),
      ],
    },
  ],
});

const buildBiographyEditor = (content: BiographyPageManagedContent): ManagedPageEditorConfig => ({
  uploadFolder: "pages/biography",
  sections: [
    seoSection(content.seo, { fragment: "biography-banner" }),
    {
      kind: "standard",
      fragment: "biography-banner",
      title: "Banner",
      copy: "Naslovna sekcija biografije.",
      entries: [
        text("bannerTitle", "Naslov", content.banner.title),
        richText("bannerDescription", "Opis", content.banner.description),
        media("bannerBackgroundImage", "Pozadinska slika", content.banner.backgroundImage),
      ],
    },
    {
      kind: "biographyCards",
      fragment: "biography-cards",
      title: "Kartice",
      copy: "Naslov sekcije i dinamični profili tima. Svaki profil dobija svoju javnu stranicu.",
      sectionTitleValue: content.cardsSection.title,
      sectionCopyValue: content.cardsSection.copy,
      cards: content.cardsSection.cards,
    },
    {
      kind: "standard",
      fragment: "biography-approach",
      title: "Pristup radu",
      copy: "Donja sekcija sa slikom i CTA dugmetom.",
      entries: [
        text("approachTitle", "Naslov", content.approach.title, { full: true }),
        richText("approachCopy", "Opis", content.approach.copy),
        media("approachImage", "Slika", content.approach.image),
        text("approachCtaLabel", "Labela CTA dugmeta", content.approach.ctaLabel, { rich: true }),
      ],
    },
    {
      kind: "repeatableText",
      fragment: "biography-approach",
      title: "Pristup radu stavke",
      copy: "Dodajte, uklonite ili presložite ključne stavke pristupa radu.",
      itemLabel: "Stavka",
      itemNamePrefix: "approachPoint",
      values: content.approach.points,
      addButtonLabel: "Dodaj stavku",
      minItems: 1,
    },
    {
      kind: "standard",
      fragment: "biography-approach",
      title: "Profil stranice — opcije",
      copy: "Kontrola elemenata na pojedinačnim stranicama profila. Podrazumevano isključeno.",
      entries: [
        toggle(
          "profileHighlightsVisible",
          "Prikaži oznake (labele) na stranici profila",
          content.profileHighlightsVisible ?? false,
        ),
        toggle(
          "profileBackLinkVisible",
          'Prikaži dugme za povratak ("Biografija") na stranici profila',
          content.profileBackLinkVisible ?? false,
        ),
      ],
    },
  ],
});

const buildPsychotherapyEditor = (
  content: PsychotherapyPageManagedContent,
): ManagedPageEditorConfig => ({
  uploadFolder: "pages/psychotherapy",
  sections: [
    seoSection(content.seo, { fragment: "psychotherapy-banner" }),
    {
      kind: "standard",
      fragment: "psychotherapy-banner",
      title: "Banner",
      copy: "Naslovna sekcija stranice Pristup.",
      entries: [
        text("bannerTitle", "Naslov", content.banner.title),
        richText("bannerDescription", "Opis", content.banner.description),
        media("bannerBackgroundImage", "Pozadinska slika", content.banner.backgroundImage),
      ],
    },
    {
      kind: "standard",
      fragment: "psychotherapy-scope",
      title: "Opseg rada",
      copy: "Naslov centralnog bloka.",
      entries: [text("scopeTitle", "Naslov bloka", content.scope.title, { full: true })],
    },
    {
      kind: "repeatableText",
      fragment: "psychotherapy-scope",
      title: "Opseg rada stavke",
      copy: "Dodajte ili uklonite stavke u centralnom bloku.",
      itemLabel: "Stavka",
      itemNamePrefix: "scopeItem",
      values: content.scope.items,
      addButtonLabel: "Dodaj stavku",
      minItems: 1,
    },
    {
      kind: "repeatableGroup",
      fragment: "psychotherapy-services",
      title: "Usluge",
      copy: "Kartice usluga.",
      itemLabel: "Kartica",
      itemNamePrefix: "serviceCard",
      addButtonLabel: "Dodaj karticu usluge",
      minItems: 1,
      fields: [
        { key: "title", kind: "text", label: "Naslov" },
        { key: "copy", kind: "richText", label: "Opis", full: true },
        { key: "image", kind: "media", label: "Slika" },
      ],
      items: content.services.cards.map((card) => ({
        title: card.title,
        copy: card.copy,
        image: card.image,
      })),
    },
    {
      kind: "standard",
      fragment: "psychotherapy-booking",
      title: "Zakazivanje tekst",
      copy: "Tekstualni blok iznad formata rada.",
      entries: [
        text("bookingTitle", "Naslov", content.booking.title, { full: true }),
        richText("bookingCopy", "Opis", content.booking.copy),
        text("bookingFormatLabel", "Labela formata", content.booking.formatLabel, { rich: true }),
      ],
    },
    {
      kind: "repeatableText",
      fragment: "psychotherapy-booking",
      title: "Formati rada",
      copy: "Dodajte ili uklonite formate rada.",
      itemLabel: "Format",
      itemNamePrefix: "bookingFormat",
      values: content.booking.formats,
      addButtonLabel: "Dodaj format",
      minItems: 1,
    },
    {
      kind: "standard",
      fragment: "psychotherapy-faq",
      title: "FAQ medija",
      copy: "Slika za FAQ blok.",
      entries: [media("faqImage", "FAQ slika", content.faq.image)],
    },
    {
      kind: "repeatableGroup",
      fragment: "psychotherapy-faq",
      title: "FAQ pitanja",
      copy: "Dodajte, uklonite i uredite pitanja sa odgovorima.",
      itemLabel: "Pitanje",
      itemNamePrefix: "faqItem",
      addButtonLabel: "Dodaj pitanje",
      minItems: 1,
      fields: [
        { key: "question", kind: "text", label: "Pitanje", full: true },
        { key: "answer", kind: "richText", label: "Odgovor", full: true },
      ],
      items: content.faq.items.map((item) => ({
        question: item.question,
        answer: item.answer,
      })),
    },
  ],
});

const buildScopeEditor = (content: ScopePageManagedContent): ManagedPageEditorConfig => ({
  uploadFolder: "pages/scope",
  sections: [
    seoSection(content.seo, { fragment: "scope-banner" }),
    {
      kind: "standard",
      fragment: "scope-banner",
      title: "Banner",
      copy: "Naslovna sekcija stranice Oblast rada.",
      entries: [
        text("bannerTitle", "Naslov", content.banner.title),
        richText("bannerDescription", "Opis", content.banner.description),
        media("bannerBackgroundImage", "Pozadinska slika", content.banner.backgroundImage),
      ],
    },
    {
      kind: "standard",
      fragment: "scope-tabs",
      title: "Uvodni blok",
      copy: "Naslov uvodnog bloka.",
      entries: [text("introTitle", "Naslov", content.intro.title, { full: true })],
    },
    {
      kind: "repeatableText",
      fragment: "scope-tabs",
      title: "Uvodne stavke",
      copy: "Dodajte ili uklonite stavke uvodnog bloka.",
      itemLabel: "Stavka",
      itemNamePrefix: "introItem",
      values: content.intro.items,
      addButtonLabel: "Dodaj stavku",
      minItems: 1,
    },
    {
      kind: "standard",
      fragment: "scope-tabs",
      title: "Detalj stranice",
      copy: "Zajednički tekst za donji deo detail stranica.",
      entries: [text("detailRelatedTitle", "Naslov povezanih tema", content.detail.relatedTitle)],
    },
    {
      kind: "standard",
      fragment: "scope-focus",
      title: "Fokus sekcija",
      copy: "Slika, kopija i CTA za srednji blok.",
      entries: [
        text("focusTitle", "Naslov", content.focus.title, { full: true }),
        richText("focusCopy", "Prvi pasus", content.focus.copy),
        richText("focusSecondaryCopy", "Drugi pasus", content.focus.secondaryCopy),
        media("focusImage", "Slika", content.focus.image),
        text("focusCtaLabel", "Labela CTA", content.focus.ctaLabel, { rich: true }),
      ],
    },
    {
      kind: "standard",
      fragment: "scope-blog",
      title: "Blog sekcija",
      copy: "Tekstualni blok ispod fokus sekcije.",
      entries: [
        text("recentTitle", "Naslov", content.recent.title),
        text("recentLabel", "Labela dugmeta", content.recent.label, { rich: true }),
        richText("recentCopy", "Opis", content.recent.copy),
        textarea("recentEmpty", "Poruka kada nema postova", content.recent.empty, {
          full: true,
        }),
      ],
    },
    {
      kind: "scopeTabs",
      fragment: "scope-tabs",
      title: "Teme rada",
      copy: "Dinamični tabovi i detail sadržaj. Svaka tema automatski dobija svoju javnu stranicu.",
      tabs: content.tabs,
    },
  ],
});

const buildServicesEditor = (content: ServicesPageManagedContent): ManagedPageEditorConfig => ({
  uploadFolder: "pages/services",
  sections: content.services.flatMap((service, index): ManagedPageEditorSection[] => {
    const prefix = `svc${index}`;
    // service.banner.title is a rich-text field (can contain inline
    // font-size/color HTML); strip tags before using it inside these plain
    // section header strings, or the raw markup shows up literally.
    const serviceLabel = stripHtmlTags(service.banner.title);

    return [
      {
        kind: "standard",
        fragment: `services-${index}-banner`,
        title: `${serviceLabel} — SEO i baner`,
        copy: "SEO, naslov, opis i pozadinska slika banera ove usluge.",
        entries: [
          text(`${prefix}_seoTitle`, "SEO naslov", service.seo.title, { full: true }),
          textarea(`${prefix}_seoDescription`, "Meta opis", service.seo.description, {
            full: true,
            rows: 3,
          }),
          text(`${prefix}_bannerTitle`, "Naslov usluge", service.banner.title),
          richText(`${prefix}_bannerDescription`, "Opis u baneru", service.banner.description),
          media(`${prefix}_bannerImage`, "Pozadinska slika banera", service.banner.backgroundImage),
        ],
      },
      {
        kind: "standard",
        fragment: `services-${index}-intro`,
        title: `${serviceLabel} — Uvodni tekst`,
        copy: "Naslov, glavni tekst i slika uvodne sekcije.",
        entries: [
          text(`${prefix}_introTitle`, "Naslov", service.intro.title, { full: true }),
          richText(`${prefix}_introBody`, "Tekst", service.intro.body),
          media(`${prefix}_introImage`, "Slika uz tekst", service.intro.image),
        ],
      },
      {
        kind: "repeatableText",
        fragment: `services-${index}-intro`,
        title: `${serviceLabel} — Ključne stavke`,
        copy: 'Lista "Ukratko" pored slike.',
        itemLabel: "Stavka",
        itemNamePrefix: `${prefix}_highlight`,
        values: service.intro.highlights,
        addButtonLabel: "Dodaj stavku",
        minItems: 1,
      },
      {
        kind: "repeatableGroup",
        fragment: `services-${index}-faq`,
        title: `${serviceLabel} — FAQ`,
        copy: "Pitanja i odgovori za ovu uslugu.",
        itemLabel: "Pitanje",
        itemNamePrefix: `${prefix}_faq`,
        addButtonLabel: "Dodaj pitanje",
        minItems: 1,
        fields: [
          { key: "question", kind: "text", label: "Pitanje", full: true },
          { key: "answer", kind: "richText", label: "Odgovor", full: true },
        ],
        items: service.faqs.map((faq) => ({
          question: faq.question,
          answer: faq.answer,
        })),
      },
    ];
  }),
});

const buildPricingEditor = (content: PricingPageManagedContent): ManagedPageEditorConfig => ({
  uploadFolder: "pages/pricing",
  sections: [
    seoSection(content.seo, { fragment: "pricing-banner" }),
    {
      kind: "standard",
      fragment: "pricing-banner",
      title: "Banner",
      copy: "Naslov, opis i pozadinska slika cenovne stranice.",
      previewCopy:
        "Banner se prikazuje na vrhu cenovne stranice i postavlja kontekst za planove ispod.",
      entries: [
        text("bannerTitle", "Naslov", content.banner.title),
        richText("bannerDescription", "Opis", content.banner.description),
        media("bannerBackgroundImage", "Pozadinska slika", content.banner.backgroundImage),
      ],
    },
    {
      kind: "repeatableGroup",
      fragment: "pricing-plans",
      title: "Planovi",
      copy: "Dodajte, uklonite i uredite cenovne kartice.",
      itemLabel: "Plan",
      itemNamePrefix: "pricingPlan",
      addButtonLabel: "Dodaj plan",
      minItems: 1,
      fields: [
        { key: "title", kind: "text", label: "Naslov", rich: true },
        { key: "price", kind: "text", label: "Cena", rich: true },
        { key: "ctaLabel", kind: "text", label: "Labela CTA", rich: true },
      ],
      items: content.plans.map((plan) => ({
        title: plan.title,
        price: plan.price,
        ctaLabel: plan.ctaLabel,
      })),
    },
    {
      kind: "repeatableGroup",
      fragment: "pricing-info",
      title: "Info kartice",
      copy: "Dodajte i uklonite objašnjenja ispod planova.",
      itemLabel: "Info",
      itemNamePrefix: "pricingInfo",
      addButtonLabel: "Dodaj info karticu",
      minItems: 1,
      fields: [
        { key: "title", kind: "text", label: "Naslov", rich: true },
        { key: "copy", kind: "richText", label: "Opis", full: true },
      ],
      items: content.infoCards.map((card) => ({
        title: card.title,
        copy: card.copy,
      })),
    },
  ],
});

const buildAppointmentEditor = (
  content: AppointmentPageManagedContent,
): ManagedPageEditorConfig => ({
  uploadFolder: "pages/appointment",
  sections: [
    seoSection(content.seo, { fragment: "appointment-banner" }),
    {
      kind: "standard",
      fragment: "appointment-banner",
      title: "Hero banner",
      copy: "Naslov, opis i pozadinska slika hero bloka na vrhu stranice za zakazivanje.",
      previewCopy:
        "Hero banner se prikazuje na vrhu stranice za zakazivanje. Isključite prekidač da ga sakrijete.",
      entries: [
        text("bannerTitle", "Naslov", content.banner.title),
        richText("bannerDescription", "Opis", content.banner.description),
        media("bannerBackgroundImage", "Pozadinska slika", content.banner.backgroundImage),
      ],
    },
    {
      kind: "standard",
      fragment: "appointment-booking",
      title: "Uvod i forma",
      copy: "Naslov i uvodni tekst uz formu za zakazivanje.",
      entries: [
        text("bookingTitle", "Naslov forme", content.booking.title, { full: true }),
        richText("bookingCopy", "Uvodni tekst", content.booking.copy),
        text("bookingFormatLabel", "Labela formata", content.booking.formatLabel, { rich: true }),
      ],
    },
    {
      kind: "repeatableText",
      fragment: "appointment-booking",
      title: "Formati rada",
      copy: "Dodajte ili uklonite formate rada za zakazivanje.",
      itemLabel: "Format",
      itemNamePrefix: "bookingFormat",
      values: content.booking.formats,
      addButtonLabel: "Dodaj format",
      minItems: 1,
    },
    {
      kind: "standard",
      fragment: "appointment-faq",
      title: "FAQ medija",
      copy: "Slika za FAQ blok na dnu stranice.",
      entries: [media("faqImage", "FAQ slika", content.faq.image)],
    },
    {
      kind: "repeatableGroup",
      fragment: "appointment-faq",
      title: "FAQ pitanja",
      copy: "Dodajte i uklonite pitanja u FAQ bloku.",
      itemLabel: "Pitanje",
      itemNamePrefix: "faqItem",
      addButtonLabel: "Dodaj pitanje",
      minItems: 1,
      fields: [
        { key: "question", kind: "text", label: "Pitanje", full: true },
        { key: "answer", kind: "richText", label: "Odgovor", full: true },
      ],
      items: content.faq.items.map((item) => ({
        question: item.question,
        answer: item.answer,
      })),
    },
  ],
});

const buildFaqEditor = (content: FaqPageManagedContent): ManagedPageEditorConfig => ({
  uploadFolder: "pages/faq",
  sections: [
    seoSection(content.seo, { fragment: "faq-banner" }),
    {
      kind: "standard",
      fragment: "faq-banner",
      title: "Banner",
      copy: "Naslov, SEO opis i pozadinska slika FAQ stranice.",
      entries: [
        text("bannerTitle", "Naslov", content.banner.title),
        richText("bannerDescription", "Opis", content.banner.description),
        media("bannerBackgroundImage", "Pozadinska slika", content.banner.backgroundImage),
      ],
    },
    {
      kind: "standard",
      fragment: "faq-items",
      title: "FAQ medija",
      copy: "Slika za glavni FAQ blok.",
      entries: [media("faqImage", "FAQ slika", content.faq.image)],
    },
    {
      kind: "repeatableGroup",
      fragment: "faq-items",
      title: "FAQ pitanja",
      copy: "Dodajte, uklonite i uredite glavna pitanja.",
      itemLabel: "Pitanje",
      itemNamePrefix: "faqItem",
      addButtonLabel: "Dodaj pitanje",
      minItems: 1,
      fields: [
        { key: "question", kind: "text", label: "Pitanje", full: true },
        { key: "answer", kind: "richText", label: "Odgovor", full: true },
      ],
      items: content.faq.items.map((item) => ({
        question: item.question,
        answer: item.answer,
      })),
    },
    {
      kind: "standard",
      fragment: "faq-booking",
      title: "Zakazivanje blok",
      copy: "Tekstualni deo ispod FAQ liste.",
      entries: [
        text("bookingTitle", "Naslov", content.booking.title, { full: true }),
        richText("bookingCopy", "Opis", content.booking.copy),
        text("bookingFormatLabel", "Labela formata", content.booking.formatLabel, { rich: true }),
      ],
    },
    {
      kind: "repeatableText",
      fragment: "faq-booking",
      title: "Formati rada",
      copy: "Dodajte ili uklonite formate rada ispod FAQ liste.",
      itemLabel: "Format",
      itemNamePrefix: "bookingFormat",
      values: content.booking.formats,
      addButtonLabel: "Dodaj format",
      minItems: 1,
    },
  ],
});

const buildContactEditor = (content: ContactPageManagedContent): ManagedPageEditorConfig => ({
  uploadFolder: "pages/contact",
  sections: [
    seoSection(content.seo, { fragment: "contact-banner" }),
    {
      kind: "standard",
      fragment: "contact-banner",
      title: "Banner",
      copy: "Naslov, opis i pozadinska slika kontakt stranice.",
      entries: [
        text("bannerTitle", "Naslov", content.banner.title),
        richText("bannerDescription", "Opis", content.banner.description),
        media("bannerBackgroundImage", "Pozadinska slika", content.banner.backgroundImage),
      ],
    },
    {
      kind: "standard",
      fragment: "contact-details",
      title: "Kontakt uvod i forma",
      copy: "Uvodni tekst i naslov forme za kontakt.",
      entries: [
        text("introTitle", "Naslov uvoda", content.introTitle),
        richText("introCopy", "Opis uvoda", content.introCopy),
        text("formTitle", "Naslov forme", content.formTitle),
      ],
    },
    {
      kind: "standard",
      fragment: "contact-cards",
      title: "Kontakt podaci (telefon i email)",
      copy: "Kartice sa telefonom i email adresom.",
      entries: [
        text("contactLabelPhone", "Labela telefon", content.contactLabels.phone, { rich: true }),
        text("phone", "Telefon", content.phone),
        text("contactLabelEmail", "Labela email", content.contactLabels.email, { rich: true }),
        text("email", "Email", content.email),
      ],
    },
    {
      kind: "standard",
      fragment: "contact-socials",
      title: "Drustvene mreze",
      copy: "Naslov bloka sa drustvenim mrezama.",
      entries: [
        text("contactLabelSocials", "Labela drustvene mreze", content.contactLabels.socials, { rich: true }),
      ],
    },
    {
      kind: "repeatableGroup",
      fragment: "contact-socials",
      title: "Linkovi drustvenih mreza",
      copy: "Dodajte mreze koje zelite da prikazete na kontakt stranici.",
      itemLabel: "Mreza",
      itemNamePrefix: "socialLink",
      addButtonLabel: "Dodaj mrezu",
      minItems: 1,
      fields: [
        { key: "platform", kind: "text", label: "Platforma" },
        { key: "label", kind: "text", label: "ARIA labela" },
        { key: "href", kind: "text", label: "URL", full: true },
      ],
      items: content.socialLinks.map((item) => ({
        platform: item.platform,
        label: item.label,
        href: item.href,
      })),
    },
    {
      kind: "standard",
      fragment: "contact-offices",
      title: "Prostor",
      copy: "Naslov i opis galerije prostora.",
      entries: [
        text("officesTitle", "Naslov sekcije", content.officesTitle),
        richText("officesCopy", "Opis sekcije", content.officesCopy),
      ],
    },
    {
      kind: "repeatableGroup",
      fragment: "contact-gallery",
      title: "Galerija prostora",
      copy: "Dodajte ili uklonite fotografije kancelarije.",
      itemLabel: "Fotografija",
      itemNamePrefix: "officeGallery",
      addButtonLabel: "Dodaj fotografiju",
      minItems: 1,
      fields: [{ key: "image", kind: "media", label: "Slika" }],
      items: content.officeGallery.map((image) => ({ image })),
    },
  ],
});

const buildBlogIndexEditor = (content: BlogIndexPageManagedContent): ManagedPageEditorConfig => ({
  uploadFolder: "pages/blog",
  sections: [
    seoSection(content.seo, { fragment: "blog-banner" }),
    {
      kind: "standard",
      fragment: "blog-banner",
      title: "Banner",
      copy: "Naslovna sekcija blog listing strane.",
      entries: [
        text("bannerTitle", "Naslov", content.banner.title),
        richText("bannerDescription", "Opis", content.banner.description),
        media("bannerBackgroundImage", "Pozadinska slika", content.banner.backgroundImage),
      ],
    },
    {
      kind: "standard",
      fragment: "blog-index",
      title: "Lista i filteri",
      copy: "Tekstovi za listu postova, pretragu i filtere.",
      entries: [
        text("allPostsTitle", "Naslov liste", content.allPostsTitle),
        text("postsLabel", "Labela brojaca postova", content.postsLabel, { rich: true }),
        text("searchTitle", "Naslov pretrage", content.searchTitle),
        text("searchPlaceholder", "Placeholder pretrage", content.searchPlaceholder),
        text("searchActionLabel", "Labela dugmeta pretrage", content.searchActionLabel, { rich: true }),
        text("recentTitle", "Naslov recent sekcije", content.recentTitle),
        text("keywordsTitle", "Naslov keyword sekcije", content.keywordsTitle),
        text("allKeywordsLabel", "Labela svih keyworda", content.allKeywordsLabel, { rich: true }),
        textarea("noResultsText", "Poruka bez rezultata", content.noResultsText, {
          full: true,
          rows: 3,
        }),
      ],
    },
  ],
});

export const getManagedPageEditorConfig = (
  page: SupportedManagedPage,
  content: ManagedPageEditorContent,
): ManagedPageEditorConfig => {
  switch (page) {
    case "about":
      return buildAboutEditor(content as AboutPageManagedContent);
    case "biography":
      return buildBiographyEditor(content as BiographyPageManagedContent);
    case "psychotherapy":
      return buildPsychotherapyEditor(content as PsychotherapyPageManagedContent);
    case "scope":
      return buildScopeEditor(content as ScopePageManagedContent);
    case "services":
      return buildServicesEditor(content as ServicesPageManagedContent);
    case "pricing":
      return buildPricingEditor(content as PricingPageManagedContent);
    case "appointment":
      return buildAppointmentEditor(content as AppointmentPageManagedContent);
    case "faq":
      return buildFaqEditor(content as FaqPageManagedContent);
    case "contact":
      return buildContactEditor(content as ContactPageManagedContent);
    case "blog":
      return buildBlogIndexEditor(content as BlogIndexPageManagedContent);
  }
};
