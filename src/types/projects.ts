export const PROJECT_STATUSES = [
  "pre_meeting",
  "design",
  "approval",
  "preparation",
  "implementation",
  "final_checks",
  "ready",
] as const;

export type ProjectStatus = (typeof PROJECT_STATUSES)[number];

export type ProjectUpdate = {
  stage: ProjectStatus;
  stageLabel: string;
  title: string;
  description: string | null;
  completed: boolean;
  completedAt: string | null;
  sortOrder: number;
};

export type TrackedProject = {
  projectCode: string;
  title: string;
  projectType: string | null;
  location: string | null;
  startDate: string | null;
  estimatedCompletion: string | null;
  currentStage: ProjectStatus;
  currentStageLabel: string;
  progress: number;
  publicNote: string | null;
  timeline: ProjectUpdate[];
};

export type PortfolioProject = {
  title: string;
  slug: string;
  location: string;
  type: string;
  summary: string;
  images: string[];
  services: string[];
  seo?: {
    metaTitle?: string;
    metaDescription?: string;
    openGraphImage?: string;
  };
};

export function isProjectStatus(value: string): value is ProjectStatus {
  return PROJECT_STATUSES.includes(value as ProjectStatus);
}
