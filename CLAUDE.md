# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Commands

Package manager is **pnpm** (declared in `package.json` `packageManager` field).

```bash
pnpm install      # install dependencies
pnpm dev          # start dev server at http://localhost:3000 (auto-redirects to /en)
pnpm build        # production build
pnpm start        # serve production build
pnpm lint         # next lint (eslint-config-next)
```

There is no test suite configured in this repository.

## Architecture

### Internationalized App Router (next-intl)

This is a Next.js 14 App Router project where **every public route lives under a `[locale]` segment**. The setup spans four files that must stay consistent:

- [src/i18n/routing.ts](src/i18n/routing.ts) — single source of truth for locales (`en`, `de`), default locale, and `localePrefix: 'always'`. Adding a locale means updating this file **and** adding a matching JSON in [messages/](messages/).
- [src/i18n/request.ts](src/i18n/request.ts) — resolves the active locale and loads `messages/${locale}.json`. Unknown locales call `notFound()`.
- [src/middleware.ts](src/middleware.ts) — wraps `createMiddleware(routing)`; its matcher excludes `_next`, `_vercel`, and any path with a dot (files).
- [next.config.mjs](next.config.mjs) — wraps the config with `createNextIntlPlugin('./src/i18n/request.ts')`. Also sets `transpilePackages: ["three"]`.

Because `localePrefix: 'always'`, the bare `/` is never a valid render path — the middleware rewrites it. There are catch-all redirect routes at [src/app/\[...slug\]/page.tsx](src/app/[...slug]/page.tsx) (redirects to `/`) and [src/app/\[locale\]/\[...slug\]/page.tsx](src/app/[locale]/[...slug]/page.tsx) (redirects to `/${locale}`) to keep deep-link 404s from leaking through.

[src/app/layout.tsx](src/app/layout.tsx) is a pass-through; the real `<html>`/`<body>` shell, `NextIntlClientProvider`, `CustomCursor`, `ParticleBackground`, and `Navbar` all live in [src/app/\[locale\]/layout.tsx](src/app/[locale]/layout.tsx). `generateStaticParams` there pre-renders one branch per locale.

### Content model: structured data + translations

Content lives in two places that intentionally complement each other — **changes to project/experience descriptions usually require editing both**:

1. [src/lib/data.ts](src/lib/data.ts) — language-agnostic structured data: `PERSONAL`, `SKILLS`, `PROJECTS`, `EXPERIENCE`. Items reference translation strings by key, not value:
   - `Project.descriptionKey` → looked up under `projects.descriptions.{key}` in the JSON messages.
   - `Experience.descriptionNamespace` → namespace under `experience.{namespace}` containing the bullet list.
2. [messages/en.json](messages/en.json) and [messages/de.json](messages/de.json) — all user-visible strings, including hero roles, section copy, and the description text referenced above.

So `PROJECTS[0].title` is hard-coded English in `data.ts`, but its description text is fetched via `useTranslations('projects.descriptions').raw('photoVoltaic')`. When adding a project or experience, add both the structured entry **and** the matching translation keys in every locale JSON.

### Page composition

[src/app/\[locale\]/page.tsx](src/app/[locale]/page.tsx) is a flat assembly of section components — `HeroSection`, `AboutSection`, `SkillsSection`, `ProjectsSection`, `ExperienceSection`, `ContactSection`, `Footer`. Section anchors (`#about`, `#skills`, etc.) are used by the `Navbar` for smooth-scroll nav. Each section is a `"use client"` component that calls `useTranslations(...)` for its strings.

### 3D / WebGL components

[src/components/3d/](src/components/3d/) holds the two visually-heavy pieces. Both are client-only:

- [ParticleBackground.tsx](src/components/3d/ParticleBackground.tsx) — actual Three.js scene. Mounted once globally in the locale layout. Reads `useMousePosition()` to parallax the particles. Particle count is set in this file; lower it for low-end device perf.
- [Avatar3D.tsx](src/components/3d/Avatar3D.tsx) — despite the `/3d/` path, this is an **SVG-based** avatar driven by mouse position via `requestAnimationFrame` transform updates. It is `dynamic()`-imported with `ssr: false` from [HeroSection.tsx](src/components/sections/HeroSection.tsx).

When adding new Three.js code, follow the existing pattern: `"use client"` + `dynamic()` import with `ssr: false` from the consuming section. Three is listed in `transpilePackages` so direct imports from `three` work.

### Contact form (EmailJS)

[src/components/sections/ContactSection.tsx](src/components/sections/ContactSection.tsx) calls `emailjs.send()` directly from the browser. The three `NEXT_PUBLIC_EMAIL_SERVICE_*` env vars must be present in `.env.local` (see README) — without them the call fails silently and the form shows the error state. The template variable names sent (`from_name`, `from_email`, `message`, `to_name`, `to_email`) must match the EmailJS template; the recipient address `to_email` is currently hard-coded in this file.

### Styling

Tailwind is configured in [tailwind.config.ts](tailwind.config.ts) with project-specific design tokens that are used throughout the components — prefer these over arbitrary values:

- Colors: `bg-bg-primary/secondary/tertiary`, `text-accent-cyan/violet/pink`, `bg-surface`.
- Fonts: `font-display` (Syne), `font-body` (DM Sans), `font-mono` (JetBrains Mono).
- Custom animations: `animate-spin-slow`, `animate-float`, `animate-pulse-glow`, `animate-shimmer`, `animate-slide-up`, `animate-fade-in`.
- Backgrounds: `bg-grid-pattern bg-grid-size`, `bg-hero-glow`, `bg-card-glow`.
- Shadows: `shadow-glow-cyan`, `shadow-glow-violet`, `shadow-card-hover`.

Class-merging utility: `cn(...)` from [src/lib/utils.ts](src/lib/utils.ts) (clsx + tailwind-merge).

### Path alias

`@/*` resolves to `./src/*` (see [tsconfig.json](tsconfig.json)). Use it for all internal imports.
