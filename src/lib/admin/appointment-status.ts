import type { AppointmentStatus } from "@/types/appointments";

export const APPOINTMENT_STATUS_OPTIONS = [
  { value: "new", label: "Yeni" },
  { value: "contacted", label: "İletişime Geçildi" },
  { value: "confirmed", label: "Onaylandı" },
  { value: "completed", label: "Tamamlandı" },
  { value: "cancelled", label: "İptal" },
] as const satisfies ReadonlyArray<{
  value: AppointmentStatus;
  label: string;
}>;

export function isAppointmentStatus(value: string): value is AppointmentStatus {
  return APPOINTMENT_STATUS_OPTIONS.some((status) => status.value === value);
}

export function getAppointmentStatusLabel(status: AppointmentStatus) {
  return (
    APPOINTMENT_STATUS_OPTIONS.find((option) => option.value === status)?.label ??
    status
  );
}
