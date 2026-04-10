# Satvik Sabharwal — 3D Portfolio

A high-performance, visually immersive personal portfolio built with **Next.js 14**, **Three.js**, and **Framer Motion**. Features a WebGL 3D avatar, particle background, animated skill bars, timeline experience section, and a fully wired contact form powered by **EmailJS**.

**Live demo:** [satviksabharwal.com](https://satviksabharwal.com/)

---

## Table of Contents

- [Features](#features)
- [Tech Stack](#tech-stack)
- [Project Structure](#project-structure)
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
| **Experience** | Accordion timeline with smooth height transitions                                              |
| **Contact**    | EmailJS-powered form with loading / success / error states                                     |
| **Global**     | Custom cursor, interactive particle background, scroll-reveal animations, smooth-scroll navbar |

---

## Tech Stack

| Layer           | Technology                                            |
| --------------- | ----------------------------------------------------- |
| Framework       | [Next.js 14](https://nextjs.org/) (App Router)        |
| Language        | TypeScript                                            |
| Styling         | Tailwind CSS v3 with custom design tokens             |
| 3D / WebGL      | Three.js + `@react-three/fiber` + `@react-three/drei` |
| Animations      | Framer Motion                                         |
| Typewriter      | `react-type-animation`                                |
| Contact form    | `@emailjs/browser`                                    |
| Intersection    | `react-intersection-observer`                         |
| Utilities       | `clsx` + `tailwind-merge`                             |
| Package manager | pnpm                                                  |

---

## Project Structure

```
portfolio/
├── public/                        # Static assets (images, fonts, models)
├── src/
│   ├── app/
│   │   ├── globals.css            # Global styles & Tailwind directives
│   │   ├── layout.tsx             # Root layout — cursor, navbar
│   │   ├── page.tsx               # Single-page assembly of all sections
│   │   └── [...slug]/page.tsx     # Catch-all route (fallback)
│   ├── components/
│   │   ├── 3d/
│   │   │   ├── Avatar3D.tsx       # Three.js 3D avatar (dynamic, SSR-disabled)
│   │   │   └── ParticleBackground.tsx
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
│   │       ├── Navbar.tsx
│   │       └── SectionWrapper.tsx
│   ├── hooks/
│   │   ├── useMousePosition.ts    # Global mouse tracking
│   │   └── useScrollReveal.ts     # IntersectionObserver helper
│   ├── lib/
│   │   ├── data.ts                # All personal content — edit this to personalise
│   │   └── utils.ts               # cn() utility
│   └── types/
│       └── index.ts
├── tailwind.config.ts
├── next.config.mjs
├── tsconfig.json
└── .env.local                     # NOT committed — you must create this
```

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

Open [http://localhost:3000](http://localhost:3000) in your browser.

> **Note:** The contact form will silently fail until you add your EmailJS credentials to `.env.local` (see [Environment Variables](#environment-variables)).

---

## Environment Variables

Create a `.env.local` file in the root of the project (next to `package.json`). This file is git-ignored and must **never** be committed.

```env
# EmailJS — required for the contact form
NEXT_PUBLIC_EMAIL_SERVICE_ID=your_service_id
NEXT_PUBLIC_EMAIL_SERVICE_TEMPLATE_ID=your_template_id
NEXT_PUBLIC_EMAIL_SERVICE_PUBLIC_KEY=your_public_key
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

4. Under **To Email**, enter your personal email address (e.g., `satviksabharwal7@gmail.com`) — this is where messages will land.
5. Optionally set **Reply To** to `{{from_email}}` so you can reply directly to the sender.
6. Click **Save**.
7. Copy the **Template ID** — it looks like `template_xxxxxxx`.

> Store this as `NEXT_PUBLIC_EMAIL_SERVICE_TEMPLATE_ID` in `.env.local`.

---

### Step 4 — Get Your Public Key

The public key authenticates requests from your browser without exposing any secrets.

1. In the dashboard, click your account avatar (top-right) → **Account**.
2. Under the **API Keys** section, find your **Public Key** — it looks like `AbCdEfGhIjKlMnOpQr`.
3. Copy it.

> Store this as `NEXT_PUBLIC_EMAIL_SERVICE_PUBLIC_KEY` in `.env.local`.

---

### Step 5 — Add Credentials to `.env.local`

Your completed `.env.local` should look like this (replace with your real values):

```env
NEXT_PUBLIC_EMAIL_SERVICE_ID=service_abc123
NEXT_PUBLIC_EMAIL_SERVICE_TEMPLATE_ID=template_xyz789
NEXT_PUBLIC_EMAIL_SERVICE_PUBLIC_KEY=AbCdEfGhIjKlMnOpQr
```

Restart the dev server:

```bash
pnpm dev
```

---

### Step 6 — Verify the Integration

1. Open [http://localhost:3000/#contact](http://localhost:3000/#contact).
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

All personal content is centralised in `src/lib/data.ts`. Edit the exported constants to make the portfolio your own:

| Constant     | What it controls                                                               |
| ------------ | ------------------------------------------------------------------------------ |
| `PERSONAL`   | Name, title, tagline, bio, email, GitHub, LinkedIn, location                   |
| `SKILLS`     | Skill name, proficiency level (0–100), category                                |
| `PROJECTS`   | Title, description, tech stack, GitHub/live links, featured flag, accent color |
| `EXPERIENCE` | Role, company, period, bullet points, tech tags                                |

**Other customization points:**

- **Initials in Navbar & Footer** — search for `YN` (or similar) in `Navbar.tsx` and `Footer.tsx` and replace with your own initials.
- **Resume link** — place your PDF at `public/resume.pdf`; the Navbar "Resume" button links to it automatically.
- **Avatar appearance** — the 3D avatar is built with raw Three.js geometries in `Avatar3D.tsx`. Adjust skin tone, hair color, or glasses glow in the `Materials` section near the top of that file.
- **Design tokens** — colors, fonts, and animations are all defined in `tailwind.config.ts`.

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
3. In the Vercel project settings → **Environment Variables**, add the three `NEXT_PUBLIC_EMAIL_*` variables.
4. Deploy — Vercel auto-detects Next.js and configures everything.

### Deploy to Netlify

1. Connect the GitHub repo in the Netlify dashboard.
2. Set **Build command** to `pnpm build` and **Publish directory** to `.next`.
3. Under **Site settings → Environment variables**, add the three `NEXT_PUBLIC_EMAIL_*` variables.
4. Deploy.

> When deploying, always add your EmailJS environment variables in the hosting platform's dashboard — **never commit `.env.local`** to version control.

---

## Performance Tips

- The Three.js components use `dynamic()` with `ssr: false` — they only load client-side, keeping the initial HTML payload small.
- Particle count is set to 2500 in `ParticleBackground.tsx` — reduce this value for better performance on lower-end devices.
- Framer Motion `useScrollReveal` uses `IntersectionObserver` with `triggerOnce: true`, so animations run only once and don't re-trigger on scroll.

---

## License

This project is open source and available under the [MIT License](LICENSE).

---

> Built by [Satvik Sabharwal](https://www.linkedin.com/in/satvik-sabharwal/)

- All section animations use `triggerOnce: true` — they only play once on scroll

## FAANG-Ready Extras to Consider

- Add **Google Analytics / Vercel Analytics** for visitor tracking
- Integrate a **CMS** (Sanity, Contentful) so you can update projects without redeploying
- Add **JSON-LD structured data** in `layout.tsx` for SEO
- Set up **OG image generation** via `app/opengraph-image.tsx`
- Add a **Projects detail page** at `app/projects/[slug]/page.tsx`
