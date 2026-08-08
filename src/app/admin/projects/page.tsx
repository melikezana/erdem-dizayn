import Link from "next/link";
import { ArrowUpRight, ClipboardList, Plus } from "lucide-react";
import { AdminLockedState } from "@/components/admin/AdminLockedState";
import { requireAdminAccess } from "@/lib/admin/auth";
import { listAdminProjects, type AdminProject } from "@/lib/admin/projects";

export const dynamic = "force-dynamic";

function formatDate(value: string) {
  const date = new Date(value);

  if (Number.isNaN(date.getTime())) {
    return value;
  }

  return new Intl.DateTimeFormat("tr-TR", {
    day: "numeric",
    month: "short",
    year: "numeric",
  }).format(date);
}

export default async function AdminProjectsPage() {
  const access = await requireAdminAccess();

  if (!access.allowed) {
    return (
      <AdminLockedState
        title="Proje yönetimi kapalı."
        description="Proje yönetim mimarisi hazırlandı, ancak Supabase Auth doğrulaması tamamlanmadan proje kayıtları listelenmez, oluşturulmaz veya düzenlenmez."
      />
    );
  }

  let projects: AdminProject[] = [];
  let loadError = "";

  try {
    projects = await listAdminProjects();
  } catch (error) {
    console.error("Admin projects could not be loaded", error);
    loadError = "Projeler şu anda yüklenemedi.";
  }

  return (
    <main className="min-h-screen bg-[#F6F2EA] px-5 py-10 text-[#102B49] sm:px-10 lg:px-20">
      <div className="mx-auto max-w-5xl">
        <div className="flex flex-col gap-5 border-b border-[#102B49]/10 pb-6 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <h1 className="font-serif text-4xl font-bold">Projeler</h1>
            <p className="mt-3 max-w-2xl text-sm leading-6 text-[#102B49]/72">
              Yeni proje oluşturulduğunda takip kodu sunucuda otomatik üretilir.
            </p>
          </div>
          <Link
            href="/admin/projects/new"
            className="inline-flex min-h-12 items-center justify-center gap-2 rounded-full bg-[#102B49] px-6 text-sm font-semibold uppercase tracking-[0.12em] text-[#F6F2EA] transition-colors hover:bg-[#9A5C2F] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#9A5C2F]"
          >
            <Plus className="h-4 w-4" />
            <span>Yeni Proje</span>
          </Link>
        </div>

        {loadError ? (
          <p
            role="alert"
            className="mt-8 rounded-lg border border-[#9A3D2F]/20 bg-[#FFF7F4] px-4 py-3 text-sm font-semibold text-[#8A2E24]"
          >
            {loadError}
          </p>
        ) : (
          <section className="mt-8">
            <div className="mb-4 flex items-center gap-2 text-xs font-semibold uppercase tracking-[0.18em] text-[#9A5C2F]">
              <ClipboardList className="h-4 w-4" />
              <span>Son Projeler</span>
            </div>

            {projects.length > 0 ? (
              <ul className="grid grid-cols-1 gap-3">
                {projects.map((project) => (
                  <li key={project.id}>
                    <Link
                      href={`/admin/projects/${project.projectCode}`}
                      className="grid gap-4 rounded-lg border border-[#102B49]/10 bg-[#FBFAF7] p-4 transition-colors hover:border-[#9A5C2F] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[#9A5C2F] sm:grid-cols-[1fr_auto] sm:items-center"
                    >
                      <div>
                        <div className="flex flex-wrap items-center gap-3">
                          <span className="font-serif text-xl font-bold text-[#102B49]">
                            {project.title}
                          </span>
                          <span className="rounded-full border border-[#102B49]/10 px-3 py-1 text-xs font-bold uppercase tracking-[0.12em] text-[#9A5C2F]">
                            {project.projectCode}
                          </span>
                        </div>
                        <p className="mt-2 text-sm text-[#102B49]/68">
                          {project.customerName} · {project.currentStageLabel} ·{" "}
                          {formatDate(project.createdAt)}
                        </p>
                      </div>
                      <ArrowUpRight className="h-5 w-5 text-[#9A5C2F]" />
                    </Link>
                  </li>
                ))}
              </ul>
            ) : (
              <div className="rounded-lg border border-[#102B49]/10 bg-[#FBFAF7] p-6 text-sm leading-6 text-[#102B49]/72">
                Henüz proje oluşturulmadı.
              </div>
            )}
          </section>
        )}
      </div>
    </main>
  );
}
