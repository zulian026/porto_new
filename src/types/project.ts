
// types/project.ts
export interface Project {
  id: string;
  title: string;
  description: string;
  technologies: string[];
  image_url?: string;
  demo_url?: string;
  github_url?: string;
  featured: boolean;
  created_at: string;
  updated_at: string;
}
