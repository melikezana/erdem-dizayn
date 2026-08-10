"use client";

import { useMemo, useState } from "react";
import { CalendarDays, MessageCircle, Phone, Save } from "lucide-react";
import { updateAppointmentStatusAction } from "@/app/admin/appointments/actions";
import {
  APPOINTMENT_STATUS_OPTIONS,
  getAppointmentStatusLabel,
} from "@/lib/admin/appointment-status";
import { createWhatsAppUrlForNumber } from "@/lib/contact";
import type { Appointment } from "@/types/appointments";

type AdminAppointmentsClientProps = {
  appointments: Appointment[];
};

function formatDate(value: string) {
  const date = new Date(`${value}T00:00:00`);

  if (Number.isNaN(date.getTime())) {
    return value;
  }

  return new Intl.DateTimeFormat("tr-TR", {
    day: "numeric",
    month: "long",
    year: "numeric",
  }).format(date);
}

function formatDateTime(value: string) {
  const date = new Date(value);

  if (Number.isNaN(date.getTime())) {
    return value;
  }

  return new Intl.DateTimeFormat("tr-TR", {
    day: "numeric",
    month: "short",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  }).format(date);
}

function getWhatsAppUrl(appointment: Appointment) {
  if (!appointment.phone) {
    return null;
  }

  return createWhatsAppUrlForNumber(
    appointment.phone,
    `Merhaba ${appointment.fullName}, Erdem Dizayn & Mekanik randevu talebiniz için yazıyorum.`
  );
}

export function AdminAppointmentsClient({
  appointments,
}: AdminAppointmentsClientProps) {
  const [selectedId, setSelectedId] = useState(appointments[0]?.id ?? "");
  const selectedAppointment = useMemo(
    () => appointments.find((appointment) => appointment.id === selectedId),
    [appointments, selectedId]
  );

  if (!appointments.length) {
    return (
      <div className="ed-body-copy-sm rounded-lg border border-[#102B49]/10 bg-[#FBFAF7] p-6 text-sm leading-6 text-[#102B49]/72">
        <p>Yeni randevu talebi bulunmuyor.</p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 gap-5 xl:grid-cols-[1fr_360px]">
      <div className="overflow-hidden rounded-lg border border-[#102B49]/10 bg-[#FBFAF7]">
        <div className="ed-data-label hidden grid-cols-[1.1fr_0.9fr_0.9fr_0.75fr_0.9fr_0.75fr] gap-4 border-b border-[#102B49]/10 px-4 py-3 text-[10px] font-bold uppercase tracking-[0.16em] text-[#102B49]/55 lg:grid">
          <span>Ad Soyad</span>
          <span>Telefon</span>
          <span>Proje Türü</span>
          <span>Tarih</span>
          <span>Durum</span>
          <span>Oluşturulma</span>
        </div>

        <ul className="divide-y divide-[#102B49]/10">
          {appointments.map((appointment) => {
            const selected = appointment.id === selectedId;
            const whatsappUrl = getWhatsAppUrl(appointment);

            return (
              <li key={appointment.id}>
                <button
                  type="button"
                  onClick={() => setSelectedId(appointment.id)}
                  className={`ed-interactive grid w-full cursor-pointer grid-cols-1 gap-3 px-4 py-4 text-left transition-colors hover:bg-white lg:grid-cols-[1.1fr_0.9fr_0.9fr_0.75fr_0.9fr_0.75fr] lg:items-center ${
                    selected ? "bg-white" : "bg-transparent"
                  }`}
                >
                  <span className="text-sm font-bold text-[#102B49]">
                    {appointment.fullName}
                  </span>
                  <span className="text-sm text-[#102B49]/72">
                    {appointment.phone ?? "Belirtilmedi"}
                  </span>
                  <span className="text-sm text-[#102B49]/72">
                    {appointment.projectType}
                  </span>
                  <span className="text-sm text-[#102B49]/72">
                    {formatDate(appointment.preferredDate)} · {appointment.preferredTime}
                  </span>
                  <span className="text-sm font-semibold text-[#9A5C2F]">
                    {getAppointmentStatusLabel(appointment.status)}
                  </span>
                  <span className="text-sm text-[#102B49]/55">
                    {formatDateTime(appointment.createdAt)}
                  </span>
                </button>

                <div className="flex flex-col gap-3 px-4 pb-4 sm:flex-row lg:hidden">
                  {whatsappUrl && (
                    <a
                      href={whatsappUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="ed-interactive inline-flex min-h-11 items-center justify-center gap-2 rounded-full bg-[#102B49] px-4 text-sm font-semibold text-[#F6F2EA]"
                    >
                      <MessageCircle className="h-4 w-4" />
                      <span>WhatsApp&apos;tan Yaz</span>
                    </a>
                  )}
                  {appointment.phone && (
                    <a
                      href={`tel:${appointment.phone}`}
                      className="ed-interactive inline-flex min-h-11 items-center justify-center gap-2 rounded-full border border-[#102B49]/20 bg-white px-4 text-sm font-semibold text-[#102B49]"
                    >
                      <Phone className="h-4 w-4" />
                      <span>Ara</span>
                    </a>
                  )}
                </div>
              </li>
            );
          })}
        </ul>
      </div>

      <aside className="rounded-lg border border-[#102B49]/10 bg-[#FBFAF7] p-5">
        {selectedAppointment ? (
          <div>
            <div className="ed-eyebrow flex items-center gap-2 text-xs font-bold uppercase tracking-[0.16em] text-[#9A5C2F]">
              <CalendarDays className="h-4 w-4" />
              <span>Randevu Detayı</span>
            </div>
            <h2 className="ed-panel-title mt-3 font-serif text-2xl font-bold text-[#102B49]">
              {selectedAppointment.fullName}
            </h2>
            <dl className="mt-5 space-y-3 text-sm">
              {[
                ["Telefon", selectedAppointment.phone ?? "Belirtilmedi"],
                ["Proje Türü", selectedAppointment.projectType],
                ["Tarih", formatDate(selectedAppointment.preferredDate)],
                ["Saat", selectedAppointment.preferredTime],
                ["Durum", getAppointmentStatusLabel(selectedAppointment.status)],
                ["Not", selectedAppointment.note ?? "Not eklenmedi."],
              ].map(([label, value]) => (
                <div key={label} className="border-b border-[#102B49]/10 pb-3">
                  <dt className="ed-data-label text-[10px] font-bold uppercase tracking-[0.16em] text-[#102B49]/50">
                    {label}
                  </dt>
                  <dd className="mt-1 font-semibold leading-6 text-[#102B49]">
                    {value}
                  </dd>
                </div>
              ))}
            </dl>

            <form action={updateAppointmentStatusAction} className="mt-5 space-y-3">
              <input type="hidden" name="id" value={selectedAppointment.id} />
              <label className="block">
                <span className="ed-data-label mb-2 block text-xs font-semibold uppercase tracking-[0.16em] text-[#102B49]/70">
                  Durum
                </span>
                <select
                  name="status"
                  defaultValue={selectedAppointment.status}
                  className="min-h-12 w-full rounded-lg border border-[#102B49]/15 bg-white px-4 text-sm font-semibold text-[#102B49] shadow-xs transition-colors focus:border-[#9A5C2F] focus:outline-none focus:ring-2 focus:ring-[#9A5C2F]/20"
                >
                  {APPOINTMENT_STATUS_OPTIONS.map((status) => (
                    <option key={status.value} value={status.value}>
                      {status.label}
                    </option>
                  ))}
                </select>
              </label>
              <button
                type="submit"
                className="ed-interactive inline-flex min-h-11 w-full cursor-pointer items-center justify-center gap-2 rounded-full bg-[#102B49] px-5 text-sm font-semibold text-[#F6F2EA] transition-colors hover:bg-[#9A5C2F] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#9A5C2F]"
              >
                <Save className="h-4 w-4" />
                <span>Durumu Güncelle</span>
              </button>
            </form>

            <div className="mt-4 flex flex-col gap-3">
              {getWhatsAppUrl(selectedAppointment) && (
                <a
                  href={getWhatsAppUrl(selectedAppointment) ?? undefined}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="ed-interactive inline-flex min-h-11 items-center justify-center gap-2 rounded-full border border-[#102B49]/20 bg-white px-5 text-sm font-semibold text-[#102B49] transition-colors hover:border-[#9A5C2F] hover:text-[#9A5C2F]"
                >
                  <MessageCircle className="h-4 w-4" />
                  <span>WhatsApp&apos;tan Yaz</span>
                </a>
              )}
              {selectedAppointment.phone && (
                <a
                  href={`tel:${selectedAppointment.phone}`}
                  className="ed-interactive inline-flex min-h-11 items-center justify-center gap-2 rounded-full border border-[#102B49]/20 bg-white px-5 text-sm font-semibold text-[#102B49] transition-colors hover:border-[#9A5C2F] hover:text-[#9A5C2F]"
                >
                  <Phone className="h-4 w-4" />
                  <span>Ara</span>
                </a>
              )}
            </div>
          </div>
        ) : null}
      </aside>
    </div>
  );
}
