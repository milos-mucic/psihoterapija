# Psychotherapy Website Implementation Blueprint

## 1. Recommended Architecture

### Recommended baseline
- Use **Astro as the application shell** with **TypeScript** and **Tailwind**.
- Use **React islands only for interactive parts**:
  - mobile navigation
  - FAQ accordion if needed
  - contact / intake / appointment forms
  - admin password modal
  - admin CRUD UI widgets
- Run Astro in **server mode with the Node adapter** so the project can support:
  - password-gated admin access
  - form handling
  - cookie-based admin sessions
  - future database integration
- Keep **public marketing pages prerendered** where possible, and keep **admin pages + data endpoints server-rendered**.

### Why this is the best fit
- Public pages stay fast and SEO-friendly.
- React stays limited to real UI interactivity instead of taking over the app.
- The admin area and submission handling need server capabilities anyway.
- This gives us a clean path from local/mock storage to SQLite/Postgres later without rewriting the site structure.

### High-level architecture
- `Astro pages` for route shells and page assembly
- `Astro layouts` for public and admin chrome
- `Shared UI components` in Astro for mostly static sections
- `React components` for form state, modal state, filters, inline admin editing
- `Service layer` between pages/actions and storage
- `Repository layer` behind services so storage can be swapped later
- `Middleware` for admin route protection and locale handling

### Recommended stack
- Astro
- TypeScript
- React
- Tailwind CSS
- Zod for validation
- Astro Content Collections for seeded blog content
- Astro Actions or API routes for submissions/admin operations
- Node adapter
- Optional but recommended soon after MVP: Drizzle + SQLite, later Postgres

## 2. Folder Structure

```text
/
  public/
    favicon/
    legacy/
      images/
      fonts/

  src/
    actions/
      public.ts
      admin.ts

    assets/
      images/

    components/
      astro/
        layout/
        navigation/
        sections/
        seo/
        ui/
      react/
        admin/
        forms/
        ui/

    content/
      blog/
        sr-latn/
        sr-cyrl/

    data/
      fixtures/
        faq.ts
        testimonials.ts
        navigation.ts
      mock/
        submissions.json

    features/
      admin/
        auth/
          admin-auth.service.ts
          admin-guard.ts
        pages/
          AdminDashboardPage.astro
          AdminBlogListPage.astro
          AdminBlogEditorPage.astro
          AdminSubmissionListPage.astro
          AdminSubmissionDetailsPage.astro
        schemas/
          admin-login.schema.ts

      blog/
        components/
          BlogCard.astro
          BlogHero.astro
        repositories/
          blog.repository.ts
          content-collection-blog.repository.ts
          sqlite-blog.repository.ts
        services/
          blog.service.ts
        schemas/
          blog.schema.ts
        types/
          blog.types.ts

      forms/
        components/
          ContactForm.tsx
          IntakeForm.tsx
          AppointmentForm.tsx
        repositories/
          submission.repository.ts
          file-submission.repository.ts
          sqlite-submission.repository.ts
        services/
          submission.service.ts
        schemas/
          submission.schema.ts
        types/
          submission.types.ts

      i18n/
        dictionaries/
          sr-latn.ts
          sr-cyrl.ts
        locale.ts
        routes.ts
        translate.ts

      marketing/
        page-data/
          home.ts
          about.ts
          psychotherapy.ts

    layouts/
      BaseLayout.astro
      AdminLayout.astro
      BlogPostLayout.astro

    lib/
      config/
        site.ts
        seo.ts
        admin.ts
      env.ts
      metadata.ts
      dates.ts
      urls.ts

    pages/
      index.astro
      o-nama.astro
      psihoterapija.astro
      blog/
        index.astro
        [slug].astro
      faq.astro
      kontakt.astro
      zakazivanje.astro
      cir/
        index.astro
        o-nama.astro
        psihoterapija.astro
        blog/
          index.astro
          [slug].astro
        faq.astro
        kontakt.astro
        zakazivanje.astro
      studio/
        ikar-portal-4f27b19a/
          index.astro
          blog/
            index.astro
            new.astro
            [id]/
              edit.astro
          submissions/
            index.astro
            [id].astro

    styles/
      tokens.css
      base.css
      prose.css
      admin.css

    content.config.ts
    env.d.ts
    middleware.ts

  data/
    sqlite/
      app.db

  astro.config.mjs
  package.json
  tsconfig.json
  tailwind.config.mjs
```

### Structure principles
- `src/pages` stays thin and route-focused.
- `src/features` holds business logic and feature-specific repositories/services.
- `src/components` holds shared presentational UI.
- `src/content` is for editorial content, not application state.
- `data/` is outside `src/` for runtime-backed local storage if needed.

## 3. Route Map

### Public routes

#### Latin default
- `/` -> Pocetna
- `/o-nama/` -> O nama
- `/psihoterapija/` -> Psihoterapija
- `/blog/` -> Blog listing
- `/blog/[slug]/` -> Blog post detail
- `/faq/` -> FAQ
- `/kontakt/` -> Contact page
- `/zakazivanje/` -> Intake / appointment form page

#### Cyrillic variant
- `/cir/`
- `/cir/o-nama/`
- `/cir/psihoterapija/`
- `/cir/blog/`
- `/cir/blog/[slug]/`
- `/cir/faq/`
- `/cir/kontakt/`
- `/cir/zakazivanje/`

### Admin routes
- `/studio/ikar-portal-4f27b19a/` -> dashboard
- `/studio/ikar-portal-4f27b19a/blog/` -> post list
- `/studio/ikar-portal-4f27b19a/blog/new/` -> create post
- `/studio/ikar-portal-4f27b19a/blog/[id]/edit/` -> edit post
- `/studio/ikar-portal-4f27b19a/submissions/` -> submissions list
- `/studio/ikar-portal-4f27b19a/submissions/[id]/` -> submission details

### Routing recommendations
- Keep the admin route **not linked anywhere publicly**.
- Keep admin **outside i18n routing** at first.
- Use the same public information architecture in both scripts.
- Keep slugs ASCII and stable even for Cyrillic pages to avoid URL complexity.

## 4. Component Architecture

### Public UI
- `BaseLayout.astro`
- `SiteHeader.astro`
- `SiteFooter.astro`
- `SeoHead.astro`
- `SectionHero.astro`
- `SectionRichText.astro`
- `SectionCTA.astro`
- `SectionTestimonials.astro`
- `SectionFaq.astro`
- `SectionContact.astro`
- `BlogCard.astro`

### React islands only where needed
- `MobileMenu.tsx`
- `LocaleSwitcher.tsx`
- `FaqAccordion.tsx` if the design requires client-side interaction
- `ContactForm.tsx`
- `AppointmentForm.tsx`
- `AdminPasswordModal.tsx`
- `AdminPostEditor.tsx`
- `AdminSubmissionFilters.tsx`

### Page composition pattern
- Route files in `src/pages` should mostly:
  - resolve locale
  - call services
  - pass data into layouts/sections
- Reusable section blocks should live in Astro components, not inside route files.
- Page-specific composition can live in `src/features/*/pages`.

## 5. Data Strategy For Blog + Submissions

### Recommended principle
Use **repository interfaces from day one** so the rest of the app does not care whether data comes from:
- content collections
- JSON/file storage
- SQLite
- Postgres
- external CMS later

### Blog strategy

#### Initial content source
- Seed the blog with **Astro Content Collections** in:
  - `src/content/blog/sr-latn/*.mdx`
  - `src/content/blog/sr-cyrl/*.mdx`
- This is excellent for:
  - schema validation
  - SEO-friendly static generation
  - easy editorial seeding from Webflow content
  - versioning content in Git

#### Important reality
- **Content Collections are great for seeded/editorial files, but not ideal as the only runtime admin-editable source in production.**
- If admin blog create/edit must truly work on a deployed app, we should not rely only on local MDX files.

#### Recommended practical approach
- Use `BlogRepository` as the app contract.
- Start with:
  - `ContentCollectionBlogRepository` for public published content
  - optionally `SQLiteBlogRepository` when runtime admin editing becomes required
- Admin UI should talk to the repository/service layer, never directly to `astro:content`.

#### Suggested blog model
- `id`
- `slug`
- `locale`
- `title`
- `excerpt`
- `coverImage`
- `content`
- `status` (`draft` | `published`)
- `publishedAt`
- `updatedAt`
- `seoTitle`
- `seoDescription`
- `tags`

### Submission strategy

#### Initial handling
- Forms submit through an Astro Action or API route.
- Validate input with Zod.
- Save through `SubmissionService`.

#### Storage options

##### Simplest local-first option
- `FileSubmissionRepository` storing JSON in `data/mock/submissions.json`
- Good for:
  - local development
  - early UI prototyping
  - fast MVP scaffolding

##### Better production-minded option
- `SQLiteSubmissionRepository`
- Better for:
  - deployed admin review
  - filtering/search later
  - future migration to Postgres

#### Suggested submission model
- `id`
- `type` (`contact` | `appointment` | `intake`)
- `locale`
- `name`
- `email`
- `phone`
- `message`
- `metadata`
- `status` (`new` | `reviewed` | `archived`)
- `createdAt`

### Recommended DB-ready migration path

#### Best migration path
- Step 1: repository interfaces
- Step 2: file or content-backed implementations
- Step 3: add Drizzle + SQLite
- Step 4: switch repository binding
- Step 5: later point Drizzle to Postgres

#### Why this works well
- Routes do not change.
- Admin UI does not change.
- Services do not change much.
- Only repository implementations change.

## 6. Hidden Admin Implementation Approach

### Recommended approach
- Use a **hardcoded obscure route segment in source**, for example:
  - `/studio/ikar-portal-4f27b19a/`
- Protect it with:
  - a password modal
  - server verification
  - an `HttpOnly` cookie
  - middleware guard on all admin routes

### Why this is better than a pure client-side gate
- A modal-only client check is trivial to bypass.
- A server-set cookie is still simple, but at least prevents casual direct access.
- This matches your stated security level without pretending it is enterprise auth.

### Recommended flow
1. User visits hidden admin URL.
2. Admin page shows password modal.
3. Modal submits password to an Astro Action or endpoint.
4. Server compares against `ADMIN_PASSWORD`.
5. On success, server sets signed or secret-derived `HttpOnly` cookie.
6. `middleware.ts` checks the cookie for every admin route.
7. If invalid or missing, redirect back to the admin entry page with the modal open.

### Suggested environment variables
- `ADMIN_PASSWORD`
- `ADMIN_COOKIE_NAME`
- `ADMIN_SESSION_SECRET`
- `DATABASE_URL`
- `PUBLIC_SITE_URL`

### Important implementation note
- The exact hidden path itself is better kept in source/config than in env, because Astro file routes are build-time based.

## 7. i18n Strategy

### Recommendation
- Use **Latin as default**, **Cyrillic under `/cir/`**.
- Keep admin non-localized initially.
- Keep UI labels in dictionaries.
- Keep blog content duplicated per locale/script.

### Recommended split
- Dictionaries for shared UI:
  - nav
  - buttons
  - labels
  - form messages
- Content files for blog posts
- Optional page-data files for section copy if marketing pages need structured editable content

### Why this is pragmatic
- Serbian Latin and Cyrillic are mostly script variants, not two unrelated site structures.
- This keeps routing simple.
- This avoids overengineering a full CMS-localization system on day one.

## 8. Initial Setup Plan

### Phase 1: project foundation
1. Initialize Astro with TypeScript.
2. Add React, Tailwind, MDX, sitemap, and Node adapter.
3. Set up base styles, design tokens, and typography.
4. Create `BaseLayout`, `AdminLayout`, header, footer, SEO component.

### Phase 2: route shell + i18n
1. Build public route skeletons for Latin.
2. Duplicate route wrappers for Cyrillic.
3. Add locale helpers and translation dictionaries.
4. Add canonical/hreflang metadata support.

### Phase 3: Webflow migration layer
1. Move legacy images/fonts into `public/legacy/`.
2. Map each Webflow page to Astro sections.
3. Rebuild layouts using reusable section components instead of copying Webflow DOM verbatim.
4. Reuse text/content structure, but normalize CSS and spacing into tokens.

### Phase 4: blog
1. Define blog content schema.
2. Add blog list and blog detail pages.
3. Seed initial posts from Webflow content.
4. Add blog card and blog detail layouts.

### Phase 5: forms + submissions
1. Add contact, appointment, and intake forms.
2. Validate with Zod.
3. Persist through `SubmissionService`.
4. Add success/error states and admin visibility.

### Phase 6: admin
1. Add hidden admin route.
2. Add password modal flow.
3. Add middleware cookie guard.
4. Build dashboard, blog management, and submission review screens.

### Phase 7: DB-ready upgrade
1. Add SQLite repository implementations.
2. Introduce Drizzle schema if moving beyond mock/file mode.
3. Swap service bindings from file/content to DB.

### Phase 8: production hardening
1. SEO metadata and schema markup
2. image optimization pass
3. performance cleanup
4. accessibility QA
5. analytics and form notifications if needed

## 9. Starter File Scaffold

### Minimum first scaffold to create immediately

```text
src/
  actions/
    public.ts
    admin.ts
  components/
    astro/
      layout/SiteHeader.astro
      layout/SiteFooter.astro
      seo/SeoHead.astro
      sections/HeroSection.astro
      sections/FaqSection.astro
    react/
      forms/ContactForm.tsx
      forms/AppointmentForm.tsx
      admin/AdminPasswordModal.tsx
  content/
    blog/
      sr-latn/
        dobrodosli-u-blog.mdx
      sr-cyrl/
        dobrodosli-u-blog-cir.mdx
  features/
    admin/
      auth/admin-auth.service.ts
    blog/
      repositories/blog.repository.ts
      repositories/content-collection-blog.repository.ts
      services/blog.service.ts
    forms/
      repositories/submission.repository.ts
      repositories/file-submission.repository.ts
      services/submission.service.ts
      schemas/submission.schema.ts
    i18n/
      dictionaries/sr-latn.ts
      dictionaries/sr-cyrl.ts
      locale.ts
  layouts/
    BaseLayout.astro
    AdminLayout.astro
  lib/
    config/site.ts
    config/admin.ts
    env.ts
  pages/
    index.astro
    o-nama.astro
    psihoterapija.astro
    blog/index.astro
    blog/[slug].astro
    faq.astro
    kontakt.astro
    zakazivanje.astro
    cir/
      index.astro
      o-nama.astro
      psihoterapija.astro
      blog/index.astro
      blog/[slug].astro
      faq.astro
      kontakt.astro
      zakazivanje.astro
    studio/
      ikar-portal-4f27b19a/
        index.astro
        blog/index.astro
        blog/new.astro
        blog/[id]/edit.astro
        submissions/index.astro
        submissions/[id].astro
  styles/
    tokens.css
    base.css
  middleware.ts
  content.config.ts
```

### Recommended first implementation order
1. foundation config
2. layouts and global styles
3. public pages
4. blog content system
5. forms + submission service
6. admin password gate
7. admin screens

## 10. Important Tradeoffs And Risks

### 1. Content collections vs admin editing
- If you want real runtime admin editing in production, content collections alone are not enough.
- They are ideal for seeded content, but not the final answer for a live admin-managed blog.

### 2. Hidden URL is not real security
- A hidden path plus password modal is acceptable only because you explicitly do not need enterprise security.
- Sensitive patient or medical records should not be handled this way.

### 3. File-based storage is not durable on many hosts
- Writing JSON/files on the server can fail or be wiped depending on hosting.
- It is fine for local prototype mode, but SQLite/Postgres is safer for a real deployment.

### 4. Two scripts means duplicated editorial review
- Latin and Cyrillic support is manageable, but every content change must be reviewed in both versions.

### 5. Webflow 1:1 migration can create messy markup if copied blindly
- Use the Webflow export as a visual/content reference.
- Rebuild the UI in Astro sections instead of preserving raw Webflow class soup and JS behavior.

## 11. Recommendation Summary

### Best overall recommendation
- Build the site as an **Astro server-mode project with prerendered public pages**.
- Use **React only for forms, modal gating, and small admin widgets**.
- Use **content collections for seeded blog content**.
- Use **repository + service layers from day one**.
- Use **file-based storage only as a temporary prototype path**.
- Move to **SQLite first** once admin blog editing and submission persistence must work in deployed environments.

This gives you the cleanest balance of simplicity, maintainability, performance, and future database readiness without overengineering the first version.
