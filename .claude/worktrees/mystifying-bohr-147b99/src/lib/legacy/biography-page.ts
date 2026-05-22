import { readFile } from "node:fs/promises";
import { localizePath } from "@/features/i18n/locale";
import type { SiteLocale } from "@/lib/config/site";

const biographySourceUrl = new URL("../../../webflow-old/our-team.html", import.meta.url);
const biographyHeadHtml = `
  <link href="/legacy/css/normalize.css" rel="stylesheet" type="text/css">
  <link href="/legacy/css/webflow.css" rel="stylesheet" type="text/css">
  <link href="/legacy/css/psihoterapijski-kabinet-ikar-website.webflow.css" rel="stylesheet" type="text/css">
  <link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=Lato:wght@100;300;400;700;900&display=swap">
`;
const biographyContentTranslations: Record<SiteLocale, Array<[string, string]>> = {
  "sr-latn": [
    ["Our Team", "Biografija"],
    [
      "Exploring various psychological concepts, theories, and research findings in an accessible way.",
      "Na pristupačan i jasan način predstavljamo profesionalni put, pristup radu i psihološke uvide koji oblikuju ovaj prostor.",
    ],
    ["Meet Our Specialists", "Stručni profil"],
    [
      "These professionals may include clinical psychologists, counseling psychologists, psychotherapists, psychiatrists, and other specialists.",
      "Ovaj pristup oslanja se na znanja iz kliničke psihologije, savetodavne psihologije, psihoterapije, psihijatrije i srodnih oblasti mentalnog zdravlja.",
    ],
    ["No items found.", "Detalji će uskoro biti dopunjeni."],
    ['aria-label="List"', 'aria-label="Lista"'],
    ['aria-label="Previous Page"', 'aria-label="Prethodna stranica"'],
    [">Previous<", ">Prethodna<"],
    ['aria-label="Next Page"', 'aria-label="Sledeća stranica"'],
    [">Next<", ">Sledeća<"],
    ['alt="Psychology Therapy"', 'alt="Psihoterapijski rad"'],
    ["We Love Our Clients", "Pristup radu"],
    [
      "Psychologist centers are staffed by licensed psychologists and mental health professionals.",
      "Psihoterapijski rad zasniva se na licenciranim psiholozima i stručnjacima za mentalno zdravlje.",
    ],
    [
      "Psychologist centers are staffed by licensed psychologists and mental health professionals. These professionals may include clinical psychologists, counseling psychologists, psychotherapists, psychiatrists, and other specialists.",
      "Psihoterapijski rad zasniva se na licenciranom stručnom vođenju, poverenju i kontinuiranom razumevanju unutrašnjih procesa, misli, osećanja i ponašanja.",
    ],
    [
      "Therapy is a collaborative process. You&#x27;ll have the opportunity to discuss your experiences, concerns, and any challenges you&#x27;re facing. The psychologist will provide support and insights.",
      "Terapija je saradnički proces. Imaćete priliku da govorite o svojim iskustvima, brigama i izazovima sa kojima se suočavate, a terapeut će Vam pružiti podršku i uvide.",
    ],
    [
      "Together with the psychologist, you&#x27;ll discuss your goals for therapy. This could include addressing specific issues, improving coping skills, or working towards personal growth.",
      "Zajedno sa terapeutom definisaćete ciljeve rada. To može uključivati rad na konkretnim teškoćama, jačanje kapaciteta za suočavanje i lični razvoj.",
    ],
    [
      "The psychologist may ask questions to better understand your thoughts, feelings, and behaviors. This process helps in assessing the factors contributing to your concerns.",
      "Terapeut može postavljati pitanja kako bi bolje razumeo Vaše misli, osećanja i ponašanja. Taj proces pomaže da se sagledaju faktori koji doprinose teškoćama sa kojima dolazite.",
    ],
  ],
  "sr-cyrl": [
    ["Our Team", "Биографија"],
    [
      "Exploring various psychological concepts, theories, and research findings in an accessible way.",
      "На приступачан и јасан начин представљамо професионални пут, приступ раду и психолошке увиде који обликују овај простор.",
    ],
    ["Meet Our Specialists", "Стручни профил"],
    [
      "These professionals may include clinical psychologists, counseling psychologists, psychotherapists, psychiatrists, and other specialists.",
      "Овај приступ ослања се на знања из клиничке психологије, саветодавне психологије, психотерапије, психијатрије и сродних области менталног здравља.",
    ],
    ["No items found.", "Детаљи ће ускоро бити допуњени."],
    ['aria-label="List"', 'aria-label="Листа"'],
    ['aria-label="Previous Page"', 'aria-label="Претходна страница"'],
    [">Previous<", ">Претходна<"],
    ['aria-label="Next Page"', 'aria-label="Следећа страница"'],
    [">Next<", ">Следећа<"],
    ['alt="Psychology Therapy"', 'alt="Психотерапијски рад"'],
    ["We Love Our Clients", "Приступ раду"],
    [
      "Psychologist centers are staffed by licensed psychologists and mental health professionals.",
      "Психотерапијски рад заснива се на лиценцираним психолозима и стручњацима за ментално здравље.",
    ],
    [
      "Psychologist centers are staffed by licensed psychologists and mental health professionals. These professionals may include clinical psychologists, counseling psychologists, psychotherapists, psychiatrists, and other specialists.",
      "Психотерапијски рад заснива се на лиценцираном стручном вођењу, поверењу и континуираном разумевању унутрашњих процеса, мисли, осећања и понашања.",
    ],
    [
      "Therapy is a collaborative process. You&#x27;ll have the opportunity to discuss your experiences, concerns, and any challenges you&#x27;re facing. The psychologist will provide support and insights.",
      "Терапија је сараднички процес. Имаћете прилику да говорите о својим искуствима, бригама и изазовима са којима се суочавате, а терапеут ће Вам пружити подршку и увиде.",
    ],
    [
      "Together with the psychologist, you&#x27;ll discuss your goals for therapy. This could include addressing specific issues, improving coping skills, or working towards personal growth.",
      "Заједно са терапеутом дефинисаћете циљеве рада. То може укључивати рад на конкретним тешкоћама, јачање капацитета за суочавање и лични развој.",
    ],
    [
      "The psychologist may ask questions to better understand your thoughts, feelings, and behaviors. This process helps in assessing the factors contributing to your concerns.",
      "Терапеут може постављати питања како би боље разумео Ваше мисли, осећања и понашања. Тај процес помаже да се сагледају фактори који доприносе тешкоћама са којима долазите.",
    ],
  ],
};

const legacyImageAliases = new Map([
  ["Team-Img-1_1Team-Img-1.webp", "Team-Img-1_1Team%20Img%20(1).webp"],
  ["Info-Wrapper_1Info-Wrapper.webp", "Info-Wrapper_1Info%20Wrapper.webp"],
  ["About-Img-3_1About-Img-3.webp", "About-Img-3_1About%20Img%20(3).webp"],
  ["Office-3-1_1Office-3-1.webp", "Office-3-1_1Office%203%20(1).webp"],
  ["Appointmebt-Img_1Appointmebt-Img.webp", "Appointmebt-Img_1Appointmebt%20Img.webp"],
]);

export const getBiographyPageParts = async (locale: SiteLocale) => {
  let html = await readFile(biographySourceUrl, "utf-8");

  const pathMap = new Map([
    ["home-1.html", localizePath(locale, "/")],
    ["index.html", localizePath(locale, "/")],
    ["about-us-2.html", localizePath(locale, "/o-nama/")],
    ["about-us-1.html", localizePath(locale, "/biografija/")],
    ["our-team.html", localizePath(locale, "/biografija/")],
    ["services.html", localizePath(locale, "/psihoterapija/")],
    ["pricing.html", localizePath(locale, "/psihoterapija/")],
    ["sessions.html", localizePath(locale, "/psihoterapija/")],
    ["appointment.html", localizePath(locale, "/zakazivanje/")],
    ["blog-1.html", localizePath(locale, "/blog/")],
    ["blog-2.html", localizePath(locale, "/blog/")],
    ["blog-3.html", localizePath(locale, "/blog/")],
    ["faq.html", localizePath(locale, "/pitanja/")],
    ["contact-us.html", localizePath(locale, "/kontakt/")],
  ]);

  const replacements: Array<[string, string]> = [
    ['href="css/normalize.css"', 'href="/legacy/css/normalize.css"'],
    ['href="css/webflow.css"', 'href="/legacy/css/webflow.css"'],
    [
      'href="css/psihoterapijski-kabinet-ikar-website.webflow.css"',
      'href="/legacy/css/psihoterapijski-kabinet-ikar-website.webflow.css"',
    ],
    ['src="images/', 'src="/legacy/images/'],
    ['href="images/', 'href="/legacy/images/'],
    ['srcset="images/', 'srcset="/legacy/images/'],
    [", images/", ", /legacy/images/"],
  ];

  for (const [from, to] of pathMap) {
    replacements.push([`href="${from}"`, `href="${to}"`]);
  }

  for (const [from, to] of legacyImageAliases) {
    replacements.push([`/legacy/images/${from}`, `/legacy/images/${to}`]);
  }

  for (const [from, to] of replacements) {
    html = html.replaceAll(from, to);
  }

  const bodyMatch = html.match(/<body>([\s\S]*?)<\/body>/);

  if (!bodyMatch) {
    throw new Error("Legacy biography page is missing body markup.");
  }

  const bodyContent = bodyMatch[1];
  const contentStart = bodyContent.indexOf('<div class="section inner-banner">');
  const footerStart = bodyContent.indexOf('<div class="footer">', contentStart);

  if (contentStart === -1 || footerStart === -1) {
    throw new Error("Legacy biography page content markers were not found.");
  }

  let contentHtml = bodyContent
    .slice(contentStart, footerStart)
    .trim()
    .replaceAll(' style="opacity:0"', "");

  for (const [from, to] of biographyContentTranslations[locale]) {
    contentHtml = contentHtml.replaceAll(from, to);
  }

  return {
    extraHeadHtml: biographyHeadHtml.trim(),
    contentHtml,
  };
};
