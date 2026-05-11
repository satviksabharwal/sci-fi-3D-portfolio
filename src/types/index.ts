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
  period: string;
  descriptionNamespace: string;
  tech: string[];
  current?: boolean;
}

export interface Skill {
  name: string;
  level: number;
  category: "frontend" | "tools" | "backend" | "other";
}
