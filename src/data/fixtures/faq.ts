export type FaqItem = {
  question: string;
  answer: string;
};

const faqItems: FaqItem[] = [
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
];

export const getFaqItems = () => faqItems;
