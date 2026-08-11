import "server-only";

import { cache } from "react";
import {
  PROJECTS_DATA,
  getProjectBySlug,
  getPublishedProjects,
  type ProjectItem,
} from "@/data/projects";
import {
  createServiceRoleSupabaseClient,
  SupabaseConfigurationError,
} from "@/lib/supabase/server";

type AdminSeoProjectRow = {
  id: string;
  title: string;
  project_type: string | null;
  location: string | null;
  public_note: string | null;
  seo_meta_title: string | null;
  seo_meta_description: string | null;
  seo_slug: string | null;
  seo_og_image: string | null;
};

const ADMIN_SEO_PROJECT_SELECT = [
  "id",
  "title",
  "project_type",
  "location",
  "public_note",
  "seo_meta_title",
  "seo_meta_description",
  "seo_slug",
  "seo_og_image",
].join(", ");

function toAdminPublicProject(row: AdminSeoProjectRow): ProjectItem | null {
  if (!row.seo_slug) {
    return null;
  }

  const image = row.seo_og_image?.startsWith("/")
    ? row.seo_og_image
    : "/images/project-1.jpg";
  const summary =
    row.seo_meta_description ||
    row.public_note ||
    "Erdem Dizayn tarafından keşif, tasarım, mekanik koordinasyon ve uygulama süreci tek merkezden yönetilen proje.";

  return {
    id: row.id,
    slug: row.seo_slug,
    title: row.title,
    type: row.project_type ?? "İç Mimari",
    location: row.location ?? "Belirtilmedi",
    image,
    images: [image],
    summary,
    services: [
      row.project_type ?? "İç mimari",
      "Mekanik koordinasyon",
      "Uygulama yönetimi",
    ],
    seo: {
      metaTitle: row.seo_meta_title ?? undefined,
      metaDescription: row.seo_meta_description ?? undefined,
      openGraphImage: row.seo_og_image ?? undefined,
    },
    published: true,
  };
}

export function getStaticRelatedProjects(slug: string) {
  return getPublishedProjects().filter((project) => project.slug !== slug);
}

export function getStaticProjectSlugs() {
  return PROJECTS_DATA.filter((project) => project.published).map(
    (project) => project.slug
  );
}

export const getPublicProjectBySlug = cache(async (slug: string) => {
  const staticProject = getProjectBySlug(slug);

  if (staticProject) {
    return staticProject;
  }

  try {
    const supabase = createServiceRoleSupabaseClient();
    const { data, error } = await supabase
      .from("projects")
      .select(ADMIN_SEO_PROJECT_SELECT)
      .eq("seo_slug", slug)
      .maybeSingle<AdminSeoProjectRow>();

    if (error) {
      throw error;
    }

    return data ? toAdminPublicProject(data) : null;
  } catch (error) {
    if (error instanceof SupabaseConfigurationError) {
      return null;
    }

    console.error("Public project SEO lookup failed", error);
    return null;
  }
});
