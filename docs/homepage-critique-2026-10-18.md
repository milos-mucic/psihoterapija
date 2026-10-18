# Homepage critique — 18.10.2026

Impeccable design critique of the homepage (`src/pages/index.astro`), run on `main` @ `da5a972`
(local dev, seeded content) and checked against the deployed copy at https://dev.psihoterapija-ikar.rs/
(real CMS content). Two independent passes: a design review and a detector/browser scan.

Status legend: `[x]` fixed on branch `impeccable/homepage-fixes` · `[ ]` open.
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

- [ ] **Nemanja** — About section shows a stock photo of a woman under "Ja sam Nemanja Zajkešković"; hero and reasons photos also show a female therapist. Replace with a real portrait and real practice photos (or remove them).
- [ ] **Nemanja** — Logo is the template's "Psychologist" SVG (`/legacy/images/Logo-White.svg`, `Logo-Dark.svg`). Needs an Ikar wordmark; upload it in Studio → site settings (brand logo light/dark).
- [ ] **CMS** — Phone is the placeholder `+381 60 123 4567` (default in `src/lib/config/site.ts:7`, shown via the contact page content). Enter the real number in Studio → Kontakt.
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

- [ ] **kod + Nemanja** — Free 15-minute intro call exists in `homePage.promo` (dictionary + `src/data/fixtures/home.ts:51`) but is never rendered. Show it next to the form.
- [ ] **Nemanja** — Reassurance next to the form: confidentiality, reply time ("javljam se u roku od 24h"?), price or a link to /cena, online vs in person. Needs confirmed facts before it goes live.
- [ ] **kod** — Make phone optional (email stays required), make the format choice optional ("Nisam siguran/na"), add an optional message field. Backend already accepts `message` for appointments (`src/features/forms/schemas/submission.schema.ts`).
- [ ] **CMS** — Form heading "Unesite neophodne informacije kako biste zakazali termin" and button "Pošalji prijavu" read like paperwork → e.g. "Zakažite prvi razgovor" / "Pošaljite upit".
- [ ] **kod** — One booking target: header says "Kontakt" (/kontakt/), drawer "Zakazivanje", hero links to /zakazivanje/ while the form is on this page.
- [ ] **kod** — Error message should offer a fallback (email/phone).

## P2 — structure

- [ ] **Nemanja** — Page is ~9.4–9.7k px tall on mobile; booking is section 7 of 8. Merge services / themes / reasons into one "Kako radim" section, drop the early "Kako možemo da Vam pomognemo?" prompt, move a booking prompt up after About.
- [ ] **kod** — Sticky "Zakažite" button on mobile after the hero.
- [x] **kod** — Theme cards had 3 links to the same URL (image, title, "Saznajte više") → one link per card, whole card clickable.
- [ ] **CMS** — "Poremećaji ličnosti" as one of only three topics reads as stigmatizing to a first-time visitor.
- [x] **kod** — Reason panels lifted on hover although they are not clickable → hover lift removed.
- [ ] **kod** — The video card is a poster-only leftover (player disabled); remove or replace with a real practice photo.

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
- [ ] Desktop nav collapses to a hamburger already at 1100px although nav + CTA need ~860px. Left as is: the dropdown nav was not re-tested at 901–1100 in this pass.
- [ ] Sticky "Zakažite" button on phones (see P2).

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
- Detector on the local URL: 9 → 4 findings at 1280px, 4 → 3 at 390px (remaining: italic `Ikar`, footer kicker, buried footer raster; source: `side-tab` blockquote false positive).

## Detector findings

| Rule | Where | Verdict |
|---|---|---|
| `body-text-viewport-edge` | about, reasons intro, hero copy at 1024–1280 | Real → fixed with the gutter |
| `line-length` | `.home-reasons__intro` p (~102 ch) | Real → fixed |
| `kicker-above-heading` | footer "Kontakt" eyebrow above the brand h2 (`SiteFooter.astro`) | Real, open (eyebrow is CMS-editable) |
| `buried-raster` | footer photo under a 0.92–0.98 gradient, rule defined twice (`base.css:1464`, `SiteFooter.astro`) | Real, open: image downloads but is invisible |
| `italic-serif-display` | `<em>Ikar</em>` in the h1 | Judgment call, kept |
| `side-tab` | `.home-richtext blockquote` border-left (`home.css:211`) | False positive for this page (quote style) |

## Accessibility notes

- [ ] Drawer close button and backdrop are labelled "Otvori navigaciju" (open navigation).
- [ ] h1 reads "centarIkar" without a space for screen readers (`<br>` in CMS title).
- [ ] Video poster image has empty alt but is not hidden from assistive tech.
- [ ] No skip link.

## Questions for Nemanja

1. If his name were swapped for another therapist's, what on this page would change?
2. Why ask for phone, email and a service before saying the first 15 minutes are free?
3. This is one person's practice that says "Ja sam". Does "naš centar" cost more trust than it gains?
