import { getDictionary } from "@/features/i18n/translate";
import type {
  ServiceItemManagedContent,
  ServicesPageManagedContent,
} from "@/features/page-content/types/page-content.types";
import type {
  ServiceDetailData,
  ServiceDetailSlug,
} from "@/data/fixtures/service-details";

const mirroredImages = {
  logoService1: "/legacy/images/mirrored/logo-service-1.png",
  logoService2: "/legacy/images/mirrored/logo-service-2.png",
  logoService3: "/legacy/images/mirrored/logo-service-3.png",
  service3: "/legacy/images/mirrored/service-3.png",
  serviceImage: "/legacy/images/mirrored/service-img.png",
  sessionImage: "/legacy/images/mirrored/session-img-1.png",
  supportImage: "/legacy/images/mirrored/support-img.webp",
  scopeIcon1: "/legacy/images/mirrored/scope-icon-1.png",
  scopeIcon2: "/legacy/images/mirrored/scope-icon-2.png",
  scopeIcon3: "/legacy/images/mirrored/scope-icon-3.png",
  scopeIcon4: "/legacy/images/mirrored/scope-icon-4.png",
  sessionBanner: "/legacy/images/mirrored/session-banner.webp",
} as const;

export type BannerData = {
  title: string;
  description?: string;
  theme?: "light" | "dark";
  backgroundImage?: string;
  align?: "split" | "center";
};

export type FaqAccordionItem = {
  question: string;
  answer?: string;
  answerHtml?: string;
};

type BiographyCard = {
  slug: string;
  title: string;
  role: string;
  summary: string;
  body: string;
  image: string;
  href: string;
  highlights: string[];
};

type ScopeTabItem = {
  title: string;
  copy: string;
};

type ScopeTab = {
  id: string;
  label: string;
  tabMeta: string;
  icon: string;
  summaryTitle: string;
  summaryCopy: string;
  panelEyebrow: string;
  panelStatLabel: string;
  panelCtaLabel: string;
  detailImage: string;
  detailBannerDescription: string;
  detailEyebrow: string;
  detailLead: string;
  detailBackLabel: string;
  detailCtaLabel: string;
  cardTitle: string;
  cardCopy: string;
  href: string;
  items: ScopeTabItem[];
};

type ScopeTabSeed = Omit<ScopeTab, "cardTitle" | "cardCopy" | "href">;

type PricingPlan = {
  title: string;
  price: string;
  ctaHref: string;
  ctaLabel: string;
};

type PricingInfoCard = {
  title: string;
  copy: string;
};

type PsychotherapyServiceCard = {
  title: string;
  copy: string;
  href: string;
  label: string;
  image: string;
};

export const getAboutPageData = () => {
  const dictionary = getDictionary();
  const content = dictionary.pages.about;
  const serviceItems = dictionary.homePage.services.items;

  return {
    banner: {
      ...content.banner,
      theme: "dark" as const,
      backgroundImage: "/legacy/images/BG-Video-2_1BG Video (2).webp",
      align: "split" as const,
    },
    showcaseTitle: content.showcaseTitle,
    showcaseVideoHref: "https://www.youtube.com/watch?v=KGg5cIjHQiw",
    showcaseVideoImage: "/legacy/images/Video-BG-About-Us-1_1Video BG About Us (1).webp",
    showcaseEmptyLabel: content.showcaseEmptyLabel,
    showcaseCards: [
      {
        title: serviceItems[2].title,
        copy: serviceItems[2].copy,
        href: "/zakazivanje/",
        image: mirroredImages.logoService1,
      },
      {
        title: serviceItems[0].title,
        copy: serviceItems[0].copy,
        href: "/psihoterapija/",
        image: mirroredImages.logoService2,
      },
      {
        title: serviceItems[1].title,
        copy: serviceItems[1].copy,
        href: "/psihoterapija/",
        image: mirroredImages.logoService3,
      },
    ],
    ideaTitle: content.ideaTitle,
    ideaHtml: content.ideaHtml,
    focusTitle: content.focusTitle,
    focusItems: content.focusItems,
    recentTitle: content.recentTitle,
    recentCopy: content.recentCopy,
    recentHref: "/blog/",
    recentLabel: content.recentLabel,
    recentReadMoreLabel: content.recentReadMoreLabel,
    recentEmptyLabel: content.recentEmptyLabel,
  };
};

export const getPsychotherapyPageData = () => {
  const dictionary = getDictionary();
  const content = dictionary.pages.psychotherapy;
  const serviceItems = dictionary.homePage.services.items;
  const serviceCards: PsychotherapyServiceCard[] = [
    {
      title: serviceItems[0].title,
      copy: serviceItems[0].copy,
      href: "/zakazivanje/",
      label: serviceItems[0].label,
      image: mirroredImages.service3,
    },
    {
      title: serviceItems[1].title,
      copy: serviceItems[1].copy,
      href: "/zakazivanje/",
      label: serviceItems[1].label,
      image: mirroredImages.serviceImage,
    },
    {
      title: serviceItems[2].title,
      copy: serviceItems[2].copy,
      href: "/zakazivanje/",
      label: serviceItems[2].label,
      image: mirroredImages.sessionImage,
    },
  ];

  return {
    banner: {
      ...content.banner,
      theme: "light" as const,
      align: "split" as const,
    },
    scopeTitle: content.scopeTitle,
    scopeItems: content.scopeItems,
    serviceCards,
    bookingTitleHtml: content.bookingTitleHtml,
    formatLabel: content.formatLabel,
    formats: content.formats,
    faqs: content.faqs satisfies FaqAccordionItem[],
    faqImage: mirroredImages.supportImage,
  };
};

const getScopeTabSeeds = (): ScopeTabSeed[] => [
  {
    id: "anksiozna-stanja",
    label: "Anksiozna stanja",
    icon: mirroredImages.scopeIcon1,
    detailImage: mirroredImages.scopeIcon1,
    detailLead:
      "Kada napetost postane stalno prisutna, psihoterapijski proces pomaže da se razumeju unutrašnji konflikti i postepeno vrati osećaj stabilnosti.",
    items: [
      {
        title: "Anksiozna stanja i poremećaji",
        copy: "Kada napetost, strah i ubrzane misli dugotrajno remete svakodnevno funkcionisanje.",
      },
      {
        title: "Panični napadi i telesni simptomi",
        copy: "Rad na razumevanju okidača, osećaja gubitka kontrole i ciklusa izbegavanja.",
      },
      {
        title: "Opsesivne i ruminativne misli",
        copy: "Postupno prepoznavanje obrazaca koji održavaju anksioznost i unutrašnju napetost.",
      },
    ],
  },
  {
    id: "depresivna-stanja",
    label: "Depresivna stanja",
    icon: mirroredImages.scopeIcon3,
    detailImage: mirroredImages.scopeIcon3,
    detailLead:
      "U terapiji radimo na razumevanju osećaja bezvoljnosti, unutrašnje praznine i gubitka smisla kroz stabilan i kontinuiran proces.",
    items: [
      {
        title: "Depresivna stanja i poremećaji",
        copy: "Pad energije, bezvoljnost i gubitak smisla koji traju i utiču na kvalitet života.",
      },
      {
        title: "Povlačenje i gubitak motivacije",
        copy: "Postupno vraćanje u kontakt sa ličnim potrebama, ritmom i osloncima.",
      },
      {
        title: "Samokritičnost i osećaj bezvrednosti",
        copy: "Rad na unutrašnjem dijalogu i obrascima koji održavaju depresivnost.",
      },
    ],
  },
  {
    id: "poremecaji-licnosti",
    label: "Poremećaji ličnosti",
    icon: mirroredImages.scopeIcon2,
    detailImage: mirroredImages.scopeIcon2,
    detailLead:
      "Fokus rada je na obrascima odnosa, doživljaju sebe i načinima emocionalne regulacije koji se dugotrajno ponavljaju.",
    items: [
      {
        title: "Poremećaji ličnosti",
        copy: "Ponavljajući obrasci odnosa i slike o sebi koji dugotrajno stvaraju teškoće.",
      },
      {
        title: "Hronične poteškoće u odnosima",
        copy: "Teme bliskosti, granica, odbacivanja i konflikta u partnerskim i porodičnim odnosima.",
      },
      {
        title: "Emocionalna nestabilnost",
        copy: "Rad na prepoznavanju i regulaciji intenzivnih emocija i impulsivnih reakcija.",
      },
    ],
  },
  {
    id: "traume",
    label: "Traume",
    icon: mirroredImages.scopeIcon4,
    detailImage: mirroredImages.scopeIcon4,
    detailLead:
      "Traumatska iskustva ostavljaju trajne emocionalne tragove. Cilj terapije je postepena integracija iskustva i stabilizacija svakodnevnog funkcionisanja.",
    items: [
      {
        title: "Trauma i posttraumatske reakcije",
        copy: "Iskustva koja ostaju psihološki aktivna i nakon što su se objektivno završila.",
      },
      {
        title: "Gubitak i krize identiteta",
        copy: "Periodi intenzivnih promena u kojima se preispituju uloge, smisao i lični pravac.",
      },
      {
        title: "Ponavljanje destruktivnih obrazaca",
        copy: "Razumevanje nesvesnih ponavljanja i njihovog uticaja na odnose i životne izbore.",
      },
    ],
  },
];

const getScopeTabs = (): ScopeTab[] =>
  getScopeTabSeeds().map((tab) => {
    const itemCount = tab.items.length;
    const countLabel = "teme u fokusu";
    const panelEyebrow = "Oblast rada";
    const detailBackLabel = "Nazad na oblast rada";
    const detailCtaLabel = "Zakažite termin";
    const panelCtaLabel = "Pogledaj stranicu";
    const summaryTitle = tab.items[0]?.title ?? tab.label;
    const summaryCopy = tab.items[0]?.copy ?? "";

    return {
      ...tab,
      tabMeta: `${itemCount} ${countLabel}`,
      summaryTitle,
      summaryCopy,
      panelEyebrow,
      panelStatLabel: countLabel,
      panelCtaLabel,
      detailBannerDescription: summaryCopy,
      detailEyebrow: panelEyebrow,
      detailBackLabel,
      detailCtaLabel,
      cardTitle: summaryTitle,
      cardCopy: summaryCopy,
      href: `/psihoterapija/#psych-tab-${tab.id}`,
    };
  });

export const getScopePageData = () => {
  const dictionary = getDictionary();
  const content = dictionary.pages.psychotherapy;
  const tabs = getScopeTabs();

  return {
    banner: {
      title: "Oblast rada",
      description:
        "Ovde možete pročitati detaljnije o različitim mentalnim poremećajima, psihološkim stanjima i temama sa kojima radimo.",
      theme: "dark" as const,
      backgroundImage: mirroredImages.sessionBanner,
      align: "split" as const,
    },
    tabs,
    scopeTitle: content.scopeTitle,
    scopeItems: content.scopeItems,
    focusTitle: "Vodeći centar za psihoterapijsko savetovanje",
    focusCopy:
      "Psihoterapijski rad se zasniva na jasnom profesionalnom okviru, kontinuitetu i odnosu poverenja.",
    focusSecondaryCopy:
      "Proces je prilagođen pojedincu i usmeren na razumevanje uzroka teškoća, a ne samo njihovih posledica.",
    focusImage: "/legacy/images/Video-BG-About-Us-1_1Video BG About Us (1).webp",
    focusCtaHref: "/o-nama/",
    focusCtaLabel: dictionary.nav.about,
    recentTitle: dictionary.homePage.recent.title,
    recentCopy: dictionary.homePage.recent.copy,
    recentHref: "/blog/",
    recentLabel: dictionary.homePage.recent.label,
    recentEmpty: dictionary.homePage.recent.empty,
  };
};

export const getScopeDetailSlugs = () => getScopeTabs().map((tab) => tab.id);

export const getScopeDetailPageData = (slug: string) => {
  const dictionary = getDictionary();
  const tabs = getScopeTabs();
  const currentTab = tabs.find((tab) => tab.id === slug);

  if (!currentTab) {
    return null;
  }

  return {
    banner: {
      title: currentTab.label,
      description: currentTab.cardCopy,
      theme: "dark" as const,
      backgroundImage: mirroredImages.sessionBanner,
      align: "split" as const,
    },
    eyebrow: "Oblast rada",
    lead: currentTab.detailLead,
    image: currentTab.detailImage,
    items: currentTab.items,
    backHref: "/psihoterapija/",
    backLabel: "Nazad na psihoterapiju",
    ctaHref: "/zakazivanje/",
    ctaLabel: dictionary.nav.appointment,
    relatedTitle: "Ostale teme",
    relatedTabs: tabs.filter((tab) => tab.id !== slug),
  };
};

export const getPricingPageData = () => {
  const dictionary = getDictionary();
  const serviceItems = dictionary.homePage.services.items;

  const plans: PricingPlan[] = [
    {
      title: "Psihoterapijska seansa",
      price: "3500 RSD",
      ctaHref: "/zakazivanje/",
      ctaLabel: "Zakažite termin",
    },
    {
      title: "Psihološko savetovanje",
      price: "3500 RSD",
      ctaHref: "/zakazivanje/",
      ctaLabel: "Zakažite termin",
    },
    {
      title: "Konsultacija",
      price: "4000 RSD",
      ctaHref: "/zakazivanje/",
      ctaLabel: "Zakažite termin",
    },
  ];

  const infoCards: PricingInfoCard[] = [
    {
      title: "Psihoterapijske seanse",
      copy: serviceItems[0].copy,
    },
    {
      title: "Psihološko savetovanje",
      copy: serviceItems[1].copy,
    },
    {
      title: "Konsultacije",
      copy: serviceItems[2].copy,
    },
  ];

  return {
    banner: {
      title: "Cena",
      description: "Ispod možete videti različite vrste usluga koje naš kabinet nudi.",
      theme: "dark" as const,
      backgroundImage: "/legacy/images/Pricing_1Pricing.webp",
      align: "split" as const,
    },
    plans,
    infoCards,
  };
};

export const getFaqPageData = () => {
  const dictionary = getDictionary();
  const content = dictionary.pages.faq;

  return {
    banner: {
      ...content.banner,
      theme: "dark" as const,
      backgroundImage: "/legacy/images/Banner-Contact-1_1Banner Contact (1).webp",
      align: "split" as const,
    },
    sectionTitle: content.banner.title,
    sectionIntro: content.banner.description,
    sectionTags: content.formats,
    items: content.items satisfies FaqAccordionItem[],
    faqImage: mirroredImages.supportImage,
    bookingTitle: content.bookingTitle,
    bookingCopy: dictionary.homePage.booking.copy,
    formatLabel: content.formatLabel,
    formats: content.formats,
  };
};

export const getContactPageData = () => {
  const content = getDictionary().pages.contact;

  return {
    banner: {
      ...content.banner,
      theme: "dark" as const,
      backgroundImage: "/legacy/images/Banner-Contact-1_1Banner Contact (1).webp",
      align: "center" as const,
    },
    introTitle: content.introTitle,
    introCopy: content.introCopy,
    formTitle: content.formTitle,
    contactLabels: content.contactLabels,
    officesTitle: content.officesTitle,
    officesCopy: content.officesCopy,
  };
};

export const getAppointmentPageData = () => {
  const content = getDictionary().pages.appointment;

  return {
    banner: {
      ...content.banner,
      theme: "dark" as const,
      backgroundImage: "/legacy/images/Appointment_1Appointment.webp",
      align: "split" as const,
    },
    formTitle: content.formTitle,
    formatLabel: content.formatLabel,
    formats: content.formats,
    faqs: content.faqs satisfies FaqAccordionItem[],
    faqImage: mirroredImages.supportImage,
  };
};

export const getBiographyPageData = () => {
  const dictionary = getDictionary();
  const services = dictionary.homePage.services.items;
  const biographySlugs = ["nemanja-zajkeskovic", "kabinet-ikar", "prostor-za-terapijski-rad"];

  const cards: BiographyCard[] = [
    {
      slug: biographySlugs[0],
      title: "Nemanja Zajkešković",
      role: "Master psiholog i psihodinamski psihoterapeut",
      summary: dictionary.homePage.about.paragraphs[0],
      body: dictionary.homePage.about.paragraphs[0],
      image: "/legacy/images/Doctor--1_1Doctor  (1).webp",
      href: `/biografija/${biographySlugs[0]}/`,
      highlights: ["Psihodinamska psihoterapija", "Individualni rad", "Dugoročni proces"],
    },
    {
      slug: biographySlugs[1],
      title: "Psihoterapijski kabinet Ikar",
      role: "Struktura rada i profesionalni okvir",
      summary:
        "Rad se odvija u jasnom profesionalnom okviru, uz stabilan ritam susreta, dogovorena pravila i kontinuirano praćenje ciljeva.",
      body: "Rad se odvija u jasnom profesionalnom okviru, uz stabilan ritam susreta, dogovorena pravila i kontinuirano praćenje ciljeva.",
      image: "/legacy/images/Team-Details_1Team Details.webp",
      href: `/biografija/${biographySlugs[1]}/`,
      highlights: [services[0].title, services[1].title, services[2].title],
    },
    {
      slug: biographySlugs[2],
      title: "Prostor za terapijski rad",
      role: "Uživo i online formati",
      summary:
        "Terapijski susreti se organizuju uživo ili online, u skladu sa procenom potreba i jasno definisanim planom rada.",
      body: "Terapijski susreti se organizuju uživo ili online, u skladu sa procenom potreba i jasno definisanim planom rada.",
      image: "/legacy/images/Team-Img-1_1Team Img (1).webp",
      href: `/biografija/${biographySlugs[2]}/`,
      highlights: ["Poverljivost", "Kontinuitet", "Fokus na promenu"],
    },
  ];

  return {
    banner: {
      title: dictionary.nav.biography,
      description:
        "Profesionalni put, pristup radu i vrednosti na kojima zasnivamo psihoterapijski proces.",
      theme: "dark" as const,
      backgroundImage: "/legacy/images/Our-team_1Our team.webp",
      align: "split" as const,
    },
    cardsTitle: "Stručni profil i radni kontekst",
    cardsCopy:
      "Na jednom mestu možete videti ko vodi rad, kako je proces postavljen i u kom okviru se terapija odvija.",
    cards,
    approachTitle: "Pristup radu",
    approachCopy:
      "Psihoterapija se postavlja kao saradnički proces u kom se postepeno razvija razumevanje lične dinamike, odnosa i unutrašnjih konflikata.",
    approachPoints: [
      "Terapija je prostor za rad na temama koje se ponavljaju i utiču na svakodnevno funkcionisanje.",
      "Ciljevi rada se definišu zajedno i povremeno preispituju kako bi proces imao jasnu smernicu.",
      "Kontinuitet i redovnost su ključni za dubinske i stabilne psihološke promene.",
    ],
    approachImage: "/legacy/images/Our-team_1Our team.webp",
    ctaHref: "/zakazivanje/",
    ctaLabel: dictionary.homePage.hero.primaryActionLabel,
  };
};

export const officeGallery = [
  "/legacy/images/Office-1-1_1Office 1 (1).webp",
  "/legacy/images/Office-2-1_1Office 2 (1).webp",
  "/legacy/images/Office-3-1_1Office 3 (1).webp",
];

export const buildServiceDetailData = (
  service: ServiceItemManagedContent,
): ServiceDetailData => ({
  slug: service.slug as ServiceDetailSlug,
  seo: service.seo,
  banner: {
    title: service.banner.title,
    description: service.banner.description,
    backgroundImage: service.banner.backgroundImage,
    theme: "dark",
    align: "split",
  },
  intro: {
    title: service.intro.title,
    body: service.intro.body,
    image: service.intro.image,
    highlights: service.intro.highlights,
  },
  faqs: service.faqs.map((faq) => ({ question: faq.question, answerHtml: faq.answer })),
});

export const buildServicesPageData = (content: ServicesPageManagedContent) => ({
  seo: content.seo,
  services: content.services.map((service) => buildServiceDetailData(service)),
});
