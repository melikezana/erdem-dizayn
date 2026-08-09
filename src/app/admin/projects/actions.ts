"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import {
  createAdminProject,
  isSupabaseAdminProjectConfigError,
  updateAdminProject,
  updateAdminTimeline,
} from "@/lib/admin/projects";
import { requireAdminAccess } from "@/lib/admin/auth";
import {
  PROJECT_TYPE_OPTIONS,
  adminProjectSchema,
  adminTimelineUpdateSchema,
} from "@/lib/admin/project-management";
import { formatZodErrors } from "@/lib/validation/common";
import {
  PROJECT_STATUSES,
  isProjectStatus,
  type ProjectStatus,
} from "@/types/projects";

export type AdminProjectFormValues = {
  id: string;
  title: string;
  customerName: string;
  phone: string;
  projectType: string;
  location: string;
  startDate: string;
  estimatedCompletion: string;
  currentStage: ProjectStatus;
  progress: string;
  publicNote: string;
};

export type AdminProjectFormState = {
  status: "idle" | "success" | "error";
  message: string;
  fieldErrors: Record<string, string[]>;
  values: AdminProjectFormValues;
};

export type AdminTimelineFormState = {
  status: "idle" | "success" | "error";
  message: string;
  stage: ProjectStatus | "";
};

function readFormString(formData: FormData, key: string) {
  const value = formData.get(key);
  return typeof value === "string" ? value : "";
}

function readBoolean(formData: FormData, key: string) {
  return formData.get(key) === "on" || formData.get(key) === "true";
}

function normalizeProjectType(value: string) {
  return PROJECT_TYPE_OPTIONS.includes(value as (typeof PROJECT_TYPE_OPTIONS)[number])
    ? value
    : PROJECT_TYPE_OPTIONS[0];
}

function readFormValues(formData: FormData): AdminProjectFormValues {
  const rawStage = readFormString(formData, "currentStage");

  return {
    id: readFormString(formData, "id"),
    title: readFormString(formData, "title"),
    customerName: readFormString(formData, "customerName"),
    phone: readFormString(formData, "phone"),
    projectType: normalizeProjectType(readFormString(formData, "projectType")),
    location: readFormString(formData, "location"),
    startDate: readFormString(formData, "startDate"),
    estimatedCompletion: readFormString(formData, "estimatedCompletion"),
    currentStage: isProjectStatus(rawStage) ? rawStage : PROJECT_STATUSES[0],
    progress: readFormString(formData, "progress") || "0",
    publicNote: readFormString(formData, "publicNote"),
  };
}

async function ensureAdmin(values: AdminProjectFormValues) {
  const access = await requireAdminAccess();

  if (access.allowed) {
    return null;
  }

  return {
    status: "error" as const,
    message:
      access.reason === "configuration"
        ? access.message
        : "Bu işlem için admin oturumu gerekiyor.",
    fieldErrors: {},
    values,
  };
}

function parseProjectForm(values: AdminProjectFormValues, formData: FormData) {
  return adminProjectSchema.safeParse({
    title: values.title,
    customerName: values.customerName,
    phone: values.phone,
    projectType: values.projectType,
    location: values.location,
    startDate: values.startDate,
    estimatedCompletion: values.estimatedCompletion,
    currentStage: readFormString(formData, "currentStage"),
    progress: values.progress,
    publicNote: values.publicNote,
  });
}

export async function createAdminProjectAction(
  _previousState: AdminProjectFormState,
  formData: FormData
): Promise<AdminProjectFormState> {
  const values = readFormValues(formData);
  const deniedState = await ensureAdmin(values);

  if (deniedState) {
    return deniedState;
  }

  const parsed = parseProjectForm(values, formData);

  if (!parsed.success) {
    return {
      status: "error",
      message: "Yeni proje bilgilerini kontrol edin.",
      fieldErrors: formatZodErrors(parsed.error),
      values,
    };
  }

  let createdProjectId = "";

  try {
    const project = await createAdminProject(parsed.data);
    createdProjectId = project.id;
    revalidatePath("/admin");
    revalidatePath("/admin/projects");
  } catch (error) {
    if (isSupabaseAdminProjectConfigError(error)) {
      console.error("Supabase admin project creation is not configured.");
    } else {
      console.error("Admin project creation failed", error);
    }

    return {
      status: "error",
      message: "Proje şu anda oluşturulamadı. Lütfen tekrar deneyin.",
      fieldErrors: {},
      values,
    };
  }

  redirect(`/admin/projects/${createdProjectId}?created=1`);
}

export async function updateAdminProjectAction(
  _previousState: AdminProjectFormState,
  formData: FormData
): Promise<AdminProjectFormState> {
  const values = readFormValues(formData);
  const deniedState = await ensureAdmin(values);

  if (deniedState) {
    return deniedState;
  }

  if (!values.id) {
    return {
      status: "error",
      message: "Proje kaydı bulunamadı.",
      fieldErrors: {},
      values,
    };
  }

  const parsed = parseProjectForm(values, formData);

  if (!parsed.success) {
    return {
      status: "error",
      message: "Proje bilgilerini kontrol edin.",
      fieldErrors: formatZodErrors(parsed.error),
      values,
    };
  }

  try {
    const project = await updateAdminProject(values.id, parsed.data);
    revalidatePath("/admin");
    revalidatePath("/admin/projects");
    revalidatePath(`/admin/projects/${project.id}`);

    return {
      status: "success",
      message: "Proje güncellendi.",
      fieldErrors: {},
      values: {
        ...values,
        id: project.id,
        title: project.title,
        customerName: project.customerName,
        phone: project.customerPhone ?? "",
        projectType: project.projectType,
        location: project.location ?? "",
        startDate: project.startDate ?? "",
        estimatedCompletion: project.estimatedCompletion ?? "",
        currentStage: project.currentStage,
        progress: String(project.progress),
        publicNote: project.publicNote ?? "",
      },
    };
  } catch (error) {
    console.error("Admin project update failed", error);

    return {
      status: "error",
      message: "Proje şu anda güncellenemedi.",
      fieldErrors: {},
      values,
    };
  }
}

export async function updateAdminTimelineAction(
  _previousState: AdminTimelineFormState,
  formData: FormData
): Promise<AdminTimelineFormState> {
  const rawStage = readFormString(formData, "stage");
  const stage = isProjectStatus(rawStage) ? rawStage : "";
  const access = await requireAdminAccess();

  if (!access.allowed) {
    return {
      status: "error",
      message:
        access.reason === "configuration"
          ? access.message
          : "Bu işlem için admin oturumu gerekiyor.",
      stage,
    };
  }

  const parsed = adminTimelineUpdateSchema.safeParse({
    projectId: readFormString(formData, "projectId"),
    projectCode: readFormString(formData, "projectCode"),
    stage: rawStage,
    description: readFormString(formData, "description"),
    completed: readBoolean(formData, "completed"),
    completedAt: readFormString(formData, "completedAt"),
    setActive: readBoolean(formData, "setActive"),
  });

  if (!parsed.success) {
    return {
      status: "error",
      message: "Aşama bilgilerini kontrol edin.",
      stage,
    };
  }

  try {
    await updateAdminTimeline(parsed.data);
    revalidatePath("/admin");
    revalidatePath("/admin/projects");
    revalidatePath(`/admin/projects/${parsed.data.projectId}`);
    revalidatePath(`/api/projects/${parsed.data.projectCode}`);

    return {
      status: "success",
      message: "Aşama güncellendi.",
      stage: parsed.data.stage,
    };
  } catch (error) {
    console.error("Admin timeline update failed", error);

    return {
      status: "error",
      message: "Aşama şu anda güncellenemedi.",
      stage,
    };
  }
}
