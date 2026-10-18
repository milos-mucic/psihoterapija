# Homepage critique — 18.10.2026

Impeccable design critique of the homepage (`src/pages/index.astro`), run on `main` @ `da5a972`
(local dev, seeded content) and checked against the deployed copy at https://dev.psihoterapija-ikar.rs/
(real CMS content). Two independent passes: a design review and a detector/browser scan.

Status legend: `[x]` fixed on branch `impeccable/homepage-fixes` · `[ ]` open · `[~]` parked placeholder (kept on purpose until the real content exists).
Owner: **kod** = code change · **CMS** = change in the admin studio · **Nemanja** = needs real assets or a decision.

## Score

| # | Heuristic | Score | Key issue |
|---|---|---|---|
| 1 | Visibility of system status | 2 | No inline validation; nothing says what happens after the form is sent |
| 2 | Match with the real world | 2 | "Unesite neophodne informacije…", "Pošalji prijavu", English "Psychologist" logo, kabinet vs centar |
| 3 | User control and freedom | 3 | Drawer closes on Esc and locks scroll |
| 4 | Consistency and standards | 1 | Header CTA "Kontakt" vs drawer CTA "Zakazivanje"; hero links off-page although the form is on this page; four button styles |
| 5 | Error prevention | 2 | Phone and email both required, no hints, no explanation next to the format select |
| 6 | Recognition rather than recall | 3 | Services are explained four sections above the select that asks you to pick one |
| 7 | Flexibility and efficiency | 2 | No tap-to-call in header or drawer |
| 8 | Aesthetic and minimalist design | 2 | Seven sections, ~13 competing actions, repeated "Saznajte više", stock imagery |
| 9 | Error recovery | 2 | Generic "Došlo je do greške" with no fallback channel |
| 10 | Help and documentation | 1 | Nothing about price, confidentiality, online vs in person, session length |
| | **Total** | **20/40** | **Acceptable** (previous run on the deployed page: 19/36) |

**Design specificity:** template, not authored. Logo reads "Psychologist"; template asset and class names
(`Banner-Home-3`, `Doctor--1`, `.collection-list-session-home-3`, `.heading-12`); 01/02/03 index chips.
What is genuinely Ikar: the teal/cream + Castoro/Lexend system, the first-person voice, the psychodynamic positioning.

## P0 — trust and identity

Parked 18.10.2026: logo, photos and contact data stay as placeholders until the real content is ready.

- [~] **Nemanja** — About section shows a stock photo of a woman under "Ja sam Nemanja Zajkešković"; hero and reasons photos also show a female therapist. Replace with a real portrait and real practice photos (or remove them).
- [~] **Nemanja** — Logo is the template's "Psychologist" SVG (`/legacy/images/Logo-White.svg`, `Logo-Dark.svg`). Needs an Ikar wordmark; upload it in Studio → site settings (brand logo light/dark).
- [~] **CMS** — Phone is the placeholder `+381 60 123 4567` (default in `src/lib/config/site.ts:7`, shown via the contact page content). Enter the real number in Studio → Kontakt.
- [x] **kod** — Footer shows "Profil uskoro" when no social links exist → the social block is now hidden until a link is added.

## P1 — content defects (deployed CMS content)

- [ ] **CMS** — Anxiety theme card copy is the placeholder "Uopšteno".
- [ ] **CMS** — Depression theme card has an empty description (renders an empty gap).
- [ ] **CMS** — Grammar: "Psihoterapijski centar Ikar je prevashodno polazi od toga…" → "…prevashodno polazi od toga…".
- [ ] **CMS** — Surname spelled "Zajkesković" in the about heading/alt; source says "Zajkešković".
- [ ] **Nemanja** — Pick one name: "kabinet" (title, footer) or "centar" (hero, reasons). The about section says "Ja sam", the rest says "naš centar".
- [x] **kod** — Footer label "Sitemap" → "Mapa sajta".
- [ ] **CMS** — Footer gallery has 2 images for 3 slots on prod (upload a third or the grid shows a gap; code now adapts to the count).

## P1 — booking moment

- [x] **kod** — Free 15-minute intro call (`homePage.promo`) was never rendered → now the first reassurance line next to the form.
- [x] **kod** — Reassurance next to the form: free intro call, link to "Cene i trajanje seansi" (/cena/), "Odgovor stiže na email adresu koju ostavite."
- [ ] **Nemanja** — Still unconfirmed, so not on the page yet: confidentiality line, reply time ("u roku od 24h"?), online vs in person.
- [x] **kod** — Phone optional (email stays required), format optional with "Nisam siguran/na" as the default, optional message field. Schema relaxed in `submission.schema.ts`; DB columns were already optional. Applies to /zakazivanje/ too.
- [x] **kod** — Submit button "Pošalji prijavu" → "Pošaljite upit"; success message says where the reply goes.
- [ ] **CMS** — Form heading "Unesite neophodne informacije kako biste zakazali termin" still reads like paperwork → e.g. "Zakažite prvi razgovor" (Studio → Početna → booking).
- [x] **kod** — One booking action: header, drawer and footer all say "Zakažite termin" (on the homepage it jumps to `#home-booking`, elsewhere /zakazivanje/); "Kontakt" is a plain link next to it and in the drawer.
- [ ] **CMS** — Hero primary button still links to /zakazivanje/ (CMS field); `#home-booking` would keep visitors on the page.
- [x] **kod** — Error messages name the problem and a fallback: invalid data → "Proverite ime i email adresu…"; failed send → "…ili nam se javite preko stranice Kontakt."

## P2 — structure

- [x] **kod** — The "Kako možemo da Vam pomognemo?" contact prompt now comes after About (who before contact).
- [ ] **Nemanja** — Merge services / themes / reasons into one "Kako radim" section (content decision; page is still ~9.5k px on phones).
- [x] **kod** — Sticky "Zakažite termin" button on phones; hidden over the hero, the form and the footer, and without JS.
- [x] **kod** — Theme cards had 3 links to the same URL (image, title, "Saznajte više") → one link per card, whole card clickable.
- [ ] **CMS** — "Poremećaji ličnosti" as one of only three topics reads as stigmatizing to a first-time visitor.
- [x] **kod** — Reason panels lifted on hover although they are not clickable → hover lift removed.
- [~] **Nemanja** — The video card is a poster-only leftover (player disabled). Hidden on phones and from screen readers; replace with a real practice photo later.

## Responsiveness

- [x] `.container` gutter is 15px at every width up to 1470px (text <16px from the edge) → fluid gutter `clamp(1rem, 5vw, 3rem)`. `base.css:138`, duplicated in `SiteFooter.astro`.
- [x] Anchor jumps to `#home-booking` land under the fixed header (h2 at 32px, header ends at 87px) → `scroll-padding-top` from `--header-offset`.
- [x] Form inputs are 15.2px → iOS zooms on focus. Now 16px minimum.
- [x] Tap targets under 44px: hero "O nama" (81×24), menu toggle (41×41), theme links (23–28px), footer links (26px), desktop nav (43px).
- [x] Hero title at 320px: "Psihoterapijski" fills 290/290px → fluid size with safe minimum.
- [x] Hero crop on phones shows only a lamp and sofa (no people) → mobile background position adjusted.
- [x] Hero is a 100vh mostly-empty photo at 721–1100px → capped height on tablet.
- [x] About at 961–1100px: image column dominates, heading wraps to 4 lines → rebalanced columns.
- [x] About image at 721–960px: 738×738 square upscaled 2.6× → capped size and portrait ratio.
- [x] Body copy line length 86–105 characters (about, reasons, services intro) → max 62ch.
- [x] Themes at 721–960px break into 2+1 with a lone centred card → even 3-column grid, 1 column on phones.
- [x] `.service-img` fixed 300px height → aspect-ratio crop. Removed Webflow leftover `.service-name{width:91%}`.
- [x] Services at 721–960px: single 738px-wide cards → copy capped at 62ch. (Still one column; an icon-beside-text layout is an option for later.)
- [x] Video poster upscaled at 721–960 and ~400px of filler scroll on phones → shorter crop on tablet, hidden on phones.
- [x] Blog at 721–960px: three tall stacked cards with upscaled images → two columns.
- [x] Footer at 721–1100px: three cramped columns (sitemap sub-columns 88px) → two columns; link groups align to top.
- [x] Footer gallery leaves a hole when fewer than 3 images.
- [x] Orphan words in headings at 320–1024 ("radu", "centar?", "sajtu", "Ikar", "termin") → `text-wrap: balance` / `pretty`.
- [x] Scrolled header is translucent teal over cream (muddy grey-green) → near-solid.
- [x] Native select arrow only styled inside `.page-form-shell` → styled in the homepage form too.
- [x] Reason panel index chip sits on its own row on phones.
- [x] Reveal motion: no reduced-motion and no no-JS fallback (content stays at opacity 0) → visible by default, animates only when JS runs and motion is allowed.
- [x] Logo link in the header was 31px tall → 44px.
- [x] Desktop nav collapsed to a hamburger already at 1100px → full nav from 1025px (needs ~870px incl. Kontakt + CTA; 961px left only 865px). Dropdown hover breakpoint in `public/scripts/appbar.js` moved with it.
- [x] Sticky "Zakažite termin" button on phones (see P2).
- [x] Empty CMS rich-text fields no longer render blank gaps.

### Verification after the fixes (local, seeded content)

| Width | Horizontal overflow | Closest text to edge | Inputs | Body line length | Themes / blog / footer columns |
|---|---|---|---|---|---|
| 1440 | 0 | 80px | 16px | ≤75 ch | 3 / 3 / 3 |
| 1024 | 0 | 48px | 16px | ≤73 ch | 3 / 3 / 2 |
| 768 | 0 | 38px | 16px | ≤75 ch | 3 / 2 / 2 |
| 375 | 0 | 19px | 16px | 42 ch | 1 / 1 / 1 |
| 320 | 0 | 16px | 16px | 36 ch | 1 / 1 / 1 |

- Hero title at 320px: 41.6px, fits in 288px. Hero height at 768px: 660px (was 1024px).
- `#home-booking` jump: heading lands at 144px, header ends at 75px.
- Without JS (`.js` class removed) revealed blocks stay at opacity 1.
- Every theme card has one link; tapping the image opens it. All remaining links ≥44px tall.
- Detector on the local URL: 9 → 4 findings at 1280px after the responsive pass, then → 1 after the second pass (only the intentional italic `Ikar`); 390px: clean. Source scan clean.
- Second pass checked at 1440, 1280, 1100, 1025, 1024, 768, 375 and 320px: no overflow, no tap target under 44px, desktop nav on one line from 1025px. /zakazivanje/, /kontakt/, /blog/, /cena/ also have no overflow. Appointment API accepts name + email only (201) and rejects invalid email with the new message (400).

## Detector findings

| Rule | Where | Verdict |
|---|---|---|
| `body-text-viewport-edge` | about, reasons intro, hero copy at 1024–1280 | Real → fixed with the gutter |
| `line-length` | `.home-reasons__intro` p (~102 ch) | Real → fixed |
| `kicker-above-heading` | footer "Kontakt" eyebrow above the brand h2 (`SiteFooter.astro`) | Real → eyebrow removed; footer button is now "Zakažite termin" |
| `buried-raster` | footer photo under a 0.92–0.98 gradient, rule defined twice (`base.css`, `SiteFooter.astro`) | Real → photo dropped from both rules |
| `low-contrast` | message placeholder #8b9e9e on white, 2.8:1 | Real → placeholders use the muted text colour (~7:1) |
| `italic-serif-display` | `<em>Ikar</em>` in the h1 | Judgment call, kept |
| `side-tab` | `.home-richtext blockquote` border-left (`home.css:211`) | False positive for this page (quote style) |

## Accessibility notes

- [x] Drawer close button and backdrop were labelled "Otvori navigaciju" → "Zatvori navigaciju".
- [x] h1 read "centarIkar" for screen readers → a space is kept before the CMS `<br>`.
- [x] Video poster card is `aria-hidden`.
- [x] Skip link "Preskoči na sadržaj" → `#main`; themed focus ring and text selection.

## Questions for Nemanja

1. If his name were swapped for another therapist's, what on this page would change?
2. Why ask for phone, email and a service before saying the first 15 minutes are free?
3. This is one person's practice that says "Ja sam". Does "naš centar" cost more trust than it gains?
