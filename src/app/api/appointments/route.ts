import type { NextRequest } from "next/server";
import { apiError, apiSuccess } from "@/lib/api/responses";
import { getClientIp, checkRateLimit } from "@/lib/rate-limit";
import {
  createServiceRoleSupabaseClient,
  SupabaseConfigurationError,
} from "@/lib/supabase/server";
import { appointmentRequestSchema } from "@/lib/validation/appointments";
import { formatZodErrors } from "@/lib/validation/common";
import type { AppointmentCreateResult } from "@/types/appointments";

export const runtime = "nodejs";

export async function POST(request: NextRequest) {
  let body: unknown;

  try {
    body = await request.json();
  } catch {
    return apiError("INVALID_JSON", "Geçerli bir JSON gövdesi gönderin.", 400);
  }

  const parsed = appointmentRequestSchema.safeParse(body);

  if (!parsed.success) {
    return apiError(
      "VALIDATION_ERROR",
      "Randevu bilgilerini kontrol edin.",
      400,
      formatZodErrors(parsed.error)
    );
  }

  if (parsed.data.website) {
    return apiError("SPAM_DETECTED", "Randevu talebi gönderilemedi.", 400);
  }

  const rateLimit = checkRateLimit(`appointments:${getClientIp(request)}`, {
    limit: 5,
    windowMs: 15 * 60 * 1000,
  });

  if (!rateLimit.allowed) {
    return apiError(
      "RATE_LIMITED",
      "Çok fazla randevu talebi gönderildi. Lütfen biraz sonra tekrar deneyin.",
      429
    );
  }

  try {
    const supabase = createServiceRoleSupabaseClient();
    const { error } = await supabase.from("appointments").insert({
      full_name: parsed.data.fullName,
      phone: parsed.data.phone ?? null,
      project_type: parsed.data.projectType,
      preferred_date: parsed.data.preferredDate,
      preferred_time: parsed.data.preferredTime,
      note: parsed.data.note ?? null,
      source: "website",
    });

    if (error) {
      throw error;
    }

    return apiSuccess<AppointmentCreateResult>({ status: "received" }, 201);
  } catch (error) {
    if (error instanceof SupabaseConfigurationError) {
      console.error(error.message);
    } else {
      console.error("Appointment insert failed", error);
    }

    return apiError(
      "SERVER_ERROR",
      "Randevu talebi şu anda kaydedilemedi.",
      500
    );
  }
}
