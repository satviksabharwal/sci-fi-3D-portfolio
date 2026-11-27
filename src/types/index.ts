export interface Project {
  id: number;
  title: string;
  descriptionKey: string;
  tech: string[];
  link?: string;
  github?: string;
  featured: boolean;
  color: string;
}

export interface Experience {
  id: number;
  role: string;
  company: string;
  /** First month, as "YYYY-MM". */
  start: string;
  /** Last month, as "YYYY-MM"; null while it is the current job. */
  end: string | null;
  descriptionNamespace: string;
  tech: string[];
  current?: boolean;
}

export interface Skill {
  name: string;
  level: number;
  category: "frontend" | "tools" | "backend" | "other";
}
