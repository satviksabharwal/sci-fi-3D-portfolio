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

Because `localePrefix: 'always'`, the bare `/` is never a valid render path — the middleware rewrites it. Unknown paths return a real 404 (not a redirect, which search engines treat as a soft 404): [src/app/\[locale\]/\[...slug\]/page.tsx](src/app/[locale]/[...slug]/page.tsx) calls `notFound()` and renders the translated [src/app/\[locale\]/not-found.tsx](src/app/[locale]/not-found.tsx); [src/app/not-found.tsx](src/app/not-found.tsx) covers requests the middleware skips and renders its own `<html>`.

SEO surface: `generateMetadata` in the locale layout (strings under the `metadata` namespace in the messages), [src/app/robots.ts](src/app/robots.ts), [src/app/sitemap.ts](src/app/sitemap.ts), [src/app/\[locale\]/opengraph-image.tsx](src/app/[locale]/opengraph-image.tsx), and the JSON-LD block in the locale page. The canonical origin is `SITE_URL` in [src/lib/data.ts](src/lib/data.ts). The locale layout and page call `setRequestLocale` so both locales are statically rendered — keep that call in any new page.

[src/app/layout.tsx](src/app/layout.tsx) is a pass-through; the real `<html>`/`<body>` shell, `NextIntlClientProvider`, `CustomCursor`, `ParticleBackground`, and `Navbar` all live in [src/app/\[locale\]/layout.tsx](src/app/[locale]/layout.tsx). `generateStaticParams` there pre-renders one branch per locale.

### Content model: structured data + translations

Content lives in two places that intentionally complement each other — **changes to project/experience descriptions usually require editing both**:

1. [src/lib/data.ts](src/lib/data.ts) — language-agnostic structured data: `PERSONAL`, `SKILLS`, `PROJECTS`, `EXPERIENCE`. Items reference translation strings by key, not value:
   - `Project.descriptionKey` → looked up under `projects.descriptions.{key}` in the JSON messages.
   - `Experience.descriptionNamespace` → namespace under `experience.{namespace}` containing the bullet list.
2. [messages/en.json](messages/en.json) and [messages/de.json](messages/de.json) — all user-visible strings, including hero roles, section copy, and the description text referenced above.

So `PROJECTS[0].title` is hard-coded English in `data.ts`, but its description text is fetched via `useTranslations('projects.descriptions').raw('photoVoltaic')`. When adding a project or experience, add both the structured entry **and** the matching translation keys in every locale JSON.

### Page composition

[src/app/\[locale\]/page.tsx](src/app/[locale]/page.tsx) is a flat assembly of section components in **story order** — `HeroSection`, `AboutSection`, `ExperienceSection`, `SkillsSection`, `ProjectsSection`, `ContactSection`, `Footer`. The page is told as a space-mission log: each section is a "station" with a `chapter` word (`/Origin`, `/Flight log`, …) rendered by [SectionWrapper.tsx](src/components/ui/SectionWrapper.tsx), and [MissionHud.tsx](src/components/ui/MissionHud.tsx) (mounted in the locale layout) shows the route. The same section order is listed in `MissionHud`'s `STATIONS` and the `Navbar` links — change all three together. Section anchors (`#about`, `#skills`, etc.) are used by the `Navbar` for smooth-scroll nav. Each section is a `"use client"` component that calls `useTranslations(...)` for its strings.

### 3D / WebGL components

[src/components/3d/](src/components/3d/) holds the visually-heavy pieces. All are client-only:

- [ParticleBackground.tsx](src/components/3d/ParticleBackground.tsx) — mounted once globally in the locale layout; renders [StarField.tsx](src/components/3d/StarField.tsx), a CSS-only starfield (client-only: it reads the screen size while rendering). It is the backdrop for pages without the 3D world (404) and while that world loads.
- [JourneyScene.tsx](src/components/3d/JourneyScene.tsx) — the page's whole 3D world, a fixed full-viewport canvas behind the content (`-z-10` inside `<main>`; never wrap it in a transformed element, that would stop it being fixed). Everything is built from Three.js primitives (no model files). It holds the station where the astronaut codes and greets (the hero's "live intro"), then one continuous flight: scroll position is mapped through the section tops (`STATIONS`, same order as `MissionHud`) onto `ROUTE`, and the astronaut leaves his chair and flies it top to bottom past an object per section (moons, three company planets, a skill constellation, satellites, a home planet). Keys fly it too: W/S or ↑/↓ thrust (scrolls the page), A/D steer, 1–6 jump to a station. The camera's view offset keeps him beside the hero text, then in the right margin during the flight; objects are placed on the left so they stay clear of him. It takes two props, `greeting` and `speaking`, and animates everything from one rAF loop reading refs. [HeroSection.tsx](src/components/sections/HeroSection.tsx) owns the behaviour: when the scene is ≥60% in view he swivels round, lifts his visor, waves and plays the intro lines (`hero.intro` in the messages, typed as captions). Per line it uses the best media in `public/intro/<locale>/`: `line-N.mp4` / `again.mp4`, an avatar video of Satvik saying the line, projected onto a head-shaped mesh inside the helmet (`faceVideo` prop; muted unless sound is on). The helmet's resting face is `public/intro/rest.mp4` held on its first frame (the first 0.3s of a clip — video, not an image, because browsers colour-convert the two differently), and clips cross-fade in and out of it so the face never visibly swaps; the simple 3D face is only the fallback if that still fails to load; else, with sound on, `line-N.mp3` (his own recording); else the browser's `speechSynthesis`. The videos come from `pnpm generate:intro` ([scripts/generate-intro.ts](scripts/generate-intro.ts)), which renders them through Runway's avatar-video API with `RUNWAYML_API_SECRET` (server-side secret in `.env.local`, spends credits) and writes the manifest [src/lib/intro-clips.json](src/lib/intro-clips.json) the hero reads — re-run it whenever `hero.intro` changes; when it scrolls away the visor closes and he turns back to the console. It is `dynamic()`-imported with `ssr: false` and mounted only after page load + idle, on touch devices too.

When adding new Three.js code, follow the existing pattern: `"use client"` + `dynamic()` import with `ssr: false` from the consuming section. Three is listed in `transpilePackages` so direct imports from `three` work.

### Contact form (EmailJS)

[src/components/sections/ContactSection.tsx](src/components/sections/ContactSection.tsx) calls `emailjs.send()` directly from the browser. The three `NEXT_PUBLIC_EMAIL_SERVICE_*` env vars must be present in `.env.local` (see README) — without them the call fails silently and the form shows the error state. The template variable names sent (`from_name`, `from_email`, `message`, `to_name`, `to_email`) must match the EmailJS template; the recipient address `to_email` is currently hard-coded in this file.

### Styling

Tailwind is configured in [tailwind.config.ts](tailwind.config.ts) with project-specific design tokens that are used throughout the components — prefer these over arbitrary values:

The look is a refined near-black canvas with **one** accent (`accent-cyan`, a soft teal), two-weight headlines (`font-bold` + `font-light`), hairline dividers and pill buttons — no gradients, grids or emoji icons in sections.

- Colors: `bg-bg-primary/secondary/tertiary`, `text-accent-cyan`, `bg-surface` (`accent-violet/pink` remain only for the chat widget).
- Fonts: `font-display` (Manrope), `font-body` (DM Sans), `font-mono` (JetBrains Mono).
- Custom animations: `animate-spin-slow`, `animate-float`, `animate-pulse-glow`, `animate-shimmer`, `animate-slide-up`, `animate-fade-in`.
- Backgrounds: `bg-grid-pattern bg-grid-size`, `bg-hero-glow`, `bg-card-glow`.
- Shadows: `shadow-glow-cyan`, `shadow-glow-violet`, `shadow-card-hover`.

Class-merging utility: `cn(...)` from [src/lib/utils.ts](src/lib/utils.ts) (clsx + tailwind-merge).

### Path alias

`@/*` resolves to `./src/*` (see [tsconfig.json](tsconfig.json)). Use it for all internal imports.
