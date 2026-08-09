import "server-only";

import { unstable_noStore as noStore } from "next/cache";
import {
  createServiceRoleSupabaseClient,
  SupabaseConfigurationError,
} from "@/lib/supabase/server";
import {
  isAppointmentStatus,
  getAppointmentStatusLabel,
} from "@/lib/admin/appointment-status";
import type { Appointment, AppointmentStatus } from "@/types/appointments";

export { isAppointmentStatus, getAppointmentStatusLabel };

type AppointmentRow = {
  id: string;
  full_name: string;
  phone: string | null;
  project_type: string;
  preferred_date: string;
  preferred_time: string;
  note: string | null;
  status: string;
  source: string;
  created_at: string;
  updated_at: string;
};

const APPOINTMENT_SELECT = [
  "id",
  "full_name",
  "phone",
  "project_type",
  "preferred_date",
  "preferred_time",
  "note",
  "status",
  "source",
  "created_at",
  "updated_at",
].join(", ");

function toAppointment(row: AppointmentRow): Appointment {
  const status = isAppointmentStatus(row.status) ? row.status : "new";

  return {
    id: row.id,
    fullName: row.full_name,
    phone: row.phone,
    projectType: row.project_type,
    preferredDate: row.preferred_date,
    preferredTime: row.preferred_time,
    note: row.note,
    status,
    source: row.source,
    createdAt: row.created_at,
    updatedAt: row.updated_at,
  };
}

export async function listAdminAppointments(limit = 80) {
  noStore();

  const supabase = createServiceRoleSupabaseClient();
  const { data, error } = await supabase
    .from("appointments")
    .select(APPOINTMENT_SELECT)
    .order("created_at", { ascending: false })
    .limit(limit)
    .returns<AppointmentRow[]>();

  if (error) {
    throw error;
  }

  return (data ?? []).map(toAppointment);
}

export async function countNewAppointments() {
  noStore();

  const supabase = createServiceRoleSupabaseClient();
  const { count, error } = await supabase
    .from("appointments")
    .select("id", { count: "exact", head: true })
    .eq("status", "new");

  if (error) {
    throw error;
  }

  return count ?? 0;
}

export async function updateAppointmentStatus(
  appointmentId: string,
  status: AppointmentStatus
) {
  noStore();

  const supabase = createServiceRoleSupabaseClient();
  const { error } = await supabase
    .from("appointments")
    .update({ status })
    .eq("id", appointmentId);

  if (error) {
    throw error;
  }
}

export function isSupabaseAdminAppointmentConfigError(error: unknown) {
  return error instanceof SupabaseConfigurationError;
}
