import { readFile } from "node:fs/promises";

const biographySourceUrl = new URL("../../../webflow-old/our-team.html", import.meta.url);
const biographyHeadHtml = `
  <link href="/legacy/css/normalize.css" rel="stylesheet" type="text/css">
  <link href="/legacy/css/webflow.css" rel="stylesheet" type="text/css">
  <link href="/legacy/css/psihoterapijski-kabinet-ikar-website.webflow.css" rel="stylesheet" type="text/css">
  <link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=Lato:wght@100;300;400;700;900&display=swap">
`;
const biographyContentTranslations: Array<[string, string]> = [
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
];

const legacyImageAliases = new Map([
  ["Team-Img-1_1Team-Img-1.webp", "Team-Img-1_1Team%20Img%20(1).webp"],
  ["Info-Wrapper_1Info-Wrapper.webp", "Info-Wrapper_1Info%20Wrapper.webp"],
  ["About-Img-3_1About-Img-3.webp", "About-Img-3_1About%20Img%20(3).webp"],
  ["Office-3-1_1Office-3-1.webp", "Office-3-1_1Office%203%20(1).webp"],
  ["Appointmebt-Img_1Appointmebt-Img.webp", "Appointmebt-Img_1Appointmebt%20Img.webp"],
]);

export const getBiographyPageParts = async () => {
  let html = await readFile(biographySourceUrl, "utf-8");

  const pathMap = new Map([
    ["home-1.html", "/"],
    ["index.html", "/"],
    ["about-us-2.html", "/o-nama/"],
    ["about-us-1.html", "/biografija/"],
    ["our-team.html", "/biografija/"],
    ["services.html", "/psihoterapija/"],
    ["pricing.html", "/psihoterapija/"],
    ["sessions.html", "/psihoterapija/"],
    ["appointment.html", "/zakazivanje/"],
    ["blog-1.html", "/blog/"],
    ["blog-2.html", "/blog/"],
    ["blog-3.html", "/blog/"],
    ["faq.html", "/pitanja/"],
    ["contact-us.html", "/kontakt/"],
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

  for (const [from, to] of biographyContentTranslations) {
    contentHtml = contentHtml.replaceAll(from, to);
  }

  return {
    extraHeadHtml: biographyHeadHtml.trim(),
    contentHtml,
  };
};
