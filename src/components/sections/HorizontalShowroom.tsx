"use client";

import React, {
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
  useSyncExternalStore,
} from "react";
import Image from "next/image";
import Link from "next/link";
import {
  AlertCircle,
  ArrowRight,
  ArrowUpRight,
  CalendarDays,
  Camera,
  Check,
  LoaderCircle,
  MessageCircle,
  Phone,
  Search,
} from "lucide-react";
import { Navbar } from "@/components/layout/Navbar";
import { HeroScene } from "@/components/three/HeroScene";
import { AppointmentModal } from "@/components/ui/AppointmentModal";
import { CinematicIntro } from "@/components/ui/CinematicIntro";
import {
  PROJECT_STAGES,
  getProjectStageIndex,
  type ProjectStageState,
} from "@/data/project-tracking";
import { PROJECTS_DATA } from "@/data/projects";
import {
  BUSINESS_CONTACT,
  createProjectTrackingWhatsAppUrl,
  createWhatsAppUrl,
} from "@/lib/contact";
import { normalizeProjectCode } from "@/lib/project-code";
import type { ApiResponse } from "@/types/api";
import type { ProjectStatus, TrackedProject } from "@/types/projects";

type PanelId = "hero" | "services" | "projects" | "tracking" | "contact";
type LookupState = "idle" | "loading" | "found" | "empty" | "error";

const PANEL_IDS: PanelId[] = [
  "hero",
  "services",
  "projects",
  "tracking",
  "contact",
];

const PANEL_META: { id: PanelId; number: string; label: string }[] = [
  { id: "hero", number: "01", label: "Villa" },
  { id: "services", number: "02", label: "Hizmetler" },
  { id: "projects", number: "03", label: "Projeler" },
  { id: "tracking", number: "04", label: "Takip" },
  { id: "contact", number: "05", label: "İletişim" },
];

const SHOWROOM_SERVICES = [
  {
    number: "01",
    title: "İç Mimari Tasarım",
    description:
      "Mekânı kullanım alışkanlıklarınıza göre planlar, malzeme ve ışık kararlarını netleştiririz.",
  },
  {
    number: "02",
    title: "Mekanik Çözümler",
    description:
      "Isıtma, soğutma, havalandırma ve tesisat kararlarını mimari bütünlükle birlikte çözeriz.",
  },
  {
    number: "03",
    title: "Tadilat & Yenileme",
    description:
      "Mevcut alanı daha işlevli, güncel ve rafine bir yaşam ya da çalışma mekânına dönüştürürüz.",
  },
  {
    number: "04",
    title: "Uygulama",
    description:
      "Tasarımı sahaya indirir, imalat akışını ve detay çözümünü kontrollü biçimde yönetiriz.",
  },
  {
    number: "05",
    title: "Anahtar Teslim",
    description:
      "Planlamadan son kontrole kadar tüm süreci tek elden koordine ederek teslim ederiz.",
  },
];

const DESKTOP_QUERY = "(min-width: 768px)";
const REDUCED_MOTION_QUERY = "(prefers-reduced-motion: reduce)";

function clamp(value: number, min: number, max: number) {
  return Math.min(max, Math.max(min, value));
}

function subscribeToMediaQuery(query: string, callback: () => void) {
  if (typeof window === "undefined") return () => {};

  const media = window.matchMedia(query);
  media.addEventListener("change", callback);

  return () => media.removeEventListener("change", callback);
}

function getMediaQueryState(query: string) {
  if (typeof window === "undefined") return false;
  return window.matchMedia(query).matches;
}

function isPanelId(value: string): value is PanelId {
  return PANEL_IDS.includes(value as PanelId);
}

function getStageState(index: number, currentIndex: number): ProjectStageState {
  if (index < currentIndex) return "completed";
  if (index === currentIndex) return "active";
  return "upcoming";
}

function formatStageNumber(index: number) {
  return String(index + 1).padStart(2, "0");
}

function formatDate(value: string | null) {
  if (!value) return "Belirtilmedi";

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

export const HorizontalShowroom: React.FC = () => {
  const containerRef = useRef<HTMLDivElement>(null);
  const viewportRef = useRef<HTMLElement>(null);
  const trackRef = useRef<HTMLDivElement>(null);
  const currentXRef = useRef(0);
  const targetXRef = useRef(0);
  const maxXRef = useRef(0);
  const scrollStartRef = useRef(0);
  const sectionOffsetsRef = useRef<Record<PanelId, number>>({
    hero: 0,
    services: 0,
    projects: 0,
    tracking: 0,
    contact: 0,
  });
  const sectionWidthsRef = useRef<Record<PanelId, number>>({
    hero: 0,
    services: 0,
    projects: 0,
    tracking: 0,
    contact: 0,
  });
  const activePanelRef = useRef<PanelId>("hero");
  const [isAppointmentOpen, setIsAppointmentOpen] = useState(false);
  const [isIntroActive, setIsIntroActive] = useState(true);
  const [scrollHeight, setScrollHeight] = useState<number | null>(null);
  const [activePanel, setActivePanel] = useState<PanelId>("hero");
  const [activeServiceIndex, setActiveServiceIndex] = useState(0);
  const [progress, setProgress] = useState(0);

  const isDesktop = useSyncExternalStore(
    (callback) => subscribeToMediaQuery(DESKTOP_QUERY, callback),
    () => getMediaQueryState(DESKTOP_QUERY),
    () => false
  );

  const prefersReducedMotion = useSyncExternalStore(
    (callback) => subscribeToMediaQuery(REDUCED_MOTION_QUERY, callback),
    () => getMediaQueryState(REDUCED_MOTION_QUERY),
    () => false
  );

  useEffect(() => {
    activePanelRef.current = activePanel;
  }, [activePanel]);

  const setActivePanelSafely = useCallback((nextPanel: PanelId) => {
    setActivePanel((current) => {
      if (current === nextPanel) return current;
      return nextPanel;
    });
  }, []);

  const setActiveServiceSafely = useCallback((nextIndex: number) => {
    setActiveServiceIndex((current) => {
      if (current === nextIndex) return current;
      return nextIndex;
    });
  }, []);

  const updateMobileState = useCallback(() => {
    let nextPanel: PanelId = "hero";

    PANEL_IDS.forEach((panelId) => {
      const panel = document.getElementById(panelId);
      if (!panel) return;

      const rect = panel.getBoundingClientRect();
      if (rect.top <= window.innerHeight * 0.46) {
        nextPanel = panelId;
      }

      if (panelId === "services") {
        const serviceProgress = clamp(
          (window.innerHeight * 0.46 - rect.top) / Math.max(rect.height, 1),
          0,
          0.999
        );
        setActiveServiceSafely(
          Math.min(
            SHOWROOM_SERVICES.length - 1,
            Math.floor(serviceProgress * SHOWROOM_SERVICES.length)
          )
        );
      }
    });

    const maxScroll =
      document.documentElement.scrollHeight - window.innerHeight || 1;
    setProgress(clamp(window.scrollY / maxScroll, 0, 1));
    setActivePanelSafely(nextPanel);
  }, [setActivePanelSafely, setActiveServiceSafely]);

  const updateFromScroll = useCallback(() => {
    if (!isDesktop) {
      targetXRef.current = 0;
      currentXRef.current = 0;
      if (trackRef.current) {
        trackRef.current.style.transform = "translate3d(0, 0, 0)";
      }
      updateMobileState();
      return;
    }

    const range = maxXRef.current;
    const rawX = clamp(window.scrollY - scrollStartRef.current, 0, range);
    const nextProgress = range > 0 ? rawX / range : 0;

    targetXRef.current = -rawX;
    setProgress((current) =>
      Math.abs(current - nextProgress) > 0.002 ? nextProgress : current
    );

    const focusX = rawX + window.innerWidth * 0.46;
    let nextPanel: PanelId = "hero";

    PANEL_IDS.forEach((panelId) => {
      if (focusX >= sectionOffsetsRef.current[panelId] - 4) {
        nextPanel = panelId;
      }
    });

    const serviceStart = sectionOffsetsRef.current.services;
    const serviceWidth = Math.max(sectionWidthsRef.current.services, 1);
    const serviceProgress = clamp(
      (focusX - serviceStart) / serviceWidth,
      0,
      0.999
    );

    setActivePanelSafely(nextPanel);
    setActiveServiceSafely(
      Math.min(
        SHOWROOM_SERVICES.length - 1,
        Math.floor(serviceProgress * SHOWROOM_SERVICES.length)
      )
    );
  }, [
    isDesktop,
    setActivePanelSafely,
    setActiveServiceSafely,
    updateMobileState,
  ]);

  const measureHorizontalTrack = useCallback(() => {
    const container = containerRef.current;
    const track = trackRef.current;

    if (!container || !track || !isDesktop) {
      maxXRef.current = 0;
      setScrollHeight(null);
      updateFromScroll();
      return;
    }

    const viewportWidth = window.innerWidth;
    const viewportHeight = window.innerHeight;
    const nextOffsets = { ...sectionOffsetsRef.current };
    const nextWidths = { ...sectionWidthsRef.current };

    PANEL_IDS.forEach((panelId) => {
      const panel = track.querySelector<HTMLElement>(`[data-panel="${panelId}"]`);
      nextOffsets[panelId] = panel?.offsetLeft ?? 0;
      nextWidths[panelId] = panel?.offsetWidth ?? viewportWidth;
    });

    sectionOffsetsRef.current = nextOffsets;
    sectionWidthsRef.current = nextWidths;
    maxXRef.current = Math.max(0, track.scrollWidth - viewportWidth);
    scrollStartRef.current = container.offsetTop;
    setScrollHeight(maxXRef.current + viewportHeight);
    updateFromScroll();
  }, [isDesktop, updateFromScroll]);

  const scrollToPanel = useCallback(
    (panelId: PanelId) => {
      if (typeof window === "undefined") return;

      const hash = `#${panelId}`;
      if (window.location.hash !== hash) {
        window.history.replaceState(null, "", hash);
      }

      if (!isDesktop) {
        document.getElementById(panelId)?.scrollIntoView({
          block: "start",
          behavior: prefersReducedMotion ? "auto" : "smooth",
        });
        return;
      }

      const targetX = clamp(
        sectionOffsetsRef.current[panelId] ?? 0,
        0,
        maxXRef.current
      );

      window.scrollTo({
        top: scrollStartRef.current + targetX,
        behavior: prefersReducedMotion ? "auto" : "smooth",
      });
    },
    [isDesktop, prefersReducedMotion]
  );

  useEffect(() => {
    measureHorizontalTrack();

    const handleResize = () => {
      window.requestAnimationFrame(measureHorizontalTrack);
    };

    window.addEventListener("resize", handleResize);
    window.addEventListener("scroll", updateFromScroll, { passive: true });

    return () => {
      window.removeEventListener("resize", handleResize);
      window.removeEventListener("scroll", updateFromScroll);
    };
  }, [measureHorizontalTrack, updateFromScroll]);

  useEffect(() => {
    if (!isDesktop) {
      if (trackRef.current) {
        trackRef.current.style.transform = "translate3d(0, 0, 0)";
      }
      return;
    }

    let frameId = window.requestAnimationFrame(function animate() {
      const track = trackRef.current;
      if (track) {
        const targetX = targetXRef.current;
        const currentX = currentXRef.current;
        const nextX = prefersReducedMotion
          ? targetX
          : Math.abs(targetX - currentX) < 0.35
            ? targetX
            : currentX + (targetX - currentX) * 0.14;

        currentXRef.current = nextX;
        track.style.transform = `translate3d(${nextX}px, 0, 0)`;
      }

      frameId = window.requestAnimationFrame(animate);
    });

    return () => window.cancelAnimationFrame(frameId);
  }, [isDesktop, prefersReducedMotion]);

  useEffect(() => {
    const viewport = viewportRef.current;
    if (!viewport || !isDesktop) return;

    const handleWheel = (event: WheelEvent) => {
      if (Math.abs(event.deltaX) <= Math.abs(event.deltaY)) return;

      const scrollY = window.scrollY;
      const start = scrollStartRef.current;
      const end = start + maxXRef.current;

      if (scrollY < start - 2 || scrollY > end + 2) return;

      event.preventDefault();
      window.scrollBy({
        top: event.deltaX,
        behavior: "auto",
      });
    };

    viewport.addEventListener("wheel", handleWheel, { passive: false });

    return () => viewport.removeEventListener("wheel", handleWheel);
  }, [isDesktop]);

  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (!isDesktop) return;

      const target = event.target as HTMLElement | null;
      const targetTag = target?.tagName;
      const isFormField =
        targetTag === "INPUT" ||
        targetTag === "TEXTAREA" ||
        targetTag === "SELECT" ||
        Boolean(target?.isContentEditable);

      if (isFormField) return;

      const currentIndex = PANEL_IDS.indexOf(activePanelRef.current);

      if (event.key === "ArrowRight" || event.key === "PageDown") {
        event.preventDefault();
        scrollToPanel(PANEL_IDS[Math.min(PANEL_IDS.length - 1, currentIndex + 1)]);
      }

      if (event.key === "ArrowLeft" || event.key === "PageUp") {
        event.preventDefault();
        scrollToPanel(PANEL_IDS[Math.max(0, currentIndex - 1)]);
      }
    };

    window.addEventListener("keydown", handleKeyDown);

    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isDesktop, scrollToPanel]);

  useEffect(() => {
    const hashValue = window.location.hash.slice(1);
    if (!isPanelId(hashValue)) return;

    const timer = window.setTimeout(() => scrollToPanel(hashValue), 80);

    return () => window.clearTimeout(timer);
  }, [scrollToPanel]);

  const handleIntroComplete = useCallback(() => {
    setIsIntroActive(false);
  }, []);

  const openAppointment = useCallback(() => {
    setIsAppointmentOpen(true);
  }, []);

  const closeAppointment = useCallback(() => {
    setIsAppointmentOpen(false);
  }, []);

  return (
    <div className="relative bg-[#F6F2EA] text-[#102B49] selection:bg-[#9A5C2F] selection:text-white">
      <Navbar
        activeSection={activePanel}
        onNavigate={scrollToPanel}
        onOpenAppointment={openAppointment}
      />

      <CinematicIntro
        isIntroActive={isIntroActive}
        onComplete={handleIntroComplete}
      />

      <div
        ref={containerRef}
        className="relative"
        style={isDesktop && scrollHeight ? { height: `${scrollHeight}px` } : undefined}
      >
        <main
          ref={viewportRef}
          className="relative min-h-[100svh] overflow-hidden md:sticky md:top-0 md:h-[100svh]"
        >
          <div
            ref={trackRef}
            className="flex min-h-[100svh] flex-col will-change-transform md:h-[100svh] md:flex-row"
          >
            <HeroPanel
              isIntroActive={isIntroActive}
              onOpenAppointment={openAppointment}
              onNavigate={scrollToPanel}
            />
            <ServicesPanel activeServiceIndex={activeServiceIndex} />
            <ProjectsPanel />
            <TrackingPanel onOpenAppointment={openAppointment} />
            <ContactPanel onOpenAppointment={openAppointment} />
          </div>

          <ProgressIndicator
            activePanel={activePanel}
            progress={progress}
            onNavigate={scrollToPanel}
          />
        </main>
      </div>

      <AppointmentModal isOpen={isAppointmentOpen} onClose={closeAppointment} />
    </div>
  );
};

interface HeroPanelProps {
  isIntroActive: boolean;
  onOpenAppointment: () => void;
  onNavigate: (panelId: PanelId) => void;
}

const HeroPanel: React.FC<HeroPanelProps> = ({
  isIntroActive,
  onOpenAppointment,
  onNavigate,
}) => {
  return (
    <section
      id="hero"
      data-panel="hero"
      className="relative flex min-h-[100svh] w-full shrink-0 overflow-hidden bg-[#F6F2EA] px-5 pb-10 pt-28 text-[#102B49] sm:px-10 md:h-[100svh] md:min-w-[100vw] md:px-12 md:pb-12 md:pt-28 lg:px-16"
    >
      <div className="pointer-events-none absolute inset-0 bg-blueprint-light opacity-35" />
      <div className="pointer-events-none absolute inset-x-0 top-0 h-40 bg-gradient-to-b from-[#F6F2EA] to-transparent" />
      <div className="pointer-events-none absolute bottom-0 right-0 h-[42vh] w-[60vw] bg-[#9A5C2F]/10 blur-3xl" />

      <div className="relative z-10 mx-auto grid h-full w-full max-w-[1900px] grid-cols-1 items-center gap-8 md:grid-cols-[minmax(340px,0.42fr)_minmax(0,0.58fr)] md:gap-0">
        <div className="max-w-2xl md:pr-4">
          <div className="mb-7 flex items-center gap-3 text-xs font-semibold uppercase tracking-[0.22em] text-[#9A5C2F]">
            <span className="h-2 w-2 rounded-full bg-[#9A5C2F]" />
            <span>ERDEM DİZAYN & MEKANİK</span>
          </div>

          <h1 className="font-serif text-4xl font-semibold leading-[1.08] tracking-normal text-[#102B49] sm:text-5xl lg:text-6xl xl:text-7xl">
            Hayal ettiğiniz mekânı,
            <span className="block font-normal italic text-[#9A5C2F]">
              birlikte gerçeğe dönüştürelim.
            </span>
          </h1>

          <p className="mt-7 max-w-xl text-base leading-8 text-[#102B49]/76 sm:text-lg">
            İç mimari, mekanik çözüm ve saha uygulamasını tek masada buluşturan
            premium bir proje yolculuğu.
          </p>

          <div className="mt-9 flex flex-col gap-3 sm:flex-row sm:flex-wrap">
            <button
              type="button"
              onClick={onOpenAppointment}
              className="inline-flex min-h-12 cursor-pointer items-center justify-center gap-3 rounded-full bg-[#102B49] px-7 text-sm font-semibold uppercase tracking-[0.12em] text-[#F6F2EA] transition-colors duration-200 hover:bg-[#9A5C2F] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#9A5C2F]"
            >
              <CalendarDays className="h-4 w-4" />
              <span>Randevu Oluştur</span>
            </button>
            <button
              type="button"
              onClick={() => onNavigate("projects")}
              className="inline-flex min-h-12 cursor-pointer items-center justify-center gap-3 rounded-full border border-[#102B49]/25 bg-[#FBFAF7]/70 px-7 text-sm font-semibold uppercase tracking-[0.12em] text-[#102B49] transition-colors duration-200 hover:border-[#9A5C2F] hover:text-[#9A5C2F] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#9A5C2F]"
            >
              <span>Projeleri İncele</span>
              <ArrowRight className="h-4 w-4" />
            </button>
          </div>
        </div>

        <div className="relative h-[48vh] min-h-[360px] w-full md:h-[calc(100svh-6rem)] md:min-h-0 md:translate-x-8 lg:translate-x-16 xl:translate-x-24">
          <div className="absolute inset-x-4 bottom-6 h-px bg-[#102B49]/12 md:inset-x-0" />
          <HeroScene isIntroActive={isIntroActive} />
        </div>
      </div>
    </section>
  );
};

interface ServicesPanelProps {
  activeServiceIndex: number;
}

const ServicesPanel: React.FC<ServicesPanelProps> = ({ activeServiceIndex }) => {
  const activeService = SHOWROOM_SERVICES[activeServiceIndex];

  return (
    <section
      id="services"
      data-panel="services"
      className="relative flex min-h-[100svh] w-full shrink-0 overflow-hidden border-t border-[#102B49]/10 bg-[#FBFAF7] px-5 py-24 text-[#102B49] sm:px-10 md:h-[100svh] md:min-w-[120vw] md:border-l md:border-t-0 md:px-16 md:py-0"
    >
      <div className="pointer-events-none absolute inset-0 bg-blueprint-light opacity-25" />

      <div className="relative z-10 grid w-full grid-cols-1 gap-12 self-center md:grid-cols-[0.72fr_1fr] md:items-end md:gap-[7vw]">
        <div className="max-w-xl md:pb-[13vh]">
          <p className="text-xs font-semibold uppercase tracking-[0.24em] text-[#9A5C2F]">
            Hizmetler
          </p>
          <h2 className="mt-5 font-serif text-3xl font-semibold leading-tight tracking-normal text-[#102B49] sm:text-5xl lg:text-6xl">
            Tasarım, mekanik ve uygulama aynı hatta ilerler.
          </h2>
          <p className="mt-6 text-base leading-8 text-[#102B49]/68">
            Uzun listeler yerine, proje kararlarını bir mimari indeks gibi
            netleştiririz.
          </p>
        </div>

        <div className="border-y border-[#102B49]/12 py-9 md:mb-[12vh] md:max-w-3xl">
          <div className="flex items-start gap-6 sm:gap-9">
            <span className="font-serif text-6xl font-semibold leading-none text-[#9A5C2F]/70 sm:text-8xl lg:text-9xl">
              {activeService.number}
            </span>
            <div>
              <h3 className="font-serif text-4xl font-semibold leading-tight tracking-normal text-[#102B49] sm:text-6xl">
                {activeService.title}
              </h3>
              <p className="mt-6 max-w-2xl text-base leading-8 text-[#102B49]/76 sm:text-lg">
                {activeService.description}
              </p>
            </div>
          </div>

          <div className="mt-12 grid grid-cols-1 gap-4 sm:grid-cols-5">
            {SHOWROOM_SERVICES.map((service, index) => {
              const isActive = index === activeServiceIndex;

              return (
                <div
                  key={service.number}
                  className={`border-t pt-4 transition-colors duration-200 ${
                    isActive
                      ? "border-[#9A5C2F] text-[#102B49]"
                      : "border-[#102B49]/12 text-[#102B49]/45"
                  }`}
                >
                  <span className="block font-serif text-xl font-semibold">
                    {service.number}
                  </span>
                  <span className="mt-2 block text-xs font-semibold uppercase leading-5 tracking-[0.12em]">
                    {service.title}
                  </span>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
};

const ProjectsPanel: React.FC = () => {
  return (
    <section
      id="projects"
      data-panel="projects"
      className="relative flex min-h-[100svh] w-full shrink-0 overflow-hidden border-t border-[#102B49]/10 bg-[#F6F2EA] px-5 py-24 text-[#102B49] sm:px-10 md:h-[100svh] md:min-w-[140vw] md:border-l md:border-t-0 md:px-16 md:py-0"
    >
      <div className="pointer-events-none absolute inset-0 bg-blueprint-light opacity-20" />

      <div className="relative z-10 grid w-full grid-cols-1 gap-10 self-center md:grid-cols-[0.28fr_1fr] md:gap-[5vw]">
        <div className="max-w-md md:pt-[10vh]">
          <p className="text-xs font-semibold uppercase tracking-[0.24em] text-[#9A5C2F]">
            Seçili Projeler
          </p>
          <h2 className="mt-5 font-serif text-3xl font-semibold leading-tight tracking-normal text-[#102B49] sm:text-5xl">
            Bir galeri duvarı gibi; sadece işin kendisi konuşur.
          </h2>
        </div>

        <div className="flex flex-col gap-7 md:h-[74vh] md:flex-row md:items-center md:gap-[4vw] md:overflow-visible">
          {PROJECTS_DATA.map((project, index) => (
            <Link
              key={project.id}
              href={`/projeler/${project.slug}`}
              className={`group relative block shrink-0 overflow-hidden border border-[#102B49]/10 bg-[#102B49]/5 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[#9A5C2F] md:h-full ${
                index % 2 === 0 ? "md:w-[34vw]" : "md:w-[28vw] md:self-end"
              }`}
            >
              <Image
                src={project.image}
                alt={project.title}
                fill
                className="hidden object-cover transition-transform duration-700 ease-out group-hover:scale-[1.035] md:block"
                sizes="(max-width: 768px) 100vw, 34vw"
                priority={index === 0}
              />
              <Image
                src={project.image}
                alt={project.title}
                width={900}
                height={1100}
                className="aspect-[4/5] w-full object-cover md:hidden"
                sizes="100vw"
                priority={index === 0}
              />
              <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-[#0A1B2E]/86 via-[#0A1B2E]/28 to-transparent p-5 text-white sm:p-7">
                <h3 className="font-serif text-2xl font-semibold tracking-normal sm:text-3xl">
                  {project.title}
                </h3>
                <div className="mt-3 flex flex-wrap gap-x-4 gap-y-2 text-xs font-semibold uppercase tracking-[0.14em] text-white/72">
                  <span>{project.type}</span>
                  <span>{project.location}</span>
                </div>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
};

interface TrackingPanelProps {
  onOpenAppointment: () => void;
}

const TrackingPanel: React.FC<TrackingPanelProps> = ({ onOpenAppointment }) => {
  const [projectCode, setProjectCode] = useState("");
  const [submittedCode, setSubmittedCode] = useState("");
  const [selectedProject, setSelectedProject] = useState<TrackedProject | null>(
    null
  );
  const [lookupState, setLookupState] = useState<LookupState>("idle");

  const currentStageIndex = selectedProject
    ? getProjectStageIndex(selectedProject.currentStage)
    : -1;
  const visibleProjectCode =
    selectedProject?.projectCode || submittedCode || normalizeProjectCode(projectCode);
  const whatsappUrl = createProjectTrackingWhatsAppUrl(
    visibleProjectCode || "ERD-XXXXX"
  );

  const timelineByStage = useMemo(() => {
    const entries =
      selectedProject?.timeline.map(
        (update) =>
          [update.stage, update] as [
            ProjectStatus,
            TrackedProject["timeline"][number],
          ]
      ) ?? [];

    return new Map(entries);
  }, [selectedProject]);

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    if (lookupState === "loading") return;

    const normalizedCode = normalizeProjectCode(projectCode);

    setSubmittedCode(normalizedCode);
    setSelectedProject(null);
    setLookupState("loading");

    try {
      const response = await fetch(
        `/api/projects/${encodeURIComponent(normalizedCode)}`,
        { method: "GET" }
      );
      const result = (await response.json().catch(() => null)) as
        | ApiResponse<TrackedProject>
        | null;

      if (
        response.status === 400 ||
        response.status === 404 ||
        (!result?.ok &&
          (result?.error.code === "PROJECT_NOT_FOUND" ||
            result?.error.code === "INVALID_PROJECT_CODE"))
      ) {
        setLookupState("empty");
        return;
      }

      if (!response.ok || !result?.ok) {
        throw new Error("Project lookup failed.");
      }

      setSelectedProject(result.data);
      setSubmittedCode(result.data.projectCode);
      setLookupState("found");
    } catch {
      setLookupState("error");
    }
  };

  return (
    <section
      id="tracking"
      data-panel="tracking"
      className="relative flex min-h-[100svh] w-full shrink-0 overflow-hidden border-t border-[#102B49]/10 bg-[#102B49] px-5 py-24 text-[#F6F2EA] sm:px-10 md:h-[100svh] md:min-w-[110vw] md:border-l md:border-t-0 md:px-16 md:py-0"
    >
      <div className="pointer-events-none absolute inset-0 bg-blueprint-dark opacity-25" />
      <div className="pointer-events-none absolute right-[-8rem] top-[-8rem] h-96 w-96 rounded-full border border-white/10" />

      <div className="relative z-10 grid w-full grid-cols-1 gap-10 self-center md:grid-cols-[0.42fr_0.58fr] md:items-center md:gap-[5vw]">
        <div className="max-w-xl">
          <p className="text-xs font-semibold uppercase tracking-[0.24em] text-[#B8733E]">
            Projem Nerede?
          </p>
          <h2 className="mt-5 font-serif text-4xl font-semibold leading-tight tracking-normal text-white sm:text-6xl">
            Projenizin hangi aşamada olduğunu tek bakışta görün.
          </h2>

          <form
            onSubmit={handleSubmit}
            className="mt-9 grid grid-cols-1 gap-3 sm:grid-cols-[1fr_auto]"
          >
            <label className="block">
              <span className="mb-2 block text-xs font-semibold uppercase tracking-[0.16em] text-white/62">
                Proje Kodu
              </span>
              <input
                type="text"
                value={projectCode}
                onChange={(event) => setProjectCode(event.target.value)}
                autoComplete="off"
                autoCapitalize="characters"
                placeholder="ERD-24018"
                disabled={lookupState === "loading"}
                className="min-h-12 w-full rounded-lg border border-white/15 bg-white px-4 text-sm font-semibold uppercase tracking-[0.08em] text-[#102B49] shadow-sm transition-colors placeholder:text-[#102B49]/35 focus:border-[#B8733E] focus:outline-none focus:ring-2 focus:ring-[#B8733E]/25 disabled:cursor-not-allowed disabled:opacity-65"
              />
            </label>

            <button
              type="submit"
              disabled={lookupState === "loading"}
              className="inline-flex min-h-12 cursor-pointer items-center justify-center gap-2 self-end rounded-full bg-[#B8733E] px-6 text-sm font-semibold uppercase tracking-[0.12em] text-white transition-colors duration-200 hover:bg-[#9A5C2F] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#B8733E] disabled:cursor-not-allowed disabled:bg-[#B8733E]/60"
            >
              {lookupState === "loading" ? (
                <LoaderCircle className="h-4 w-4 animate-spin" />
              ) : (
                <Search className="h-4 w-4" />
              )}
              <span>
                {lookupState === "loading"
                  ? "Kontrol Ediliyor"
                  : "Projemi Görüntüle"}
              </span>
            </button>
          </form>
        </div>

        <div className="min-h-[360px] border-y border-white/12 py-7 md:min-h-[56vh] md:py-9">
          <div aria-live="polite">
            {lookupState === "idle" && (
              <div className="flex min-h-[260px] flex-col justify-center">
                <p className="max-w-lg text-lg leading-8 text-white/72">
                  Proje kodunuzu girin; planlama, tasarım, uygulama ve teslim
                  akışını aynı panelde görüntüleyin.
                </p>
                <div className="mt-10 grid grid-cols-7 gap-2">
                  {PROJECT_STAGES.map((stage, index) => (
                    <span
                      key={stage.id}
                      className="h-1 rounded-full bg-white/15"
                      aria-label={`${formatStageNumber(index)} ${stage.label}`}
                    />
                  ))}
                </div>
              </div>
            )}

            {lookupState === "loading" && (
              <div
                role="status"
                className="flex min-h-[260px] items-center gap-3 text-sm font-semibold uppercase tracking-[0.16em] text-white/70"
              >
                <LoaderCircle className="h-5 w-5 animate-spin text-[#B8733E]" />
                <span>Projeniz kontrol ediliyor</span>
              </div>
            )}

            {(lookupState === "empty" || lookupState === "error") && (
              <div
                role="status"
                className="flex min-h-[260px] flex-col justify-center text-white"
              >
                <div className="flex gap-3">
                  <AlertCircle className="mt-1 h-5 w-5 shrink-0 text-[#B8733E]" />
                  <div>
                    <p className="font-serif text-2xl font-semibold">
                      Bu kodla eşleşen bir proje bulunamadı.
                    </p>
                    <p className="mt-3 max-w-lg text-sm leading-7 text-white/68">
                      Proje kodunuzu kontrol edin veya doğrudan bize yazın.
                    </p>
                  </div>
                </div>
                <a
                  href={whatsappUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="mt-7 inline-flex min-h-12 w-fit items-center justify-center gap-2 rounded-full border border-white/15 px-6 text-sm font-semibold text-white transition-colors duration-200 hover:border-[#B8733E] hover:text-[#B8733E] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#B8733E]"
                >
                  <MessageCircle className="h-4 w-4" />
                  <span>WhatsApp&apos;tan Sor</span>
                </a>
              </div>
            )}

            {selectedProject && (
              <div>
                <div className="grid grid-cols-1 gap-4 sm:grid-cols-4">
                  {[
                    ["Proje", selectedProject.title],
                    ["Konum", selectedProject.location ?? "Belirtilmedi"],
                    ["Başlangıç", formatDate(selectedProject.startDate)],
                    ["İlerleme", `${selectedProject.progress}%`],
                  ].map(([label, value]) => (
                    <div key={label} className="border-t border-white/15 pt-4">
                      <span className="block text-[10px] font-semibold uppercase tracking-[0.2em] text-[#B8733E]">
                        {label}
                      </span>
                      <span className="mt-2 block text-sm font-semibold text-white">
                        {value}
                      </span>
                    </div>
                  ))}
                </div>

                <div className="mt-8">
                  <div className="mb-2 flex items-center justify-between text-xs font-semibold uppercase tracking-[0.14em] text-white/60">
                    <span>Güncel aşama</span>
                    <span>{selectedProject.currentStageLabel}</span>
                  </div>
                  <div className="h-1.5 overflow-hidden rounded-full bg-white/12">
                    <div
                      className="h-full rounded-full bg-[#B8733E]"
                      style={{
                        width: `${Math.min(
                          100,
                          Math.max(0, selectedProject.progress)
                        )}%`,
                      }}
                    />
                  </div>
                </div>

                <ol className="mt-9 grid grid-cols-1 gap-3 lg:grid-cols-7">
                  {PROJECT_STAGES.map((stage, index) => {
                    const state = getStageState(index, currentStageIndex);
                    const isCompleted = state === "completed";
                    const isActive = state === "active";
                    const update = timelineByStage.get(stage.id);

                    return (
                      <li
                        key={stage.id}
                        aria-current={isActive ? "step" : undefined}
                        className={`min-h-36 border-t pt-4 ${
                          isActive
                            ? "border-[#B8733E] text-white"
                            : isCompleted
                              ? "border-white/45 text-white/80"
                              : "border-white/15 text-white/42"
                        }`}
                      >
                        <div className="flex items-center gap-2">
                          <span
                            className={`flex h-8 w-8 items-center justify-center rounded-full border text-[11px] font-bold ${
                              isCompleted
                                ? "border-white bg-white text-[#102B49]"
                                : isActive
                                  ? "border-[#B8733E] bg-[#B8733E] text-white"
                                  : "border-white/18"
                            }`}
                          >
                            {isCompleted ? (
                              <Check className="h-4 w-4" />
                            ) : (
                              formatStageNumber(index)
                            )}
                          </span>
                          <span className="text-[10px] font-semibold uppercase tracking-[0.16em]">
                            {stage.label}
                          </span>
                        </div>
                        <p className="mt-3 text-xs leading-6">
                          {update?.description ?? stage.description}
                        </p>
                      </li>
                    );
                  })}
                </ol>

                {selectedProject.publicNote && (
                  <p className="mt-7 max-w-2xl border-l border-[#B8733E] pl-4 text-sm leading-7 text-white/72">
                    {selectedProject.publicNote}
                  </p>
                )}

                <div className="mt-7 flex flex-col gap-3 sm:flex-row">
                  <a
                    href={whatsappUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex min-h-12 items-center justify-center gap-2 rounded-full bg-[#B8733E] px-6 text-sm font-semibold text-white transition-colors duration-200 hover:bg-[#9A5C2F] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#B8733E]"
                  >
                    <MessageCircle className="h-4 w-4" />
                    <span>WhatsApp&apos;tan Sor</span>
                  </a>
                  <button
                    type="button"
                    onClick={onOpenAppointment}
                    className="inline-flex min-h-12 cursor-pointer items-center justify-center gap-2 rounded-full border border-white/18 px-6 text-sm font-semibold text-white transition-colors duration-200 hover:border-[#B8733E] hover:text-[#B8733E] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#B8733E]"
                  >
                    <CalendarDays className="h-4 w-4" />
                    <span>Randevu Oluştur</span>
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </section>
  );
};

interface ContactPanelProps {
  onOpenAppointment: () => void;
}

const ContactPanel: React.FC<ContactPanelProps> = ({ onOpenAppointment }) => {
  return (
    <section
      id="contact"
      data-panel="contact"
      className="relative flex min-h-[100svh] w-full shrink-0 overflow-hidden border-t border-[#102B49]/10 bg-[#F6F2EA] px-5 pb-24 pt-28 text-[#102B49] sm:px-10 md:h-[100svh] md:min-w-[100vw] md:border-l md:border-t-0 md:px-16 md:py-0"
    >
      <div className="pointer-events-none absolute inset-0 bg-blueprint-light opacity-30" />
      <div className="pointer-events-none absolute bottom-0 left-0 h-1/2 w-full bg-gradient-to-t from-[#102B49]/10 to-transparent" />

      <div className="relative z-10 grid w-full grid-cols-1 gap-10 self-center md:grid-cols-[0.68fr_0.32fr] md:items-end md:gap-[5vw]">
        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.24em] text-[#9A5C2F]">
            İletişim
          </p>
          <h2 className="mt-5 max-w-5xl font-serif text-4xl font-semibold leading-tight tracking-normal text-[#102B49] sm:text-6xl lg:text-7xl">
            Bir fikriniz varsa,
            <span className="block font-normal italic text-[#9A5C2F]">
              konuşarak başlayalım.
            </span>
          </h2>

          <div className="mt-10 flex flex-col gap-3 sm:flex-row sm:flex-wrap">
            <button
              type="button"
              onClick={onOpenAppointment}
              className="inline-flex min-h-12 cursor-pointer items-center justify-center gap-2 rounded-full bg-[#102B49] px-7 text-sm font-semibold uppercase tracking-[0.12em] text-[#F6F2EA] transition-colors duration-200 hover:bg-[#9A5C2F] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#9A5C2F]"
            >
              <CalendarDays className="h-4 w-4" />
              <span>Randevu Oluştur</span>
            </button>
            <a
              href={createWhatsAppUrl()}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex min-h-12 items-center justify-center gap-2 rounded-full border border-[#102B49]/20 bg-[#FBFAF7]/70 px-7 text-sm font-semibold uppercase tracking-[0.12em] text-[#102B49] transition-colors duration-200 hover:border-[#9A5C2F] hover:text-[#9A5C2F] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#9A5C2F]"
            >
              <MessageCircle className="h-4 w-4" />
              <span>WhatsApp&apos;tan Yaz</span>
            </a>
            <a
              href={BUSINESS_CONTACT.instagramUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex min-h-12 items-center justify-center gap-2 rounded-full border border-[#102B49]/20 bg-[#FBFAF7]/70 px-7 text-sm font-semibold uppercase tracking-[0.12em] text-[#102B49] transition-colors duration-200 hover:border-[#9A5C2F] hover:text-[#9A5C2F] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#9A5C2F]"
            >
              <Camera className="h-4 w-4" />
              <span>Instagram</span>
              <ArrowUpRight className="h-4 w-4" />
            </a>
          </div>
        </div>

        <div className="border-y border-[#102B49]/12 py-7">
          <a
            href={BUSINESS_CONTACT.phoneHref}
            className="flex min-h-11 items-center gap-3 text-base font-semibold text-[#102B49] transition-colors duration-200 hover:text-[#9A5C2F] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[#9A5C2F]"
          >
            <Phone className="h-5 w-5 text-[#9A5C2F]" />
            <span>{BUSINESS_CONTACT.phoneDisplay}</span>
          </a>
          <p className="mt-6 text-sm leading-7 text-[#102B49]/66">
            Mesajınızı doğrudan WhatsApp üzerinden iletebilir ya da randevu
            formuyla uygun görüşme zamanınızı paylaşabilirsiniz.
          </p>
          <div className="mt-12 flex items-center justify-between text-xs uppercase tracking-[0.18em] text-[#102B49]/42">
            <span>Erdem Dizayn & Mekanik</span>
            <span>{new Date().getFullYear()}</span>
          </div>
        </div>
      </div>
    </section>
  );
};

interface ProgressIndicatorProps {
  activePanel: PanelId;
  progress: number;
  onNavigate: (panelId: PanelId) => void;
}

const ProgressIndicator: React.FC<ProgressIndicatorProps> = ({
  activePanel,
  progress,
  onNavigate,
}) => {
  return (
    <div className="pointer-events-none absolute inset-x-8 bottom-6 z-30 hidden md:block">
      <div className="relative h-px overflow-hidden bg-[#102B49]/15">
        <div
          className="h-full bg-[#9A5C2F]"
          style={{ width: `${clamp(progress, 0, 1) * 100}%` }}
        />
      </div>
      <ol className="mt-3 flex items-center justify-between">
        {PANEL_META.map((panel) => {
          const isActive = panel.id === activePanel;

          return (
            <li key={panel.id}>
              <button
                type="button"
                onClick={() => onNavigate(panel.id)}
                className={`pointer-events-auto min-h-11 cursor-pointer text-left text-[10px] font-semibold uppercase tracking-[0.18em] transition-colors duration-200 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[#9A5C2F] ${
                  isActive ? "text-[#102B49]" : "text-[#102B49]/42 hover:text-[#9A5C2F]"
                }`}
              >
                <span className="font-serif text-base">{panel.number}</span>
                <span className="ml-2">{panel.label}</span>
              </button>
            </li>
          );
        })}
      </ol>
    </div>
  );
};
