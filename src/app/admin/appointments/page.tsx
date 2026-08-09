import { AlertCircle } from "lucide-react";
import { AdminAppointmentsClient } from "@/components/admin/AdminAppointmentsClient";
import { AdminLockedState } from "@/components/admin/AdminLockedState";
import { AdminShell } from "@/components/admin/AdminShell";
import { requireAdminAccess } from "@/lib/admin/auth";
import { listAdminAppointments } from "@/lib/admin/appointments";
import type { Appointment } from "@/types/appointments";

export const dynamic = "force-dynamic";

export default async function AdminAppointmentsPage() {
  const access = await requireAdminAccess();

  if (!access.allowed) {
    return (
      <AdminLockedState
        title="Randevu yönetimi kullanılamıyor."
        description={access.message}
      />
    );
  }

  let appointments: Appointment[] = [];
  let loadError = "";

  try {
    appointments = await listAdminAppointments();
  } catch (error) {
    console.error("Admin appointments could not be loaded", error);
    loadError =
      "Supabase bağlantısı kurulamadı veya randevular şu anda yüklenemedi.";
  }

  return (
    <AdminShell userEmail={access.user.email}>
      <div className="border-b border-[#102B49]/10 pb-6">
        <p className="text-xs font-bold uppercase tracking-[0.18em] text-[#9A5C2F]">
          Randevular
        </p>
        <h1 className="mt-2 font-serif text-4xl font-bold text-[#102B49]">
          Randevu Talepleri
        </h1>
      </div>

      {loadError ? (
        <div
          role="alert"
          className="mt-6 flex gap-3 rounded-lg border border-[#9A3D2F]/20 bg-[#FFF7F4] p-4 text-sm font-semibold text-[#8A2E24]"
        >
          <AlertCircle className="mt-0.5 h-5 w-5 shrink-0" />
          <p>{loadError}</p>
        </div>
      ) : (
        <section className="mt-6">
          <AdminAppointmentsClient appointments={appointments} />
        </section>
      )}
    </AdminShell>
  );
}
