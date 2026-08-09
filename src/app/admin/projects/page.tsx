import Link from "next/link";
import { Eye, Pencil, Plus, Search } from "lucide-react";
import { AdminLockedState } from "@/components/admin/AdminLockedState";
import { AdminShell } from "@/components/admin/AdminShell";
import { requireAdminAccess } from "@/lib/admin/auth";
import { listAdminProjects, type AdminProject } from "@/lib/admin/projects";

export const dynamic = "force-dynamic";

function formatDate(value: string | null) {
  if (!value) {
    return "Belirtilmedi";
  }

  const date = new Date(value.includes("T") ? value : `${value}T00:00:00`);

  if (Number.isNaN(date.getTime())) {
    return value;
  }

  return new Intl.DateTimeFormat("tr-TR", {
    day: "numeric",
    month: "short",
    year: "numeric",
  }).format(date);
}

export default async function AdminProjectsPage({
  searchParams,
}: {
  searchParams: Promise<{ q?: string }>;
}) {
  const access = await requireAdminAccess();

  if (!access.allowed) {
    return (
      <AdminLockedState
        title="Proje yönetimi kullanılamıyor."
        description={access.message}
      />
    );
  }

  const resolvedSearchParams = await searchParams;
  const q = resolvedSearchParams.q ?? "";
  let projects: AdminProject[] = [];
  let loadError = "";

  try {
    projects = await listAdminProjects(q);
  } catch (error) {
    console.error("Admin projects could not be loaded", error);
    loadError =
      "Supabase bağlantısı kurulamadı veya projeler şu anda yüklenemedi.";
  }

  return (
    <AdminShell userEmail={access.user.email}>
      <div className="flex flex-col gap-5 border-b border-[#102B49]/10 pb-6 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <p className="text-xs font-bold uppercase tracking-[0.18em] text-[#9A5C2F]">
            Projeler
          </p>
          <h1 className="mt-2 font-serif text-4xl font-bold text-[#102B49]">
            Proje Yönetimi
          </h1>
        </div>
        <Link
          href="/admin/projects/new"
          className="inline-flex min-h-12 items-center justify-center gap-2 rounded-full bg-[#102B49] px-6 text-sm font-semibold uppercase tracking-[0.12em] text-[#F6F2EA] transition-colors hover:bg-[#9A5C2F] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#9A5C2F]"
        >
          <Plus className="h-4 w-4" />
          <span>Yeni Proje Oluştur</span>
        </Link>
      </div>

      <form
        action="/admin/projects"
        className="mt-6 grid grid-cols-1 gap-3 rounded-lg border border-[#102B49]/10 bg-[#FBFAF7] p-4 sm:grid-cols-[1fr_auto]"
      >
        <label className="block">
          <span className="mb-2 block text-xs font-semibold uppercase tracking-[0.16em] text-[#102B49]/70">
            Proje kodu, müşteri adı veya proje adı
          </span>
          <input
            type="search"
            name="q"
            defaultValue={q}
            className="min-h-12 w-full rounded-lg border border-[#102B49]/15 bg-white px-4 text-sm font-semibold text-[#102B49] shadow-xs transition-colors focus:border-[#9A5C2F] focus:outline-none focus:ring-2 focus:ring-[#9A5C2F]/20"
          />
        </label>
        <button
          type="submit"
          className="inline-flex min-h-12 cursor-pointer items-center justify-center gap-2 rounded-full border border-[#102B49]/20 bg-white px-6 text-sm font-semibold text-[#102B49] transition-colors hover:border-[#9A5C2F] hover:text-[#9A5C2F] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#9A5C2F] sm:self-end"
        >
          <Search className="h-4 w-4" />
          <span>Ara</span>
        </button>
      </form>

      {loadError ? (
        <p
          role="alert"
          className="mt-6 rounded-lg border border-[#9A3D2F]/20 bg-[#FFF7F4] px-4 py-3 text-sm font-semibold text-[#8A2E24]"
        >
          {loadError}
        </p>
      ) : projects.length > 0 ? (
        <section className="mt-6 overflow-hidden rounded-lg border border-[#102B49]/10 bg-[#FBFAF7]">
          <div className="hidden grid-cols-[0.75fr_1.1fr_1fr_0.8fr_0.9fr_0.65fr_0.8fr_0.8fr] gap-4 border-b border-[#102B49]/10 px-4 py-3 text-[10px] font-bold uppercase tracking-[0.16em] text-[#102B49]/55 lg:grid">
            <span>Proje Kodu</span>
            <span>Proje Adı</span>
            <span>Müşteri</span>
            <span>Konum</span>
            <span>Güncel Aşama</span>
            <span>İlerleme</span>
            <span>Son Güncelleme</span>
            <span>Aksiyon</span>
          </div>
          <ul className="divide-y divide-[#102B49]/10">
            {projects.map((project) => (
              <li
                key={project.id}
                className="grid grid-cols-1 gap-3 px-4 py-4 lg:grid-cols-[0.75fr_1.1fr_1fr_0.8fr_0.9fr_0.65fr_0.8fr_0.8fr] lg:items-center"
              >
                <span className="font-mono text-sm font-bold text-[#9A5C2F]">
                  {project.projectCode}
                </span>
                <span className="font-semibold text-[#102B49]">
                  {project.title}
                </span>
                <span className="text-sm text-[#102B49]/72">
                  {project.customerName}
                </span>
                <span className="text-sm text-[#102B49]/72">
                  {project.location ?? "Belirtilmedi"}
                </span>
                <span className="text-sm font-semibold text-[#102B49]">
                  {project.currentStageLabel}
                </span>
                <span className="text-sm font-semibold text-[#102B49]">
                  {project.progress}%
                </span>
                <span className="text-sm text-[#102B49]/62">
                  {formatDate(project.updatedAt)}
                </span>
                <span className="flex flex-wrap gap-2">
                  <Link
                    href={`/admin/projects/${project.id}`}
                    className="inline-flex min-h-10 items-center justify-center gap-2 rounded-full border border-[#102B49]/15 bg-white px-4 text-sm font-semibold text-[#102B49] transition-colors hover:border-[#9A5C2F] hover:text-[#9A5C2F]"
                  >
                    <Eye className="h-4 w-4" />
                    <span>Görüntüle</span>
                  </Link>
                  <Link
                    href={`/admin/projects/${project.id}#edit`}
                    className="inline-flex min-h-10 items-center justify-center gap-2 rounded-full bg-[#102B49] px-4 text-sm font-semibold text-[#F6F2EA] transition-colors hover:bg-[#9A5C2F]"
                  >
                    <Pencil className="h-4 w-4" />
                    <span>Düzenle</span>
                  </Link>
                </span>
              </li>
            ))}
          </ul>
        </section>
      ) : (
        <div className="mt-6 rounded-lg border border-[#102B49]/10 bg-[#FBFAF7] p-6 text-sm leading-6 text-[#102B49]/72">
          <p>Henüz proje oluşturulmadı.</p>
          <Link
            href="/admin/projects/new"
            className="mt-5 inline-flex min-h-11 items-center justify-center gap-2 rounded-full bg-[#102B49] px-5 text-sm font-semibold text-[#F6F2EA] transition-colors hover:bg-[#9A5C2F]"
          >
            <Plus className="h-4 w-4" />
            <span>Yeni Proje Oluştur</span>
          </Link>
        </div>
      )}
    </AdminShell>
  );
}
