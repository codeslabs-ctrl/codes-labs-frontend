export interface ProjectDetail {
  id: string;
  projectId: string;
  projectDetail: string;
  displayOrder: number;
  createdAt?: string;
  updatedAt?: string;
  isActive?: boolean;
}

export interface Project {
  id: string;
  title: string;
  description: string;
  category: string;
  iconName: string;
  stats: { [key: string]: string };
  technologies: string[];
  details?: ProjectDetail[];
  createdAt?: string;
  updatedAt?: string;
  isActive?: boolean;
  displayOrder?: number;
}

export interface ProjectResponse {
  success: boolean;
  data: Project[];
}

export interface SingleProjectResponse {
  success: boolean;
  data: Project;
}

