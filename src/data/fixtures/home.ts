import { localizePath } from "@/features/i18n/locale";
import type { SiteLocale } from "@/lib/config/site";

type LinkCard = {
  title: string;
  copy: string;
  href: string;
  label: string;
};

export type HomePageData = {
  hero: {
    titleHtml: string;
    description: string;
    primaryAction: { href: string; label: string };
    secondaryAction: { href: string; label: string };
  };
  prompt: {
    title: string;
    copy: string;
    href: string;
    label: string;
  };
  about: {
    title: string;
    paragraphs: string[];
    bullets: string[];
    href: string;
    label: string;
    image: string;
  };
  services: {
    title: string;
    copy: string;
    items: LinkCard[];
  };
  promo: {
    title: string;
    href: string;
    label: string;
    image: string;
  };
  themes: {
    title: string;
    items: LinkCard[];
  };
  reasons: {
    title: string;
    copy: string;
    items: LinkCard[];
    videoHref: string;
    videoImage: string;
    videoLabel: string;
  };
  booking: {
    title: string;
    copy: string;
    formats: string[];
  };
  recent: {
    title: string;
    copy: string;
    href: string;
    label: string;
    empty: string;
  };
};

export const getHomePageData = (locale: SiteLocale): HomePageData => {
  if (locale === "sr-cyrl") {
    return {
      hero: {
        titleHtml: "Психотерапијски центар<br /><em>Икар</em>",
        description:
          "Центар посвећен психодинамичкој психотерапији, усмерен ка разумевању дубљих узрока емоционалних потешкоћа и постизању трајних психолошких промена.",
        primaryAction: { href: localizePath(locale, "/zakazivanje/"), label: "Заказивање" },
        secondaryAction: { href: localizePath(locale, "/o-nama/"), label: "О нама" },
      },
      prompt: {
        title: "Како можемо да Вам помогнемо?",
        copy: "За било каква питања или недоумице, пошаљите нам поруку.",
        href: localizePath(locale, "/kontakt/"),
        label: "Контакт",
      },
      about: {
        title: "Ја сам Немања Зајкесковић, психодинамијски психотерапеут",
        paragraphs: [
          "Мастер психолог и психодинамски психотерапеут са вишегодишњим искуством у раду са анксиозним и депресивним стањима, опсесивним стањима, поремећајима личности, кризама идентитета, понављањем деструктивних животних образаца и хроничним проблемима у односима са другима.",
        ],
        bullets: [
          "У раду фокусиран на дуготрајан психотерапијски процес у циљу дубинских промена и реструктурације личности.",
          "Користимо терапијски однос као централни инструмент промене и разумевања личне историје, унутрашњих конфликата и погледа на свет.",
        ],
        href: localizePath(locale, "/o-nama/"),
        label: "Биографија",
        image: "/legacy/images/Doctor--1_1Doctor  (1).webp",
      },
      services: {
        title: "Психодинамска психотерапија и психолошко саветовање",
        copy:
          "У нашем центру, поред психолошког саветовања и психодинамске психотерапије, можете заказати и консултативне термине.",
        items: [
          {
            title: "Психодинамска психотерапија",
            copy: "Дугорочни рад на дубљем разумевању унутрашњих конфликата, образаца и односа.",
            href: localizePath(locale, "/psihoterapija/"),
            label: "Сазнајте више",
          },
          {
            title: "Психолошко саветовање",
            copy: "Подршка у кризним периодима, доношењу одлука и јаснијем увиду у тренутну ситуацију.",
            href: localizePath(locale, "/kontakt/"),
            label: "Контактирајте нас",
          },
          {
            title: "Консултације",
            copy: "Уводни сусрети и процена формата рада који најбоље одговара Вашим потребама.",
            href: localizePath(locale, "/zakazivanje/"),
            label: "Закажите термин",
          },
        ],
      },
      promo: {
        title: "Закажите бесплатан уводни Zoom или Skype разговор од 15 минута",
        href: localizePath(locale, "/kontakt/"),
        label: "Контакт",
        image: "/legacy/images/Appointmebt-Img_1Appointmebt Img.webp",
      },
      themes: {
        title: "Учестале теме са којима се сусрећемо у раду",
        items: [
          {
            title: "Анксиозност и депресивна стања",
            copy: "Када се напетост, страх или осећај безвољности понављају и почињу да обликују свакодневицу.",
            href: localizePath(locale, "/psihoterapija/"),
            label: "Прочитајте више",
          },
          {
            title: "Проблеми у односима",
            copy: "Понављајући конфликти, дистанца, страх од блискости или тешкоће у постављању граница.",
            href: localizePath(locale, "/kontakt/"),
            label: "Јавите нам се",
          },
          {
            title: "Кризе идентитета и животни прелази",
            copy: "Тренуци у којима стари обрасци више не функционишу, а нови још нису добили јасан облик.",
            href: localizePath(locale, "/zakazivanje/"),
            label: "Закажите сусрет",
          },
        ],
      },
      reasons: {
        title: "Зашто изабрати баш наш центар?",
        copy:
          "Психотерапијски центар Икар је примарно усмерен на дугорочну психотерапију, јер верујемо да се дубинске и трајне промене не постижу кроз брзе интервенције, већ кроз континуиран процес.",
        items: [
          {
            title: "Наш приступ",
            copy: "Психодинамски приступ омогућава рад са широким спектром емоционалних стања и понављајућих образаца који отежавају свакодневно функционисање.",
            href: localizePath(locale, "/psihoterapija/"),
            label: "Више о приступу",
          },
          {
            title: "Професионални оквир и јасноћа",
            copy: "Рад се одвија у јасно дефинисаном и етички утемељеном оквиру, са стабилним правилима и доследношћу.",
            href: localizePath(locale, "/faq/"),
            label: "Честа питања",
          },
          {
            title: "Транспарентност и отвореност",
            copy: "Сам процес, циљеви и динамика терапије могу се преиспитивати ради јасноће и усмеравања рада.",
            href: localizePath(locale, "/kontakt/"),
            label: "Поставите питање",
          },
        ],
        videoHref: "https://www.youtube.com/watch?v=KGg5cIjHQiw",
        videoImage: "/legacy/images/Video-Home-3-BG_1Video Home 3 BG.webp",
        videoLabel: "Погледајте кратко представљање",
      },
      booking: {
        title: "Унесите неопходне информације како бисте заказали термин",
        copy: "Први контакт нам помаже да разумемо контекст, предложимо формат рада и договоримо наредни корак.",
        formats: ["Психодинамска психотерапија", "Психолошко саветовање", "Консултације"],
      },
      recent: {
        title: "Најновије објаве на нашем сајту",
        copy: "Будите у току са новим текстовима из области психологије и психотерапије.",
        href: localizePath(locale, "/blog/"),
        label: "Све објаве",
        empty: "Нови текстови стижу ускоро.",
      },
    };
  }

  return {
    hero: {
      titleHtml: "Psihoterapijski centar<br /><em>Ikar</em>",
      description:
        "Centar posvecen psihodinamskoj psihoterapiji, usmeren ka razumevanju dubljih uzroka emocionalnih poteskoca i postizanju trajnih psiholoskih promena.",
      primaryAction: { href: localizePath(locale, "/zakazivanje/"), label: "Zakazivanje" },
      secondaryAction: { href: localizePath(locale, "/o-nama/"), label: "O nama" },
    },
    prompt: {
      title: "Kako mozemo da Vam pomognemo?",
      copy: "Za bilo kakva pitanja ili nedoumice, posaljite nam poruku.",
      href: localizePath(locale, "/kontakt/"),
      label: "Kontakt",
    },
    about: {
      title: "Ja sam Nemanja Zajkeskovic, psihodinamski psihoterapeut",
      paragraphs: [
        "Master psiholog i psihodinamski psihoterapeut sa visegodisnjim iskustvom u radu sa anksioznim i depresivnim stanjima, opsesivnim stanjima, poremecajima licnosti, krizama identiteta, ponavljanjem destruktivnih zivotnih obrazaca i hronicnim problemima u odnosima sa drugima.",
      ],
      bullets: [
        "U radu fokusiran na dugotrajan psihoterapijski proces u cilju dubinskih promena i restrukturacije licnosti.",
        "Koristimo terapijski odnos kao centralni instrument promene i razumevanja licne istorije, unutrasnjih konflikata i pogleda na svet.",
      ],
      href: localizePath(locale, "/o-nama/"),
      label: "Biografija",
      image: "/legacy/images/Doctor--1_1Doctor  (1).webp",
    },
    services: {
      title: "Psihodinamska psihoterapija i psiholosko savetovanje",
      copy:
        "U nasem centru, pored psiholoskog savetovanja i psihodinamske psihoterapije, mozete zakazati i konsultativne termine.",
      items: [
        {
          title: "Psihodinamska psihoterapija",
          copy: "Dugorocni rad na dubljem razumevanju unutrasnjih konflikata, obrazaca i odnosa.",
          href: localizePath(locale, "/psihoterapija/"),
          label: "Saznajte vise",
        },
        {
          title: "Psiholosko savetovanje",
          copy: "Podrska u kriznim periodima, donosenju odluka i jasnijem uvidu u trenutnu situaciju.",
          href: localizePath(locale, "/kontakt/"),
          label: "Kontaktirajte nas",
        },
        {
          title: "Konsultacije",
          copy: "Uvodni susreti i procena formata rada koji najbolje odgovara Vasim potrebama.",
          href: localizePath(locale, "/zakazivanje/"),
          label: "Zakazite termin",
        },
      ],
    },
    promo: {
      title: "Zakazite besplatan uvodni Zoom ili Skype razgovor od 15 minuta",
      href: localizePath(locale, "/kontakt/"),
      label: "Kontakt",
      image: "/legacy/images/Appointmebt-Img_1Appointmebt Img.webp",
    },
    themes: {
      title: "Ucestale teme sa kojima se susrecemo u radu",
      items: [
        {
          title: "Anksioznost i depresivna stanja",
          copy: "Kada se napetost, strah ili osecaj bezvoljnosti ponavljaju i pocinju da oblikuju svakodnevicu.",
          href: localizePath(locale, "/psihoterapija/"),
          label: "Procitajte vise",
        },
        {
          title: "Problemi u odnosima",
          copy: "Ponavljajuci konflikti, distanca, strah od bliskosti ili teskoce u postavljanju granica.",
          href: localizePath(locale, "/kontakt/"),
          label: "Javite nam se",
        },
        {
          title: "Krize identiteta i zivotni prelazi",
          copy: "Trenuci u kojima stari obrasci vise ne funkcionisu, a novi jos nisu dobili jasan oblik.",
          href: localizePath(locale, "/zakazivanje/"),
          label: "Zakazite susret",
        },
      ],
    },
    reasons: {
      title: "Zasto izabrati bas nas centar?",
      copy:
        "Psihoterapijski centar Ikar u svom radu je primarno usmeren na dugorocnu psihoterapiju, jer verujemo da se dubinske i trajne promene ne postizu kroz brze intervencije, vec kroz kontinuiran proces.",
      items: [
        {
          title: "Nas pristup",
          copy: "Psihodinamski pristup omogucava rad sa sirokim spektrom emocionalnih stanja i ponavljajucih obrazaca koji otezavaju svakodnevno funkcionisanje.",
          href: localizePath(locale, "/psihoterapija/"),
          label: "Vise o pristupu",
        },
        {
          title: "Profesionalni okvir i jasnoca",
          copy: "Rad se odvija u jasno definisanom i eticki utemeljenom okviru, sa stabilnim pravilima i doslednoscu.",
          href: localizePath(locale, "/faq/"),
          label: "Cesta pitanja",
        },
        {
          title: "Transparentnost i otvorenost",
          copy: "Sam proces, ciljevi i dinamika terapije mogu se preispitivati radi jasnoce i usmeravanja rada.",
          href: localizePath(locale, "/kontakt/"),
          label: "Postavite pitanje",
        },
      ],
      videoHref: "https://www.youtube.com/watch?v=KGg5cIjHQiw",
      videoImage: "/legacy/images/Video-Home-3-BG_1Video Home 3 BG.webp",
      videoLabel: "Pogledajte kratko predstavljanje",
    },
    booking: {
      title: "Unesite neophodne informacije kako bi zakazali termin",
      copy: "Prvi kontakt nam pomaze da razumemo kontekst, predlozimo format rada i dogovorimo naredni korak.",
      formats: ["Psihodinamska psihoterapija", "Psiholosko savetovanje", "Konsultacije"],
    },
    recent: {
      title: "Najnovije objave na nasem sajtu",
      copy: "Budite u toku sa novim tekstovima iz oblasti psihologije i psihoterapije.",
      href: localizePath(locale, "/blog/"),
      label: "Sve objave",
      empty: "Novi tekstovi stizu uskoro.",
    },
  };
};
