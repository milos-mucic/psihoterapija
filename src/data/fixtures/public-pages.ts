import { localizePath } from "@/features/i18n/locale";
import type { SiteLocale } from "@/lib/config/site";

export type BannerData = {
  title: string;
  description?: string;
  theme?: "light" | "dark";
  backgroundImage?: string;
};

export type FaqAccordionItem = {
  question: string;
  answer: string;
};

export type PageLinkCard = {
  title: string;
  copy: string;
  href: string;
  label: string;
};

const getAboutPageDataLatn = (locale: SiteLocale) => ({
  banner: {
    title: "Ko smo mi?",
    description: "Na stranici ispod mozete naci dodatne informacije o nasem kabinetu.",
    theme: "dark" as const,
    backgroundImage: "/legacy/images/BG-Video-2_1BG Video (2).webp",
  },
  showcaseTitle: "Psihoterapijski kabinet Ikar",
  showcaseVideoHref: "https://www.youtube.com/watch?v=KGg5cIjHQiw",
  showcaseVideoImage: "/legacy/images/Video-BG-About-Us-1_1Video BG About Us (1).webp",
  showcaseCards: [
    "Dugorocni psihoterapijski proces usmeren ka dubinskim promenama.",
    "Jasan profesionalni okvir, poverljivost i stabilnost rada.",
    "Informisanje i edukacija kao deo odgovorne terapijske prakse.",
  ],
  ideaTitle: "Glavna ideja naseg kabineta",
  ideaParagraphs: [
    "U savremenoj psiholoskoj praksi razvijenih zemalja, psihoterapija predstavlja pravno standardizovan i odgovoran vid pomoci, zasnovan na jasnim teorijskim okvirima, klinickom iskustvu i etickim principima.",
    "U nasoj zemlji ona je i dalje cesto pracena konfuzijom, mistikom i nejasnim ocekivanjima, kao i razlicitim pristupima koji se predstavljaju kao terapijski, a koji neretko nemaju trajno ili stvarno dejstvo, najcesce na ustrb samih klijenata i pacijenata.",
    "Nas rad je usmeren i ka osvetljavanju toga sta psihoterapija jeste, ali i sta ona nije. Verujemo da se psiholosko zdravlje ne moze posmatrati izdvojeno od drustvenog konteksta i da je individualni rad uvek i ljudski odnos.",
    "U uzem smislu, cilj nam je profesionalan i odgovoran psihoterapijski rad, zasnovan na intervencijama koje su klijentima zaista potrebne. Na psihoterapiju ne dolazi dijagnoza, vec covek.",
  ],
  focusTitle: "Bavimo se:",
  focusItems: [
    "Poremecajima licnosti",
    "Anksioznim stanjima",
    "Depresivnim stanjima",
    "Hronicnim poteskocama u odnosima i vezama",
    "Krizama identiteta, traumama i gubicima",
  ],
  recentTitle: "Najnovije objave na nasem sajtu",
  recentCopy: "Budite u toku sa novim tekstovima iz oblasti psihologije i psihoterapije.",
  recentHref: localizePath(locale, "/blog/"),
  recentLabel: "Sve objave",
  recentEmpty: "Objave ce uskoro biti dostupne.",
  readMoreLabel: "Procitajte tekst",
});

const getAboutPageDataCyrl = (locale: SiteLocale) => ({
  banner: {
    title: "Ко смо ми?",
    description: "На страници испод можете наћи додатне информације о нашем кабинету.",
    theme: "dark" as const,
    backgroundImage: "/legacy/images/BG-Video-2_1BG Video (2).webp",
  },
  showcaseTitle: "Психотерапијски кабинет Икар",
  showcaseVideoHref: "https://www.youtube.com/watch?v=KGg5cIjHQiw",
  showcaseVideoImage: "/legacy/images/Video-BG-About-Us-1_1Video BG About Us (1).webp",
  showcaseCards: [
    "Дугорочни психотерапијски процес усмерен ка дубинским променама.",
    "Јасан професионални оквир, поверљивост и стабилност рада.",
    "Информисање и едукација као део одговорне терапијске праксе.",
  ],
  ideaTitle: "Главна идеја нашег кабинета",
  ideaParagraphs: [
    "У савременој психолошкој пракси развијених земаља, психотерапија представља правно стандардизован и одговоран вид помоћи, заснован на јасним теоријским оквирима, клиничком искуству и етичким принципима.",
    "У нашој земљи она је и даље често праћена конфузијом, мистиком и нејасним очекивањима, као и различитим приступима који се представљају као терапијски, а који неретко немају трајно или стварно дејство, најчешће на уштрб самих клијената и пацијената.",
    "Наш рад је усмерен и ка осветљавању тога шта психотерапија јесте, али и шта она није. Верујемо да се психолошко здравље не може посматрати издвојено од друштвеног контекста и да је индивидуални рад увек и људски однос.",
    "У ужем смислу, циљ нам је професионалан и одговоран психотерапијски рад, заснован на интервенцијама које су клијентима заиста потребне. На психотерапију не долази дијагноза, већ човек.",
  ],
  focusTitle: "Бавимо се:",
  focusItems: [
    "Поремећајима личности",
    "Анксиозним стањима",
    "Депресивним стањима",
    "Хроничним потешкоћама у односима и везама",
    "Кризама идентитета, траумама и губицима",
  ],
  recentTitle: "Најновије објаве на нашем сајту",
  recentCopy: "Будите у току са новим текстовима из области психологије и психотерапије.",
  recentHref: localizePath(locale, "/blog/"),
  recentLabel: "Све објаве",
  recentEmpty: "Објаве ће ускоро бити доступне.",
  readMoreLabel: "Прочитајте текст",
});

const getPsychotherapyPageDataLatn = (locale: SiteLocale) => ({
  banner: {
    title: "Psihoterapijski pristup",
    description:
      "U nasem kabinetu bavimo se psihodinamskom psihoterapijom, koja je dubinski orijentisana na razumevanje i razresavanje uzroka, a ne samo posledica psiholoskih teskoca.",
    theme: "light" as const,
  },
  scopeTitle: "Opseg rada",
  scopeItems: [
    "Anksiozna stanja i poremecaji",
    "Depresivna stanja i poremecaji",
    "Poremecaji licnosti",
    "Hronicne poteskoce u odnosima i vezama",
    "Psihoticni poremecaji",
    "Gubitak, trauma i krize identiteta",
    "Ponavljanje destruktivnih zivotnih obrazaca",
  ],
  cards: [
    {
      title: "Dubinsko razumevanje",
      copy: "Fokus je na unutrasnjim konfliktima, ponavljajucim odnosima i znacenjima koja oblikuju simptome.",
      href: localizePath(locale, "/o-nama/"),
      label: "O nama",
    },
    {
      title: "Kontinuitet procesa",
      copy: "Promena se ne gradi kroz brza resenja, vec kroz stabilan terapijski odnos i kontinuitet rada.",
      href: localizePath(locale, "/zakazivanje/"),
      label: "Zakazite termin",
    },
    {
      title: "Prilagodjeno pojedincu",
      copy: "Svako zapocinje terapiju iz drugacijeg mesta, zbog cega i rad mora biti prilagodjen konkretnoj osobi.",
      href: localizePath(locale, "/kontakt/"),
      label: "Postavite pitanje",
    },
  ] satisfies PageLinkCard[],
  bookingTitle: "Neophodne informacije o zakazivanju termina",
  bookingCopy: "Posaljite osnovne podatke i javicemo Vam se u najkracem mogucem roku.",
  bookingFormats: ["Psihodinamska psihoterapija", "Psiholosko savetovanje", "Konsultacije"],
  faqTitle: "Najcesca pitanja",
  faqs: [
    {
      question: "Koja je razlika izmedju psihologa i psihoterapeuta?",
      answer:
        "U Republici Srbiji, psiholog postaje osoba koja zavrsi osnovne studije psihologije, dok je psihoterapeut onaj koji nakon osnovnih studija prolazi i visegodisnju psihoterapijsku edukaciju.",
    },
    {
      question: "Kako da znam da mi je potrebna psihoterapija?",
      answer:
        "O psihoterapiji mozete razmisljati ako dozivljavate emocionalne teskoce, prolazite kroz tezak zivotni period ili primecujete da se obrasci koji Vas opterecuju ponavljaju iznova.",
    },
    {
      question: "Koliko traje psihoterapija?",
      answer:
        "Trajanje ne moze biti unapred precizno odredjeno. Zavisi od ciljeva, prirode teskoca i dubine promena na kojima se radi.",
    },
    {
      question: "Kako izgleda prvi susret sa psihoterapeutom?",
      answer:
        "Prvi susret sluzi da dobijete prostor da opisete razloge dolaska, a da mi predlozimo okvir daljeg rada i odgovorimo na pitanja i nedoumice koje imate.",
    },
  ] satisfies FaqAccordionItem[],
});

const getPsychotherapyPageDataCyrl = (locale: SiteLocale) => ({
  banner: {
    title: "Психотерапијски приступ",
    description:
      "У нашем кабинету бавимо се психодинамском психотерапијом, која је дубински оријентисана на разумевање и разрешење узрока, а не само последица психолошких тешкоћа.",
    theme: "light" as const,
  },
  scopeTitle: "Опсег рада",
  scopeItems: [
    "Анксиозна стања и поремећаји",
    "Депресивна стања и поремећаји",
    "Поремећаји личности",
    "Хроничне потешкоће у односима и везама",
    "Психотични поремећаји",
    "Губитак, траума и кризе идентитета",
    "Понављање деструктивних животних образаца",
  ],
  cards: [
    {
      title: "Дубинско разумевање",
      copy: "Фокус је на унутрашњим конфликтима, понављајућим односима и значењима која обликују симптоме.",
      href: localizePath(locale, "/o-nama/"),
      label: "О нама",
    },
    {
      title: "Континуитет процеса",
      copy: "Промена се не гради кроз брза решења, већ кроз стабилан терапијски однос и континуитет рада.",
      href: localizePath(locale, "/zakazivanje/"),
      label: "Закажите термин",
    },
    {
      title: "Прилагођено појединцу",
      copy: "Свако започиње терапију из другачијег места, због чега и рад мора бити прилагођен конкретној особи.",
      href: localizePath(locale, "/kontakt/"),
      label: "Поставите питање",
    },
  ] satisfies PageLinkCard[],
  bookingTitle: "Неопходне информације о заказивању термина",
  bookingCopy: "Пошаљите основне податке и јавићемо Вам се у најкраћем могућем року.",
  bookingFormats: ["Психодинамска психотерапија", "Психолошко саветовање", "Консултације"],
  faqTitle: "Најчешћа питања",
  faqs: [
    {
      question: "Која је разлика између психолога и психотерапеута?",
      answer:
        "У Републици Србији, психолог постаје особа која заврши основне студије психологије, док је психотерапеут онај који након основних студија пролази и вишегодишњу психотерапијску едукацију.",
    },
    {
      question: "Како да знам да ми је потребна психотерапија?",
      answer:
        "О психотерапији можете размишљати ако доживљавате емоционалне тешкоће, пролазите кроз тежак животни период или примећујете да се обрасци који Вас оптерећују понављају изнова.",
    },
    {
      question: "Колико траје психотерапија?",
      answer:
        "Трајање не може бити унапред прецизно одређено. Зависи од циљева, природе тешкоћа и дубине промена на којима се ради.",
    },
    {
      question: "Како изгледа први сусрет са психотерапеутом?",
      answer:
        "Први сусрет служи да добијете простор да опишете разлоге доласка, а да ми предложимо оквир даљег рада и одговоримо на питања и недоумице које имате.",
    },
  ] satisfies FaqAccordionItem[],
});

const getFaqPageDataLatn = () => ({
  banner: {
    title: "Pitanja",
    description: "Ovde mozete pronaci odgovore na najcesce postavljena pitanja.",
    theme: "light" as const,
  },
  title: "Cesta pitanja",
  items: [
    {
      question: 'Da li je moguce "izleciti se" bez psihoterapije?',
      answer:
        "Neke zivotne krize je moguce prebroditi uz licne resurse i podrsku bliskih ljudi, ali psihoterapija moze znacajno pomoci ako se teskoce ponavljaju ili postaju preopterecujuce.",
    },
    {
      question: "Kako da znam da mi je potrebna terapija?",
      answer:
        "Kada osetite da se napetost, tuga, strahovi ili problemi u odnosima ponavljaju i pocinju da oblikuju Vas svakodnevni zivot, vredi razmisliti o razgovoru sa strucnim licem.",
    },
    {
      question: "Sta je psihodinamska terapija?",
      answer:
        "To je pristup koji nastoji da simptome razume kroz njihove uzroke, unutrasnje konflikte, licnu istoriju i odnose, a ne samo kroz povrsinsko ublazavanje teskoca.",
    },
    {
      question: "Kako izgleda prvi susret?",
      answer:
        "Prvi susret sluzi da dobijete prostor da opisete razloge dolaska, a da mi predlozimo okvir daljeg rada i odgovorimo na nedoumice koje imate.",
    },
  ] satisfies FaqAccordionItem[],
  bookingTitle: "Unesite neophodne informacije kako bi zakazali termin",
  bookingCopy: "Posaljite osnovne podatke i javicemo Vam se sa predlogom narednog koraka.",
  bookingFormats: ["Psihodinamska psihoterapija", "Psiholosko savetovanje", "Konsultacije"],
});

const getFaqPageDataCyrl = () => ({
  banner: {
    title: "Питања",
    description: "Овде можете пронаћи одговоре на најчешће постављена питања.",
    theme: "light" as const,
  },
  title: "Честа питања",
  items: [
    {
      question: 'Да ли је могуће "излечити се" без психотерапије?',
      answer:
        "Неке животне кризе је могуће пребродити уз личне ресурсе и подршку блиских људи, али психотерапија може значајно помоћи ако се тешкоће понављају или постају преоптерећујуће.",
    },
    {
      question: "Како да знам да ми је потребна терапија?",
      answer:
        "Када осетите да се напетост, туга, страхови или проблеми у односима понављају и почињу да обликују Ваш свакодневни живот, вреди размислити о разговору са стручним лицем.",
    },
    {
      question: "Шта је психодинамска терапија?",
      answer:
        "То је приступ који настоји да симптоме разуме кроз њихове узроке, унутрашње конфликте, личну историју и односе, а не само кроз површинско ублажавање тешкоћа.",
    },
    {
      question: "Како изгледа први сусрет?",
      answer:
        "Први сусрет служи да добијете простор да опишете разлоге доласка, а да ми предложимо оквир даљег рада и одговоримо на недоумице које имате.",
    },
  ] satisfies FaqAccordionItem[],
  bookingTitle: "Унесите неопходне информације како бисте заказали термин",
  bookingCopy: "Пошаљите основне податке и јавићемо Вам се са предлогом наредног корака.",
  bookingFormats: ["Психодинамска психотерапија", "Психолошко саветовање", "Консултације"],
});

const getContactPageDataLatn = () => ({
  banner: {
    title: "Kontaktirajte nas",
    theme: "dark" as const,
    backgroundImage: "/legacy/images/Banner-Contact-1_1Banner Contact (1).webp",
  },
  introTitle: "Psiholoske teskoce ne morate resavati sami",
  introCopy:
    "Ova stranica namenjena je prvom kontaktu, informisanju i postavljanju pitanja, sve u cilju razjasnjavanja nedoumica koje imate.",
  detailsTitle: "Kako nas mozete kontaktirati",
  formTitle: "Kako mozemo da Vam pomognemo?",
  officesTitle: "Nase prostorije",
  officesCopy:
    "Psihoterapijski prostor igra vaznu ulogu u radu, pa je kod nas osmisljen tako da pruzi mirno, diskretno i sigurno okruzenje.",
  contactLabels: {
    phone: "Broj telefona",
    email: "E-mail",
    instagram: "Instagram",
    facebook: "Facebook",
  },
});

const getContactPageDataCyrl = () => ({
  banner: {
    title: "Контактирајте нас",
    theme: "dark" as const,
    backgroundImage: "/legacy/images/Banner-Contact-1_1Banner Contact (1).webp",
  },
  introTitle: "Психолошке тешкоће не морате решавати сами",
  introCopy:
    "Ова страница намењена је првом контакту, информисању и постављању питања, све у циљу разјашњавања недоумица које имате.",
  detailsTitle: "Како нас можете контактирати",
  formTitle: "Како можемо да Вам помогнемо?",
  officesTitle: "Наше просторије",
  officesCopy:
    "Психотерапијски простор игра важну улогу у раду, па је код нас осмишљен тако да пружи мирно, дискретно и сигурно окружење.",
  contactLabels: {
    phone: "Број телефона",
    email: "Е-пошта",
    instagram: "Инстаграм",
    facebook: "Фејсбук",
  },
});

const getAppointmentPageDataLatn = () => ({
  banner: {
    title: "Zakazivanje",
    description:
      "Ovde mozete poslati upit za savetodavni, psihoterapijski ili konsultativni termin, a nas tim ce Vam se javiti u najkracem mogucem roku.",
    theme: "dark" as const,
  },
  formTitle: "Unesite svoje podatke",
  formCopy: "Posaljite osnovne informacije i javicemo Vam se sa predlogom narednog koraka.",
  formats: ["Psihodinamska psihoterapija", "Psiholosko savetovanje", "Konsultacije"],
  faqTitle: "Pitanja u vezi sa procesom",
  faqs: [
    {
      question:
        "Koja je razlika izmedju psiholoskog savetovanja, psihodinamske psihoterapije i strucnih konsultacija?",
      answer:
        "Razlika je u stepenu dubine rada i ciljevima koje zelimo da postignemo. Konsultacije sluze razjasnjavanju dilema i proceni oblika podrske, savetovanje pruza konkretnu podrsku, a psihoterapija radi na dubljim uzrocima.",
    },
    {
      question: "Da li se psihoterapija odvija uzivo ili online?",
      answer:
        "Rad moze biti uzivo, online ili kombinovano, u zavisnosti od Vasih potreba, mogucnosti i procene sta najvise podrzava kontinuitet procesa.",
    },
    {
      question: "Da li psihoterapijska seansa ima strukturu i plan ili samo pratimo tok razgovora?",
      answer:
        "Psihodinamska psihoterapija nema strogo zadatu strukturu. Vi donosite temu za razgovor, a terapijski rad se razvija kroz odnos, kontinuitet i zajednicko razumevanje onoga sto se pojavljuje.",
    },
    {
      question: "Da li mogu da prekinem proces kada pozelim?",
      answer:
        "Da, ali je vazno da o toj odluci razgovaramo, kako bi zavrsetak procesa bio jasan, promisljen i zaokruzen.",
    },
  ] satisfies FaqAccordionItem[],
});

const getAppointmentPageDataCyrl = () => ({
  banner: {
    title: "Заказивање",
    description:
      "Овде можете послати упит за саветодавни, психотерапијски или консултативни термин, а наш тим ће Вам се јавити у најкраћем могућем року.",
    theme: "dark" as const,
  },
  formTitle: "Унесите своје податке",
  formCopy: "Пошаљите основне информације и јавићемо Вам се са предлогом наредног корака.",
  formats: ["Психодинамска психотерапија", "Психолошко саветовање", "Консултације"],
  faqTitle: "Питања у вези са процесом",
  faqs: [
    {
      question:
        "Која је разлика између психолошког саветовања, психодинамске психотерапије и стручних консултација?",
      answer:
        "Разлика је у степену дубине рада и циљевима које желимо да постигнемо. Консултације служе разјашњавању дилема и процени облика подршке, саветовање пружа конкретну подршку, а психотерапија ради на дубљим узроцима.",
    },
    {
      question: "Да ли се психотерапија одвија уживо или online?",
      answer:
        "Рад може бити уживо, online или комбиновано, у зависности од Ваших потреба, могућности и процене шта највише подржава континуитет процеса.",
    },
    {
      question: "Да ли психотерапијска сеанса има структуру и план или само пратимо ток разговора?",
      answer:
        "Психодинамска психотерапија нема строго задату структуру. Ви доносите тему за разговор, а терапијски рад се развија кроз однос, континуитет и заједничко разумевање онога што се појављује.",
    },
    {
      question: "Да ли могу да прекинем процес када пожелим?",
      answer:
        "Да, али је важно да о тој одлуци разговарамо, како би завршетак процеса био јасан, промишљен и заокружен.",
    },
  ] satisfies FaqAccordionItem[],
});

export const getAboutPageData = (locale: SiteLocale) =>
  locale === "sr-cyrl" ? getAboutPageDataCyrl(locale) : getAboutPageDataLatn(locale);

export const getPsychotherapyPageData = (locale: SiteLocale) =>
  locale === "sr-cyrl" ? getPsychotherapyPageDataCyrl(locale) : getPsychotherapyPageDataLatn(locale);

export const getFaqPageData = (locale: SiteLocale) =>
  locale === "sr-cyrl" ? getFaqPageDataCyrl() : getFaqPageDataLatn();

export const getContactPageData = (locale: SiteLocale) =>
  locale === "sr-cyrl" ? getContactPageDataCyrl() : getContactPageDataLatn();

export const getAppointmentPageData = (locale: SiteLocale) =>
  locale === "sr-cyrl" ? getAppointmentPageDataCyrl() : getAppointmentPageDataLatn();

export const officeGallery = [
  "/legacy/images/Office-1-1_1Office 1 (1).webp",
  "/legacy/images/Office-2-1_1Office 2 (1).webp",
  "/legacy/images/Office-3-1_1Office 3 (1).webp",
];
