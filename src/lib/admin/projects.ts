import "server-only";

import { getProjectStageLabel } from "@/data/project-tracking";
import {
  createServiceRoleSupabaseClient,
  SupabaseConfigurationError,
} from "@/lib/supabase/server";
import { adminProjectSchema } from "@/lib/admin/project-management";
import { projectCodeSchema } from "@/lib/validation/projects";
import { isProjectStatus, type ProjectStatus } from "@/types/projects";
import type { z } from "zod";

export type AdminProjectInput = z.infer<typeof adminProjectSchema>;

export type AdminProject = {
  id: string;
  projectCode: string;
  title: string;
  projectType: string | null;
  location: string | null;
  customerName: string;
  customerPhone: string | null;
  startDate: string | null;
  estimatedCompletion: string | null;
  currentStage: ProjectStatus;
  currentStageLabel: string;
  progress: number;
  publicNote: string | null;
  createdAt: string;
  updatedAt: string;
};

type AdminProjectRow = {
  id: string;
  project_code: string;
  title: string;
  project_type: string | null;
  location: string | null;
  customer_name: string | null;
  customer_phone?: string | null;
  start_date: string | null;
  estimated_completion: string | null;
  current_stage: string;
  progress: number | null;
  public_note: string | null;
  created_at: string;
  updated_at: string;
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
  "created_at",
  "updated_at",
].join(", ");

function unwrapProjectRow(data: unknown) {
  if (Array.isArray(data)) {
    return (data[0] ?? null) as AdminProjectRow | null;
  }

  return data as AdminProjectRow | null;
}

function toAdminProject(row: AdminProjectRow): AdminProject {
  if (!isProjectStatus(row.current_stage)) {
    throw new Error(`Unknown project stage: ${row.current_stage}`);
  }

  return {
    id: row.id,
    projectCode: row.project_code.toUpperCase(),
    title: row.title,
    projectType: row.project_type,
    location: row.location,
    customerName: row.customer_name ?? "",
    customerPhone: row.customer_phone ?? null,
    startDate: row.start_date,
    estimatedCompletion: row.estimated_completion,
    currentStage: row.current_stage,
    currentStageLabel: getProjectStageLabel(row.current_stage),
    progress: row.progress ?? 0,
    publicNote: row.public_note,
    createdAt: row.created_at,
    updatedAt: row.updated_at,
  };
}

export async function createAdminProject(input: AdminProjectInput) {
  const supabase = createServiceRoleSupabaseClient();
  const { data, error } = await supabase.rpc("create_project", {
    p_title: input.title,
    p_customer_name: input.customerName,
    p_customer_phone: input.phone,
    p_project_type: input.projectType ?? null,
    p_location: input.location ?? null,
    p_start_date: input.startDate ?? null,
    p_estimated_completion: input.estimatedCompletion ?? null,
    p_current_stage: input.currentStage,
    p_progress: input.progress,
    p_public_note: input.publicNote ?? null,
  });

  if (error) {
    throw error;
  }

  const row = unwrapProjectRow(data);

  if (!row) {
    throw new Error("Project creation did not return a row.");
  }

  return toAdminProject(row);
}

export async function listAdminProjects() {
  const supabase = createServiceRoleSupabaseClient();
  const { data, error } = await supabase
    .from("projects")
    .select(ADMIN_PROJECT_SELECT)
    .order("created_at", { ascending: false })
    .limit(30)
    .returns<AdminProjectRow[]>();

  if (error) {
    throw error;
  }

  return (data ?? []).map(toAdminProject);
}

export async function getAdminProjectByCode(projectCode: string) {
  const parsedCode = projectCodeSchema.safeParse(projectCode);

  if (!parsedCode.success) {
    return null;
  }

  const supabase = createServiceRoleSupabaseClient();
  const { data, error } = await supabase
    .from("projects")
    .select(ADMIN_PROJECT_SELECT)
    .eq("project_code", parsedCode.data)
    .maybeSingle<AdminProjectRow>();

  if (error) {
    throw error;
  }

  return data ? toAdminProject(data) : null;
}

export function isSupabaseAdminProjectConfigError(error: unknown) {
  return error instanceof SupabaseConfigurationError;
}
