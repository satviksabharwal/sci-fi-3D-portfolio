# Satvik Sabharwal — 3D Portfolio

A high-performance, visually immersive personal portfolio built with **Next.js 14**, **Three.js**, and **Framer Motion**. Features a WebGL 3D avatar, particle background, animated skill bars, accordion experience timeline, and a fully wired contact form powered by **EmailJS**. Fully internationalised in **English** and **German** with browser-locale detection.

**Live demo:** [satviksabharwal.com](https://satviksabharwal.com/)

---

## Table of Contents

- [Features](#features)
- [Tech Stack](#tech-stack)
- [Project Structure](#project-structure)
- [Internationalisation (i18n)](#internationalisation-i18n)
- [Getting Started](#getting-started)
  - [Prerequisites](#prerequisites)
  - [Installation](#installation)
  - [Running Locally](#running-locally)
- [Environment Variables](#environment-variables)
- [Connecting EmailJS](#connecting-emailjs)
  - [Step 1 — Create an EmailJS Account](#step-1--create-an-emailjs-account)
  - [Step 2 — Add an Email Service](#step-2--add-an-email-service)
  - [Step 3 — Create an Email Template](#step-3--create-an-email-template)
  - [Step 4 — Get Your Public Key](#step-4--get-your-public-key)
  - [Step 5 — Add Credentials to .env.local](#step-5--add-credentials-to-envlocal)
  - [Step 6 — Verify the Integration](#step-6--verify-the-integration)
- [Customization](#customization)
- [Build & Deployment](#build--deployment)
- [Performance Tips](#performance-tips)
- [License](#license)

---

## Features

| Section        | Highlights                                                                                     |
| -------------- | ---------------------------------------------------------------------------------------------- |
| **Hero**       | 3D WebGL avatar, typewriter role animation, animated orbit rings, stats strip                  |
| **About**      | Bio, education timeline, values grid, location & social chips                                  |
| **Skills**     | Animated progress bars grouped by Frontend / Backend / Tools & Ops                             |
| **Projects**   | Featured project cards with per-project glow color, GitHub + live links                        |
| **Experience** | Accordion timeline — active card shows neon cyan indicator with ping animation                 |
| **Contact**    | EmailJS-powered form with loading / success / error states                                     |
| **Global**     | Custom cursor, interactive particle background, scroll-reveal animations, smooth-scroll navbar |
| **i18n**       | English + German, browser-locale detection, language switcher in navbar                        |
| **Favicon**    | Programmatic gradient "S" monogram matching the navbar logo                                    |

---

## Tech Stack

| Layer           | Technology                                            |
| --------------- | ----------------------------------------------------- |
| Framework       | [Next.js 14](https://nextjs.org/) (App Router)        |
| Language        | TypeScript                                            |
| Styling         | Tailwind CSS v3 with custom design tokens             |
| 3D / WebGL      | Three.js + `@react-three/fiber` + `@react-three/drei` |
| Animations      | Framer Motion                                         |
| i18n            | `next-intl` v4                                        |
| Typewriter      | `react-type-animation`                                |
| Contact form    | `@emailjs/browser`                                    |
| Intersection    | `react-intersection-observer`                         |
| Utilities       | `clsx` + `tailwind-merge`                             |
| Package manager | pnpm                                                  |

---

## Project Structure

```
portfolio/
├── messages/
│   ├── en.json                    # All English strings (UI copy, section text, descriptions)
│   └── de.json                    # All German strings
├── src/
│   ├── app/
│   │   ├── [...slug]/page.tsx     # Catch-all redirect → /
│   │   ├── [locale]/
│   │   │   ├── [...slug]/page.tsx # Catch-all redirect → /{locale}
│   │   │   ├── layout.tsx         # HTML shell, NextIntlClientProvider, Navbar, ParticleBackground
│   │   │   └── page.tsx           # Flat assembly of all section components
│   │   ├── globals.css            # Global styles & Tailwind directives
│   │   ├── icon.tsx               # Programmatic favicon (gradient "S" monogram via ImageResponse)
│   │   └── layout.tsx             # Root pass-through layout
│   ├── components/
│   │   ├── 3d/
│   │   │   ├── Avatar3D.tsx       # SVG-based avatar driven by mouse position (dynamic, SSR-disabled)
│   │   │   └── ParticleBackground.tsx  # Three.js particle scene, mounted globally
│   │   ├── sections/
│   │   │   ├── HeroSection.tsx
│   │   │   ├── AboutSection.tsx
│   │   │   ├── SkillsSection.tsx
│   │   │   ├── ProjectsSection.tsx
│   │   │   ├── ExperienceSection.tsx
│   │   │   └── ContactSection.tsx # EmailJS integration lives here
│   │   └── ui/
│   │       ├── CustomCursor.tsx
│   │       ├── Footer.tsx
│   │       ├── LogoSvg.tsx        # Shared gradient "S" logo — used by Navbar and favicon
│   │       ├── Navbar.tsx         # Language switcher + locale-aware resume link
│   │       └── SectionWrapper.tsx
│   ├── hooks/
│   │   ├── useMousePosition.ts    # Global mouse tracking for parallax
│   │   └── useScrollReveal.ts     # IntersectionObserver helper (re-triggers on each scroll)
│   ├── i18n/
│   │   ├── navigation.ts          # Locale-aware Link / useRouter / usePathname
│   │   ├── request.ts             # Resolves locale + loads messages at request time
│   │   └── routing.ts             # Single source of truth: locales, defaultLocale, detection
│   ├── lib/
│   │   ├── data.ts                # Language-agnostic structured data (PERSONAL, SKILLS, PROJECTS, EXPERIENCE)
│   │   └── utils.ts               # cn() utility (clsx + tailwind-merge)
│   ├── middleware.ts              # next-intl middleware — locale prefix + Accept-Language detection
│   └── types/
│       └── index.ts
├── tailwind.config.ts
├── next.config.mjs
├── tsconfig.json
└── .env.local                     # NOT committed — you must create this
```

---

## Internationalisation (i18n)

The site is fully internationalised with [next-intl](https://next-intl-docs.vercel.app/) v4. Every public route lives under a `[locale]` segment (`/en`, `/de`).

### How it works

| File                  | Role                                                                                             |
| --------------------- | ------------------------------------------------------------------------------------------------ |
| `src/i18n/routing.ts` | Declares supported locales (`en`, `de`), `defaultLocale: 'en'`, and `localePrefix: 'always'`     |
| `src/middleware.ts`   | Intercepts every request; reads the `Accept-Language` header and redirects `/` to `/en` or `/de` |
| `src/i18n/request.ts` | Loads the correct `messages/*.json` for the active locale on the server                          |
| `messages/en.json`    | All English strings                                                                              |
| `messages/de.json`    | All German strings                                                                               |

### Browser locale detection

- `localeDetection: true` — the middleware reads the browser's `Accept-Language` header on every visit to `/`
- `localeCookie: false` — no locale cookie is set, so the browser language is always respected (not overridden by a previous visit)
- Unsupported languages (e.g. French, Spanish) fall back to `defaultLocale: 'en'`

### Content model

Content lives in two places that must stay in sync:

1. **`src/lib/data.ts`** — language-agnostic structured data. Items reference translation keys, not values:
   - `Project.descriptionKey` → looked up as `projects.descriptions.{key}` in the JSON messages
   - `Experience.descriptionNamespace` → namespace under `experience.{namespace}` containing bullet points

2. **`messages/en.json` and `messages/de.json`** — all user-visible strings, including the hero bio, section labels, and the description text referenced above.

When adding a project or experience entry, update **both** `data.ts` (structured metadata) and **every locale JSON** (translated text).

### Language switcher

The Navbar includes an `EN · DE` toggle that calls `router.replace(pathname, { locale })` from `next-intl` — no page reload, no cookie set.

---

## Getting Started

### Prerequisites

- **Node.js** v18 or later
- **pnpm** v8 or later — install with `npm install -g pnpm`

### Installation

```bash
# Clone the repository
git clone https://github.com/satviksabharwal/portfolio.git
cd portfolio

# Install dependencies
pnpm install
```

### Running Locally

```bash
pnpm dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser — it auto-redirects to `/en` (or `/de` if your browser language is German).

> **Note:** The contact form will silently fail until you add your EmailJS credentials to `.env.local` (see [Environment Variables](#environment-variables)).

---

## Environment Variables

Create a `.env.local` file in the root of the project (next to `package.json`). This file is git-ignored and must **never** be committed.

```env
# EmailJS — required for the contact form
NEXT_PUBLIC_EMAIL_SERVICE_ID=your_service_id
NEXT_PUBLIC_EMAIL_SERVICE_TEMPLATE_ID=your_template_id
NEXT_PUBLIC_EMAIL_SERVICE_PUBLIC_KEY=your_public_key
NEXT_PUBLIC_RESUME_URL_EN=https://example.com/resume-en.pdf
NEXT_PUBLIC_RESUME_URL_DE=https://example.com/resume-de.pdf

# Resume links — locale-aware (shown in Navbar based on active language)
NEXT_PUBLIC_RESUME_URL_EN=https://your-link/resume-en.pdf
NEXT_PUBLIC_RESUME_URL_DE=https://your-link/resume-de.pdf
```

After adding these values, restart the dev server (`pnpm dev`) for Next.js to pick them up.

---

## Connecting EmailJS

[EmailJS](https://www.emailjs.com/) lets you send emails directly from the browser without a backend. The free tier allows **200 emails/month**, which is more than enough for a portfolio contact form.

### Step 1 — Create an EmailJS Account

1. Go to [https://www.emailjs.com/](https://www.emailjs.com/) and click **Sign Up Free**.
2. Verify your email address and log in to the dashboard.

---

### Step 2 — Add an Email Service

An _email service_ connects EmailJS to your email provider (Gmail, Outlook, etc.).

1. In the EmailJS dashboard, navigate to **Email Services** in the left sidebar.
2. Click **Add New Service**.
3. Choose your email provider (e.g., **Gmail**).
4. Click **Connect Account** and authorise access for the Gmail account that should _receive_ contact form submissions.
5. Give the service a recognisable name (e.g., `portfolio_contact`).
6. Click **Create Service**.
7. Copy the **Service ID** — it looks like `service_xxxxxxx`.

> Store this as `NEXT_PUBLIC_EMAIL_SERVICE_ID` in `.env.local`.

---

### Step 3 — Create an Email Template

An _email template_ defines the shape of every email EmailJS sends on your behalf.

1. In the dashboard, navigate to **Email Templates** → **Create New Template**.
2. Set the **Subject** line, e.g.:

   ```
   New portfolio message from {{from_name}}
   ```

3. In the **Content** (body) field, use the following variable names — they match exactly what `ContactSection.tsx` sends to EmailJS:

   ```
   You have a new message from your portfolio contact form.

   Name:    {{from_name}}
   Email:   {{from_email}}
   Message: {{message}}

   ---
   Sent to: {{to_name}}
   ```

   > The variables inside `{{ }}` **must match exactly** the keys passed to `emailjs.send()` in the code:
   > `from_name`, `from_email`, `message`, `to_name`, `to_email`.

4. Under **To Email**, enter your personal email address — this is where messages will land.
5. Optionally set **Reply To** to `{{from_email}}` so you can reply directly to the sender.
6. Click **Save**.
7. Copy the **Template ID** — it looks like `template_xxxxxxx`.

> Store this as `NEXT_PUBLIC_EMAIL_SERVICE_TEMPLATE_ID` in `.env.local`.

---

### Step 4 — Get Your Public Key

1. In the dashboard, click your account avatar (top-right) → **Account**.
2. Under the **API Keys** section, find your **Public Key** — it looks like `AbCdEfGhIjKlMnOpQr`.
3. Copy it.

> Store this as `NEXT_PUBLIC_EMAIL_SERVICE_PUBLIC_KEY` in `.env.local`.

---

### Step 5 — Add Credentials to `.env.local`

Your completed `.env.local` should look like this:

```env
NEXT_PUBLIC_EMAIL_SERVICE_ID=service_abc123
NEXT_PUBLIC_EMAIL_SERVICE_TEMPLATE_ID=template_xyz789
NEXT_PUBLIC_EMAIL_SERVICE_PUBLIC_KEY=AbCdEfGhIjKlMnOpQr
NEXT_PUBLIC_RESUME_URL_EN=https://your-link/resume-en.pdf
NEXT_PUBLIC_RESUME_URL_DE=https://your-link/resume-de.pdf
```

Restart the dev server:

```bash
pnpm dev
```

---

### Step 6 — Verify the Integration

1. Open [http://localhost:3000/en#contact](http://localhost:3000/en#contact).
2. Fill in the Name, Email, and Message fields.
3. Click **Send Message**.
4. The button should show a spinner, then display a success confirmation.
5. Check the inbox of the email address you set as **To Email** in your template.
6. In the EmailJS dashboard under **Email History**, you can also confirm the delivery.

**Common issues:**

| Symptom                                             | Fix                                                                                                       |
| --------------------------------------------------- | --------------------------------------------------------------------------------------------------------- |
| Form shows "Something went wrong" immediately       | Double-check all three env vars are correct and the dev server was restarted                              |
| Template variables show as `undefined` in the email | Ensure template variable names (`{{from_name}}` etc.) exactly match the keys sent in `ContactSection.tsx` |
| Emails going to spam                                | Add a custom **From Name** in the EmailJS template settings and set **Reply-To** to `{{from_email}}`      |
| 400 error in browser console                        | Service ID or Template ID is wrong, or the email service is not properly connected                        |
| Exceeding the free tier (200/month)                 | Upgrade to a paid EmailJS plan or switch to a server-side solution (Nodemailer, Resend, etc.)             |

---

## Customization

### Structured data (`src/lib/data.ts`)

Language-agnostic metadata lives here. Edit these constants to personalise the portfolio:

| Constant     | What it controls                                                              |
| ------------ | ----------------------------------------------------------------------------- |
| `PERSONAL`   | Name, email, GitHub, LinkedIn, location                                       |
| `SKILLS`     | Skill name, proficiency level (0–100), category                               |
| `PROJECTS`   | Title, `descriptionKey` (points to messages JSON), tech stack, links, color   |
| `EXPERIENCE` | Role, company, period, `descriptionNamespace` (points to messages JSON), tech |

> `PERSONAL.bio` and all user-visible text have moved to `messages/en.json` and `messages/de.json`. Edit those files for copy changes.

### Translated copy (`messages/en.json` and `messages/de.json`)

All visible text — hero roles, section headings, bio paragraphs, project descriptions, experience bullets — lives in these files. Add or edit keys in both files to keep the locales in sync.

### Other customization points

- **Logo** — the gradient "S" monogram is defined once in `src/components/ui/LogoSvg.tsx` and shared between the Navbar and the browser favicon (`src/app/icon.tsx`).
- **Resume links** — set `NEXT_PUBLIC_RESUME_URL_EN` and `NEXT_PUBLIC_RESUME_URL_DE` in `.env.local`; the Navbar picks the right one based on the active locale.
- **Avatar appearance** — the avatar is an SVG component driven by mouse position via `requestAnimationFrame` in `Avatar3D.tsx`. Adjust colors and geometry in that file.
- **Design tokens** — colors, fonts, and animations are defined in `tailwind.config.ts`.
- **Adding a locale** — update `locales` in `src/i18n/routing.ts` and add a matching `messages/{locale}.json`.

---

## Build & Deployment

### Production Build

```bash
pnpm build
pnpm start
```

### Deploy to Vercel (recommended)

1. Push the repository to GitHub.
2. Import the repo at [vercel.com/new](https://vercel.com/new).
3. In the Vercel project settings → **Environment Variables**, add all five `NEXT_PUBLIC_*` variables.
4. Deploy — Vercel auto-detects Next.js and configures everything.

### Deploy to Netlify

1. Connect the GitHub repo in the Netlify dashboard.
2. Set **Build command** to `pnpm build` and **Publish directory** to `.next`.
3. Under **Site settings → Environment variables**, add all five `NEXT_PUBLIC_*` variables.
4. Deploy.

> When deploying, always add your environment variables in the hosting platform's dashboard — **never commit `.env.local`** to version control.

---

## Performance Tips

- The Three.js components use `dynamic()` with `ssr: false` — they only load client-side, keeping the initial HTML payload small.
- Particle count is set to 2500 in `ParticleBackground.tsx` — reduce this value for better performance on lower-end devices.
- Scroll-reveal animations (`useScrollReveal` + Framer Motion `whileInView`) re-trigger on every scroll. Set `triggerOnce: false → true` in `src/hooks/useScrollReveal.ts` and flip `viewport={{ once: false }}` back to `true` in each section component to lock animations to first-play only.

---

## License

This project is open source and available under the [MIT License](LICENSE).

---

> Built by [Satvik Sabharwal](https://www.linkedin.com/in/satvik-sabharwal/)
