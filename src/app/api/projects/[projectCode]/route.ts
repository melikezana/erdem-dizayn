import type { NextRequest } from "next/server";
import { apiError, apiSuccess } from "@/lib/api/responses";
import { getProjectStageLabel } from "@/data/project-tracking";
import {
  createServiceRoleSupabaseClient,
  SupabaseConfigurationError,
} from "@/lib/supabase/server";
import { projectCodeSchema } from "@/lib/validation/projects";
import { isProjectStatus, type ProjectStatus, type TrackedProject } from "@/types/projects";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

type ProjectRow = {
  id: string;
  project_code: string;
  title: string;
  project_type: string | null;
  location: string | null;
  start_date: string | null;
  estimated_completion: string | null;
  current_stage: string;
  progress: number | null;
  public_note: string | null;
};

type ProjectUpdateRow = {
  stage: string;
  title: string;
  description: string | null;
  completed: boolean | null;
  completed_at: string | null;
  sort_order: number;
};

function toTrackedProject(project: ProjectRow, updates: ProjectUpdateRow[]): TrackedProject | null {
  if (!isProjectStatus(project.current_stage)) {
    return null;
  }

  const timeline = updates
    .filter((update): update is ProjectUpdateRow & { stage: ProjectStatus } =>
      isProjectStatus(update.stage)
    )
    .map((update) => ({
      stage: update.stage,
      stageLabel: getProjectStageLabel(update.stage),
      title: update.title,
      description: update.description,
      completed: Boolean(update.completed),
      completedAt: update.completed_at,
      sortOrder: update.sort_order,
    }));

  return {
    projectCode: project.project_code,
    title: project.title,
    projectType: project.project_type,
    location: project.location,
    startDate: project.start_date,
    estimatedCompletion: project.estimated_completion,
    currentStage: project.current_stage,
    currentStageLabel: getProjectStageLabel(project.current_stage),
    progress: project.progress ?? 0,
    publicNote: project.public_note,
    timeline,
  };
}

export async function GET(
  _request: NextRequest,
  { params }: { params: Promise<{ projectCode: string }> }
) {
  const { projectCode } = await params;
  const parsedCode = projectCodeSchema.safeParse(projectCode);

  if (!parsedCode.success) {
    return apiError("INVALID_PROJECT_CODE", "Geçerli bir proje kodu girin.", 400);
  }

  try {
    const supabase = createServiceRoleSupabaseClient();
    const { data: project, error: projectError } = await supabase
      .from("projects")
      .select(
        "id, project_code, title, project_type, location, start_date, estimated_completion, current_stage, progress, public_note"
      )
      .eq("project_code", parsedCode.data)
      .maybeSingle<ProjectRow>();

    if (projectError) {
      throw projectError;
    }

    if (!project) {
      return apiError(
        "PROJECT_NOT_FOUND",
        "Bu kodla eşleşen bir proje bulunamadı.",
        404
      );
    }

    const { data: updates, error: updatesError } = await supabase
      .from("project_updates")
      .select("stage, title, description, completed, completed_at, sort_order")
      .eq("project_id", project.id)
      .order("sort_order", { ascending: true })
      .returns<ProjectUpdateRow[]>();

    if (updatesError) {
      throw updatesError;
    }

    const trackedProject = toTrackedProject(project, updates ?? []);

    if (!trackedProject) {
      return apiError("SERVER_ERROR", "Proje durumu okunamadı.", 500);
    }

    return apiSuccess(trackedProject);
  } catch (error) {
    if (error instanceof SupabaseConfigurationError) {
      console.error(error.message);
    } else {
      console.error("Project lookup failed", error);
    }

    return apiError("SERVER_ERROR", "Proje durumu şu anda alınamadı.", 500);
  }
}
