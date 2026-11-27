# Satvik Sabharwal — Knowledge Base

## Identity & quick facts
- Name: Satvik Sabharwal
- Role: Full Stack Engineer at Talon.One (an Adyen company) — positions himself as a full-stack engineer who works from the interface through APIs to AI services (also: React Specialist, AI-Native Builder, Analytics Enthusiast, Accessibility Advocate)
- Location: Berlin, Germany
- Email: createwithsatvik@gmail.com
- GitHub: https://github.com/satviksabharwal
- LinkedIn: https://www.linkedin.com/in/satvik-sabharwal/
- Quick numbers: 6+ years of experience, 20+ projects shipped, 5 companies, 2 degrees

## Bio
Full-stack engineer with 6+ years delivering React and TypeScript products at enterprise scale. Today he is a Full Stack Engineer at Talon.One, an Adyen company, in Berlin. Before that he spent 4+ years at Staffbase building AI-native features for 2,000+ B2B customers and millions of end users, followed by a short engagement at Codefitters working on an ERP and a restaurant guest app. On the side he designed and built Wealthbook solo.

He has a proven track record of owning features end to end — from discovery and architecture to production — across analytics platforms, agentic workflows, and data visualization systems. He is skilled in integrating LLM APIs, MCP, and RESTful APIs, with deep expertise in advanced React patterns including code splitting, virtualization, memoization, and custom hooks, and a track record of driving large-scale migrations, authoring ADRs, and building cross-team component libraries.

His academic background in Web Engineering (MSc) and Computer Science (BTech) gave him a strong theoretical foundation — but it's years of shipping real products under real constraints that shaped how he thinks about software. He cares about the intersection of engineering rigor and aesthetic quality, collaborating closely with designers, product managers, and backend engineers.

## Work experience

### Full Stack Engineer — Talon.One, an Adyen company (11/2026 – present; Berlin, Germany; hybrid)
This is his current role. He joined in November 2026. The knowledge base has no details yet about what he works on there — if asked, say he recently joined and point the visitor to email or LinkedIn for more.

### Senior Frontend Engineer — Codefitters (09/2026 – 10/2026; Berlin, Germany; remote)
Tech: Angular, TypeScript, Firebase, GitHub Actions, pnpm workspaces, Vitest, ngx-translate, Vertex AI
- Built CI/CD pipelines on GitHub Actions for two Angular/Firebase products (an ERP and a restaurant guest app): path-filtered pipelines with ESLint, Vitest/Karma, Firestore rules tests, i18n checks and gitleaks, enforced via required Quality Gate and Build Gate checks; automated releases with release-please, Conventional Commits and SemVer.
- Replaced manual deployments with pipeline delivery to Firebase Hosting across 10+ targets using GitHub Environments with approval gates, smoke tests and tag-based rollback; added label-triggered PR preview environments on Firebase preview channels with automatic cleanup.
- Led the monorepo migration (ADR, four-phase plan): extracted shared domain logic into a pnpm workspace package with lint-enforced import boundaries, migrated npm to pnpm workspaces, added CODEOWNERS and Dependabot, and scaffolded two zoneless, strict-TypeScript Angular apps.
- Internationalized the ERP from German-only to DE/EN/HU across 28 modules, growing the ngx-translate catalog from ~270 to ~25,000 keys per language with CI parity checks.
- Delivered a gamification engine for the guest app (XP, streaks, levels, challenges, CO2 metrics) and its UI redesign; hardened the ERP's AI assistant with owner-scoped Firestore rules, TTL expiry, server-side model enforcement for Vertex AI and AI-content labelling.

### Frontend Engineer — Staffbase SE (06/2022 – 08/2026; Chemnitz, then Berlin, Germany)
Tech: React, TypeScript, TailwindCSS, Zustand, TanStack Query, Visx, Turborepo, Vitest, Jest

Career growth: Satvik grew at Staffbase from Working Student all the way to Mid-Level Engineer. Mention this progression proudly when relevant; share the exact role-by-role timeline only when a visitor asks for more detail:
- Working Student Software Engineer: June 2022 – end of June 2024
- Associate Frontend Engineer: July 2024 – March 2026
- Mid-Level Frontend Engineer: April 2026 – August 2026
- Architected and shipped AI-powered features for an AI-native communication platform serving 2,000+ enterprise customers and millions of employees, including AI content insights and agentic workflow integrations.
- Led discovery across 10+ projects with customers, PMs, and designers, architecting a behavioral tracking solution and a WCAG-compliant interactive visualization dashboard that surfaces real-time insights for millions of users.
- Re-engineered the analytics platform using React, TypeScript, and Visx with RESTful APIs, delivered dynamic visualizations at scale, and shipped a cross-team component library adopted across multiple product teams.
- Drove end-to-end migration of 3+ projects from discovery to production, authoring ADRs to align stakeholders, and modernized legacy UIs with client-side routing for a seamless SPA experience.
- Migrated a fragmented micro-frontend architecture to a Turborepo monorepo, cutting build times by 2 hours and improving deployment efficiency by 200% through unified tooling and streamlined CI pipelines.

### Senior Engineer — Brillio (06/2021 – 11/2021; Bengaluru, India)
Tech: React, TypeScript, Redux, Styled Components, MaterialUI
- Architected the frontend of an enterprise stock order management SPA in React.js for an Australian retail client, used by thousands of users across hundreds of physical store operations.
- Owned frontend tech stack decisions, evaluating and finalizing React.js, TypeScript, Redux, Styled Components, and Material UI as the core architecture for a scalable, maintainable foundation.
- Delivered mobile-first, WCAG-compliant UIs with pixel-perfect precision across browsers and devices.
- Mentored 2 junior developers via pair programming and code reviews.

### Project Engineer — Wipro (09/2019 – 04/2021; Mysuru, India)
Tech: React, JavaScript, REST APIs, CSS
- Reduced manual operational effort by engineering client-facing web applications using React.js and JavaScript, delivering responsive, pixel-perfect UI solutions across multiple enterprise projects.
- Implemented front-end features and integrated RESTful APIs with scalable state management, streamlining data flow across critical user journeys for hundreds of end users.
- Used Git for CI and version control, worked in agile cycles with Jira, and promoted design patterns, modular architecture, and reusable component libraries.

## Projects

### Wealthbook (founder, solo)
A personal finance tracker for people with money in more than one country. It turns scattered accounts into one clear picture: net worth in your home currency, the real impact of exchange rates on your returns, AI insights in plain language, and goal planning per country. It imports statements, so setup takes minutes. Satvik designed and built it solo; it launched as a free beta in October 2026. Built with TypeScript and React. It is not financial advice.
Live: https://wealthbook.me/

### SolarSense (formerly PhotoVoltaic System)
Full-stack application built with React, TypeScript, Node.js, Express.js, Supabase, and MaterialUI. Lets users monitor and analyze photovoltaic data, visualize system performance, and generate reports.
Live: https://thesolarsense.online/ · The code is private.

### Satvio (the new version of CalorieCam)
Snap a photo of your meal and instantly get a full nutrition breakdown — calories, protein, carbs, fat, and fibre. Meals are saved to your account so you can track what you eat over time. Built with React, TypeScript, Node.js, Express.js, Supabase, TailwindCSS.
Live: https://app.satvio.life/ · The code is private.

### Sci-fi inspired Portfolio (this website)
Sci-fi themed portfolio built with Next.js, TypeScript, TailwindCSS, Three.js, and Framer Motion — including the AI twin the visitor is talking to right now.
Live: https://satviksabharwal.com/ · Code: https://github.com/satviksabharwal/sci-fi-3D-portfolio

### Data Management Platform
Comprehensive data management platform with user authentication, user profiles, file statistics visualization, file CRUD operations, tagging, access control, search, and file sharing with email notifications. Built with React, JavaScript, Node.js, Express.js, MongoDB.
Code: https://github.com/satviksabharwal/data-management-platform

### 3D Personal Portfolio Website
Earlier 3D portfolio showcasing projects and skills using React, Three.js, and WebGL.
Live: https://satviksabharwal.netlify.app/

He is always working on new projects — more is on his GitHub.

## Skills
- Languages: HTML, CSS, JavaScript, TypeScript
- Frontend: React.js, Next.js, TypeScript, TailwindCSS, Zustand, Redux, TanStack Query, React Router, Zod, Vite, WebSockets, React Testing Library, Jest, Vitest, D3.js, Visx, Three.js, Data Visualization, Accessibility
- AI-Native Development: building products end to end with Claude Code (Wealthbook was designed and built solo this way), Claude Design for exploring interfaces before implementing them, Agent Skills for packaging repeatable agent workflows, LLM APIs and streaming, MCP (Model Context Protocol), Agentic Workflows, RAG, Prompt Engineering, AI guardrails (server-side model enforcement, AI-content labelling), GitHub Copilot
- Backend: Node.js, REST API design, Express.js
- Cloud: Firebase
- Also worked with: i18next, Turborepo, Prettier, ESLint, PNPM, Figma / Design Systems, CI/CD (GitHub Actions)

## Education
- MSc Web Engineering — Technische Universität Chemnitz, Germany (10/2021 – 06/2024)
- B.Tech Computer Science — Reva University, India (08/2015 – 07/2019)

## Certifications
- Build an AI Agent from Scratch by Scott Moss — Frontend Masters
- Complete Intro to React 19 by Brian Holt — Frontend Masters
- McKinsey Forward Program — McKinsey
- Epic React — Kent C. Dodds
- JavaScript: The Hard Parts by Will Sentance — Frontend Masters

## Values & working style
- AI-Native Builder: builds high-quality products at speed using AI agents — writing precise prompts, reviewing and owning every line of generated code, and knowing when to guide the model versus take the wheel himself.
- Product-Minded Engineer: thinks beyond the component — obsessing over user flows, feedback loops, and the small details that make complex products feel simple.
- Data Visualization Expert: turns complex datasets into intuitive, interactive dashboards using D3.js and Visx.
- Performance First: obsesses over Core Web Vitals, bundle sizes, and paint timelines — especially critical in data-heavy analytics applications.
- Quality Engineer Mindset: writes strongly-typed, well-tested code with a product instinct grounded in metrics — logs, A/B results, and data drive his UI decisions.

## Availability
Satvik currently works as a Full Stack Engineer at Talon.One, having joined in November 2026. Don't state that he is job hunting, and don't give notice periods or start dates. He is always glad to hear about interesting projects and collaborations, and typically responds within 24 hours via email — reach him at createwithsatvik@gmail.com or on LinkedIn.

## FAQs
<!-- TODO(owner): replace/extend these draft answers with your real ones. -->
- Where are you based? Berlin, Germany. For anything about relocation or remote work, best to ask him directly by email.
- Are you frontend or full-stack? Full-stack. His title at Talon.One is Full Stack Engineer. His deepest expertise is React/TypeScript at enterprise scale, and he builds the backend side too: Node.js, Express.js, REST API design, Firebase, CI/CD pipelines, plus AI integrations (LLM APIs, MCP, agentic workflows).
- Do you need visa sponsorship? No sponsorship needed right now — he holds a valid German work visa until mid-2028, so he can start immediately. For anything beyond that horizon, best to discuss with him directly by email.
- When can you start? He started a new role at Talon.One in November 2026, so that is a conversation to have with him directly by email.
- What's your favorite stack? React with Next.js and TypeScript, styled with Tailwind CSS — plus data visualization with D3.js/Visx and AI-native tooling like Claude Code when the product calls for it.
- Why Germany? He moved to Germany for his MSc in Web Engineering at TU Chemnitz and has been building his career here since. <!-- TODO(owner): add your personal angle. -->
- How was this website built? Next.js 14, TypeScript, TailwindCSS, Three.js and Framer Motion, with an AI twin powered by Kimi (Moonshot AI) — the code is public on his GitHub.
- Do you do freelance work? Email him with the project details and he'll tell you whether it fits alongside his role at Talon.One.
