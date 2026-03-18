import { localizePath } from "@/features/i18n/locale";
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

const aboutLatn = (locale: SiteLocale) => ({
  banner: {
    title: "Ko smo mi?",
    description: "Na stranici ispod možete naći dodatne informacije o našem kabinetu.",
    theme: "dark" as const,
    backgroundImage: "/legacy/images/BG-Video-2_1BG Video (2).webp",
    align: "split" as const,
  },
  showcaseTitle: "Psihoterapijski kabinet 'Ikar'",
  showcaseVideoHref: "https://www.youtube.com/watch?v=KGg5cIjHQiw",
  showcaseVideoImage: "/legacy/images/Video-BG-About-Us-1_1Video BG About Us (1).webp",
  showcaseEmptyLabel: "No items found.",
  ideaTitle: "Glavna ideja našeg kabineta",
  ideaHtml:
    "U savremenoj psihološkoj praksi razvijenih zemalja, psihoterapija predstavlja pravno standardizovan i odgovoran vid pomoći, zasnovan na jasnim teorijskim okvirima, kliničkom iskustvu i etičkim principima<strong>. </strong>U našoj zemlji, međutim, ona je i dalje često praćena konfuzijom, mistikom i nejasnim očekivanjima, kao i različitim pristupima koji se predstavljaju kao terapijski, a koji neretko nemaju trajno ili stvarno dejstvo, najčešće na uštrb samih klijenata i pacijenata.<br><br>Naš rad je u širem smislu prevashodno usmeren ka osvetljavanju toga šta psihoterapija jeste, ali i šta ona nije. Smatramo da je edukacija javnosti sastavni deo svakog ozbiljnog terapijskog procesa, jer samo kroz razumevanje moguće je uspostaviti realna očekivanja, osećaj sigurnosti i poverenje u rad koji se odvija. Psihološko zdravlje se ne može se posmatrati izdvojeno društvenog konteksta, jer ne postoje psihološki zdrave osobe u sredini koja je u osnovi nezdrava.<br><br>U užem smislu, naš cilj se ogleda u profesionalnom i odgovornom psihoterapijskom radu, zasnovanom na intervencijama koji su klijentima zaista potrebne. U fokusu su individualnost, lične granice i kompleksnost svake psihološke pojave. Ne bavimo se „tretmanom bolesti“ u apstraktnom smislu koristeći tehnike ili alate, jer na psihoterapiju ne dolazi <em>dijagnoza</em>, već čovek. Upravo zato je naš pristup uvek prilagođen pojedincu, i ono što je najbitnije, on je pre svega, ljudski.<br><br>Nijedan psihoterapijski proces nije identičan, jer nijedna osoba i nijedan životni put nisu isti.<br><br>Psihoterapiju razumemo kao proces koji zahteva vreme, kontinuitet i spremnost za susret sa sopstvenim emocijama, a ne kao mesto gde će psihoterapeut brzo ili univerzalno rešenje.",
  focusTitle: "Bavimo se:",
  focusItems: [
    "Poremećajima ličnosti",
    "Anksioznim stanjima",
    "Depresivnim stanjima",
    "Hroničnim poteškoćama u odnosima i vezama",
    "Krizama identiteta, traumama, gubicima",
  ],
  recentTitle: "Najnovije objave na našem sajtu",
  recentCopy: "Budite u toku sa najnovijim istraživanjima u oblasti psihologije i psihoterapije.",
  recentHref: localizePath(locale, "/blog/"),
  recentLabel: "View all posts",
  recentReadMoreLabel: "Read more",
});

const aboutCyrl = (locale: SiteLocale) => ({
  banner: {
    title: "Ко смо ми?",
    description: "На страници испод можете наћи додатне информације о нашем кабинету.",
    theme: "dark" as const,
    backgroundImage: "/legacy/images/BG-Video-2_1BG Video (2).webp",
    align: "split" as const,
  },
  showcaseTitle: "Психотерапијски кабинет 'Икар'",
  showcaseVideoHref: "https://www.youtube.com/watch?v=KGg5cIjHQiw",
  showcaseVideoImage: "/legacy/images/Video-BG-About-Us-1_1Video BG About Us (1).webp",
  showcaseEmptyLabel: "No items found.",
  ideaTitle: "Главна идеја нашег кабинета",
  ideaHtml:
    "У савременој психолошкој пракси развијених земаља, психотерапија представља правно стандардизован и одговоран вид помоћи, заснован на јасним теоријским оквирима, клиничком искуству и етичким принципима. У нашој земљи, међутим, она је и даље често праћена конфузијом, мистиком и нејасним очекивањима, као и различитим приступима који се представљају као терапијски, а који неретко немају трајно или стварно дејство, најчешће на уштрб самих клијената и пацијената.<br><br>Наш рад је у ширем смислу превасходно усмерен ка осветљавању тога шта психотерапија јесте, али и шта она није. Сматрамо да је едукација јавности саставни део сваког озбиљног терапијског процеса, јер само кроз разумевање могуће је успоставити реална очекивања, осећај сигурности и поверење у рад који се одвија.<br><br>У ужем смислу, наш циљ се огледа у професионалном и одговорном психотерапијском раду, заснованом на интервенцијама које су клијентима заиста потребне. На психотерапију не долази дијагноза, већ човек.",
  focusTitle: "Бавимо се:",
  focusItems: [
    "Поремећајима личности",
    "Анксиозним стањима",
    "Депресивним стањима",
    "Хроничним потешкоћама у односима и везама",
    "Кризама идентитета, траумама и губицима",
  ],
  recentTitle: "Најновије објаве на нашем сајту",
  recentCopy: "Будите у току са најновијим текстовима из области психологије и психотерапије.",
  recentHref: localizePath(locale, "/blog/"),
  recentLabel: "Све објаве",
  recentReadMoreLabel: "Прочитајте текст",
});

const psychotherapyLatn = (locale: SiteLocale) => ({
  banner: {
    title: "Psihoterapijski pristup",
    description:
      "U našem kabinetu bavimo se psihodinamskom psihoterapijom, koja je dubinski orijentisana na razumevanje i razrešavanje uzroka, a ne samo posledica psiholoških teškoća. Ona omogućava rad sa širokim spektrom mentalnih bolesti i psiholoških problema.",
    theme: "light" as const,
    align: "split" as const,
  },
  scopeTitle: "Opseg rada",
  scopeItems: [
    "Anksiozna stanja i poremećaji",
    "Depresivna stanja i poremećaji",
    "Poremećaji ličnosti",
    "Hronične poteškoće u odnosima i vezama",
    "Psihotični poremećaji",
    "Gubitak, trauma, krize identiteta",
    "Ponavljanje destruktivnih životnih obrazaca",
  ],
  servicesEmptyLabel: "No items found.",
  bookingTitleHtml: "Neophodne informacije <br>o zakazivanju termina",
  formatLabel: "Izaberite format rada",
  formats: ["Psihodinamska psihoterapija", "Psihološko savetovanje", "Konsultacije"],
  faqs: [
    {
      question: "Koja je razlika između psihologa i psihoterapeuta?",
      answer:
        "U Republici Srbiji, psiholog se postaje tako što osoba završi osnovne studije psihologije (najčešće na Filozofskom fakultetu), dok je psihoterapeut onaj koji je i nakon završenih osnovnih studija (ne nužno psihologije), završio i dodatnu psihoterapijsku edukaciju u trajanju od minimum 4 do 6 godina.",
    },
    {
      question: "Kako da znam da mi je potrebna psihoterapija?",
      answer:
        "O psihoterapiji možete razmišljati ako doživljavate emocionalne poteškoće, imate dijagnostifikovani određeni mentalni poremećaj, ili generalno prolazite kroz težak životni period. Takođe, psihoterapija može služiti ličnom razvoju, istraživanju, i generalnom povećanju zadovoljstva životom.",
    },
    {
      question: "Koliko traje psihoterapija?",
      answer:
        "Psihoterapija nema unapred definisano trajanje, jer napredak u terapijskom procesu ne zavisi od vremena, već od rada i truda koji se ulažu u sam proces. Okvirno, psihoterapija može trajati od nekoliko meseci, pa sve do nekoliko godina. Uzimajući to u obzir, na početku tretmana često definišemo ciljeve kako bismo imali stabilan okvir za dalji rad.",
    },
    {
      question: "Kako izgleda prvi susret sa psihoterapeutom?",
      answer:
        "U dogovoreno vreme i mesto dolazite na psihoterapijsku seansu gde će Vas psihoterapeut sačekati. Nije potrebna nikakva prethodna priprema, samo volja za razgovorom. Čak i slučaju da ne možete da definište šta Vas konkretno uznemirava i muči, psihoterapeut će Vam pomoći to da to definišete. Na prvoj seansi ćete govoriti o svim potrebnim tehničkim informacijama za dalji rad.",
    },
  ] satisfies FaqAccordionItem[],
  faqImage: "/legacy/images/FAQ_1FAQ.webp",
});

const psychotherapyCyrl = (locale: SiteLocale) => ({
  banner: {
    title: "Психотерапијски приступ",
    description:
      "У нашем кабинету бавимо се психодинамском психотерапијом, која је дубински оријентисана на разумевање и разрешење узрока, а не само последица психолошких тешкоћа.",
    theme: "light" as const,
    align: "split" as const,
  },
  scopeTitle: "Опсег рада",
  scopeItems: [
    "Анксиозна стања и поремећаји",
    "Депресивна стања и поремећаји",
    "Поремећаји личности",
    "Хроничне потешкоће у односима и везама",
    "Психотични поремећаји",
    "Губитак, траума, кризе идентитета",
    "Понављање деструктивних животних образаца",
  ],
  servicesEmptyLabel: "No items found.",
  bookingTitleHtml: "Неопходне информације <br>о заказивању термина",
  formatLabel: "Изаберите формат рада",
  formats: ["Психодинамска психотерапија", "Психолошко саветовање", "Консултације"],
  faqs: [
    {
      question: "Која је разлика између психолога и психотерапеута?",
      answer:
        "У Републици Србији, психолог постаје особа која заврши основне студије психологије, док је психотерапеут онај који након основних студија пролази и вишегодишњу психотерапијску едукацију.",
    },
    {
      question: "Како да знам да ми је потребна психотерапија?",
      answer:
        "О психотерапији можете размишљати ако доживљавате емоционалне тешкоће, пролазите кроз тежак животни период или примећујете да се оптерећујући обрасци понављају.",
    },
    {
      question: "Колико траје психотерапија?",
      answer:
        "Трајање не може бити унапред прецизно одређено. Зависи од циљева, природе тешкоћа и дубине промена на којима се ради.",
    },
    {
      question: "Како изгледа први сусрет са психотерапеутом?",
      answer:
        "Први сусрет служи да добијете простор да опишете разлоге доласка, а да ми предложимо оквир даљег рада и одговоримо на недоумице које имате.",
    },
  ] satisfies FaqAccordionItem[],
  faqImage: "/legacy/images/FAQ_1FAQ.webp",
});

const faqLatn = () => ({
  banner: {
    title: "Pitanja",
    description: "Ovde možete pronaći odgovore na najčešće postavljena pitanja.",
    theme: "light" as const,
    align: "split" as const,
  },
  items: [
    {
      question: 'Da li je moguće "izlečiti se" bez psihoterapije?',
      answer:
        "Psychologists and psychiatrists both work in the mental health field, but they differ in their approaches. Psychologists primarily use talk therapy and counseling to address emotional and behavioral issues, while psychiatrists are medical doctors who can prescribe medication in addition to therapy. Psychologists and psychiatrists both work in the mental health field, but they differ in their approaches. Psychologists primarily use talk therapy and counseling to address emotional and behavioral issues, while psychiatrists are medical doctors who can prescribe medication in addition to therapy. Psychologists and psychiatrists both work in the mental health field, but they differ in their approaches. Psychologists primarily use talk therapy and counseling to address emotional and behavioral issues, while psychiatrists are medical doctors who can prescribe medication in addition to therapy.",
    },
    {
      question: "How do I know if I need therapy?",
      answer:
        "You might consider therapy if you're experiencing persistent feelings of distress, anxiety, sadness, or if you're facing challenges that impact your daily life. It can also be beneficial for personal growth, self-exploration, and developing coping strategies for life's stressors.",
    },
    {
      question: "What is cognitive-behavioral therapy (CBT), and how does it work?",
      answer:
        "CBT is a widely used therapeutic approach that focuses on identifying and changing negative thought patterns and behaviors. It helps individuals develop healthier ways of thinking and coping with challenges. The goal is to improve mental well-being by addressing the connection between thoughts, feelings, and behaviors.",
    },
    {
      question: "How can I manage stress effectively?",
      answer:
        "Stress management involves adopting healthy coping strategies. This may include practicing mindfulness, engaging in regular physical activity, maintaining a balanced diet, getting adequate sleep, and seeking support from friends, family, or a mental health professional. Developing effective stress-management techniques can enhance overall well-being.",
    },
  ] satisfies FaqAccordionItem[],
  bookingTitle: "Unesite neophodne informacije kako bi zakazali termin",
  formatLabel: "Izaberite format rada",
  formats: ["Psihodinamska psihoterapija", "Psihološko savetovanje", "Konsultacije"],
});

const faqCyrl = () => ({
  banner: {
    title: "Питања",
    description: "Овде можете пронаћи одговоре на најчешће постављена питања.",
    theme: "light" as const,
    align: "split" as const,
  },
  items: [
    {
      question: "Да ли је могуће „излечити се“ без психотерапије?",
      answer:
        "Неке животне кризе је могуће пребродити уз личне ресурсе и подршку блиских људи, али психотерапија може значајно помоћи ако се тешкоће понављају или постају преоптерећујуће.",
    },
    {
      question: "Како да знам да ми је потребна терапија?",
      answer:
        "Када осетите да се напетост, туга, страхови или проблеми у односима понављају и почињу да обликују свакодневни живот, вреди размислити о разговору са стручним лицем.",
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
  formatLabel: "Изаберите формат рада",
  formats: ["Психодинамска психотерапија", "Психолошко саветовање", "Консултације"],
});

const contactLatn = () => ({
  banner: {
    title: "Kontaktirajte nas",
    theme: "dark" as const,
    backgroundImage: "/legacy/images/Banner-Contact-1_1Banner Contact (1).webp",
    align: "center" as const,
  },
  introTitle: "Psihološke poteškoće ne morate rešavati sami",
  introCopy:
    "Ova stranica namenjena je prvom kontaktu, informisanju, postavljanju pitanja, sve u cilju razjašnjavanja nedoumica koje imate.",
  formTitle: "Kako možemo da Vam pomognemo?",
  contactLabels: {
    phone: "Broj telefona:",
    email: "E-mail:",
    socials: "Društvene mreže:",
  },
  officesTitle: "Naše prostorije",
  officesCopy:
    "Psihoterapijski prostor igra bitnu ulogu u psihoterapiji, te je kod nas osmišljen kako pružio neupadljivo, mirno, diskretno i sigurno okruženje za rad.",
});

const contactCyrl = () => ({
  banner: {
    title: "Контактирајте нас",
    theme: "dark" as const,
    backgroundImage: "/legacy/images/Banner-Contact-1_1Banner Contact (1).webp",
    align: "center" as const,
  },
  introTitle: "Психолошке потешкоће не морате решавати сами",
  introCopy:
    "Ова страница намењена је првом контакту, информисању и постављању питања, све у циљу разјашњавања недоумица које имате.",
  formTitle: "Како можемо да Вам помогнемо?",
  contactLabels: {
    phone: "Број телефона:",
    email: "Е-пошта:",
    socials: "Друштвене мреже:",
  },
  officesTitle: "Наше просторије",
  officesCopy:
    "Психотерапијски простор игра важну улогу у раду, па је код нас осмишљен тако да пружи мирно, дискретно и сигурно окружење.",
});

const appointmentLatn = () => ({
  banner: {
    title: "Zakazivanje",
    description:
      "Ovde možete poslati upit za savetodavni, psihoterapijski ili konsultativni termin, a naš tim će Vam se javiti u najkraćem mogućem roku",
    theme: "dark" as const,
    align: "center" as const,
  },
  formTitle: "Unesite svoje podatke",
  formatLabel: "Izaberite format rada",
  formats: ["Psihodinamska psihoterapija", "Psihološko savetovanje", "Konsultacije"],
  faqs: [
    {
      question: "Koja je razlika između psihološkog savetovanja, psihodinamske psihoterapije i stručnih konsultacija?",
      answer:
        "Razlika se ogleda u stepenu dubine rada i ciljevima koje želimo da postignemo. Stručne konsultacije služe za razjašnjavanje dilema i procenu oblika podrške koji je potreban. Psihološko savetovanje pruža konkretnu podršku u situacijama stresa i kriza i obično je kraćeg trajanja, dok je psihodinamska psihoterapija usmerena na razumevanje dubljih uzroka emocionalnih i ponašajnih poteškoća, u cilju trajnih psiholoških i strukturalnih promena.",
    },
    {
      question: "Da li se psihoterapija odvija uživo ili online?",
      answer:
        "Psihoterapija se može odvijati i uživo i online, u zavisnosti od Vaših potreba i preferencija. U određenim slučajevima koristimo oba formata kako bi održali kontinuitet terapijskog rada, a izbor pravimo zajedno u skladu sa Vašom situacijom i mogućnostima.",
    },
    {
      question: "Da li psihoterapijska seansa ima strukturu i plan ili samo pratimo tok konverzacije?",
      answer:
        "Seansa psihodinamske psihoterapije nema jasnu i konkretnu strukturu koju prati. Vi donosite temu za razgovor ili pitanja na koja želite odgovor, i razgovor se postepeno razvija. Psihoterapeut je tu da Vam pomogne i da Vas usmeri, kako bi zajedno došli do potrebnog zaključka. U početku psihoterapije, psihoterapeut je aktivniji učesnik, ali kako vreme odmiče i klijent bolje počinje da razume prirodu procesa, on preuzima vođstvo u njemu.",
    },
    {
      question: "Da li mogu da prekinem terapijski proces kada god poželim?",
      answer:
        "Da, terapiju možete prekinuti u svakom trenutku. Ipak, preporučljivo je da o toj odluci razgovaramo tokom seanse, kako bismo razumeli razloge i proces završili na način koji je za Vas jasan i zaokružen. Završetak terapije je takođe deo terapijskog procesa i važno je da bude promišljen.",
    },
  ] satisfies FaqAccordionItem[],
  faqImage: "/legacy/images/Appointmebt-Img_1Appointmebt Img.webp",
});

const appointmentCyrl = () => ({
  banner: {
    title: "Заказивање",
    description:
      "Овде можете послати упит за саветодавни, психотерапијски или консултативни термин, а наш тим ће Вам се јавити у најкраћем могућем року.",
    theme: "dark" as const,
    align: "center" as const,
  },
  formTitle: "Унесите своје податке",
  formatLabel: "Изаберите формат рада",
  formats: ["Психодинамска психотерапија", "Психолошко саветовање", "Консултације"],
  faqs: [
    {
      question: "Која је разлика између психолошког саветовања, психодинамске психотерапије и стручних консултација?",
      answer:
        "Разлика се огледа у степену дубине рада и циљевима које желимо да постигнемо. Консултације служе разјашњавању дилема и процени облика подршке, саветовање пружа конкретну подршку, а психотерапија ради на дубљим узроцима.",
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
  faqImage: "/legacy/images/Appointmebt-Img_1Appointmebt Img.webp",
});

export const getAboutPageData = (locale: SiteLocale) =>
  locale === "sr-cyrl" ? aboutCyrl(locale) : aboutLatn(locale);

export const getPsychotherapyPageData = (locale: SiteLocale) =>
  locale === "sr-cyrl" ? psychotherapyCyrl(locale) : psychotherapyLatn(locale);

export const getFaqPageData = (locale: SiteLocale) =>
  locale === "sr-cyrl" ? faqCyrl() : faqLatn();

export const getContactPageData = (locale: SiteLocale) =>
  locale === "sr-cyrl" ? contactCyrl() : contactLatn();

export const getAppointmentPageData = (locale: SiteLocale) =>
  locale === "sr-cyrl" ? appointmentCyrl() : appointmentLatn();

export const officeGallery = [
  "/legacy/images/Office-1-1_1Office 1 (1).webp",
  "/legacy/images/Office-2-1_1Office 2 (1).webp",
  "/legacy/images/Office-3-1_1Office 3 (1).webp",
];
