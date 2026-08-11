import "server-only";

import { unstable_noStore as noStore } from "next/cache";
import { getProjectStageLabel } from "@/data/project-tracking";
import {
  createServiceRoleSupabaseClient,
  SupabaseConfigurationError,
} from "@/lib/supabase/server";
import {
  adminProjectSchema,
  adminTimelineUpdateSchema,
} from "@/lib/admin/project-management";
import { projectCodeSchema } from "@/lib/validation/projects";
import { isProjectStatus, type ProjectStatus } from "@/types/projects";
import type { z } from "zod";

export type AdminProjectInput = z.infer<typeof adminProjectSchema>;
export type AdminTimelineUpdateInput = z.infer<typeof adminTimelineUpdateSchema>;

export type AdminTimelineUpdate = {
  stage: ProjectStatus;
  stageLabel: string;
  title: string;
  description: string | null;
  completed: boolean;
  completedAt: string | null;
  sortOrder: number;
};

export type AdminProject = {
  id: string;
  projectCode: string;
  title: string;
  projectType: string;
  location: string | null;
  customerName: string;
  customerPhone: string | null;
  startDate: string | null;
  estimatedCompletion: string | null;
  currentStage: ProjectStatus;
  currentStageLabel: string;
  progress: number;
  publicNote: string | null;
  seoMetaTitle: string | null;
  seoMetaDescription: string | null;
  seoSlug: string | null;
  seoOgImage: string | null;
  createdAt: string;
  updatedAt: string;
  timeline: AdminTimelineUpdate[];
};

type AdminProjectRow = {
  id: string;
  project_code: string;
  title: string;
  project_type: string | null;
  location: string | null;
  customer_name: string | null;
  customer_phone: string | null;
  start_date: string | null;
  estimated_completion: string | null;
  current_stage: string;
  progress: number | null;
  public_note: string | null;
  seo_meta_title: string | null;
  seo_meta_description: string | null;
  seo_slug: string | null;
  seo_og_image: string | null;
  created_at: string;
  updated_at: string;
};

type AdminTimelineRow = {
  stage: string;
  title: string;
  description: string | null;
  completed: boolean | null;
  completed_at: string | null;
  sort_order: number;
};

const ADMIN_PROJECT_SELECT = [
  "id",
  "project_code",
  "title",
  "project_type",
  "location",
  "customer_name",
  "customer_phone",
  "start_date",
  "estimated_completion",
  "current_stage",
  "progress",
  "public_note",
  "seo_meta_title",
  "seo_meta_description",
  "seo_slug",
  "seo_og_image",
  "created_at",
  "updated_at",
].join(", ");

const ADMIN_TIMELINE_SELECT = [
  "stage",
  "title",
  "description",
  "completed",
  "completed_at",
  "sort_order",
].join(", ");

const UUID_PATTERN =
  /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;

function unwrapProjectRow(data: unknown) {
  if (Array.isArray(data)) {
    return (data[0] ?? null) as AdminProjectRow | null;
  }

  return data as AdminProjectRow | null;
}

function sanitizeSearchTerm(value: string) {
  return value
    .replace(/[^\p{L}\p{N}\s-]/gu, " ")
    .replace(/\s+/g, " ")
    .trim()
    .slice(0, 80);
}

function toTimelineUpdate(row: AdminTimelineRow): AdminTimelineUpdate | null {
  if (!isProjectStatus(row.stage)) {
    return null;
  }

  return {
    stage: row.stage,
    stageLabel: getProjectStageLabel(row.stage),
    title: row.title,
    description: row.description,
    completed: Boolean(row.completed),
    completedAt: row.completed_at,
    sortOrder: row.sort_order,
  };
}

function toAdminProject(
  row: AdminProjectRow,
  timelineRows: AdminTimelineRow[] = []
): AdminProject {
  if (!isProjectStatus(row.current_stage)) {
    throw new Error(`Unknown project stage: ${row.current_stage}`);
  }

  const timeline = timelineRows
    .map(toTimelineUpdate)
    .filter((update): update is AdminTimelineUpdate => Boolean(update))
    .sort((left, right) => left.sortOrder - right.sortOrder);

  return {
    id: row.id,
    projectCode: row.project_code.toUpperCase(),
    title: row.title,
    projectType: row.project_type ?? "Diğer",
    location: row.location,
    customerName: row.customer_name ?? "",
    customerPhone: row.customer_phone ?? null,
    startDate: row.start_date,
    estimatedCompletion: row.estimated_completion,
    currentStage: row.current_stage,
    currentStageLabel: getProjectStageLabel(row.current_stage),
    progress: row.progress ?? 0,
    publicNote: row.public_note,
    seoMetaTitle: row.seo_meta_title,
    seoMetaDescription: row.seo_meta_description,
    seoSlug: row.seo_slug,
    seoOgImage: row.seo_og_image,
    createdAt: row.created_at,
    updatedAt: row.updated_at,
    timeline,
  };
}

async function listTimelineForProject(projectId: string) {
  const supabase = createServiceRoleSupabaseClient();
  const { data, error } = await supabase
    .from("project_updates")
    .select(ADMIN_TIMELINE_SELECT)
    .eq("project_id", projectId)
    .order("sort_order", { ascending: true })
    .returns<AdminTimelineRow[]>();

  if (error) {
    throw error;
  }

  return data ?? [];
}

export async function createAdminProject(input: AdminProjectInput) {
  noStore();

  const supabase = createServiceRoleSupabaseClient();
  const { data, error } = await supabase.rpc("create_project", {
    p_title: input.title,
    p_customer_name: input.customerName,
    p_customer_phone: input.phone ?? null,
    p_project_type: input.projectType,
    p_location: input.location ?? null,
    p_start_date: input.startDate ?? null,
    p_estimated_completion: input.estimatedCompletion ?? null,
    p_current_stage: input.currentStage,
    p_progress: input.progress,
    p_public_note: input.publicNote ?? null,
    p_seo_meta_title: input.seoMetaTitle ?? null,
    p_seo_meta_description: input.seoMetaDescription ?? null,
    p_seo_slug: input.seoSlug ?? null,
    p_seo_og_image: input.seoOgImage ?? null,
  });

  if (error) {
    throw error;
  }

  const row = unwrapProjectRow(data);

  if (!row) {
    throw new Error("Project creation did not return a row.");
  }

  const timeline = await listTimelineForProject(row.id);
  return toAdminProject(row, timeline);
}

export async function listAdminProjects(search = "", limit = 80) {
  noStore();

  const supabase = createServiceRoleSupabaseClient();
  const searchTerm = sanitizeSearchTerm(search);
  let query = supabase
    .from("projects")
    .select(ADMIN_PROJECT_SELECT)
    .order("created_at", { ascending: false })
    .limit(limit);

  if (searchTerm) {
    const ilike = `%${searchTerm}%`;
    query = query.or(
      `project_code.ilike.${ilike},title.ilike.${ilike},customer_name.ilike.${ilike}`
    );
  }

  const { data, error } = await query.returns<AdminProjectRow[]>();

  if (error) {
    throw error;
  }

  return (data ?? []).map((row) => toAdminProject(row));
}

export async function getAdminProjectByIdentifier(identifier: string) {
  noStore();

  const supabase = createServiceRoleSupabaseClient();
  const trimmed = identifier.trim();
  let query = supabase.from("projects").select(ADMIN_PROJECT_SELECT);

  if (UUID_PATTERN.test(trimmed)) {
    query = query.eq("id", trimmed);
  } else {
    const parsedCode = projectCodeSchema.safeParse(trimmed);

    if (!parsedCode.success) {
      return null;
    }

    query = query.eq("project_code", parsedCode.data);
  }

  const { data, error } = await query.maybeSingle<AdminProjectRow>();

  if (error) {
    throw error;
  }

  if (!data) {
    return null;
  }

  const timeline = await listTimelineForProject(data.id);
  return toAdminProject(data, timeline);
}

export async function updateAdminProject(
  projectId: string,
  input: AdminProjectInput
) {
  noStore();

  const supabase = createServiceRoleSupabaseClient();
  const { data, error } = await supabase
    .from("projects")
    .update({
      title: input.title,
      customer_name: input.customerName,
      customer_phone: input.phone ?? null,
      project_type: input.projectType,
      location: input.location ?? null,
      start_date: input.startDate ?? null,
      estimated_completion: input.estimatedCompletion ?? null,
      current_stage: input.currentStage,
      progress: input.progress,
      public_note: input.publicNote ?? null,
      seo_meta_title: input.seoMetaTitle ?? null,
      seo_meta_description: input.seoMetaDescription ?? null,
      seo_slug: input.seoSlug ?? null,
      seo_og_image: input.seoOgImage ?? null,
    })
    .eq("id", projectId)
    .select(ADMIN_PROJECT_SELECT)
    .single<AdminProjectRow>();

  if (error) {
    throw error;
  }

  const timeline = await listTimelineForProject(data.id);
  return toAdminProject(data, timeline);
}

export async function updateAdminTimeline(input: AdminTimelineUpdateInput) {
  noStore();

  const supabase = createServiceRoleSupabaseClient();
  const completedAt = input.completed ? input.completedAt ?? null : null;

  const { error: timelineError } = await supabase
    .from("project_updates")
    .update({
      description: input.description ?? null,
      completed: input.completed,
      completed_at: completedAt,
    })
    .eq("project_id", input.projectId)
    .eq("stage", input.stage);

  if (timelineError) {
    throw timelineError;
  }

  if (input.setActive) {
    const { error: projectError } = await supabase
      .from("projects")
      .update({ current_stage: input.stage })
      .eq("id", input.projectId);

    if (projectError) {
      throw projectError;
    }
  }
}

export async function countActiveProjects() {
  noStore();

  const supabase = createServiceRoleSupabaseClient();
  const { count, error } = await supabase
    .from("projects")
    .select("id", { count: "exact", head: true })
    .neq("current_stage", "ready");

  if (error) {
    throw error;
  }

  return count ?? 0;
}

export async function listApproachingProjects(days = 14) {
  noStore();

  const today = new Date();
  const deadline = new Date(today);
  deadline.setDate(deadline.getDate() + days);

  const supabase = createServiceRoleSupabaseClient();
  const { data, error } = await supabase
    .from("projects")
    .select(ADMIN_PROJECT_SELECT)
    .neq("current_stage", "ready")
    .not("estimated_completion", "is", null)
    .lte("estimated_completion", deadline.toISOString().slice(0, 10))
    .gte("estimated_completion", today.toISOString().slice(0, 10))
    .order("estimated_completion", { ascending: true })
    .limit(8)
    .returns<AdminProjectRow[]>();

  if (error) {
    throw error;
  }

  return (data ?? []).map((row) => toAdminProject(row));
}

export function isSupabaseAdminProjectConfigError(error: unknown) {
  return error instanceof SupabaseConfigurationError;
}
