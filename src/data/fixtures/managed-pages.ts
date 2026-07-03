import { getHomePageData } from "@/data/fixtures/home";
import {
  getAboutPageData,
  getAppointmentPageData,
  getBiographyPageData,
  getContactPageData,
  getFaqPageData,
  getPricingPageData,
  getPsychotherapyPageData,
  getScopeDetailPageData,
  getScopePageData,
} from "@/data/fixtures/public-pages";
import type {
  AboutPageManagedContent,
  AppointmentPageManagedContent,
  BlogIndexPageManagedContent,
  BiographyPageManagedContent,
  ContactPageManagedContent,
  FaqPageManagedContent,
  PricingPageManagedContent,
  PsychotherapyPageManagedContent,
  ScopePageManagedContent,
  ServicesPageManagedContent,
} from "@/features/page-content/types/page-content.types";
import { getDictionary } from "@/features/i18n/translate";
import { siteConfig } from "@/lib/config/site";

const aboutShowcaseHrefs = ["/zakazivanje/", "/psihoterapija/", "/psihoterapija/"];
const defaultScopeSlugs = [
  "anksiozna-stanja",
  "poremecaji-licnosti",
  "depresivna-stanja",
  "trauma",
];

const serviceParagraphs = (paragraphs: string[]) =>
  paragraphs.map((paragraph) => `<p>${paragraph}</p>`).join("");

export const getDefaultServicesPageManagedContent = (): ServicesPageManagedContent => {
  const dictionary = getDictionary();
  const items = dictionary.homePage.services.items;
  const psychotherapyFaqs = dictionary.pages.psychotherapy.faqs;
  const appointmentFaqs = dictionary.pages.appointment.faqs;
  const toFaqs = (list: Array<{ question: string; answer: string }>) =>
    list.map((faq) => ({ question: faq.question, answer: `<p>${faq.answer}</p>` }));

  return {
    seo: {
      title: `${items[0].title} | Psihoterapijski kabinet Ikar`,
      description: dictionary.meta.psychotherapy.description,
    },
    services: [
      {
        slug: "psihoterapija",
        seo: {
          title: `${items[0].title} | Psihoterapijski kabinet Ikar`,
          description: dictionary.meta.psychotherapy.description,
        },
        banner: {
          title: items[0].title,
          description:
            "<p>Psihodinamska psihoterapija je dugoročniji proces usmeren na razumevanje dubljih uzroka psiholoških teškoća i postepeno stvaranje trajnih promena.</p>",
          backgroundImage: "/legacy/images/mirrored/session-banner.webp",
        },
        intro: {
          title: "Kako izgleda psihoterapijski rad",
          body: serviceParagraphs([
            "Psihodinamska psihoterapija ne bavi se samo ublažavanjem simptoma, već razumevanjem unutrašnjih konflikata, obrazaca odnosa i načina na koje lična istorija oblikuje sadašnji život.",
            "U fokusu rada su teme koje se ponavljaju, odnosi koji iscrpljuju, osećanja koja dugo traju i teškoće koje utiču na svakodnevno funkcionisanje. Proces se razvija postepeno, u ritmu koji je prilagođen osobi.",
            "Cilj nije brzo rešenje, već dublje razumevanje sebe i stabilnija promena koja može da se održi i van terapijskog prostora.",
          ]),
          image: "/legacy/images/mirrored/service-3.png",
          highlights: [
            "Dugoročniji i kontinuiran proces",
            "Rad na dubljim uzrocima teškoća",
            "Individualno prilagođen ritam susreta",
          ],
        },
        faqs: toFaqs(psychotherapyFaqs.slice(1, 4)),
      },
      {
        slug: "psiholosko-savetovanje",
        seo: {
          title: `${items[1].title} | Psihoterapijski kabinet Ikar`,
          description: items[1].copy,
        },
        banner: {
          title: items[1].title,
          description:
            "<p>Psihološko savetovanje pruža jasniju podršku u periodima stresa, krize, dilema i životnih prelaza, kada je potreban fokusiraniji i kraći oblik rada.</p>",
          backgroundImage: "/legacy/images/Banner-Home-3-1_1Banner Home 3 (1).webp",
        },
        intro: {
          title: "Kada savetovanje ima najviše smisla",
          body: serviceParagraphs([
            "Psihološko savetovanje je namenjeno situacijama u kojima je osobi potrebna stručna podrška, ali ne nužno i dugoročan psihoterapijski proces. Najčešće je korisno u periodima stresa, akutnih kriza, važnih odluka ili promena.",
            "Za razliku od psihoterapije, savetovanje je više usmereno na aktuelnu situaciju, njeno razumevanje i traženje održivog načina da se osoba kroz nju kreće sa što više stabilnosti.",
            "Ovakav rad može biti kraćeg trajanja, ali i dalje podrazumeva aktivno učešće, promišljanje i saradnju, a ne gotova rešenja koja neko drugi nameće.",
          ]),
          image: "/legacy/images/mirrored/service-img.png",
          highlights: [
            "Podrška u stresu, krizi i dilemi",
            "Kraći i fokusiraniji format rada",
            "Jasniji plan narednih koraka",
          ],
        },
        faqs: toFaqs([
          {
            question: 'Da li psihološko savetovanje može da "leči" mentalne bolesti?',
            answer:
              "Cilj psihološkog savetovanja nije lečenje mentalnih poremećaja, već pružanje podrške i pomoći pri nošenju sa njima, posebno u kriznim i prelaznim životnim periodima.",
          },
          {
            question: 'Kako se psihodinamsko savetovanje razlikuje od "običnog" savetovanja?',
            answer:
              "Psihodinamsko savetovanje uzima u obzir širu sliku ličnosti i životnog konteksta, pa se ne zadržava samo na površinskom uklanjanju neprijatnih osećanja, već pokušava da razume njihovo značenje i funkciju.",
          },
          {
            question: "Koliko dugo traje savetodavni proces?",
            answer:
              "Savetovanje je uglavnom kraće od psihoterapije, ali nema unapred zadat rok. Nekome je dovoljan jedan susret, a nekome nekoliko meseci kontinuiteta, u zavisnosti od situacije i potreba.",
          },
        ]),
      },
      {
        slug: "konsultacije",
        seo: {
          title: `${items[2].title} | Psihoterapijski kabinet Ikar`,
          description: items[2].copy,
        },
        banner: {
          title: items[2].title,
          description:
            "<p>Konsultativni termin je namenjen razjašnjavanju dilema, informisanju i proceni koji oblik podrške najviše odgovara Vašoj situaciji.</p>",
          backgroundImage: "/legacy/images/Banner-Contact-1_1Banner Contact (1).webp",
        },
        intro: {
          title: "Čemu služi konsultativni termin",
          body: serviceParagraphs([
            "Konsultacije su dobar prvi korak kada osoba još nije sigurna da li joj je potrebna psihoterapija, savetovanje ili samo dodatno pojašnjenje u vezi sa sopstvenom situacijom.",
            "Na konsultativnom terminu razgovaramo o razlogu javljanja, trenutnim teškoćama, očekivanjima i mogućim pravcima daljeg rada. Cilj nije da se odmah otvori dubinski proces, već da se napravi jasnija procena.",
            "Ovakav susret može biti koristan i kada Vam je potrebna profesionalna orijentacija, dodatno objašnjenje terapijskog procesa ili pomoć da odlučite šta je u ovom trenutku za Vas najadekvatnije.",
          ]),
          image: "/legacy/images/mirrored/session-img-1.png",
          highlights: [
            "Prvi korak bez pritiska da odmah ulazite u proces",
            "Procena formata podrške koji Vam najviše odgovara",
            "Jasnije razumevanje narednih koraka",
          ],
        },
        faqs: toFaqs([
          appointmentFaqs[0],
          {
            question: "Da li konsultacije znače da moram da nastavim dalje sa radom?",
            answer:
              "Ne. Konsultativni termin služi da razjasnimo potrebe i mogućnosti. Nakon razgovora možete odlučiti da li želite nastavak rada i u kom formatu.",
          },
          {
            question: "Šta mogu da očekujem od prvog konsultativnog susreta?",
            answer:
              "Možete očekivati strukturisan razgovor o tome zbog čega se javljate, šta Vas opterećuje i koji oblik podrške bi u datom trenutku mogao biti najkorisniji za Vas.",
          },
        ]),
      },
    ],
  };
};

export const getDefaultAboutPageManagedContent = (): AboutPageManagedContent => {
  const content = getAboutPageData();
  const dictionary = getDictionary();

  return {
    seo: {
      title: dictionary.meta.about.title,
      description: dictionary.meta.about.description,
    },
    banner: {
      title: content.banner.title,
      description: content.banner.description ?? "",
      backgroundImage: content.banner.backgroundImage ?? "",
    },
    showcase: {
      title: content.showcaseTitle,
      videoUrl: content.showcaseVideoHref,
      videoImage: content.showcaseVideoImage,
      cards: content.showcaseCards.map((card) => ({
        title: card.title,
        copy: card.copy,
        image: card.image,
      })),
    },
    idea: {
      title: content.ideaTitle,
      body: content.ideaHtml,
    },
    focus: {
      title: content.focusTitle,
      items: content.focusItems,
    },
    recent: {
      title: content.recentTitle,
      copy: content.recentCopy,
      label: content.recentLabel,
      empty: content.recentEmptyLabel,
    },
  };
};

export const buildAboutPageData = (content: AboutPageManagedContent) => ({
  seo: content.seo,
  hiddenBlocks: content.hiddenBlocks ?? [],
  blockBackgrounds: content.blockBackgrounds ?? {},
  banner: {
    title: content.banner.title,
    description: content.banner.description,
    backgroundImage: content.banner.backgroundImage,
    theme: "dark" as const,
    align: "split" as const,
  },
  showcaseTitle: content.showcase.title,
  showcaseVideoHref: content.showcase.videoUrl,
  showcaseVideoImage: content.showcase.videoImage,
  showcaseCards: content.showcase.cards.map((card, index) => ({
    ...card,
    href: aboutShowcaseHrefs[index] ?? "/psihoterapija/",
  })),
  ideaTitle: content.idea.title,
  ideaHtml: content.idea.body,
  focusTitle: content.focus.title,
  focusItems: content.focus.items,
  recentTitle: content.recent.title,
  recentCopy: content.recent.copy,
  recentHref: "/blog/",
  recentLabel: content.recent.label,
  recentEmptyLabel: content.recent.empty,
});

export const getDefaultBiographyPageManagedContent = (): BiographyPageManagedContent => {
  const content = getBiographyPageData();
  const dictionary = getDictionary();

  return {
    seo: {
      title: dictionary.meta.biography.title,
      description: dictionary.meta.biography.description,
    },
    banner: {
      title: content.banner.title,
      description: content.banner.description ?? "",
      backgroundImage: content.banner.backgroundImage ?? "",
    },
    cardsSection: {
      title: content.cardsTitle,
      copy: content.cardsCopy,
      cards: content.cards.map((card) => ({
        slug: card.slug,
        title: card.title,
        role: card.role,
        summary: card.summary,
        body: card.body,
        image: card.image,
        highlights: card.highlights,
      })),
    },
    approach: {
      title: content.approachTitle,
      copy: content.approachCopy,
      points: content.approachPoints,
      image: content.approachImage,
      ctaLabel: content.ctaLabel,
    },
  };
};

export const buildBiographyPageData = (content: BiographyPageManagedContent) => ({
  seo: content.seo,
  hiddenBlocks: content.hiddenBlocks ?? [],
  blockBackgrounds: content.blockBackgrounds ?? {},
  banner: {
    title: content.banner.title,
    description: content.banner.description,
    backgroundImage: content.banner.backgroundImage,
    theme: "dark" as const,
    align: "split" as const,
  },
  cardsTitle: content.cardsSection.title,
  cardsCopy: content.cardsSection.copy,
  cards: content.cardsSection.cards.map((card) => ({
    ...card,
    href: `/biografija/${card.slug}/`,
  })),
  approachTitle: content.approach.title,
  approachCopy: content.approach.copy,
  approachPoints: content.approach.points,
  approachImage: content.approach.image,
  ctaHref: "/zakazivanje/",
  ctaLabel: content.approach.ctaLabel,
});

export const buildBiographyDetailPageData = (
  content: BiographyPageManagedContent,
  slug: string,
) => {
  const cards = content.cardsSection.cards.map((card) => ({
    ...card,
    href: `/biografija/${card.slug}/`,
  }));
  const profile = cards.find((card) => card.slug === slug);

  if (!profile) {
    return null;
  }

  return {
    banner: {
      title: profile.bannerTitle?.trim() ? profile.bannerTitle : profile.title,
      description: profile.bannerDescription?.trim() ? profile.bannerDescription : profile.role,
      backgroundImage: content.banner.backgroundImage,
      theme: "dark" as const,
      align: "split" as const,
    },
    profile,
    backHref: "/biografija/",
    backLabel: content.banner.title,
    relatedTitle: content.cardsSection.title,
    relatedProfiles: cards.filter((card) => card.slug !== slug),
  };
};

export const getDefaultPsychotherapyPageManagedContent = (): PsychotherapyPageManagedContent => {
  const content = getPsychotherapyPageData();
  const home = getHomePageData();
  const dictionary = getDictionary();

  return {
    seo: {
      title: dictionary.meta.psychotherapy.title,
      description: dictionary.meta.psychotherapy.description,
    },
    banner: {
      title: content.banner.title,
      description: content.banner.description ?? "",
      backgroundImage: "",
    },
    scope: {
      title: content.scopeTitle,
      items: content.scopeItems,
    },
    services: {
      cards: content.serviceCards.map((card) => ({
        title: card.title,
        copy: card.copy,
        image: card.image,
      })),
    },
    booking: {
      title: home.booking.title,
      copy: home.booking.copy,
      formatLabel: home.booking.formatLabel,
      formats: home.booking.formats,
    },
    faq: {
      items: content.faqs.map((item) => ({
        question: item.question,
        answer: item.answer ?? "",
      })),
      image: content.faqImage,
    },
  };
};

export const buildPsychotherapyPageData = (content: PsychotherapyPageManagedContent) => ({
  seo: content.seo,
  hiddenBlocks: content.hiddenBlocks ?? [],
  blockBackgrounds: content.blockBackgrounds ?? {},
  banner: {
    title: content.banner.title,
    description: content.banner.description,
    backgroundImage: content.banner.backgroundImage,
    theme: "light" as const,
    align: "split" as const,
  },
  scopeTitle: content.scope.title,
  scopeItems: content.scope.items,
  serviceCards: content.services.cards.map((card) => ({
    ...card,
    href: "/zakazivanje/",
    label: "",
  })),
  booking: {
    title: content.booking.title,
    copy: content.booking.copy,
    formatLabel: content.booking.formatLabel,
    formats: content.booking.formats,
  },
  faqs: content.faq.items.map((item) => ({
    question: item.question,
    answerHtml: item.answer,
  })),
  faqImage: content.faq.image,
});

export const getDefaultScopePageManagedContent = (): ScopePageManagedContent => {
  const content = getScopePageData();
  const firstDetail = getScopeDetailPageData(defaultScopeSlugs[0]);
  const dictionary = getDictionary();

  return {
    seo: {
      title: `${dictionary.nav.therapyLinks.scope} | ${siteConfig.name}`,
      description: content.banner.description ?? "",
    },
    banner: {
      title: content.banner.title,
      description: content.banner.description ?? "",
      backgroundImage: content.banner.backgroundImage ?? "",
    },
    intro: {
      title: content.scopeTitle,
      items: content.scopeItems,
    },
    tabs: content.tabs.map((tab) => ({
      id: tab.id,
      label: tab.label,
      tabMeta: tab.tabMeta,
      icon: tab.icon,
      summaryTitle: tab.summaryTitle,
      summaryCopy: tab.summaryCopy,
      panelEyebrow: tab.panelEyebrow,
      panelStatLabel: tab.panelStatLabel,
      panelCtaLabel: tab.panelCtaLabel,
      detailImage: tab.detailImage,
      detailBannerDescription: tab.detailBannerDescription,
      detailEyebrow: tab.detailEyebrow,
      detailLead: tab.detailLead,
      detailBackLabel: tab.detailBackLabel,
      detailCtaLabel: tab.detailCtaLabel,
      items: tab.items,
    })),
    detail: {
      relatedTitle: firstDetail?.relatedTitle ?? "",
    },
    focus: {
      title: content.focusTitle,
      copy: content.focusCopy,
      secondaryCopy: content.focusSecondaryCopy,
      image: content.focusImage,
      ctaLabel: content.focusCtaLabel,
    },
    recent: {
      title: content.recentTitle,
      copy: content.recentCopy,
      label: content.recentLabel,
      empty: content.recentEmpty,
    },
  };
};

export const buildScopePageData = (content: ScopePageManagedContent) => ({
  seo: content.seo,
  hiddenBlocks: content.hiddenBlocks ?? [],
  blockBackgrounds: content.blockBackgrounds ?? {},
  banner: {
    title: content.banner.title,
    description: content.banner.description,
    backgroundImage: undefined,
    theme: "light" as const,
    align: "split" as const,
  },
  tabs: content.tabs.map((tab) => ({
    ...tab,
    cardTitle: tab.summaryTitle,
    cardCopy: tab.summaryCopy,
    href: `/psihoterapija/#psych-tab-${tab.id}`,
  })),
  scopeTitle: content.intro.title,
  scopeItems: content.intro.items,
  focusTitle: content.focus.title,
  focusCopy: content.focus.copy,
  focusSecondaryCopy: content.focus.secondaryCopy,
  focusImage: content.focus.image,
  focusCtaHref: "/o-nama/",
  focusCtaLabel: content.focus.ctaLabel,
  recentTitle: content.recent.title,
  recentCopy: content.recent.copy,
  recentHref: "/blog/",
  recentLabel: content.recent.label,
  recentEmpty: content.recent.empty,
});

export const buildScopeDetailPageData = (
  content: ScopePageManagedContent,
  slug: string,
) => {
  const tabs = content.tabs.map((tab) => ({
    ...tab,
    cardTitle: tab.summaryTitle,
    cardCopy: tab.summaryCopy,
    href: `/psihoterapija/#psych-tab-${tab.id}`,
  }));
  const currentTab = tabs.find((tab) => tab.id === slug);

  if (!currentTab) {
    return null;
  }

  return {
    banner: {
      title: currentTab.label,
      description: currentTab.detailBannerDescription,
      backgroundImage: undefined,
      theme: "dark" as const,
      align: "split" as const,
    },
    eyebrow: currentTab.detailEyebrow,
    lead: currentTab.detailLead,
    image: currentTab.detailImage,
    items: currentTab.items,
    backHref: "/psihoterapija/",
    backLabel: currentTab.detailBackLabel,
    ctaHref: "/zakazivanje/",
    ctaLabel: currentTab.detailCtaLabel,
    relatedTitle: content.detail.relatedTitle,
    relatedTabs: tabs.filter((tab) => tab.id !== slug),
  };
};

export const getDefaultPricingPageManagedContent = (): PricingPageManagedContent => {
  const content = getPricingPageData();
  const dictionary = getDictionary();

  return {
    seo: {
      title: `${dictionary.nav.therapyLinks.pricing} | ${siteConfig.name}`,
      description: content.banner.description ?? "",
    },
    banner: {
      title: content.banner.title,
      description: content.banner.description ?? "",
      backgroundImage: content.banner.backgroundImage ?? "",
    },
    plans: content.plans.map((plan) => ({
      title: plan.title,
      price: plan.price,
      outsideSerbiaPrice: plan.outsideSerbiaPrice,
      ctaLabel: plan.ctaLabel,
    })),
    infoCards: content.infoCards,
  };
};

export const buildPricingPageData = (content: PricingPageManagedContent) => ({
  seo: content.seo,
  hiddenBlocks: content.hiddenBlocks ?? [],
  blockBackgrounds: content.blockBackgrounds ?? {},
  banner: {
    title: content.banner.title,
    description: content.banner.description,
    backgroundImage: content.banner.backgroundImage,
    theme: "dark" as const,
    align: "split" as const,
  },
  plans: content.plans.map((plan) => ({
    ...plan,
    ctaHref: "/zakazivanje/",
  })),
  infoCards: content.infoCards,
});

export const getDefaultAppointmentPageManagedContent = (): AppointmentPageManagedContent => {
  const content = getAppointmentPageData();
  const dictionary = getDictionary();

  return {
    seo: {
      title: dictionary.meta.appointment.title,
      description: dictionary.meta.appointment.description,
    },
    banner: {
      title: content.banner.title,
      description: content.banner.description ?? "",
      backgroundImage: content.banner.backgroundImage ?? "",
    },
    booking: {
      title: content.formTitle,
      copy: content.banner.description ?? "",
      formatLabel: content.formatLabel,
      formats: content.formats,
    },
    faq: {
      items: content.faqs.map((item) => ({
        question: item.question,
        answer: item.answer ?? "",
      })),
      image: content.faqImage,
    },
  };
};

export const buildAppointmentPageData = (content: AppointmentPageManagedContent) => ({
  seo: content.seo,
  hiddenBlocks: content.hiddenBlocks ?? [],
  blockBackgrounds: content.blockBackgrounds ?? {},
  banner: {
    title: content.banner.title,
    description: content.banner.description,
    backgroundImage: content.banner.backgroundImage,
    theme: "dark" as const,
    align: "split" as const,
  },
  formTitle: content.booking.title,
  introCopy: content.booking.copy,
  formatLabel: content.booking.formatLabel,
  formats: content.booking.formats,
  faqs: content.faq.items.map((item) => ({
    question: item.question,
    answerHtml: item.answer,
  })),
  faqImage: content.faq.image,
});

export const getDefaultFaqPageManagedContent = (): FaqPageManagedContent => {
  const content = getFaqPageData();
  const dictionary = getDictionary();

  return {
    seo: {
      title: dictionary.meta.faq.title,
      description: dictionary.meta.faq.description,
    },
    banner: {
      title: content.banner.title,
      description: content.banner.description ?? "",
      backgroundImage: content.banner.backgroundImage ?? "",
    },
    faq: {
      items: content.items.map((item) => ({
        question: item.question,
        answer: item.answer ?? "",
      })),
      image: content.faqImage,
    },
    booking: {
      title: content.bookingTitle,
      copy: content.bookingCopy,
      formatLabel: content.formatLabel,
      formats: content.formats,
    },
  };
};

export const buildFaqPageData = (content: FaqPageManagedContent) => ({
  seo: content.seo,
  hiddenBlocks: content.hiddenBlocks ?? [],
  blockBackgrounds: content.blockBackgrounds ?? {},
  banner: {
    title: content.banner.title,
    description: content.banner.description,
    backgroundImage: content.banner.backgroundImage,
    theme: "dark" as const,
    align: "split" as const,
  },
  items: content.faq.items.map((item) => ({
    question: item.question,
    answerHtml: item.answer,
  })),
  faqImage: content.faq.image,
  bookingTitle: content.booking.title,
  bookingCopy: content.booking.copy,
  formatLabel: content.booking.formatLabel,
  formats: content.booking.formats,
});

export const getDefaultContactPageManagedContent = (): ContactPageManagedContent => {
  const content = getContactPageData();
  const dictionary = getDictionary();
  const bannerDescription =
    "description" in content.banner && typeof content.banner.description === "string"
      ? content.banner.description
      : "";

  return {
    seo: {
      title: dictionary.meta.contact.title,
      description: dictionary.meta.contact.description,
    },
    banner: {
      title: content.banner.title,
      description: bannerDescription,
      backgroundImage: content.banner.backgroundImage ?? "",
    },
    introTitle: content.introTitle,
    introCopy: content.introCopy,
    formTitle: content.formTitle,
    contactLabels: content.contactLabels,
    phone: siteConfig.contactPhone,
    email: siteConfig.contactEmail,
    socialLinks: [
      {
        platform: "facebook",
        label: "Fejsbuk profil",
        href: "https://www.facebook.com/",
      },
      {
        platform: "instagram",
        label: "Instagram profil",
        href: "https://www.instagram.com/",
      },
      {
        platform: "linkedin",
        label: "LinkedIn profil",
        href: "https://www.linkedin.com/",
      },
    ],
    officesTitle: content.officesTitle,
    officesCopy: content.officesCopy,
    officeGallery: [
      "/legacy/images/Office-1-1_1Office 1 (1).webp",
      "/legacy/images/Office-2-1_1Office 2 (1).webp",
      "/legacy/images/Office-3-1_1Office 3 (1).webp",
    ],
  };
};

export const buildContactPageData = (content: ContactPageManagedContent) => ({
  seo: content.seo,
  hiddenBlocks: content.hiddenBlocks ?? [],
  blockBackgrounds: content.blockBackgrounds ?? {},
  banner: {
    title: content.banner.title,
    description: content.banner.description,
    backgroundImage: content.banner.backgroundImage,
    theme: "dark" as const,
    align: "center" as const,
  },
  introTitle: content.introTitle,
  introCopy: content.introCopy,
  formTitle: content.formTitle,
  contactLabels: content.contactLabels,
  phone: content.phone,
  email: content.email,
  socialLinks: content.socialLinks,
  officesTitle: content.officesTitle,
  officesCopy: content.officesCopy,
  officeGallery: content.officeGallery,
});

export const getDefaultBlogIndexPageManagedContent = (): BlogIndexPageManagedContent => {
  const dictionary = getDictionary();
  const ui = dictionary.blog.index;

  return {
    seo: {
      title: dictionary.meta.blog.title,
      description: dictionary.meta.blog.description,
    },
    banner: {
      title: dictionary.blog.title,
      description: ui.bannerDescription,
      backgroundImage: "/legacy/images/blog-header-hero.svg",
    },
    allPostsTitle: ui.allPosts,
    postsLabel: ui.postsLabel,
    searchTitle: ui.searchTitle,
    searchPlaceholder: ui.searchPlaceholder,
    searchActionLabel: ui.searchAction,
    recentTitle: ui.recentTitle,
    keywordsTitle: ui.keywordsTitle,
    allKeywordsLabel: ui.allKeywords,
    noResultsText: ui.noResults,
  };
};

export const buildBlogIndexPageData = (content: BlogIndexPageManagedContent) => ({
  seo: content.seo,
  hiddenBlocks: content.hiddenBlocks ?? [],
  blockBackgrounds: content.blockBackgrounds ?? {},
  banner: {
    title: content.banner.title,
    description: content.banner.description,
    backgroundImage: content.banner.backgroundImage,
    theme: "dark" as const,
    align: "split" as const,
  },
  allPostsTitle: content.allPostsTitle,
  postsLabel: content.postsLabel,
  searchTitle: content.searchTitle,
  searchPlaceholder: content.searchPlaceholder,
  searchActionLabel: content.searchActionLabel,
  recentTitle: content.recentTitle,
  keywordsTitle: content.keywordsTitle,
  allKeywordsLabel: content.allKeywordsLabel,
  noResultsText: content.noResultsText,
});
