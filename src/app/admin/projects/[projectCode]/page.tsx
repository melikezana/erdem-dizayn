import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft, Plus } from "lucide-react";
import { AdminLockedState } from "@/components/admin/AdminLockedState";
import { AdminProjectCodeActions } from "@/components/admin/AdminProjectCodeActions";
import { requireAdminAccess } from "@/lib/admin/auth";
import {
  getAdminProjectByCode,
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
}: {
  params: Promise<{ projectCode: string }>;
}) {
  const access = await requireAdminAccess();

  if (!access.allowed) {
    return (
      <AdminLockedState
        title="Proje detayı kapalı."
        description="Proje detay ekranı hazırlandı, ancak Supabase Auth doğrulaması tamamlanmadan admin proje verileri görüntülenmez."
      />
    );
  }

  const { projectCode } = await params;
  let project: AdminProject | null = null;
  let loadError = "";

  try {
    project = await getAdminProjectByCode(projectCode);
  } catch (error) {
    console.error("Admin project detail could not be loaded", error);
    loadError = "Proje detayı şu anda yüklenemedi.";
  }

  if (loadError) {
    return (
      <main className="min-h-screen bg-[#F6F2EA] px-5 py-10 text-[#102B49] sm:px-10 lg:px-20">
        <div className="mx-auto max-w-5xl">
          <Link
            href="/admin/projects"
            className="inline-flex min-h-11 items-center gap-2 text-sm font-semibold text-[#102B49]/72 transition-colors hover:text-[#9A5C2F] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[#9A5C2F]"
          >
            <ArrowLeft className="h-4 w-4" />
            <span>Projeler</span>
          </Link>
          <p
            role="alert"
            className="mt-8 rounded-lg border border-[#9A3D2F]/20 bg-[#FFF7F4] px-4 py-3 text-sm font-semibold text-[#8A2E24]"
          >
            {loadError}
          </p>
        </div>
      </main>
    );
  }

  if (!project) {
    notFound();
  }

  const detailItems = [
    ["Proje Adı", project.title],
    ["Müşteri Adı", project.customerName],
    ["Telefon", project.customerPhone ?? "Belirtilmedi"],
    ["Proje Türü", project.projectType ?? "Belirtilmedi"],
    ["Konum", project.location ?? "Belirtilmedi"],
    ["Başlangıç Tarihi", formatDate(project.startDate)],
    ["Tahmini Teslim Tarihi", formatDate(project.estimatedCompletion)],
    ["Güncel Aşama", project.currentStageLabel],
    ["İlerleme Yüzdesi", `${project.progress}%`],
  ];

  return (
    <main className="min-h-screen bg-[#F6F2EA] px-5 py-10 text-[#102B49] sm:px-10 lg:px-20">
      <div className="mx-auto max-w-5xl">
        <div className="flex flex-col gap-4 border-b border-[#102B49]/10 pb-6 sm:flex-row sm:items-center sm:justify-between">
          <Link
            href="/admin/projects"
            className="inline-flex min-h-11 items-center gap-2 text-sm font-semibold text-[#102B49]/72 transition-colors hover:text-[#9A5C2F] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[#9A5C2F]"
          >
            <ArrowLeft className="h-4 w-4" />
            <span>Projeler</span>
          </Link>
          <Link
            href="/admin/projects/new"
            className="inline-flex min-h-11 items-center justify-center gap-2 rounded-full border border-[#102B49]/20 bg-[#FBFAF7] px-5 text-sm font-semibold text-[#102B49] transition-colors hover:border-[#9A5C2F] hover:text-[#9A5C2F] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#9A5C2F]"
          >
            <Plus className="h-4 w-4" />
            <span>Yeni Proje</span>
          </Link>
        </div>

        <section className="mt-8 rounded-lg border border-[#102B49]/10 bg-[#FBFAF7] p-6 shadow-sm sm:p-8">
          <span className="text-xs font-semibold uppercase tracking-[0.22em] text-[#9A5C2F]">
            PROJE KODU
          </span>
          <h1 className="mt-3 font-serif text-5xl font-bold tracking-normal text-[#102B49] sm:text-6xl">
            {project.projectCode}
          </h1>
          <p className="mt-4 max-w-2xl text-sm leading-6 text-[#102B49]/72">
            Bu takip kodu sunucuda otomatik oluşturuldu ve müşteri takip
            ekranında kullanılabilir.
          </p>

          <AdminProjectCodeActions
            projectCode={project.projectCode}
            customerPhone={project.customerPhone}
          />
        </section>

        <section className="mt-8 grid grid-cols-1 gap-px overflow-hidden rounded-lg border border-[#102B49]/10 bg-[#102B49]/10 sm:grid-cols-2">
          {detailItems.map(([label, value]) => (
            <div key={label} className="bg-[#FBFAF7] p-5">
              <span className="block text-[10px] font-semibold uppercase tracking-[0.18em] text-[#9A5C2F]">
                {label}
              </span>
              <span className="mt-2 block text-sm font-semibold leading-6 text-[#102B49]">
                {value}
              </span>
            </div>
          ))}
        </section>

        <section className="mt-8 rounded-lg border border-[#102B49]/10 bg-[#FBFAF7] p-5">
          <span className="block text-[10px] font-semibold uppercase tracking-[0.18em] text-[#9A5C2F]">
            Müşteriye Görünecek Not
          </span>
          <p className="mt-3 text-sm leading-7 text-[#102B49]/72">
            {project.publicNote || "Not eklenmedi."}
          </p>
        </section>
      </div>
    </main>
  );
}
