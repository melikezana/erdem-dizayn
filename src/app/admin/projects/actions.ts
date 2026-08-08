"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import {
  createAdminProject,
  isSupabaseAdminProjectConfigError,
} from "@/lib/admin/projects";
import { requireAdminAccess } from "@/lib/admin/auth";
import { adminProjectSchema } from "@/lib/admin/project-management";
import { formatZodErrors } from "@/lib/validation/common";
import { PROJECT_STATUSES, isProjectStatus, type ProjectStatus } from "@/types/projects";

export type AdminProjectFormValues = {
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
  status: "idle" | "error";
  message: string;
  fieldErrors: Record<string, string[]>;
  values: AdminProjectFormValues;
};

function readFormString(formData: FormData, key: string) {
  const value = formData.get(key);
  return typeof value === "string" ? value : "";
}

function readFormValues(formData: FormData): AdminProjectFormValues {
  const rawStage = readFormString(formData, "currentStage");

  return {
    title: readFormString(formData, "title"),
    customerName: readFormString(formData, "customerName"),
    phone: readFormString(formData, "phone"),
    projectType: readFormString(formData, "projectType"),
    location: readFormString(formData, "location"),
    startDate: readFormString(formData, "startDate"),
    estimatedCompletion: readFormString(formData, "estimatedCompletion"),
    currentStage: isProjectStatus(rawStage) ? rawStage : PROJECT_STATUSES[0],
    progress: readFormString(formData, "progress") || "0",
    publicNote: readFormString(formData, "publicNote"),
  };
}

export async function createAdminProjectAction(
  _previousState: AdminProjectFormState,
  formData: FormData
): Promise<AdminProjectFormState> {
  const values = readFormValues(formData);
  const access = await requireAdminAccess();

  if (!access.allowed) {
    return {
      status: "error",
      message: "Bu işlem için admin yetkisi gerekiyor.",
      fieldErrors: {},
      values,
    };
  }

  const parsed = adminProjectSchema.safeParse({
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

  if (!parsed.success) {
    return {
      status: "error",
      message: "Yeni proje bilgilerini kontrol edin.",
      fieldErrors: formatZodErrors(parsed.error),
      values,
    };
  }

  let createdProjectCode: string;

  try {
    const project = await createAdminProject(parsed.data);
    createdProjectCode = project.projectCode;
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

  revalidatePath("/admin/projects");
  redirect(`/admin/projects/${createdProjectCode}`);
}
