"use server";

import { revalidatePath } from "next/cache";
import { z } from "zod";
import { requireAdminAccess } from "@/lib/admin/auth";
import {
  isAppointmentStatus,
  updateAppointmentStatus,
} from "@/lib/admin/appointments";

const appointmentStatusUpdateSchema = z.object({
  id: z.string().uuid(),
});

export async function updateAppointmentStatusAction(formData: FormData) {
  const access = await requireAdminAccess();

  if (!access.allowed) {
    return;
  }

  const status = formData.get("status");
  const parsed = appointmentStatusUpdateSchema.safeParse({
    id: formData.get("id"),
  });

  if (
    !parsed.success ||
    typeof status !== "string" ||
    !isAppointmentStatus(status)
  ) {
    return;
  }

  await updateAppointmentStatus(parsed.data.id, status);
  revalidatePath("/admin");
  revalidatePath("/admin/appointments");
}
