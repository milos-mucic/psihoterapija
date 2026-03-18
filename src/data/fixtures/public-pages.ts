import { localizePath } from "@/features/i18n/locale";
import { getDictionary } from "@/features/i18n/translate";
import type { SiteLocale } from "@/lib/config/site";

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
  title: string;
  role: string;
  summary: string;
  image: string;
  highlights: string[];
};

type ScopeTabItem = {
  title: string;
  copy: string;
};

type ScopeTab = {
  id: string;
  label: string;
  icon: string;
  detailImage: string;
  detailLead: string;
  cardTitle: string;
  cardCopy: string;
  href: string;
  items: ScopeTabItem[];
};

type ScopeTabSeed = Omit<ScopeTab, "cardTitle" | "cardCopy" | "href">;

type PricingPlan = {
  title: string;
  price: string;
  outsideSerbiaPrice: string;
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

export const getAboutPageData = (locale: SiteLocale) => {
  const dictionary = getDictionary(locale);
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
        href: localizePath(locale, "/zakazivanje/"),
        image:
          "https://cdn.prod.website-files.com/689b44011832e2b57d6920e4/689b44011832e2b57d692288_Logo%20Service%201.png",
      },
      {
        title: serviceItems[0].title,
        copy: serviceItems[0].copy,
        href: localizePath(locale, "/psihoterapija/"),
        image:
          "https://cdn.prod.website-files.com/689b44011832e2b57d6920e4/689b44011832e2b57d692289_Logo%20Service%202.png",
      },
      {
        title: serviceItems[1].title,
        copy: serviceItems[1].copy,
        href: localizePath(locale, "/psihoterapija/"),
        image:
          "https://cdn.prod.website-files.com/689b44011832e2b57d6920e4/689b44011832e2b57d69228a_Logo%20Service%203.png",
      },
    ],
    ideaTitle: content.ideaTitle,
    ideaHtml: content.ideaHtml,
    focusTitle: content.focusTitle,
    focusItems: content.focusItems,
    recentTitle: content.recentTitle,
    recentCopy: content.recentCopy,
    recentHref: localizePath(locale, "/blog/"),
    recentLabel: content.recentLabel,
    recentReadMoreLabel: content.recentReadMoreLabel,
    recentEmptyLabel: content.recentEmptyLabel,
  };
};

export const getPsychotherapyPageData = (locale: SiteLocale) => {
  const dictionary = getDictionary(locale);
  const content = dictionary.pages.psychotherapy;
  const serviceItems = dictionary.homePage.services.items;
  const serviceCards: PsychotherapyServiceCard[] = [
    {
      title: serviceItems[0].title,
      copy: serviceItems[0].copy,
      href: localizePath(locale, "/zakazivanje/"),
      label: serviceItems[0].label,
      image:
        "https://cdn.prod.website-files.com/689b44011832e2b57d6920e4/689b44011832e2b57d69229c_Service%203.png",
    },
    {
      title: serviceItems[1].title,
      copy: serviceItems[1].copy,
      href: localizePath(locale, "/zakazivanje/"),
      label: serviceItems[1].label,
      image:
        "https://cdn.prod.website-files.com/689b44011832e2b57d6920e4/689b44011832e2b57d69228d_Service%20Img.png",
    },
    {
      title: serviceItems[2].title,
      copy: serviceItems[2].copy,
      href: localizePath(locale, "/zakazivanje/"),
      label: serviceItems[2].label,
      image:
        "https://uploads-ssl.webflow.com/6569b75914a6537423ee9927/656dcaf20f6eba5989f094e8_Session%20Img%201.png",
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
    faqImage:
      "https://cdn.prod.website-files.com/689b44011832e2b57d692055/689b44011832e2b57d6921cc__Support%20Img.webp",
  };
};

const getScopeTabSeeds = (locale: SiteLocale): ScopeTabSeed[] => {
  const isCyrillic = locale === "sr-cyrl";

  return isCyrillic
    ? [
        {
          id: "anksiozna-stanja",
          label: "Анксиозна стања",
          icon: "https://cdn.prod.website-files.com/689b44011832e2b57d6920e4/689b44011832e2b57d6922a6_4.png",
          detailImage:
            "https://cdn.prod.website-files.com/689b44011832e2b57d6920e4/689b44011832e2b57d6922a6_4.png",
          detailLead:
            "Када напетост постане стално присутна, психотерапијски процес помаже да се разумеју унутрашњи конфликти и постепено врати осећај стабилности.",
          items: [
            {
              title: "Анксиозна стања и поремећаји",
              copy: "Када напетост, страх и убрзане мисли дуготрајно ремете свакодневно функционисање.",
            },
            {
              title: "Панични напади и телесни симптоми",
              copy: "Рад на разумевању окидача, осећаја губитка контроле и циклуса избегавања.",
            },
            {
              title: "Опсесивне и руминативне мисли",
              copy: "Поступно препознавање образаца који одржавају анксиозност и унутрашњу напетост.",
            },
          ],
        },
        {
          id: "poremecaji-licnosti",
          label: "Поремећаји личности",
          icon: "https://cdn.prod.website-files.com/689b44011832e2b57d6920e4/689b44011832e2b57d692286_Session%20Icon%202.png",
          detailImage:
            "https://cdn.prod.website-files.com/689b44011832e2b57d6920e4/689b44011832e2b57d692286_Session%20Icon%202.png",
          detailLead:
            "Фокус рада је на обрасцима односа, доживљају себе и начинима емоционалне регулације који се дуготрајно понављају.",
          items: [
            {
              title: "Поремећаји личности",
              copy: "Понављајући обрасци односа и слике о себи који дуготрајно стварају тешкоће.",
            },
            {
              title: "Хроничне потешкоће у односима",
              copy: "Теме блискости, граница, одбацивања и конфликта у партнерским и породичним односима.",
            },
            {
              title: "Емоционална нестабилност",
              copy: "Рад на препознавању и регулацији интензивних емоција и импулсивних реакција.",
            },
          ],
        },
        {
          id: "depresivna-stanja",
          label: "Депресивна стања",
          icon: "https://cdn.prod.website-files.com/689b44011832e2b57d6920e4/689b44011832e2b57d692287_Session%20Icon%203.png",
          detailImage:
            "https://cdn.prod.website-files.com/689b44011832e2b57d6920e4/689b44011832e2b57d692287_Session%20Icon%203.png",
          detailLead:
            "У терапији радимо на разумевању осећаја безвољности, унутрашње празнине и губитка смисла, кроз стабилан и континуиран процес.",
          items: [
            {
              title: "Депресивна стања и поремећаји",
              copy: "Пад енергије, безвољност и губитак смисла који трају и утичу на квалитет живота.",
            },
            {
              title: "Повлачење и губитак мотивације",
              copy: "Поступно враћање у контакт са личним потребама, ритмом и ослонцима.",
            },
            {
              title: "Самокритичност и осећај безвредности",
              copy: "Рад на унутрашњем дијалогу и обрасцима који одржавају депресивност.",
            },
          ],
        },
        {
          id: "trauma",
          label: "Траума",
          icon: "https://cdn.prod.website-files.com/689b44011832e2b57d6920e4/689b44011832e2b57d692285_Session%20Icon%201.png",
          detailImage:
            "https://cdn.prod.website-files.com/689b44011832e2b57d6920e4/689b44011832e2b57d692285_Session%20Icon%201.png",
          detailLead:
            "Трауматска искуства остављају трајне емоционалне трагове. Циљ терапије је постепена интеграција искуства и стабилизација свакодневног функционисања.",
          items: [
            {
              title: "Траума и посттрауматске реакције",
              copy: "Искуства која остају психолошки активна и након што су се објективно завршила.",
            },
            {
              title: "Губитак и кризе идентитета",
              copy: "Периоди интензивних промена у којима се преиспитују улоге, смисао и лични правац.",
            },
            {
              title: "Понављање деструктивних образаца",
              copy: "Разумевање несвесних понављања и њиховог утицаја на односе и животне изборе.",
            },
          ],
        },
      ]
    : [
        {
          id: "anksiozna-stanja",
          label: "Anksiozna stanja",
          icon: "https://cdn.prod.website-files.com/689b44011832e2b57d6920e4/689b44011832e2b57d6922a6_4.png",
          detailImage:
            "https://cdn.prod.website-files.com/689b44011832e2b57d6920e4/689b44011832e2b57d6922a6_4.png",
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
          id: "poremecaji-licnosti",
          label: "Poremećaji ličnosti",
          icon: "https://cdn.prod.website-files.com/689b44011832e2b57d6920e4/689b44011832e2b57d692286_Session%20Icon%202.png",
          detailImage:
            "https://cdn.prod.website-files.com/689b44011832e2b57d6920e4/689b44011832e2b57d692286_Session%20Icon%202.png",
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
          id: "depresivna-stanja",
          label: "Depresivna stanja",
          icon: "https://cdn.prod.website-files.com/689b44011832e2b57d6920e4/689b44011832e2b57d692287_Session%20Icon%203.png",
          detailImage:
            "https://cdn.prod.website-files.com/689b44011832e2b57d6920e4/689b44011832e2b57d692287_Session%20Icon%203.png",
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
          id: "trauma",
          label: "Trauma",
          icon: "https://cdn.prod.website-files.com/689b44011832e2b57d6920e4/689b44011832e2b57d692285_Session%20Icon%201.png",
          detailImage:
            "https://cdn.prod.website-files.com/689b44011832e2b57d6920e4/689b44011832e2b57d692285_Session%20Icon%201.png",
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
};

const getScopeTabs = (locale: SiteLocale): ScopeTab[] =>
  getScopeTabSeeds(locale).map((tab) => ({
    ...tab,
    cardTitle: tab.items[0]?.title ?? tab.label,
    cardCopy: tab.items[0]?.copy ?? "",
    href: localizePath(locale, `/oblast-rada/${tab.id}/`),
  }));

export const getScopePageData = (locale: SiteLocale) => {
  const dictionary = getDictionary(locale);
  const content = dictionary.pages.psychotherapy;
  const isCyrillic = locale === "sr-cyrl";
  const tabs = getScopeTabs(locale);

  return {
    banner: {
      title: isCyrillic ? "Област рада" : "Oblast rada",
      description: isCyrillic
        ? "Овде можете прочитати детаљније о различитим менталним поремећајима, психолошким стањима и темама са којима радимо."
        : "Ovde možete pročitati detaljnije o različitim mentalnim poremećajima, psihološkim stanjima i temama sa kojima radimo.",
      theme: "dark" as const,
      backgroundImage:
        "https://cdn.prod.website-files.com/689b44011832e2b57d692055/689b44011832e2b57d6921fd_Session%20Banner%20(1).webp",
      align: "split" as const,
    },
    tabs,
    scopeTitle: content.scopeTitle,
    scopeItems: content.scopeItems,
    focusTitle: isCyrillic
      ? "Водећи центар за психотерапијско саветовање"
      : "Vodeći centar za psihoterapijsko savetovanje",
    focusCopy: isCyrillic
      ? "Психотерапијски рад се заснива на јасном професионалном оквиру, континуитету и односу поверења."
      : "Psihoterapijski rad se zasniva na jasnom profesionalnom okviru, kontinuitetu i odnosu poverenja.",
    focusSecondaryCopy: isCyrillic
      ? "Процес је прилагођен појединцу и усмерен на разумевање узрока потешкоћа, а не само њихових последица."
      : "Proces je prilagođen pojedincu i usmeren na razumevanje uzroka teškoća, a ne samo njihovih posledica.",
    focusImage: "/legacy/images/Video-BG-About-Us-1_1Video BG About Us (1).webp",
    focusCtaHref: localizePath(locale, "/o-nama/"),
    focusCtaLabel: dictionary.nav.about,
    recentTitle: dictionary.homePage.recent.title,
    recentCopy: dictionary.homePage.recent.copy,
    recentHref: localizePath(locale, "/blog/"),
    recentLabel: dictionary.homePage.recent.label,
    recentEmpty: dictionary.homePage.recent.empty,
  };
};

export const getScopeDetailSlugs = (locale: SiteLocale) =>
  getScopeTabs(locale).map((tab) => tab.id);

export const getScopeDetailPageData = (locale: SiteLocale, slug: string) => {
  const dictionary = getDictionary(locale);
  const isCyrillic = locale === "sr-cyrl";
  const tabs = getScopeTabs(locale);
  const currentTab = tabs.find((tab) => tab.id === slug);

  if (!currentTab) {
    return null;
  }

  return {
    banner: {
      title: currentTab.label,
      description: currentTab.cardCopy,
      theme: "dark" as const,
      backgroundImage:
        "https://cdn.prod.website-files.com/689b44011832e2b57d692055/689b44011832e2b57d6921fd_Session%20Banner%20(1).webp",
      align: "split" as const,
    },
    eyebrow: isCyrillic ? "Област рада" : "Oblast rada",
    lead: currentTab.detailLead,
    image: currentTab.detailImage,
    items: currentTab.items,
    backHref: localizePath(locale, "/oblast-rada/"),
    backLabel: isCyrillic ? "Назад на област рада" : "Nazad na oblast rada",
    ctaHref: localizePath(locale, "/zakazivanje/"),
    ctaLabel: dictionary.nav.appointment,
    relatedTitle: isCyrillic ? "Остале теме" : "Ostale teme",
    relatedTabs: tabs.filter((tab) => tab.id !== slug),
  };
};

export const getPricingPageData = (locale: SiteLocale) => {
  const dictionary = getDictionary(locale);
  const serviceItems = dictionary.homePage.services.items;
  const isCyrillic = locale === "sr-cyrl";

  const plans: PricingPlan[] = [
    {
      title: isCyrillic ? "Психотерапијска сеанса" : "Psihoterapijska seansa",
      price: "3500 RSD",
      outsideSerbiaPrice: isCyrillic
        ? "За уплате изван Републике Србије, цена износи 35 € + провизија."
        : "Za uplate izvan Republike Srbije, cena iznosi 35 € + provizija.",
      ctaHref: localizePath(locale, "/zakazivanje/"),
      ctaLabel: isCyrillic ? "Закажите термин" : "Zakažite termin",
    },
    {
      title: isCyrillic ? "Психолошко саветовање" : "Psihološko savetovanje",
      price: "3500 RSD",
      outsideSerbiaPrice: isCyrillic
        ? "За уплате изван Републике Србије, цена износи 35 € + провизија."
        : "Za uplate izvan Republike Srbije, cena iznosi 35 € + provizija.",
      ctaHref: localizePath(locale, "/zakazivanje/"),
      ctaLabel: isCyrillic ? "Закажите термин" : "Zakažite termin",
    },
    {
      title: isCyrillic ? "Консултација" : "Konsultacija",
      price: "4000 RSD",
      outsideSerbiaPrice: isCyrillic
        ? "За уплате изван Републике Србије, цена износи 40 € + провизија."
        : "Za uplate izvan Republike Srbije, cena iznosi 40 € + provizija.",
      ctaHref: localizePath(locale, "/zakazivanje/"),
      ctaLabel: isCyrillic ? "Закажите термин" : "Zakažite termin",
    },
  ];

  const infoCards: PricingInfoCard[] = [
    {
      title: isCyrillic ? "Психотерапијске сеансе" : "Psihoterapijske seanse",
      copy: serviceItems[0].copy,
    },
    {
      title: isCyrillic ? "Психолошко саветовање" : "Psihološko savetovanje",
      copy: serviceItems[1].copy,
    },
    {
      title: isCyrillic ? "Консултације" : "Konsultacije",
      copy: serviceItems[2].copy,
    },
  ];

  return {
    banner: {
      title: isCyrillic ? "Цена" : "Cena",
      description: isCyrillic
        ? "Испод можете видети различите врсте услуга које наш кабинет нуди."
        : "Ispod možete videti različite vrste usluga koje naš kabinet nudi.",
      theme: "dark" as const,
      backgroundImage: "/legacy/images/Pricing_1Pricing.webp",
      align: "split" as const,
    },
    plans,
    infoCards,
  };
};

export const getFaqPageData = (locale: SiteLocale) => {
  const dictionary = getDictionary(locale);
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
    faqImage:
      "https://cdn.prod.website-files.com/689b44011832e2b57d692055/689b44011832e2b57d6921cc__Support%20Img.webp",
    bookingTitle: content.bookingTitle,
    bookingCopy: dictionary.homePage.booking.copy,
    formatLabel: content.formatLabel,
    formats: content.formats,
  };
};

export const getContactPageData = (locale: SiteLocale) => {
  const content = getDictionary(locale).pages.contact;

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

export const getAppointmentPageData = (locale: SiteLocale) => {
  const content = getDictionary(locale).pages.appointment;

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
    faqImage:
      "https://cdn.prod.website-files.com/689b44011832e2b57d692055/689b44011832e2b57d6921cc__Support%20Img.webp",
  };
};

export const getBiographyPageData = (locale: SiteLocale) => {
  const dictionary = getDictionary(locale);
  const isCyrillic = locale === "sr-cyrl";
  const services = dictionary.homePage.services.items;

  const cards: BiographyCard[] = [
    {
      title: isCyrillic ? "Немања Зајкешковић" : "Nemanja Zajkešković",
      role: isCyrillic
        ? "Мастер психолог и психодинамски психотерапеут"
        : "Master psiholog i psihodinamski psihoterapeut",
      summary: dictionary.homePage.about.paragraphs[0],
      image: "/legacy/images/Doctor--1_1Doctor  (1).webp",
      highlights: isCyrillic
        ? ["Психодинамска психотерапија", "Индивидуални рад", "Дугорочни процес"]
        : ["Psihodinamska psihoterapija", "Individualni rad", "Dugoročni proces"],
    },
    {
      title: isCyrillic ? "Психотерапијски кабинет Икар" : "Psihoterapijski kabinet Ikar",
      role: isCyrillic
        ? "Структура рада и професионални оквир"
        : "Struktura rada i profesionalni okvir",
      summary: isCyrillic
        ? "Рад се одвија у јасном професионалном оквиру, уз стабилан ритам сусрета, договорена правила и континуирано праћење циљева."
        : "Rad se odvija u jasnom profesionalnom okviru, uz stabilan ritam susreta, dogovorena pravila i kontinuirano praćenje ciljeva.",
      image: "/legacy/images/Team-Details_1Team Details.webp",
      highlights: [services[0].title, services[1].title, services[2].title],
    },
    {
      title: isCyrillic ? "Простор за терапијски рад" : "Prostor za terapijski rad",
      role: isCyrillic ? "Уживо и online формати" : "Uživo i online formati",
      summary: isCyrillic
        ? "Терапијски сусрети се организују уживо или online, у складу са проценом потреба и јасно дефинисаним планом рада."
        : "Terapijski susreti se organizuju uživo ili online, u skladu sa procenom potreba i jasno definisanim planom rada.",
      image: "/legacy/images/Team-Img-1_1Team Img (1).webp",
      highlights: isCyrillic
        ? ["Поверљивост", "Континуитет", "Фокус на промену"]
        : ["Poverljivost", "Kontinuitet", "Fokus na promenu"],
    },
  ];

  return {
    banner: {
      title: dictionary.nav.biography,
      description: isCyrillic
        ? "Професионални пут, приступ раду и вредности на којима заснивамо психотерапијски процес."
        : "Profesionalni put, pristup radu i vrednosti na kojima zasnivamo psihoterapijski proces.",
      theme: "dark" as const,
      backgroundImage: "/legacy/images/Our-team_1Our team.webp",
      align: "split" as const,
    },
    cardsTitle: isCyrillic ? "Стручни профил и радни контекст" : "Stručni profil i radni kontekst",
    cardsCopy: isCyrillic
      ? "На једном месту можете видети ко води рад, како је процес постављен и у ком оквиру се терапија одвија."
      : "Na jednom mestu možete videti ko vodi rad, kako je proces postavljen i u kom okviru se terapija odvija.",
    cards,
    approachTitle: isCyrillic ? "Приступ раду" : "Pristup radu",
    approachCopy: isCyrillic
      ? "Психотерапија се поставља као сараднички процес у ком се постепено развија разумевање личне динамике, односа и унутрашњих конфликата."
      : "Psihoterapija se postavlja kao saradnički proces u kom se postepeno razvija razumevanje lične dinamike, odnosa i unutrašnjih konflikata.",
    approachPoints: isCyrillic
      ? [
          "Терапија је простор за рад на темама које се понављају и утичу на свакодневно функционисање.",
          "Циљеви рада се дефинишу заједно и повремено преиспитују како би процес имао јасну смерницу.",
          "Континуитет и редовност су кључни за дубинске и стабилне психолошке промене.",
        ]
      : [
          "Terapija je prostor za rad na temama koje se ponavljaju i utiču na svakodnevno funkcionisanje.",
          "Ciljevi rada se definišu zajedno i povremeno preispituju kako bi proces imao jasnu smernicu.",
          "Kontinuitet i redovnost su ključni za dubinske i stabilne psihološke promene.",
        ],
    approachImage: "/legacy/images/Our-team_1Our team.webp",
    ctaHref: localizePath(locale, "/zakazivanje/"),
    ctaLabel: dictionary.homePage.hero.primaryActionLabel,
  };
};

export const officeGallery = [
  "/legacy/images/Office-1-1_1Office 1 (1).webp",
  "/legacy/images/Office-2-1_1Office 2 (1).webp",
  "/legacy/images/Office-3-1_1Office 3 (1).webp",
];
