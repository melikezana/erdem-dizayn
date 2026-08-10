import Link from "next/link";
import {
  AlertCircle,
  CalendarDays,
  FolderKanban,
  Gauge,
  Plus,
  TimerReset,
} from "lucide-react";
import { AdminLockedState } from "@/components/admin/AdminLockedState";
import { AdminShell } from "@/components/admin/AdminShell";
import { ScrollReveal } from "@/components/ui/ScrollReveal";
import { requireAdminAccess } from "@/lib/admin/auth";
import { getAdminDashboardData } from "@/lib/admin/dashboard";

export const dynamic = "force-dynamic";

function formatDate(value: string | null) {
  if (!value) {
    return "Belirtilmedi";
  }

  const date = new Date(`${value}T00:00:00`);

  if (Number.isNaN(date.getTime())) {
    return value;
  }

  return new Intl.DateTimeFormat("tr-TR", {
    day: "numeric",
    month: "short",
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
    hour: "2-digit",
    minute: "2-digit",
  }).format(date);
}

export default async function AdminPage() {
  const access = await requireAdminAccess();

  if (!access.allowed) {
    return (
      <AdminLockedState
        title="Yönetim paneli kullanılamıyor."
        description={access.message}
      />
    );
  }

  let dashboard:
    | Awaited<ReturnType<typeof getAdminDashboardData>>
    | null = null;
  let loadError = "";

  try {
    dashboard = await getAdminDashboardData();
  } catch (error) {
    console.error("Admin dashboard could not be loaded", error);
    loadError =
      "Supabase bağlantısı kurulamadı veya admin verileri şu anda yüklenemedi.";
  }

  return (
    <AdminShell userEmail={access.user.email}>
      <ScrollReveal className="flex flex-col gap-5 border-b border-[#102B49]/10 pb-6 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <p className="ed-eyebrow text-xs font-bold uppercase tracking-[0.18em] text-[#9A5C2F]">
            Genel Bakış
          </p>
          <h1 className="ed-admin-title mt-2 font-serif text-4xl font-bold text-[#102B49]">
            Yönetim Paneli
          </h1>
        </div>
        <Link
          href="/admin/projects/new"
          className="ed-interactive inline-flex min-h-12 items-center justify-center gap-2 rounded-full bg-[#102B49] px-6 text-sm font-semibold uppercase tracking-[0.12em] text-[#F6F2EA] transition-colors hover:bg-[#9A5C2F] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#9A5C2F]"
        >
          <Plus className="h-4 w-4" />
          <span>Yeni Proje Oluştur</span>
        </Link>
      </ScrollReveal>

      {loadError || !dashboard ? (
        <div
          role="alert"
          className="mt-6 flex gap-3 rounded-lg border border-[#9A3D2F]/20 bg-[#FFF7F4] p-4 text-sm font-semibold text-[#8A2E24]"
        >
          <AlertCircle className="mt-0.5 h-5 w-5 shrink-0" />
          <p>{loadError}</p>
        </div>
      ) : (
        <div className="mt-6 space-y-8">
          <section className="grid grid-cols-1 gap-4 md:grid-cols-3">
            {[
              {
                label: "Aktif Projeler",
                value: dashboard.activeProjects,
                icon: FolderKanban,
              },
              {
                label: "Yeni Randevu Talepleri",
                value: dashboard.newAppointments,
                icon: CalendarDays,
              },
              {
                label: "Teslime Yaklaşan Projeler",
                value: dashboard.approachingProjects.length,
                icon: TimerReset,
              },
            ].map(({ label, value, icon: Icon }) => (
              <ScrollReveal
                key={label}
                className="ed-card-lift rounded-lg border border-[#102B49]/10 bg-[#FBFAF7] p-5"
              >
                <Icon className="h-5 w-5 text-[#9A5C2F]" />
                <p className="mt-4 text-sm font-semibold text-[#102B49]/65">
                  {label}
                </p>
                <p className="mt-2 font-serif text-4xl font-bold leading-none text-[#102B49]">
                  {value}
                </p>
              </ScrollReveal>
            ))}
          </section>

          <ScrollReveal as="section" className="rounded-lg border border-[#102B49]/10 bg-[#FBFAF7] p-5">
            <div className="ed-eyebrow mb-4 flex items-center gap-2 text-xs font-bold uppercase tracking-[0.16em] text-[#9A5C2F]">
              <TimerReset className="h-4 w-4" />
              <span>Teslime Yaklaşan Projeler</span>
            </div>
            {dashboard.approachingProjects.length ? (
              <ul className="divide-y divide-[#102B49]/10">
                {dashboard.approachingProjects.map((project) => (
                  <li
                    key={project.id}
                    className="grid grid-cols-1 gap-2 py-3 sm:grid-cols-[1fr_auto] sm:items-center"
                  >
                    <div>
                      <Link
                        href={`/admin/projects/${project.id}`}
                        className="ed-interactive font-semibold text-[#102B49] transition-colors hover:text-[#9A5C2F]"
                      >
                        {project.title}
                      </Link>
                      <p className="mt-1 text-sm text-[#102B49]/62">
                        {project.customerName} · {project.projectCode}
                      </p>
                    </div>
                    <span className="text-sm font-semibold text-[#9A5C2F]">
                      {formatDate(project.estimatedCompletion)}
                    </span>
                  </li>
                ))}
              </ul>
            ) : (
              <p className="ed-body-copy-sm text-sm leading-6 text-[#102B49]/68">
                Yaklaşan teslim tarihi olan aktif proje bulunmuyor.
              </p>
            )}
          </ScrollReveal>

          <div className="grid grid-cols-1 gap-5 xl:grid-cols-2">
            <ScrollReveal as="section" className="rounded-lg border border-[#102B49]/10 bg-[#FBFAF7] p-5">
              <div className="ed-eyebrow mb-4 flex items-center gap-2 text-xs font-bold uppercase tracking-[0.16em] text-[#9A5C2F]">
                <Gauge className="h-4 w-4" />
                <span>Son Projeler</span>
              </div>
              {dashboard.recentProjects.length ? (
                <ul className="divide-y divide-[#102B49]/10">
                  {dashboard.recentProjects.map((project) => (
                    <li key={project.id} className="py-3">
                      <Link
                        href={`/admin/projects/${project.id}`}
                        className="ed-interactive font-semibold text-[#102B49] transition-colors hover:text-[#9A5C2F]"
                      >
                        {project.title}
                      </Link>
                      <p className="mt-1 text-sm text-[#102B49]/62">
                        {project.projectCode} · {project.currentStageLabel} ·{" "}
                        {formatDate(project.startDate)}
                      </p>
                    </li>
                  ))}
                </ul>
              ) : (
                <p className="ed-body-copy-sm text-sm leading-6 text-[#102B49]/68">
                  Henüz proje oluşturulmadı.
                </p>
              )}
            </ScrollReveal>

            <ScrollReveal as="section" className="rounded-lg border border-[#102B49]/10 bg-[#FBFAF7] p-5">
              <div className="ed-eyebrow mb-4 flex items-center gap-2 text-xs font-bold uppercase tracking-[0.16em] text-[#9A5C2F]">
                <CalendarDays className="h-4 w-4" />
                <span>Son Randevular</span>
              </div>
              {dashboard.recentAppointments.length ? (
                <ul className="divide-y divide-[#102B49]/10">
                  {dashboard.recentAppointments.map((appointment) => (
                    <li key={appointment.id} className="py-3">
                      <Link
                        href="/admin/appointments"
                        className="ed-interactive font-semibold text-[#102B49] transition-colors hover:text-[#9A5C2F]"
                      >
                        {appointment.fullName}
                      </Link>
                      <p className="mt-1 text-sm text-[#102B49]/62">
                        {appointment.projectType} · {appointment.preferredTime} ·{" "}
                        {formatDateTime(appointment.createdAt)}
                      </p>
                    </li>
                  ))}
                </ul>
              ) : (
                <p className="ed-body-copy-sm text-sm leading-6 text-[#102B49]/68">
                  Yeni randevu talebi bulunmuyor.
                </p>
              )}
            </ScrollReveal>
          </div>
        </div>
      )}
    </AdminShell>
  );
}
