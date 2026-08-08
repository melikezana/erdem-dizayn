import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft, ArrowUpRight, Check, MessageCircle } from "lucide-react";
import { getProjectBySlug, getPublishedProjects } from "@/data/projects";
import { createWhatsAppUrl } from "@/lib/contact";
import { projectSlugSchema } from "@/lib/validation/projects";

export function generateStaticParams() {
  return getPublishedProjects().map((project) => ({
    slug: project.slug,
  }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const project = getProjectBySlug(slug);

  if (!project) {
    return {
      title: "Proje Bulunamadı | Erdem Dizayn & Mekanik",
    };
  }

  return {
    title: `${project.title} | Erdem Dizayn & Mekanik`,
    description: project.summary,
  };
}

export default async function ProjectDetailPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const parsedSlug = projectSlugSchema.safeParse(slug);

  if (!parsedSlug.success) {
    notFound();
  }

  const project = getProjectBySlug(parsedSlug.data);

  if (!project) {
    notFound();
  }

  const whatsappUrl = createWhatsAppUrl(
    `Merhaba Erdem Bey,\n${project.title} projesi hakkında bilgi almak istiyorum.`
  );

  return (
    <main className="min-h-screen bg-[#F6F2EA] text-[#102B49]">
      <section className="relative overflow-hidden px-5 pb-16 pt-6 sm:px-10 lg:px-20">
        <div className="absolute inset-0 bg-blueprint-light opacity-20 pointer-events-none" />

        <div className="relative z-10 mx-auto max-w-7xl">
          <div className="flex min-h-14 items-center justify-between gap-4 border-b border-[#102B49]/10 py-4">
            <Link
              href="/#projects"
              className="inline-flex min-h-11 items-center gap-2 text-sm font-semibold text-[#102B49] transition-colors hover:text-[#9A5C2F] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[#9A5C2F]"
            >
              <ArrowLeft className="h-4 w-4" />
              <span>Projeler</span>
            </Link>

            <Link
              href="/#hero"
              className="font-serif text-base font-bold tracking-normal text-[#102B49]"
            >
              ERDEM DİZAYN & MEKANİK
            </Link>
          </div>

          <div className="grid grid-cols-1 gap-10 py-12 lg:grid-cols-[0.9fr_1.1fr] lg:items-end">
            <div>
              <span className="text-[11px] font-semibold uppercase tracking-[0.24em] text-[#9A5C2F]">
                {project.type}
              </span>
              <h1 className="mt-4 font-serif text-4xl font-bold leading-tight text-[#102B49] sm:text-6xl">
                {project.title}
              </h1>
              <p className="mt-5 text-base leading-8 text-[#102B49]/76 sm:text-lg">
                {project.summary}
              </p>
            </div>

            <div className="grid grid-cols-1 gap-px overflow-hidden rounded-lg border border-[#102B49]/10 bg-[#102B49]/10 sm:grid-cols-2">
              <div className="bg-[#FBFAF7] p-5">
                <span className="block text-[10px] font-semibold uppercase tracking-[0.2em] text-[#9A5C2F]">
                  Konum
                </span>
                <span className="mt-2 block text-sm font-semibold text-[#102B49]">
                  {project.location}
                </span>
              </div>
              <div className="bg-[#FBFAF7] p-5">
                <span className="block text-[10px] font-semibold uppercase tracking-[0.2em] text-[#9A5C2F]">
                  Hizmet
                </span>
                <span className="mt-2 block text-sm font-semibold text-[#102B49]">
                  {project.services[0]}
                </span>
              </div>
            </div>
          </div>

          <div className="relative aspect-[16/10] overflow-hidden rounded-lg border border-[#102B49]/10 bg-[#102B49]/5">
            <Image
              src={project.images[0]}
              alt={project.title}
              fill
              className="object-cover"
              sizes="100vw"
              priority
            />
          </div>

          <div className="grid grid-cols-1 gap-10 border-b border-[#102B49]/10 py-12 lg:grid-cols-12">
            <div className="lg:col-span-5">
              <h2 className="font-serif text-3xl font-bold text-[#102B49]">
                Kapsam
              </h2>
            </div>
            <ul className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:col-span-7">
              {project.services.map((service) => (
                <li
                  key={service}
                  className="flex min-h-11 items-center gap-3 border-b border-[#102B49]/10 py-3 text-sm font-semibold text-[#102B49]"
                >
                  <Check className="h-4 w-4 shrink-0 text-[#9A5C2F]" />
                  <span>{service}</span>
                </li>
              ))}
            </ul>
          </div>

          <div className="flex flex-col gap-3 py-10 sm:flex-row sm:flex-wrap">
            <a
              href={whatsappUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex min-h-12 items-center justify-center gap-2 rounded-full bg-[#102B49] px-7 text-sm font-semibold uppercase tracking-[0.12em] text-[#F6F2EA] transition-colors hover:bg-[#9A5C2F] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#9A5C2F]"
            >
              <MessageCircle className="h-4 w-4" />
              <span>WhatsApp&apos;tan Konuşalım</span>
            </a>
            <Link
              href="/#contact"
              className="inline-flex min-h-12 items-center justify-center gap-2 rounded-full border border-[#102B49]/20 bg-[#FBFAF7] px-7 text-sm font-semibold uppercase tracking-[0.12em] text-[#102B49] transition-colors hover:border-[#9A5C2F] hover:text-[#9A5C2F] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#9A5C2F]"
            >
              <span>İletişime Geç</span>
              <ArrowUpRight className="h-4 w-4" />
            </Link>
          </div>
        </div>
      </section>
    </main>
  );
}
