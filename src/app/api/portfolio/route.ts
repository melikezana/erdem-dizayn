import { apiSuccess } from "@/lib/api/responses";
import { getPublishedProjects } from "@/data/projects";
import type { PortfolioProject } from "@/types/projects";

export function GET() {
  const projects: PortfolioProject[] = getPublishedProjects().map((project) => ({
    title: project.title,
    slug: project.slug,
    location: project.location,
    type: project.type,
    summary: project.summary,
    images: project.images,
    services: project.services,
  }));

  return apiSuccess(projects);
}
