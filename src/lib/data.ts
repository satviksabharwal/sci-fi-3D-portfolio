import type { Project, Experience, Skill } from "@/types";

export const PERSONAL = {
  name: "Satvik Sabharwal",
  title: "Frontend Engineer",
  tagline: "Building extraordinary web experiences",
  bio: "6+ years crafting high-performance, pixel-perfect interfaces. BTech Computer Science · MSc Web Engineering. I turn complex problems into elegant, scalable solutions that users love.",
  email: "createwithsatvik@gmail.com",
  github: "https://github.com/satviksabharwal",
  linkedin: "https://www.linkedin.com/in/satvik-sabharwal/",
  location: "Berlin, Germany",
};

export const SKILLS: Skill[] = [
  { name: "React / Next.js", level: 97, category: "frontend" },
  { name: "JavaScript", level: 95, category: "frontend" },
  { name: "TypeScript", level: 94, category: "frontend" },
  { name: "Tailwind CSS", level: 95, category: "frontend" },
  { name: "Three.js / WebGL", level: 55, category: "frontend" },
  { name: "Node.js", level: 50, category: "backend" },
  { name: "GraphQL", level: 45, category: "backend" },
  { name: "PostgreSQL", level: 55, category: "backend" },
  { name: "Docker", level: 20, category: "tools" },
  { name: "CI/CD (GitHub Actions)", level: 80, category: "tools" },
  { name: "Figma / Design Systems", level: 88, category: "tools" },
];

export const PROJECTS: Project[] = [
  {
    id: 1,
    title: "PhotoVoltaic System",
    description:
      "It is a full-stack application built using the MERN stack. It allows users to monitor and analyze photovoltaic data, visualize system performance, and generate reports.",
    tech: ["React", "JavaScript", "Node.js", "Express.js", "MongoDB"],
    github: "https://github.com/satviksabharwal/PhotoVoltaic-System",
    link: "",
    featured: true,
    color: "#00f5c4",
  },
  {
    id: 2,
    title: "Data Management Platform",
    description:
      "It is a comprehensive data management platform with a range of features such as user authentication, user profiles, file statistics visualization, file operations (CRUD), file tagging, file access control, file search, and file sharing with email notifications.",
    tech: ["React", "JavaScript", "Node.js", "Express.js", "MongoDB"],
    github: "https://github.com/satviksabharwal/data-management-platform",
    link: "",
    featured: true,
    color: "#7c3aed",
  },
  {
    id: 3,
    title: "3D Personal Portfolio Website",
    description:
      "A 3D personal portfolio website showcasing my projects and skills using Three.js and WebGL.",
    tech: ["React", "JavaScript", "CSS", "Three.js", "WebGL"],
    github: "",
    link: "https://satviksabharwal.netlify.app/",
    featured: true,
    color: "#f472b6",
  },
  {
    id: 4,
    title: "Coming soon",
    description:
      "I'm always working on new projects and updating my portfolio. Stay tuned for more exciting work coming soon!",
    tech: ["Information"],
    link: "",
    featured: false,
    color: "#fb923c",
  },
];

export const EXPERIENCE: Experience[] = [
  {
    id: 1,
    role: "Frontend Engineer",
    company: "Staffbase SE",
    period: "2022 — Present",
    description: [
      "Spearheaded the development and full ownership of the analytics frontend using React, TypeScript, and TailwindCSS, architecting scalable solutions and delivering high-performance features for a platform with millions of active users.",
      "Implemented analytics tracking across communication platform features, collaborating with multiple feature teams to integrate tracking into their codebases, capture user behavior, generate actionable engagement insights, and enable organization admins to optimize communication strategies.",
      "Improved overall team velocity and decreased onboarding time by 30% by architecting a streamlined onboarding workflow, actively updating documentation, and mentoring new hires through bi-weekly syncs.",
    ],
    tech: [
      "React",
      "TypeScript",
      "TailwindCSS",
      "Zustand",
      "React Query",
      "i18next",
      "Vitest",
      "Jest",
      "Visx",
    ],
    current: true,
  },
  {
    id: 2,
    role: "Senior Engineer",
    company: "Brillio",
    period: "2021 — 2021",
    description: [
      "Developed and deployed the frontend of a large-scale stock order management application using React, TypeScript, and Styled Components for the Australian retailer Reece, enabling 1000+ in-store employees to serve millions of customers efficiently and streamlining product operations.",
      "Engineered responsive, mobile-first user interfaces with modern UI/UX design, ensured pixel-perfect layouts and accessibility compliance across browsers and devices, driving consistent user experiences for all platforms.",
      "Mentored junior developers through pair programming, code reviews, and structured knowledge-sharing sessions; accelerated onboarding, team skill development, and boosted project delivery speed.",
    ],
    tech: [
      "React",
      "TypeScript",
      "StyledComponents",
      "Redux",
      "StyledComponents",
      "MaterialUI",
    ],
  },
  {
    id: 3,
    role: "Project Engineer",
    company: "Wipro",
    period: "2019 — 2021",
    description: [
      "Reduced manual operational effort by 25 hours per week by engineering a highly customizable internal tools platform using React, JavaScript, and CSS.",
      "Implemented a robust front-end authentication system supporting OAuth-based login via Gmail, Outlook, and organizational accounts, optimizing security through session storage and cookies, and streamlining user access for hundreds of internal stakeholders.",
      "Applied continuous integration and version control using Git and participated in agile delivery cycles with Jira, enabling efficient task management and predictable, high-quality releases in a rapidly evolving environment.",
    ],
    tech: ["React", "JavaScript", "CSS"],
  },
];
