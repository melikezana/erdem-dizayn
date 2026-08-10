import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import {
  ArrowLeft,
  ArrowUpRight,
  Check,
  Layers3,
  MessageCircle,
  Ruler,
} from "lucide-react";
import { getProjectBySlug, getPublishedProjects } from "@/data/projects";
import { ScrollReveal } from "@/components/ui/ScrollReveal";
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

  const relatedProjects = getPublishedProjects().filter(
    (item) => item.slug !== project.slug
  );
  const whatsappUrl = createWhatsAppUrl(
    `Merhaba Erdem Bey,\n${project.title} projesi hakkında bilgi almak istiyorum.`
  );

  return (
    <main className="min-h-screen bg-[#151310] text-[#f8f0e5]">
      <section className="relative min-h-[100svh] overflow-hidden">
        <Image
          src={project.images[0]}
          alt={project.title}
          fill
          className="object-cover"
          sizes="100vw"
          priority
        />
        <div className="absolute inset-0 bg-[linear-gradient(90deg,rgba(21,19,16,0.96)_0%,rgba(21,19,16,0.72)_42%,rgba(21,19,16,0.2)_100%)]" />
        <div className="absolute inset-x-0 bottom-0 h-2/3 bg-[linear-gradient(0deg,rgba(21,19,16,0.98)_0%,rgba(21,19,16,0)_100%)]" />
        <div className="spatial-noise pointer-events-none absolute inset-0 opacity-[0.08]" />

        <div className="relative z-10 mx-auto flex min-h-[100svh] max-w-[1760px] flex-col px-5 pb-8 pt-6 sm:px-8 lg:px-12">
          <div className="flex min-h-14 items-center justify-between gap-4 border-b border-[#f8f0e5]/12 py-4">
            <Link
              href="/#projects"
              data-cursor="Geri"
              className="ed-link inline-flex min-h-11 items-center gap-2 text-sm font-semibold text-[#f8f0e5] transition-colors hover:text-[#e6c777]"
            >
              <ArrowLeft className="h-4 w-4" />
              <span>Projeler</span>
            </Link>

            <Link
              href="/#hero"
              data-cursor="Başla"
              className="font-serif text-base font-semibold text-[#f8f0e5]"
            >
              ERDEM DİZAYN
            </Link>
          </div>

          <ScrollReveal
            className="mt-auto grid grid-cols-1 gap-10 py-10 lg:grid-cols-12 lg:items-end"
            amount={0.08}
          >
            <div className="lg:col-span-8">
              <span className="ed-eyebrow text-xs font-semibold uppercase text-[#e6c777]">
                {project.type}
              </span>
              <h1 className="ed-page-display-title mt-5 max-w-6xl font-serif text-6xl font-semibold leading-[0.94] sm:text-7xl lg:text-9xl">
                {project.title}
              </h1>
              <p className="ed-body-copy mt-7 max-w-3xl text-base font-light leading-8 text-[#f8f0e5]/72 sm:text-lg">
                {project.summary}
              </p>
            </div>

            <div className="grid grid-cols-1 gap-px border border-[#f8f0e5]/12 bg-[#f8f0e5]/12 sm:grid-cols-2 lg:col-span-4">
              <div className="bg-[#151310]/70 p-5 backdrop-blur-md">
                <span className="ed-data-label block text-[10px] font-semibold uppercase text-[#e6c777]">
                  Konum
                </span>
                <span className="mt-2 block text-sm font-semibold text-[#f8f0e5]">
                  {project.location}
                </span>
              </div>
              <div className="bg-[#151310]/70 p-5 backdrop-blur-md">
                <span className="ed-data-label block text-[10px] font-semibold uppercase text-[#e6c777]">
                  Hizmet
                </span>
                <span className="mt-2 block text-sm font-semibold text-[#f8f0e5]">
                  {project.services[0]}
                </span>
              </div>
            </div>
          </ScrollReveal>
        </div>
      </section>

      <section className="ed-section-shell bg-[#f8f0e5] px-5 py-20 text-[#151310] sm:px-8 sm:py-28 lg:px-12">
        <div className="mx-auto grid max-w-[1520px] grid-cols-1 gap-12 lg:grid-cols-12">
          <ScrollReveal className="lg:col-span-5">
            <div className="ed-eyebrow mb-5 inline-flex items-center gap-3 text-xs font-semibold uppercase text-[#8e5533]">
              <Layers3 className="h-4 w-4" />
              <span>Kapsam</span>
            </div>
            <h2 className="ed-section-title-sm font-serif text-5xl font-semibold leading-[1.04] sm:text-6xl">
              Tasarım kararından saha detayına uzanan tek atmosfer.
            </h2>
          </ScrollReveal>

          <ScrollReveal className="lg:col-span-7" delay={0.08}>
            <ul className="grid grid-cols-1 gap-3 sm:grid-cols-2">
              {project.services.map((service) => (
                <li
                  key={service}
                  className="flex min-h-12 items-center gap-3 border-b border-[#151310]/10 py-3 text-sm font-semibold text-[#151310]"
                >
                  <Check className="h-4 w-4 shrink-0 text-[#8e5533]" />
                  <span>{service}</span>
                </li>
              ))}
            </ul>

            <div className="mt-10 border-y border-[#151310]/12 py-7">
              <div className="ed-eyebrow flex items-center gap-3 text-xs font-semibold uppercase text-[#8e5533]">
                <Ruler className="h-4 w-4" />
                <span>Seçili proje</span>
              </div>
              <p className="ed-body-copy mt-4 max-w-3xl text-lg font-light leading-8 text-[#151310]/68">
                Malzeme, ışık ve uygulama koordinasyonunun tek tasarım dilinde
                birleştiği çalışma. Benzer bir atmosfer için kapsamı, öncelikleri
                ve uygulanabilir takvimi kısa bir görüşmede netleştirebiliriz.
              </p>
            </div>

            <div className="mt-9 flex flex-col gap-3 sm:flex-row sm:flex-wrap">
              <a
                href={whatsappUrl}
                target="_blank"
                rel="noopener noreferrer"
                data-cursor="Yaz"
                className="ed-button inline-flex min-h-12 items-center justify-center gap-2 rounded-full bg-[#151310] px-7 text-sm font-semibold uppercase text-[#f8f0e5] transition-colors hover:bg-[#8e5533]"
              >
                <MessageCircle className="h-4 w-4" />
                <span>WhatsApp&apos;tan Konuşalım</span>
              </a>
              <Link
                href="/#contact"
                data-cursor="Git"
                className="ed-interactive inline-flex min-h-12 items-center justify-center gap-2 rounded-full border border-[#151310]/18 px-7 text-sm font-semibold uppercase text-[#151310] transition-colors hover:border-[#8e5533] hover:text-[#8e5533]"
              >
                <span>İletişime Geç</span>
                <ArrowUpRight className="h-4 w-4" />
              </Link>
            </div>
          </ScrollReveal>
        </div>
      </section>

      {relatedProjects.length > 0 && (
        <section className="ed-section-shell bg-[#151310] px-5 py-20 text-[#f8f0e5] sm:px-8 sm:py-28 lg:px-12">
          <div className="mx-auto max-w-[1520px]">
            <ScrollReveal className="mb-8 flex items-end justify-between gap-4 border-b border-[#f8f0e5]/12 pb-6">
              <div>
                <span className="ed-eyebrow text-xs font-semibold uppercase text-[#e6c777]">
                  Devam
                </span>
                <h2 className="ed-section-title-sm mt-3 font-serif text-4xl font-semibold text-[#f8f0e5]">
                  Diğer projeler
                </h2>
              </div>
              <Link
                href="/#projects"
                data-cursor="Tümü"
                className="ed-link hidden text-sm font-semibold text-[#f8f0e5]/70 hover:text-[#e6c777] sm:inline-flex"
              >
                Tümünü gör
              </Link>
            </ScrollReveal>

            <div className="grid grid-cols-1 gap-5 md:grid-cols-3">
              {relatedProjects.slice(0, 3).map((item, index) => (
                <ScrollReveal key={item.id} delay={index * 0.05}>
                <Link
                  href={`/projeler/${item.slug}`}
                  data-cursor="Aç"
                  className="ed-card-lift group block"
                >
                  <div className="relative aspect-[4/5] overflow-hidden bg-[#151310]">
                    <Image
                      src={item.image}
                      alt={item.title}
                      fill
                      className="ed-media-lift object-cover transition-transform duration-700 group-hover:scale-[1.055]"
                      sizes="(max-width: 768px) 100vw, 33vw"
                    />
                    <div className="absolute inset-0 bg-[linear-gradient(0deg,rgba(21,19,16,0.82)_0%,rgba(21,19,16,0)_58%)]" />
                    <div className="absolute inset-x-0 bottom-0 p-5 text-[#f8f0e5]">
                      <p className="ed-eyebrow text-xs font-semibold uppercase text-[#e6c777]">
                        {item.type}
                      </p>
                      <h3 className="ed-card-title mt-2 font-serif text-2xl font-semibold">
                        {item.title}
                      </h3>
                    </div>
                  </div>
                </Link>
                </ScrollReveal>
              ))}
            </div>
          </div>
        </section>
      )}
    </main>
  );
}
