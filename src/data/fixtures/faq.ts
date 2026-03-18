import type { SiteLocale } from "@/lib/config/site";

export type FaqItem = {
  question: string;
  answer: string;
};

const faqByLocale: Record<SiteLocale, FaqItem[]> = {
  "sr-latn": [
    {
      question: "Kako izgleda prvi kontakt?",
      answer:
        "Prvi kontakt dolazi kroz kratku poruku ili prijavu, nakon cega tim odgovara i predlaze naredni korak.",
    },
    {
      question: "Da li je sajt spreman za kasniju bazu podataka?",
      answer:
        "Da. Prijave prolaze kroz servisni i repozitorijumski sloj kako bismo lako zamenili lokalni storage bazom.",
    },
    {
      question: "Da li je admin deo potpuno skriven?",
      answer:
        "Admin ruta nije javno linkovana i zasticena je prostim server-side cookie pristupom, sto je dovoljno za ovaj projekat.",
    },
  ],
  "sr-cyrl": [
    {
      question: "Како изгледа први контакт?",
      answer:
        "Први контакт долази кроз кратку поруку или пријаву, након чега тим одговара и предлаже наредни корак.",
    },
    {
      question: "Да ли је сајт спреман за каснију базу података?",
      answer:
        "Да. Пријаве пролазе кроз сервисни и репозиторијумски слој како бисмо лако заменили локални storage базом.",
    },
    {
      question: "Да ли је admin део потпуно скривен?",
      answer:
        "Admin рута није јавно линкована и заштићена је простим server-side cookie приступом, што је довољно за овај пројекат.",
    },
  ],
};

export const getFaqItems = (locale: SiteLocale) => faqByLocale[locale];
