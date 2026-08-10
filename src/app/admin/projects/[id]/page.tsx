import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft, CheckCircle2, Plus } from "lucide-react";
import { AdminCustomerPreview } from "@/components/admin/AdminCustomerPreview";
import { AdminLockedState } from "@/components/admin/AdminLockedState";
import { AdminProjectCodeActions } from "@/components/admin/AdminProjectCodeActions";
import { AdminProjectEditForm } from "@/components/admin/AdminProjectEditForm";
import { AdminShell } from "@/components/admin/AdminShell";
import { AdminTimelineManager } from "@/components/admin/AdminTimelineManager";
import { ScrollReveal } from "@/components/ui/ScrollReveal";
import { requireAdminAccess } from "@/lib/admin/auth";
import {
  getAdminProjectByIdentifier,
  type AdminProject,
} from "@/lib/admin/projects";

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
    month: "long",
    year: "numeric",
  }).format(date);
}

export default async function AdminProjectDetailPage({
  params,
  searchParams,
}: {
  params: Promise<{ id: string }>;
  searchParams: Promise<{ created?: string }>;
}) {
  const access = await requireAdminAccess();

  if (!access.allowed) {
    return (
      <AdminLockedState
        title="Proje detayı kullanılamıyor."
        description={access.message}
      />
    );
  }

  const { id } = await params;
  const resolvedSearchParams = await searchParams;
  let project: AdminProject | null = null;
  let loadError = "";

  try {
    project = await getAdminProjectByIdentifier(id);
  } catch (error) {
    console.error("Admin project detail could not be loaded", error);
    loadError =
      "Supabase bağlantısı kurulamadı veya proje detayı şu anda yüklenemedi.";
  }

  if (!loadError && !project) {
    notFound();
  }

  if (!project) {
    return (
      <AdminShell userEmail={access.user.email}>
        <Link
          href="/admin/projects"
          className="inline-flex min-h-11 items-center gap-2 text-sm font-semibold text-[#102B49]/72 transition-colors hover:text-[#9A5C2F]"
        >
          <ArrowLeft className="h-4 w-4" />
          <span>Projeler</span>
        </Link>
        <p
          role="alert"
          className="mt-6 rounded-lg border border-[#9A3D2F]/20 bg-[#FFF7F4] px-4 py-3 text-sm font-semibold text-[#8A2E24]"
        >
          {loadError}
        </p>
      </AdminShell>
    );
  }

  const detailItems = [
    ["Proje Adı", project.title],
    ["Müşteri", project.customerName],
    ["Telefon", project.customerPhone ?? "Belirtilmedi"],
    ["Konum", project.location ?? "Belirtilmedi"],
    ["Proje Türü", project.projectType],
    ["Başlangıç", formatDate(project.startDate)],
    ["Tahmini Teslim", formatDate(project.estimatedCompletion)],
    ["Güncel Aşama", project.currentStageLabel],
  ];

  return (
    <AdminShell userEmail={access.user.email}>
      <ScrollReveal className="flex flex-col gap-4 border-b border-[#102B49]/10 pb-6 sm:flex-row sm:items-center sm:justify-between">
        <Link
          href="/admin/projects"
          className="ed-interactive inline-flex min-h-11 items-center gap-2 text-sm font-semibold text-[#102B49]/72 transition-colors hover:text-[#9A5C2F] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[#9A5C2F]"
        >
          <ArrowLeft className="h-4 w-4" />
          <span>Projeler</span>
        </Link>
        <Link
          href="/admin/projects/new"
          className="ed-interactive inline-flex min-h-11 items-center justify-center gap-2 rounded-full border border-[#102B49]/20 bg-[#FBFAF7] px-5 text-sm font-semibold text-[#102B49] transition-colors hover:border-[#9A5C2F] hover:text-[#9A5C2F] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#9A5C2F]"
        >
          <Plus className="h-4 w-4" />
          <span>Yeni Proje</span>
        </Link>
      </ScrollReveal>

      {resolvedSearchParams.created === "1" && (
        <div className="mt-6 flex gap-3 rounded-lg border border-[#2F6F4E]/20 bg-[#F0FAF4] p-4 text-sm font-semibold text-[#24583E]">
          <CheckCircle2 className="mt-0.5 h-5 w-5 shrink-0" />
          <p>Proje oluşturuldu.</p>
        </div>
      )}

      <ScrollReveal as="section" className="mt-6 rounded-lg border border-[#102B49]/10 bg-[#FBFAF7] p-6 shadow-sm sm:p-7">
        <div className="flex flex-col gap-6 lg:flex-row lg:items-start lg:justify-between">
          <div>
            <p className="ed-eyebrow text-xs font-semibold uppercase tracking-[0.22em] text-[#9A5C2F]">
              Proje Takip Kodu
            </p>
            <h1 className="ed-admin-code-title mt-3 font-serif text-5xl font-bold tracking-normal text-[#102B49] sm:text-6xl">
              {project.projectCode}
            </h1>
            <p className="ed-body-copy-sm mt-4 max-w-2xl text-sm leading-6 text-[#102B49]/72">
              {project.title} · {project.customerName}
            </p>
          </div>
          <div className="min-w-52">
            <div className="ed-data-label mb-2 flex items-center justify-between text-xs font-semibold uppercase tracking-[0.14em] text-[#102B49]/60">
              <span>İlerleme</span>
              <span>{project.progress}%</span>
            </div>
            <div className="h-2 overflow-hidden rounded-full bg-[#102B49]/10">
              <div
                className="h-full rounded-full bg-[#9A5C2F]"
                style={{
                  width: `${Math.min(100, Math.max(0, project.progress))}%`,
                }}
              />
            </div>
            <p className="mt-3 text-sm font-semibold text-[#102B49]">
              {project.currentStageLabel}
            </p>
          </div>
        </div>

        <AdminProjectCodeActions
          projectCode={project.projectCode}
          customerPhone={project.customerPhone}
        />
      </ScrollReveal>

      <ScrollReveal as="section" className="mt-6 grid grid-cols-1 gap-px overflow-hidden rounded-lg border border-[#102B49]/10 bg-[#102B49]/10 sm:grid-cols-2 xl:grid-cols-4">
        {detailItems.map(([label, value]) => (
          <div key={label} className="bg-[#FBFAF7] p-5">
            <span className="ed-data-label block text-[10px] font-semibold uppercase tracking-[0.18em] text-[#9A5C2F]">
              {label}
            </span>
            <span className="mt-2 block text-sm font-semibold leading-6 text-[#102B49]">
              {value}
            </span>
          </div>
        ))}
      </ScrollReveal>

      <div className="mt-6 grid grid-cols-1 gap-6 xl:grid-cols-[1fr_0.95fr]">
        <ScrollReveal as="section" className="rounded-lg border border-[#102B49]/10 bg-[#FBFAF7] p-5 sm:p-6">
          <h2 className="ed-panel-title font-serif text-2xl font-bold text-[#102B49]">
            Proje Bilgileri
          </h2>
          <div className="mt-5">
            <AdminProjectEditForm project={project} />
          </div>
        </ScrollReveal>

        <ScrollReveal as="section" className="rounded-lg border border-[#102B49]/10 bg-[#FBFAF7] p-5 sm:p-6">
          <h2 className="ed-panel-title font-serif text-2xl font-bold text-[#102B49]">
            Müşterinin Gördüğü Ekranı Önizle
          </h2>
          <details className="mt-5 group">
            <summary className="ed-interactive inline-flex min-h-11 cursor-pointer list-none items-center justify-center rounded-full border border-[#102B49]/20 bg-white px-5 text-sm font-semibold text-[#102B49] transition-colors hover:border-[#9A5C2F] hover:text-[#9A5C2F]">
              Önizlemeyi Aç
            </summary>
            <div className="mt-5">
              <AdminCustomerPreview project={project} />
            </div>
          </details>
        </ScrollReveal>
      </div>

      <ScrollReveal as="section" className="mt-6 rounded-lg border border-[#102B49]/10 bg-[#FBFAF7] p-5 sm:p-6">
        <h2 className="ed-panel-title font-serif text-2xl font-bold text-[#102B49]">
          Proje Aşamaları
        </h2>
        <p className="ed-body-copy-sm mt-2 text-sm leading-6 text-[#102B49]/68">
          Güncel aşama tekil olarak proje kaydında tutulur. Bir aşamayı güncel
          yaptığınızda müşterinin gördüğü “Projem Nerede?” ekranı da aynı aşamayı
          gösterir.
        </p>
        <div className="mt-5">
          <AdminTimelineManager project={project} />
        </div>
      </ScrollReveal>
    </AdminShell>
  );
}
