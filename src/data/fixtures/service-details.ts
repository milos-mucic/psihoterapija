import { sanitizeRichTextHtml } from "@/features/blog/utils/rich-text";
import { localizePath } from "@/features/i18n/locale";
import { getDictionary } from "@/features/i18n/translate";
import type { SiteLocale } from "@/lib/config/site";

export const serviceDetailSlugs = [
  "psihoterapija",
  "psiholosko-savetovanje",
  "konsultacije",
] as const;

export type ServiceDetailSlug = (typeof serviceDetailSlugs)[number];

type ServiceDetailData = {
  seo: {
    title: string;
    description: string;
  };
  banner: {
    title: string;
    description: string;
    backgroundImage: string;
    theme: "dark";
    align: "split";
  };
  intro: {
    title: string;
    body: string;
    image: string;
    highlights: string[];
  };
  faqs: Array<{
    question: string;
    answerHtml: string;
  }>;
  ctaHref: string;
  ctaLabel: string;
};

const toRichText = (paragraphs: string[]) =>
  sanitizeRichTextHtml(paragraphs.map((paragraph) => `<p>${paragraph}</p>`).join(""));

const toFaqs = (items: Array<{ question: string; answer: string }>) =>
  items.map((item) => ({
    question: item.question,
    answerHtml: sanitizeRichTextHtml(`<p>${item.answer}</p>`),
  }));

export const getServiceDetailData = (
  locale: SiteLocale,
  slug: ServiceDetailSlug,
): ServiceDetailData => {
  const dictionary = getDictionary(locale);
  const serviceItems = dictionary.homePage.services.items;
  const appointmentFaqs = dictionary.pages.appointment.faqs;
  const psychotherapyFaqs = dictionary.pages.psychotherapy.faqs;
  const baseImage = "/legacy/images/mirrored/session-banner.webp";
  const counselingImage = "/legacy/images/mirrored/service-img.png";
  const psychotherapyImage = "/legacy/images/mirrored/service-3.png";
  const consultationImage = "/legacy/images/mirrored/session-img-1.png";

  if (slug === "psihoterapija") {
    return {
      seo: {
        title: `${serviceItems[0].title} | Psihoterapijski kabinet Ikar`,
        description: dictionary.meta.psychotherapy.description,
      },
      banner: {
        title: serviceItems[0].title,
        description:
          "Psihodinamska psihoterapija je dugoročniji proces usmeren na razumevanje dubljih uzroka psiholoških teškoća i postepeno stvaranje trajnih promena.",
        backgroundImage: baseImage,
        theme: "dark",
        align: "split",
      },
      intro: {
        title: "Kako izgleda psihoterapijski rad",
        body: toRichText([
          "Psihodinamska psihoterapija ne bavi se samo ublažavanjem simptoma, već razumevanjem unutrašnjih konflikata, obrazaca odnosa i načina na koje lična istorija oblikuje sadašnji život.",
          "U fokusu rada su teme koje se ponavljaju, odnosi koji iscrpljuju, osećanja koja dugo traju i teškoće koje utiču na svakodnevno funkcionisanje. Proces se razvija postepeno, u ritmu koji je prilagođen osobi.",
          "Cilj nije brzo rešenje, već dublje razumevanje sebe i stabilnija promena koja može da se održi i van terapijskog prostora.",
        ]),
        image: psychotherapyImage,
        highlights: [
          "Dugoročniji i kontinuiran proces",
          "Rad na dubljim uzrocima teškoća",
          "Individualno prilagođen ritam susreta",
        ],
      },
      faqs: toFaqs(psychotherapyFaqs.slice(1, 4)),
      ctaHref: localizePath(locale, "/zakazivanje/"),
      ctaLabel: dictionary.nav.appointment,
    };
  }

  if (slug === "psiholosko-savetovanje") {
    return {
      seo: {
        title: `${serviceItems[1].title} | Psihoterapijski kabinet Ikar`,
        description: serviceItems[1].copy,
      },
      banner: {
        title: serviceItems[1].title,
        description:
          "Psihološko savetovanje pruža jasniju podršku u periodima stresa, krize, dilema i životnih prelaza, kada je potreban fokusiraniji i kraći oblik rada.",
        backgroundImage: baseImage,
        theme: "dark",
        align: "split",
      },
      intro: {
        title: "Kada savetovanje ima najviše smisla",
        body: toRichText([
          "Psihološko savetovanje je namenjeno situacijama u kojima je osobi potrebna stručna podrška, ali ne nužno i dugoročan psihoterapijski proces. Najčešće je korisno u periodima stresa, akutnih kriza, važnih odluka ili promena.",
          "Za razliku od psihoterapije, savetovanje je više usmereno na aktuelnu situaciju, njeno razumevanje i traženje održivog načina da se osoba kroz nju kreće sa što više stabilnosti.",
          "Ovakav rad može biti kraćeg trajanja, ali i dalje podrazumeva aktivno učešće, promišljanje i saradnju, a ne gotova rešenja koja neko drugi nameće.",
        ]),
        image: counselingImage,
        highlights: [
          "Podrška u stresu, krizi i dilemi",
          "Kraći i fokusiraniji format rada",
          "Jasniji plan narednih koraka",
        ],
      },
      faqs: toFaqs([
        {
          question: "Da li psihološko savetovanje može da \"leči\" mentalne bolesti?",
          answer:
            "Cilj psihološkog savetovanja nije lečenje mentalnih poremećaja, već pružanje podrške i pomoći pri nošenju sa njima, posebno u kriznim i prelaznim životnim periodima.",
        },
        {
          question: "Kako se psihodinamsko savetovanje razlikuje od \"običnog\" savetovanja?",
          answer:
            "Psihodinamsko savetovanje uzima u obzir širu sliku ličnosti i životnog konteksta, pa se ne zadržava samo na površinskom uklanjanju neprijatnih osećanja, već pokušava da razume njihovo značenje i funkciju.",
        },
        {
          question: "Koliko dugo traje savetodavni proces?",
          answer:
            "Savetovanje je uglavnom kraće od psihoterapije, ali nema unapred zadat rok. Nekome je dovoljan jedan susret, a nekome nekoliko meseci kontinuiteta, u zavisnosti od situacije i potreba.",
        },
      ]),
      ctaHref: localizePath(locale, "/zakazivanje/"),
      ctaLabel: dictionary.nav.appointment,
    };
  }

  return {
    seo: {
      title: `${serviceItems[2].title} | Psihoterapijski kabinet Ikar`,
      description: serviceItems[2].copy,
    },
    banner: {
      title: serviceItems[2].title,
      description:
        "Konsultativni termin je namenjen razjašnjavanju dilema, informisanju i proceni koji oblik podrške najviše odgovara Vašoj situaciji.",
      backgroundImage: baseImage,
      theme: "dark",
      align: "split",
    },
    intro: {
      title: "Čemu služi konsultativni termin",
      body: toRichText([
        "Konsultacije su dobar prvi korak kada osoba još nije sigurna da li joj je potrebna psihoterapija, savetovanje ili samo dodatno pojašnjenje u vezi sa sopstvenom situacijom.",
        "Na konsultativnom terminu razgovaramo o razlogu javljanja, trenutnim teškoćama, očekivanjima i mogućim pravcima daljeg rada. Cilj nije da se odmah otvori dubinski proces, već da se napravi jasnija procena.",
        "Ovakav susret može biti koristan i kada Vam je potrebna profesionalna orijentacija, dodatno objašnjenje terapijskog procesa ili pomoć da odlučite šta je u ovom trenutku za Vas najadekvatnije.",
      ]),
      image: consultationImage,
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
    ctaHref: localizePath(locale, "/zakazivanje/"),
    ctaLabel: dictionary.nav.appointment,
  };
};
