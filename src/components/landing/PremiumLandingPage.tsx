"use client";

import React, {
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
  useSyncExternalStore,
} from "react";
import dynamic from "next/dynamic";
import Image from "next/image";
import Link from "next/link";
import {
  AnimatePresence,
  motion,
  useReducedMotion,
} from "framer-motion";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import {
  ArrowDownRight,
  ArrowRight,
  ArrowUpRight,
  CalendarDays,
  Camera,
  Check,
  CheckCircle2,
  Layers3,
  LoaderCircle,
  Menu,
  MessageCircle,
  Phone,
  Search,
  Sparkles,
  X,
} from "lucide-react";
import { useLenisController } from "@/components/providers/LenisProvider";
import type { InteriorHeroSceneProps } from "@/components/three/InteriorHeroScene";
import { AppointmentModal } from "@/components/ui/AppointmentModal";
import {
  PROJECT_STAGES,
  getProjectStageIndex,
  type ProjectStageState,
} from "@/data/project-tracking";
import { PROJECTS_DATA } from "@/data/projects";
import { SERVICES_DATA } from "@/data/services";
import {
  BUSINESS_CONTACT,
  createProjectTrackingWhatsAppUrl,
  createWhatsAppUrl,
} from "@/lib/contact";
import { normalizeProjectCode } from "@/lib/project-code";
import type { ApiResponse } from "@/types/api";
import type { ProjectStatus, TrackedProject } from "@/types/projects";

const LazyInteriorHeroScene = dynamic<InteriorHeroSceneProps>(
  () =>
    import("@/components/three/InteriorHeroScene").then(
      (module) => module.InteriorHeroScene
    ),
  {
    ssr: false,
    loading: () => <StaticInteriorScene />,
  }
);

const SECTION_IDS = [
  "hero",
  "about",
  "projects",
  "services",
  "tracking",
  "contact",
] as const;

type SectionId = (typeof SECTION_IDS)[number];
type LookupState = "idle" | "loading" | "found" | "empty" | "error";

const NAV_LINKS: { label: string; target: SectionId }[] = [
  { label: "Yaklaşım", target: "about" },
  { label: "Projeler", target: "projects" },
  { label: "Hizmetler", target: "services" },
  { label: "Takip", target: "tracking" },
  { label: "İletişim", target: "contact" },
];

const NEXT_SECTION: Record<SectionId, SectionId> = {
  hero: "about",
  about: "projects",
  projects: "services",
  services: "tracking",
  tracking: "contact",
  contact: "hero",
};

const HERO_CHAPTERS = [
  {
    number: "01",
    label: "Eşik",
    title: "Mekân kapıdan değil, ışığın ritminden başlar.",
    body: "Kamera ilk adımda hacmi okur; kütle, gölge ve malzeme aynı sessizlikte belirir.",
  },
  {
    number: "02",
    label: "Salon",
    title: "Oranlar sakinleşir, yaşam senaryosu öne çıkar.",
    body: "Mobilya, dolaşım ve yüzeyler gündelik hayatın temposuna göre dengelenir.",
  },
  {
    number: "03",
    label: "Detay",
    title: "Bakır çizgi, mekanik gerçek ve zanaat aynı düzlemde buluşur.",
    body: "Görünmeyen altyapı, görünen atmosfer kadar dikkatle tasarlanır.",
  },
  {
    number: "04",
    label: "Teslim",
    title: "Son kadraj, çizimdeki fikri sahada korunmuş halde gösterir.",
    body: "Tasarımdan uygulamaya tek muhatap, kontrollü ritim ve net teslim.",
  },
];

const METRICS = [
  { value: "12+", label: "yıl saha ve tasarım disiplini" },
  { value: "05", label: "entegre hizmet başlığı" },
  { value: "01", label: "tek merkezden yönetilen süreç" },
];

const MANIFESTO_LINES = [
  "Işığın yönü değişmeden mobilya konuşulmaz.",
  "Mekanik karar estetikten ayrı bir teknik not değildir.",
  "Malzeme seçimi yalnızca renk değil; ses, temas ve ömür meselesidir.",
  "Uygulama ritmi tasarım dilinin son cümlesidir.",
];

const PROCESS_STEPS = [
  {
    number: "01",
    label: "Dinleme",
    title: "Mekânın günlük akışını okuruz.",
    body: "Kullanım, ışık, depolama, ıslak hacim ve mekanik ihtiyaçlar tek masada netleşir.",
  },
  {
    number: "02",
    label: "Kurgu",
    title: "Konsepti uygulanabilir plana indiririz.",
    body: "Malzeme, ölçü, bütçe, detay ve takvim aynı tasarım kararının parçası olur.",
  },
  {
    number: "03",
    label: "Saha",
    title: "Çizimdeki fikri üretimde koruruz.",
    body: "Ekip koordinasyonu, mekanik altyapı ve son kontroller tek merkezden izlenir.",
  },
];

const DESKTOP_QUERY = "(min-width: 768px)";
const MOBILE_QUERY = "(max-width: 767px)";
const REDUCED_MOTION_QUERY = "(prefers-reduced-motion: reduce)";
const emptySubscribe = () => () => {};

interface RevealProps {
  children: React.ReactNode;
  className?: string;
  delay?: number;
  amount?: number;
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

function useMediaQuery(query: string, serverSnapshot = false) {
  return useSyncExternalStore(
    (callback) => subscribeToMediaQuery(query, callback),
    () => getMediaQueryState(query),
    () => serverSnapshot
  );
}

function isSectionId(value: string): value is SectionId {
  return SECTION_IDS.includes(value as SectionId);
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

function Reveal({
  children,
  className = "",
  delay = 0,
  amount = 0.22,
}: RevealProps) {
  const shouldReduceMotion = useReducedMotion();

  return (
    <motion.div
      initial={shouldReduceMotion ? false : { opacity: 0, y: 18 }}
      whileInView={shouldReduceMotion ? undefined : { opacity: 1, y: 0 }}
      viewport={{ once: true, amount }}
      transition={{ duration: 0.56, delay, ease: [0.16, 1, 0.3, 1] }}
      className={className}
      data-cinema-reveal
    >
      {children}
    </motion.div>
  );
}

function StaticInteriorScene() {
  return (
    <div
      aria-hidden="true"
      className="relative h-full min-h-[28rem] w-full overflow-hidden bg-[#151310]"
    >
      <div className="absolute inset-0 bg-architectural-grid-dark opacity-30" />
      <div className="absolute inset-x-[8%] top-[12%] h-[56%] border border-[#f8f0e5]/10 bg-[#f8f0e5]/4" />
      <div className="absolute bottom-[15%] left-[10%] h-[40%] w-[76%] -skew-x-6 bg-[#ccbda9]/16 shadow-[0_70px_160px_rgba(0,0,0,0.44)]" />
      <div className="absolute bottom-[32%] left-[18%] h-[16%] w-[31%] bg-[#221f1b]" />
      <div className="absolute bottom-[46%] left-[19%] h-[13%] w-[32%] bg-[#322d27]" />
      <div className="absolute bottom-[36%] left-[56%] h-[3%] w-[22%] bg-[#b9854d]" />
      <div className="absolute bottom-[28%] left-[64%] h-[22%] w-[1.1%] bg-[#6b6054]" />
      <div className="absolute right-[22%] top-[17%] h-[38%] w-px bg-[#d5a85f]/55" />
      <div className="absolute right-[26%] top-[17%] h-[38%] w-px bg-[#d5a85f]/34" />
      <div className="absolute right-[30%] top-[17%] h-[38%] w-px bg-[#d5a85f]/24" />
      <div className="absolute right-[12%] top-[8%] h-40 w-px rotate-12 bg-[#f8f0e5]/24" />
      <div className="absolute inset-x-0 bottom-0 h-2/3 bg-[linear-gradient(0deg,rgba(21,19,16,0.98)_0%,rgba(21,19,16,0)_100%)]" />
    </div>
  );
}

function Magnetic({
  children,
  className = "",
}: React.PropsWithChildren<{ className?: string }>) {
  const ref = useRef<HTMLDivElement>(null);
  const shouldReduceMotion = useReducedMotion();

  const handlePointerMove = (event: React.PointerEvent<HTMLDivElement>) => {
    if (shouldReduceMotion || window.matchMedia("(pointer: coarse)").matches) {
      return;
    }

    const rect = event.currentTarget.getBoundingClientRect();
    const x = ((event.clientX - rect.left) / rect.width - 0.5) * 8;
    const y = ((event.clientY - rect.top) / rect.height - 0.5) * 6;

    ref.current?.style.setProperty(
      "transform",
      `translate3d(${x}px, ${y}px, 0)`
    );
  };

  const handlePointerLeave = () => {
    ref.current?.style.setProperty("transform", "translate3d(0, 0, 0)");
  };

  return (
    <div
      ref={ref}
      onPointerMove={handlePointerMove}
      onPointerLeave={handlePointerLeave}
      className={`magnetic-wrap ${className}`}
    >
      {children}
    </div>
  );
}

interface SpatialNavProps {
  activeSection: SectionId;
  onNavigate: (target: SectionId) => void;
  onOpenAppointment: () => void;
}

function SpatialNav({
  activeSection,
  onNavigate,
  onOpenAppointment,
}: SpatialNavProps) {
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 32);
    handleScroll();
    window.addEventListener("scroll", handleScroll, { passive: true });

    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const navigate = (target: SectionId) => {
    setMobileOpen(false);
    onNavigate(target);
  };

  return (
    <header
      className={`fixed inset-x-0 top-0 z-50 transition-all duration-500 ${
        scrolled || mobileOpen
          ? "border-b border-[#f8f0e5]/10 bg-[#151310]/82 py-3 shadow-[0_24px_80px_rgba(0,0,0,0.24)] backdrop-blur-xl"
          : "py-5"
      }`}
    >
      <div className="mx-auto flex max-w-[1760px] items-center justify-between px-5 sm:px-8 lg:px-12">
        <button
          type="button"
          onClick={() => navigate("hero")}
          data-cursor="Başla"
          className="group flex min-h-11 cursor-pointer items-center gap-3 text-left text-[#f8f0e5]"
          aria-label="Erdem Dizayn ana bölüme git"
        >
          <span className="grid h-10 w-10 place-items-center border border-[#f8f0e5]/18 bg-[#f8f0e5]/8 font-serif text-sm font-semibold backdrop-blur-md transition-colors group-hover:border-[#c8a34c] group-hover:text-[#e6c777]">
            ED
          </span>
          <span className="flex flex-col leading-none">
            <span className="font-serif text-base font-semibold sm:text-lg">
              ERDEM DİZAYN
            </span>
            <span className="mt-1 text-[10px] font-semibold uppercase text-[#c8a34c]">
              İç Mimarlık ve Mekanik
            </span>
          </span>
        </button>

        <nav className="hidden items-center gap-7 lg:flex" aria-label="Ana menü">
          {NAV_LINKS.map((link) => {
            const isActive = activeSection === link.target;

            return (
              <button
                key={link.target}
                type="button"
                onClick={() => navigate(link.target)}
                aria-current={isActive ? "page" : undefined}
                data-cursor="Git"
                className={`ed-link cursor-pointer py-3 text-xs font-semibold uppercase transition-colors ${
                  isActive
                    ? "text-[#f8f0e5]"
                    : "text-[#f8f0e5]/58 hover:text-[#f8f0e5]"
                }`}
              >
                {link.label}
              </button>
            );
          })}
        </nav>

        <div className="hidden items-center gap-3 lg:flex">
          <a
            href={BUSINESS_CONTACT.instagramUrl}
            target="_blank"
            rel="noopener noreferrer"
            aria-label="Instagram profilini aç"
            data-cursor="İncele"
            className="ed-interactive grid h-11 w-11 place-items-center rounded-full border border-[#f8f0e5]/18 text-[#f8f0e5] transition-colors hover:border-[#c8a34c] hover:text-[#e6c777]"
          >
            <Camera className="h-4 w-4" />
          </a>
          <Magnetic>
            <button
              type="button"
              onClick={onOpenAppointment}
              data-cursor="Planla"
              className="ed-button inline-flex min-h-11 cursor-pointer items-center gap-2 rounded-full bg-[#c8a34c] px-5 text-xs font-semibold uppercase text-[#151310] transition-colors hover:bg-[#e6c777]"
            >
              <CalendarDays className="h-4 w-4" />
              <span>Randevu</span>
            </button>
          </Magnetic>
        </div>

        <button
          type="button"
          onClick={() => setMobileOpen((open) => !open)}
          className="ed-interactive grid h-11 w-11 cursor-pointer place-items-center rounded-full border border-[#f8f0e5]/18 bg-[#f8f0e5]/8 text-[#f8f0e5] backdrop-blur-md lg:hidden"
          aria-label={mobileOpen ? "Menüyü kapat" : "Menüyü aç"}
          aria-expanded={mobileOpen}
        >
          {mobileOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
        </button>
      </div>

      <AnimatePresence>
        {mobileOpen && (
          <motion.div
            initial={{ opacity: 0, y: -14 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -14 }}
            transition={{ duration: 0.24, ease: [0.16, 1, 0.3, 1] }}
            className="px-4 lg:hidden"
          >
            <div className="mt-3 border border-[#f8f0e5]/12 bg-[#151310]/96 p-4 shadow-2xl">
              <nav className="flex flex-col" aria-label="Mobil menü">
                {NAV_LINKS.map((link) => (
                  <button
                    key={link.target}
                    type="button"
                    onClick={() => navigate(link.target)}
                    className="ed-interactive min-h-12 cursor-pointer border-b border-[#f8f0e5]/10 px-2 py-3 text-left text-sm font-semibold uppercase text-[#f8f0e5]"
                  >
                    {link.label}
                  </button>
                ))}
              </nav>
              <button
                type="button"
                onClick={() => {
                  setMobileOpen(false);
                  onOpenAppointment();
                }}
                className="ed-button mt-4 inline-flex min-h-12 w-full cursor-pointer items-center justify-center gap-2 rounded-full bg-[#c8a34c] px-5 text-sm font-semibold text-[#151310]"
              >
                <CalendarDays className="h-4 w-4" />
                <span>Randevu Oluştur</span>
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
}

interface HeroSectionProps {
  heroRef: React.RefObject<HTMLElement | null>;
  stageRef: React.RefObject<HTMLDivElement | null>;
  progressRef: React.MutableRefObject<number>;
  spatialEnabled: boolean;
  activeChapter: number;
  onNavigate: (target: SectionId) => void;
  onOpenAppointment: () => void;
}

function HeroSection({
  heroRef,
  stageRef,
  progressRef,
  spatialEnabled,
  activeChapter,
  onNavigate,
  onOpenAppointment,
}: HeroSectionProps) {
  const isMobile = useMediaQuery(MOBILE_QUERY);
  const shouldReduceMotion = useReducedMotion();
  const mounted = useSyncExternalStore(
    emptySubscribe,
    () => true,
    () => false
  );
  const showStaticScene = !mounted || isMobile || shouldReduceMotion;
  const chapter = HERO_CHAPTERS[activeChapter] ?? HERO_CHAPTERS[0];

  return (
    <section
      id="hero"
      ref={heroRef}
      className={`relative overflow-hidden bg-[#151310] text-[#f8f0e5] ${
        spatialEnabled ? "min-h-[320svh]" : "min-h-[100svh]"
      }`}
    >
      <div
        ref={stageRef}
        className="relative flex min-h-[100svh] overflow-hidden"
      >
        <div className="absolute inset-0">
          {showStaticScene ? (
            <StaticInteriorScene />
          ) : (
            <LazyInteriorHeroScene progressRef={progressRef} />
          )}
        </div>

        <div
          data-hero-drape
          className="pointer-events-none absolute inset-0 bg-[linear-gradient(90deg,rgba(21,19,16,0.96)_0%,rgba(21,19,16,0.72)_39%,rgba(21,19,16,0.22)_73%,rgba(21,19,16,0.72)_100%)]"
        />
        <div className="pointer-events-none absolute inset-x-0 bottom-0 h-2/3 bg-[linear-gradient(0deg,rgba(21,19,16,0.98)_0%,rgba(21,19,16,0)_100%)]" />
        <div className="spatial-noise pointer-events-none absolute inset-0 opacity-[0.09]" />

        <div className="relative z-10 mx-auto flex min-h-[100svh] w-full max-w-[1760px] flex-col justify-end px-5 pb-7 pt-28 sm:px-8 sm:pb-10 lg:px-12">
          <div className="grid grid-cols-1 gap-10 lg:grid-cols-12 lg:items-end">
            <div data-hero-copy className="max-w-6xl lg:col-span-8">
              <motion.div
                initial={shouldReduceMotion ? false : { opacity: 0, y: 18 }}
                animate={shouldReduceMotion ? undefined : { opacity: 1, y: 0 }}
                transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
                className="ed-eyebrow mb-6 inline-flex items-center gap-3 text-xs font-semibold uppercase text-[#d5a85f]"
              >
                <span className="h-px w-12 bg-[#c8a34c]" />
                <span>İç mimari · mekanik · anahtar teslim</span>
              </motion.div>

              <h1 className="ed-display-title hero-title-line font-serif text-6xl font-semibold leading-[0.88] sm:text-7xl md:text-8xl xl:text-9xl 2xl:text-[10rem]">
                Erdem
                <span className="block font-normal italic text-[#e6c777]">
                  Dizayn
                </span>
              </h1>

              <p className="ed-body-copy mt-7 max-w-2xl text-base font-light leading-8 text-[#f8f0e5]/76 sm:text-lg lg:text-xl lg:leading-9">
                Tasarım fikrini; ışık, malzeme, mekanik altyapı ve saha
                uygulamasıyla tek bir mekân deneyimine dönüştürüyoruz.
              </p>

              <div className="mt-9 flex flex-col gap-3 sm:flex-row sm:flex-wrap">
                <Magnetic>
                  <button
                    type="button"
                    onClick={onOpenAppointment}
                    data-cursor="Planla"
                    className="ed-button inline-flex min-h-12 cursor-pointer items-center justify-center gap-3 rounded-full bg-[#c8a34c] px-7 text-sm font-semibold uppercase text-[#151310] transition-colors hover:bg-[#e6c777]"
                  >
                    <CalendarDays className="h-4 w-4" />
                    <span>Randevu Oluştur</span>
                  </button>
                </Magnetic>
                <Magnetic>
                  <button
                    type="button"
                    onClick={() => onNavigate("projects")}
                    data-cursor="Bak"
                    className="ed-interactive inline-flex min-h-12 cursor-pointer items-center justify-center gap-3 rounded-full border border-[#f8f0e5]/22 px-7 text-sm font-semibold uppercase text-[#f8f0e5] transition-colors hover:border-[#e6c777] hover:text-[#e6c777]"
                  >
                    <span>Projeleri İncele</span>
                    <ArrowRight className="h-4 w-4" />
                  </button>
                </Magnetic>
              </div>
            </div>

            <aside className="hidden lg:col-span-4 lg:block">
              <AnimatePresence mode="wait">
                <motion.div
                  key={chapter.number}
                  initial={
                    shouldReduceMotion ? false : { opacity: 0, y: 24, x: 18 }
                  }
                  animate={
                    shouldReduceMotion ? undefined : { opacity: 1, y: 0, x: 0 }
                  }
                  exit={
                    shouldReduceMotion ? undefined : { opacity: 0, y: -20, x: -12 }
                  }
                  transition={{ duration: 0.48, ease: [0.16, 1, 0.3, 1] }}
                  className="ml-auto max-w-sm border-y border-[#f8f0e5]/14 py-6"
                >
                  <div className="mb-5 flex items-center justify-between text-xs font-semibold uppercase text-[#e6c777]">
                    <span>{chapter.label}</span>
                    <span>{chapter.number}</span>
                  </div>
                  <h2 className="ed-panel-title font-serif text-3xl font-semibold leading-tight">
                    {chapter.title}
                  </h2>
                  <p className="mt-4 text-sm font-light leading-7 text-[#f8f0e5]/64">
                    {chapter.body}
                  </p>
                </motion.div>
              </AnimatePresence>
            </aside>
          </div>

          <div className="mt-10 h-px w-full bg-[#f8f0e5]/14" />

          <div className="mt-5 grid gap-4 sm:grid-cols-3">
            {METRICS.map((metric) => (
              <div
                key={metric.label}
                data-hero-metric
                className="grid grid-cols-[auto_1fr] items-end gap-4"
              >
                <span className="font-serif text-4xl font-semibold leading-none text-[#e6c777]">
                  {metric.value}
                </span>
                <span className="ed-data-label max-w-[12rem] pb-1 text-xs font-semibold uppercase leading-5 text-[#f8f0e5]/58">
                  {metric.label}
                </span>
              </div>
            ))}
          </div>

          <div className="mt-7 flex items-center justify-between gap-5 text-[10px] font-semibold uppercase text-[#f8f0e5]/44">
            <span>Eşikten teslime</span>
            <div className="h-px flex-1 overflow-hidden bg-[#f8f0e5]/12">
              <div
                data-hero-progress
                className="h-full origin-left scale-x-0 bg-[#c8a34c]"
              />
            </div>
            <button
              type="button"
              onClick={() => onNavigate("about")}
              data-cursor="Kay"
              className="ed-interactive grid h-10 w-10 cursor-pointer place-items-center rounded-full border border-[#f8f0e5]/14 text-[#e6c777] transition-colors hover:border-[#c8a34c] hover:bg-[#c8a34c] hover:text-[#151310]"
              aria-label="Sonraki bölüme git"
            >
              <ArrowDownRight className="h-4 w-4" />
            </button>
          </div>
        </div>
      </div>
    </section>
  );
}

function ManifestoSection() {
  return (
    <section
      id="about"
      className="ed-section-shell relative overflow-hidden bg-[#f8f0e5] px-5 py-24 text-[#151310] sm:px-8 sm:py-32 lg:px-12"
    >
      <div className="pointer-events-none absolute inset-0 bg-architectural-grid opacity-35" />
      <div className="relative z-10 mx-auto max-w-[1520px]">
        <Reveal>
          <div className="grid grid-cols-1 gap-12 lg:grid-cols-12 lg:items-end">
            <div className="lg:col-span-8">
              <div className="ed-eyebrow mb-6 inline-flex items-center gap-3 text-xs font-semibold uppercase text-[#8e5533]">
                <Sparkles className="h-4 w-4" />
                <span>Yaklaşım</span>
              </div>
              <h2 className="ed-section-title max-w-6xl font-serif text-5xl font-semibold leading-[1.02] sm:text-7xl lg:text-8xl">
                Bir mekânı önce görünür kılmayız; önce hissettiririz.
              </h2>
            </div>
            <p className="ed-body-copy max-w-xl text-base font-light leading-8 text-[#151310]/68 sm:text-lg lg:col-span-4">
              Erdem Dizayn; konut, ofis ve ticari alanlarda iç mimari
              tasarımı, mekanik koordinasyonu ve uygulama sürecini tek ritimde
              yönetir. Sonuç yalnızca güzel bir yüzey değil, içinde yaşanabilen
              dengeli bir atmosfer olur.
            </p>
          </div>
        </Reveal>

        <div className="mt-16 grid grid-cols-1 gap-px bg-[#151310]/10 md:grid-cols-4">
          {MANIFESTO_LINES.map((line, index) => (
            <Reveal key={line} delay={index * 0.05}>
              <article className="ed-card-lift min-h-52 bg-[#fbfaf7] p-6 transition-colors duration-300 hover:bg-[#151310] hover:text-[#f8f0e5]">
                <span className="font-serif text-4xl font-semibold text-[#a0613a]">
                  {formatStageNumber(index)}
                </span>
                <p className="ed-body-copy mt-8 text-lg font-light leading-8">{line}</p>
              </article>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}

function ProcessSection() {
  return (
    <section className="ed-section-shell relative overflow-hidden bg-[#151310] px-5 py-24 text-[#f8f0e5] sm:px-8 sm:py-32 lg:px-12">
      <div className="pointer-events-none absolute inset-0 bg-architectural-grid-dark opacity-25" />
      <div className="relative z-10 mx-auto max-w-[1520px]">
        <div className="grid grid-cols-1 gap-12 lg:grid-cols-12">
          <Reveal className="lg:col-span-5">
            <div className="sticky top-28">
              <div className="ed-eyebrow mb-6 inline-flex items-center gap-3 text-xs font-semibold uppercase text-[#d5a85f]">
                <Layers3 className="h-4 w-4" />
                <span>Süreç</span>
              </div>
              <h2 className="ed-section-title-sm font-serif text-5xl font-semibold leading-[1.04] sm:text-6xl">
                Tasarım kararları sahada nefesini kaybetmez.
              </h2>
            </div>
          </Reveal>

          <div className="lg:col-span-7">
            {PROCESS_STEPS.map((step, index) => (
              <Reveal key={step.number} delay={index * 0.06}>
                <article className="ed-card-lift group grid grid-cols-1 gap-6 border-t border-[#f8f0e5]/14 py-10 transition-colors duration-300 hover:border-[#c8a34c] sm:grid-cols-[9rem_1fr]">
                  <div>
                    <span className="font-serif text-5xl font-semibold text-[#d5a85f]/70">
                      {step.number}
                    </span>
                    <p className="mt-2 text-xs font-semibold uppercase text-[#f8f0e5]/44">
                      {step.label}
                    </p>
                  </div>
                  <div>
                    <h3 className="ed-card-title font-serif text-3xl font-semibold leading-tight sm:text-4xl">
                      {step.title}
                    </h3>
                    <p className="ed-body-copy mt-4 max-w-2xl text-base font-light leading-8 text-[#f8f0e5]/64">
                      {step.body}
                    </p>
                  </div>
                </article>
              </Reveal>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

function ProjectCard({
  project,
  index,
}: {
  project: (typeof PROJECTS_DATA)[number];
  index: number;
}) {
  const shouldReduceMotion = useReducedMotion();

  const handlePointerMove = (event: React.PointerEvent<HTMLAnchorElement>) => {
    if (shouldReduceMotion || window.matchMedia("(pointer: coarse)").matches) {
      return;
    }

    const rect = event.currentTarget.getBoundingClientRect();
    const x = (event.clientX - rect.left) / rect.width;
    const y = (event.clientY - rect.top) / rect.height;

    event.currentTarget.style.setProperty("--tilt-rx", `${(0.5 - y) * 7}deg`);
    event.currentTarget.style.setProperty("--tilt-ry", `${(x - 0.5) * 9}deg`);
    event.currentTarget.style.setProperty("--tilt-x", `${x * 100}%`);
    event.currentTarget.style.setProperty("--tilt-y", `${y * 100}%`);
  };

  const handlePointerLeave = (event: React.PointerEvent<HTMLAnchorElement>) => {
    event.currentTarget.style.setProperty("--tilt-rx", "0deg");
    event.currentTarget.style.setProperty("--tilt-ry", "0deg");
    event.currentTarget.style.setProperty("--tilt-x", "50%");
    event.currentTarget.style.setProperty("--tilt-y", "50%");
  };

  return (
    <Link
      href={`/projeler/${project.slug}`}
      data-cursor="Gir"
      onPointerMove={handlePointerMove}
      onPointerLeave={handlePointerLeave}
      className={`project-tilt-card group block ${
        index % 2 === 0 ? "lg:mt-0" : "lg:mt-24"
      }`}
    >
      <div className="project-tilt-inner relative aspect-[4/5] overflow-hidden bg-[#151310]">
        <Image
          src={project.image}
          alt={project.title}
          fill
          className="ed-media-lift object-cover transition-transform duration-700 ease-out group-hover:scale-[1.055]"
          sizes="(max-width: 768px) 100vw, 50vw"
          priority={index === 0}
        />
        <div className="absolute inset-0 bg-[linear-gradient(0deg,rgba(21,19,16,0.86)_0%,rgba(21,19,16,0.08)_62%,rgba(21,19,16,0.18)_100%)]" />
        <div className="project-tilt-glow absolute inset-0 opacity-0 transition-opacity duration-500 group-hover:opacity-100" />
        <div className="absolute inset-x-0 bottom-0 p-5 text-[#f8f0e5] sm:p-7">
          <p className="ed-eyebrow text-xs font-semibold uppercase text-[#e6c777]">
            {project.type} · {project.location}
          </p>
          <h3 className="ed-card-title mt-3 max-w-xl font-serif text-3xl font-semibold leading-tight sm:text-5xl">
            {project.title}
          </h3>
          <p className="ed-body-copy-sm mt-4 max-w-xl text-sm font-light leading-7 text-[#f8f0e5]/68">
            {project.summary}
          </p>
          <span className="mt-6 inline-flex min-h-11 items-center gap-2 text-sm font-semibold uppercase text-[#f8f0e5]">
            İçine gir
            <ArrowUpRight className="h-4 w-4 transition-transform duration-300 group-hover:translate-x-1 group-hover:-translate-y-1" />
          </span>
        </div>
      </div>
    </Link>
  );
}

function ProjectsSection() {
  return (
    <section
      id="projects"
      className="ed-section-shell relative overflow-hidden bg-[#f8f0e5] px-5 py-24 text-[#151310] sm:px-8 sm:py-32 lg:px-12"
    >
      <div className="relative z-10 mx-auto max-w-[1520px]">
        <Reveal>
          <div className="mb-14 grid grid-cols-1 gap-10 border-b border-[#151310]/10 pb-8 lg:grid-cols-12 lg:items-end">
            <div className="lg:col-span-8">
              <span className="ed-eyebrow text-xs font-semibold uppercase text-[#8e5533]">
                Seçili projeler
              </span>
              <h2 className="ed-section-title mt-5 max-w-5xl font-serif text-5xl font-semibold leading-[1.02] sm:text-7xl">
                Görsele bakmak değil, atmosferin içine yaklaşmak.
              </h2>
            </div>
            <p className="ed-body-copy max-w-xl text-base font-light leading-8 text-[#151310]/64 lg:col-span-4">
              Büyük format görseller, yavaş hareket ve derinlik hissiyle her
              projeyi ayrı bir mekân kapısı gibi ele alır.
            </p>
          </div>
        </Reveal>

        <div className="grid grid-cols-1 gap-7 lg:grid-cols-2 lg:gap-10">
          {PROJECTS_DATA.map((project, index) => (
            <Reveal key={project.id} delay={(index % 2) * 0.08}>
              <ProjectCard project={project} index={index} />
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}

function ServicesSection({
  onOpenAppointment,
}: {
  onOpenAppointment: () => void;
}) {
  return (
    <section
      id="services"
      className="ed-section-shell relative overflow-hidden bg-[#ede2d2] px-5 py-24 text-[#151310] sm:px-8 sm:py-32 lg:px-12"
    >
      <div className="pointer-events-none absolute inset-0 bg-architectural-grid opacity-30" />
      <div className="relative z-10 mx-auto max-w-[1520px]">
        <Reveal>
          <div className="mb-12 grid grid-cols-1 gap-10 lg:grid-cols-12 lg:items-end">
            <div className="lg:col-span-7">
              <span className="ed-eyebrow text-xs font-semibold uppercase text-[#8e5533]">
                Hizmetler
              </span>
              <h2 className="ed-section-title mt-5 font-serif text-5xl font-semibold leading-[1.04] sm:text-7xl">
                İç mimari, mekanik ve uygulama aynı nefeste.
              </h2>
            </div>
            <div className="lg:col-span-5">
              <p className="ed-body-copy max-w-xl text-base font-light leading-8 text-[#151310]/68">
                Her başlık ayrı bir ekip karmaşasına dönüşmeden, ölçülebilir ve
                izlenebilir bir sürece bağlanır.
              </p>
              <Magnetic className="mt-7 inline-flex">
                <button
                  type="button"
                  onClick={onOpenAppointment}
                  data-cursor="Planla"
                  className="ed-button inline-flex min-h-12 cursor-pointer items-center justify-center gap-2 rounded-full bg-[#151310] px-7 text-sm font-semibold uppercase text-[#f8f0e5] transition-colors hover:bg-[#8e5533]"
                >
                  <CalendarDays className="h-4 w-4" />
                  <span>Randevu Oluştur</span>
                </button>
              </Magnetic>
            </div>
          </div>
        </Reveal>

        <div className="divide-y divide-[#151310]/12 border-y border-[#151310]/12 bg-[#f8f0e5]/34">
          {SERVICES_DATA.map((service, index) => (
            <Reveal key={service.id} delay={index * 0.035}>
              <article className="ed-card-lift group grid grid-cols-1 gap-6 px-0 py-8 transition-colors duration-300 hover:bg-[#151310] hover:text-[#f8f0e5] sm:grid-cols-[8rem_1fr] lg:grid-cols-12 lg:gap-10">
                <span className="font-serif text-5xl font-semibold text-[#a0613a] group-hover:text-[#e6c777] lg:col-span-2">
                  {service.number}
                </span>
                <div className="lg:col-span-4">
                  <h3 className="ed-card-title font-serif text-3xl font-semibold leading-tight">
                    {service.title}
                  </h3>
                  <p className="ed-body-copy mt-4 text-base font-light leading-8 text-[#151310]/66 group-hover:text-[#f8f0e5]/66">
                    {service.description}
                  </p>
                </div>
                <ul className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:col-span-6">
                  {service.details.map((detail) => (
                    <li
                      key={detail}
                      className="flex min-h-8 items-center gap-2 text-sm font-semibold"
                    >
                      <Check className="h-4 w-4 shrink-0 text-[#a0613a] group-hover:text-[#e6c777]" />
                      <span>{detail}</span>
                    </li>
                  ))}
                </ul>
              </article>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}

function TrackingSection({
  onOpenAppointment,
}: {
  onOpenAppointment: () => void;
}) {
  const [projectCode, setProjectCode] = useState("");
  const [submittedCode, setSubmittedCode] = useState("");
  const [selectedProject, setSelectedProject] = useState<TrackedProject | null>(
    null
  );
  const [lookupState, setLookupState] = useState<LookupState>("idle");

  const currentStageIndex = selectedProject
    ? getProjectStageIndex(selectedProject.currentStage)
    : -1;
  const currentStage =
    currentStageIndex >= 0 ? PROJECT_STAGES[currentStageIndex] : null;
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
      className="ed-section-shell relative overflow-hidden bg-[#151310] px-5 py-24 text-[#f8f0e5] sm:px-8 sm:py-32 lg:px-12"
    >
      <div className="pointer-events-none absolute inset-0 bg-architectural-grid-dark opacity-24" />
      <div className="relative z-10 mx-auto grid max-w-[1520px] grid-cols-1 gap-12 lg:grid-cols-12 lg:items-start">
        <Reveal className="lg:col-span-5">
          <span className="ed-eyebrow text-xs font-semibold uppercase text-[#d5a85f]">
            Projem Nerede?
          </span>
          <h2 className="ed-section-title mt-5 font-serif text-5xl font-semibold leading-[1.04] sm:text-7xl">
            Saha ritmini görünür kılan sakin bir takip paneli.
          </h2>
          <p className="ed-body-copy mt-6 max-w-xl text-base font-light leading-8 text-[#f8f0e5]/64">
            Proje kodunuzu girin; planlamadan teslime kadar güncel aşamayı ve
            sonraki adımı tek bakışta görün.
          </p>

          <form
            onSubmit={handleSubmit}
            data-lenis-prevent
            className="mt-9 grid grid-cols-1 gap-3 sm:grid-cols-[1fr_auto]"
          >
            <label className="block">
              <span className="mb-2 block text-xs font-semibold uppercase text-[#f8f0e5]/58">
                Proje kodu
              </span>
              <input
                type="text"
                value={projectCode}
                onChange={(event) => setProjectCode(event.target.value)}
                autoComplete="off"
                autoCapitalize="characters"
                placeholder="ERD-24018"
                disabled={lookupState === "loading"}
                className="min-h-12 w-full border border-[#f8f0e5]/14 bg-[#f8f0e5] px-4 text-sm font-semibold uppercase text-[#151310] shadow-sm transition-colors placeholder:text-[#151310]/35 focus:border-[#c8a34c] focus:outline-none focus:ring-2 focus:ring-[#c8a34c]/24 disabled:cursor-not-allowed disabled:opacity-65"
              />
            </label>

            <button
              type="submit"
              disabled={lookupState === "loading"}
              data-cursor="Görüntüle"
              className="ed-button inline-flex min-h-12 cursor-pointer items-center justify-center gap-2 self-end rounded-full bg-[#c8a34c] px-6 text-sm font-semibold uppercase text-[#151310] transition-colors hover:bg-[#e6c777] disabled:cursor-not-allowed disabled:bg-[#c8a34c]/60"
            >
              {lookupState === "loading" ? (
                <LoaderCircle className="h-4 w-4 animate-spin" />
              ) : (
                <Search className="h-4 w-4" />
              )}
              <span>{lookupState === "loading" ? "Kontrol" : "Görüntüle"}</span>
            </button>
          </form>
        </Reveal>

        <Reveal delay={0.1} className="lg:col-span-7">
          <div className="min-h-[28rem] border-y border-[#f8f0e5]/14 py-7">
            {lookupState === "idle" && (
              <div className="flex min-h-[22rem] flex-col justify-center">
                <div className="grid grid-cols-7 gap-2">
                  {PROJECT_STAGES.map((stage, index) => (
                    <span
                      key={stage.id}
                      className="h-1.5 bg-[#f8f0e5]/14"
                      aria-label={`${formatStageNumber(index)} ${stage.label}`}
                    />
                  ))}
                </div>
                <p className="ed-body-copy mt-8 max-w-xl text-lg font-light leading-8 text-[#f8f0e5]/72">
                  Kod girildiğinde proje akışı, aktif aşama ve saha notları bu
                  panelde açılır.
                </p>
              </div>
            )}

            {lookupState === "loading" && (
              <div
                role="status"
                className="flex min-h-[22rem] items-center gap-3 text-sm font-semibold uppercase text-[#f8f0e5]/70"
              >
                <LoaderCircle className="h-5 w-5 animate-spin text-[#e6c777]" />
                <span>Projeniz kontrol ediliyor</span>
              </div>
            )}

            {(lookupState === "empty" || lookupState === "error") && (
              <div
                role="status"
                className="flex min-h-[22rem] flex-col justify-center"
              >
                <p className="ed-panel-title font-serif text-3xl font-semibold text-[#f8f0e5]">
                  Bu kodla eşleşen bir proje bulunamadı.
                </p>
                <p className="mt-3 max-w-lg text-sm leading-7 text-[#f8f0e5]/68">
                  Proje kodunuzu kontrol edin veya doğrudan bize yazın.
                </p>
                <a
                  href={whatsappUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  data-cursor="Yaz"
                  className="mt-7 inline-flex min-h-12 w-fit items-center justify-center gap-2 rounded-full border border-[#f8f0e5]/18 px-6 text-sm font-semibold text-[#f8f0e5] transition-colors hover:border-[#e6c777] hover:text-[#e6c777]"
                >
                  <MessageCircle className="h-4 w-4" />
                  <span>WhatsApp&apos;tan Sor</span>
                </a>
              </div>
            )}

            {selectedProject && currentStage && (
              <div>
                <div className="grid grid-cols-1 gap-4 sm:grid-cols-4">
                  {[
                    ["Proje", selectedProject.title],
                    ["Konum", selectedProject.location ?? "Belirtilmedi"],
                    ["Başlangıç", formatDate(selectedProject.startDate)],
                    ["İlerleme", `${selectedProject.progress}%`],
                  ].map(([label, value]) => (
                    <div key={label} className="border-t border-[#f8f0e5]/15 pt-4">
                      <span className="ed-data-label block text-[10px] font-semibold uppercase text-[#e6c777]">
                        {label}
                      </span>
                      <span className="mt-2 block text-sm font-semibold text-[#f8f0e5]">
                        {value}
                      </span>
                    </div>
                  ))}
                </div>

                <div className="mt-8">
                  <div className="mb-2 flex items-center justify-between text-xs font-semibold uppercase text-[#f8f0e5]/60">
                    <span>Güncel aşama</span>
                    <span>{selectedProject.currentStageLabel}</span>
                  </div>
                  <div className="h-1.5 overflow-hidden rounded-full bg-[#f8f0e5]/12">
                    <div
                      className="h-full rounded-full bg-[#c8a34c]"
                      style={{
                        width: `${Math.min(
                          100,
                          Math.max(0, selectedProject.progress)
                        )}%`,
                      }}
                    />
                  </div>
                </div>

                <p className="mt-7 flex items-start gap-3 border-l border-[#e6c777] pl-4 text-sm leading-7 text-[#f8f0e5]/72">
                  <CheckCircle2 className="mt-1 h-4 w-4 shrink-0 text-[#e6c777]" />
                  <span>{currentStage.activeText}</span>
                </p>

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
                            ? "border-[#e6c777] text-[#f8f0e5]"
                            : isCompleted
                              ? "border-[#f8f0e5]/45 text-[#f8f0e5]/80"
                              : "border-[#f8f0e5]/15 text-[#f8f0e5]/42"
                        }`}
                      >
                        <div className="flex items-center gap-2">
                          <span
                            className={`grid h-8 w-8 place-items-center rounded-full border text-[11px] font-bold ${
                              isCompleted
                                ? "border-[#f8f0e5] bg-[#f8f0e5] text-[#151310]"
                                : isActive
                                  ? "border-[#c8a34c] bg-[#c8a34c] text-[#151310]"
                                  : "border-[#f8f0e5]/18"
                            }`}
                          >
                            {isCompleted ? (
                              <Check className="h-4 w-4" />
                            ) : (
                              formatStageNumber(index)
                            )}
                          </span>
                          <span className="ed-data-label text-[10px] font-semibold uppercase">
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

                <div className="mt-7 flex flex-col gap-3 sm:flex-row">
                  <a
                    href={whatsappUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    data-cursor="Yaz"
                    className="ed-button inline-flex min-h-12 items-center justify-center gap-2 rounded-full bg-[#c8a34c] px-6 text-sm font-semibold text-[#151310] transition-colors hover:bg-[#e6c777]"
                  >
                    <MessageCircle className="h-4 w-4" />
                    <span>WhatsApp&apos;tan Sor</span>
                  </a>
                  <button
                    type="button"
                    onClick={onOpenAppointment}
                    data-cursor="Planla"
                    className="ed-interactive inline-flex min-h-12 cursor-pointer items-center justify-center gap-2 rounded-full border border-[#f8f0e5]/18 px-6 text-sm font-semibold text-[#f8f0e5] transition-colors hover:border-[#e6c777] hover:text-[#e6c777]"
                  >
                    <CalendarDays className="h-4 w-4" />
                    <span>Randevu Oluştur</span>
                  </button>
                </div>
              </div>
            )}
          </div>
        </Reveal>
      </div>
    </section>
  );
}

function ContactSection({ onOpenAppointment }: { onOpenAppointment: () => void }) {
  return (
    <section
      id="contact"
      className="ed-section-shell relative overflow-hidden bg-[#f8f0e5] px-5 py-24 text-[#151310] sm:px-8 sm:py-32 lg:px-12"
    >
      <div className="pointer-events-none absolute inset-0 bg-architectural-grid opacity-35" />
      <div className="relative z-10 mx-auto grid max-w-[1520px] grid-cols-1 gap-12 lg:grid-cols-12 lg:items-end">
        <Reveal className="lg:col-span-8">
          <span className="ed-eyebrow text-xs font-semibold uppercase text-[#8e5533]">
            İletişim
          </span>
          <h2 className="ed-section-title mt-5 font-serif text-5xl font-semibold leading-[1.04] sm:text-7xl lg:text-8xl">
            Mekân fikriniz varsa, ilk çizgiyi birlikte atalım.
          </h2>
          <p className="ed-body-copy mt-7 max-w-2xl text-base font-light leading-8 text-[#151310]/68 sm:text-lg">
            Yeni bir konut, yenileme, ofis ya da mekanik ihtiyaç için kapsamı,
            öncelikleri ve en doğru başlangıcı netleştirelim.
          </p>
          <div className="mt-9 flex flex-col gap-3 sm:flex-row sm:flex-wrap">
            <Magnetic>
              <button
                type="button"
                onClick={onOpenAppointment}
                data-cursor="Planla"
                className="ed-button inline-flex min-h-12 cursor-pointer items-center justify-center gap-2 rounded-full bg-[#151310] px-7 text-sm font-semibold uppercase text-[#f8f0e5] transition-colors hover:bg-[#8e5533]"
              >
                <CalendarDays className="h-4 w-4" />
                <span>Randevu Oluştur</span>
              </button>
            </Magnetic>
            <a
              href={createWhatsAppUrl()}
              target="_blank"
              rel="noopener noreferrer"
              data-cursor="Yaz"
              className="ed-interactive inline-flex min-h-12 items-center justify-center gap-2 rounded-full border border-[#151310]/18 px-7 text-sm font-semibold uppercase text-[#151310] transition-colors hover:border-[#8e5533] hover:text-[#8e5533]"
            >
              <MessageCircle className="h-4 w-4" />
              <span>WhatsApp</span>
            </a>
          </div>
        </Reveal>

        <Reveal delay={0.1} className="lg:col-span-4">
          <div className="border-y border-[#151310]/12 py-7">
            <a
              href={BUSINESS_CONTACT.phoneHref}
              data-cursor="Ara"
              className="ed-link mb-5 flex min-h-11 items-center gap-3 text-base font-semibold text-[#151310] transition-colors hover:text-[#8e5533]"
            >
              <Phone className="h-5 w-5 text-[#8e5533]" />
              <span>{BUSINESS_CONTACT.phoneDisplay}</span>
            </a>
            <a
              href={createWhatsAppUrl()}
              target="_blank"
              rel="noopener noreferrer"
              data-cursor="Yaz"
              className="ed-link mb-5 flex min-h-11 items-center gap-3 text-base font-semibold text-[#151310] transition-colors hover:text-[#8e5533]"
            >
              <MessageCircle className="h-5 w-5 text-[#8e5533]" />
              <span>WhatsApp&apos;tan yaz</span>
              <ArrowUpRight className="h-4 w-4" />
            </a>
            <a
              href={BUSINESS_CONTACT.instagramUrl}
              target="_blank"
              rel="noopener noreferrer"
              data-cursor="İncele"
              className="ed-link flex min-h-11 items-center gap-3 text-base font-semibold text-[#151310] transition-colors hover:text-[#8e5533]"
            >
              <Camera className="h-5 w-5 text-[#8e5533]" />
              <span>Instagram&apos;da inceleyin</span>
              <ArrowUpRight className="h-4 w-4" />
            </a>
          </div>
        </Reveal>
      </div>
    </section>
  );
}

function LandingFooter({ onNavigate }: { onNavigate: (target: SectionId) => void }) {
  return (
    <footer className="bg-[#151310] px-5 py-10 text-[#f8f0e5] sm:px-8 lg:px-12">
      <div className="mx-auto flex max-w-[1520px] flex-col gap-6 border-t border-[#f8f0e5]/12 pt-8 md:flex-row md:items-center md:justify-between">
        <div>
          <p className="font-serif text-xl font-semibold">ERDEM DİZAYN</p>
          <p className="mt-2 text-sm font-light text-[#f8f0e5]/55">
            İç mimari, mekanik koordinasyon ve anahtar teslim uygulama.
          </p>
        </div>
        <div className="flex flex-wrap gap-x-5 gap-y-3">
          {NAV_LINKS.map((link) => (
            <button
              key={link.target}
              type="button"
              onClick={() => onNavigate(link.target)}
              data-cursor="Git"
              className="ed-link min-h-8 cursor-pointer text-sm font-semibold text-[#f8f0e5]/64 transition-colors hover:text-[#e6c777]"
            >
              {link.label}
            </button>
          ))}
        </div>
      </div>
    </footer>
  );
}

export function PremiumLandingPage() {
  const { lenis, scrollTo } = useLenisController();
  const pageRef = useRef<HTMLDivElement>(null);
  const heroRef = useRef<HTMLElement>(null);
  const heroStageRef = useRef<HTMLDivElement>(null);
  const heroProgressRef = useRef(0);
  const [activeSection, setActiveSection] = useState<SectionId>("hero");
  const [activeChapter, setActiveChapter] = useState(0);
  const [appointmentOpen, setAppointmentOpen] = useState(false);
  const isDesktop = useMediaQuery(DESKTOP_QUERY);
  const shouldReduceMotion = useReducedMotion();
  const spatialEnabled = isDesktop && !shouldReduceMotion;

  const navigateTo = useCallback(
    (target: SectionId) => {
      setActiveSection(target);
      scrollTo(`#${target}`, {
        offset: target === "hero" ? 0 : -76,
        immediate:
          typeof window !== "undefined" &&
          window.matchMedia(REDUCED_MOTION_QUERY).matches,
      });
    },
    [scrollTo]
  );

  useEffect(() => {
    if (typeof window === "undefined") return;

    gsap.registerPlugin(ScrollTrigger);

    const removeLenisUpdate = lenis?.on("scroll", ScrollTrigger.update);
    const context = gsap.context(() => {
      if (spatialEnabled && heroRef.current && heroStageRef.current) {
        const setProgress = (progress: number) => {
          heroProgressRef.current = progress;
          const nextChapter = Math.min(
            HERO_CHAPTERS.length - 1,
            Math.floor(progress * HERO_CHAPTERS.length)
          );

          setActiveChapter((current) =>
            current === nextChapter ? current : nextChapter
          );
        };

        gsap
          .timeline({
            defaults: { ease: "none" },
            scrollTrigger: {
              trigger: heroRef.current,
              start: "top top",
              end: "bottom bottom",
              pin: heroStageRef.current,
              scrub: 0.9,
              anticipatePin: 1,
              invalidateOnRefresh: true,
              onRefresh: (self) => setProgress(self.progress),
              onUpdate: (self) => setProgress(self.progress),
            },
          })
          .to("[data-hero-progress]", { scaleX: 1, duration: 1 }, 0)
          .to("[data-hero-copy]", { yPercent: -8, duration: 1 }, 0)
          .to(
            "[data-hero-drape]",
            { opacity: 0.82, duration: 0.3 },
            0.44
          )
          .to(
            "[data-hero-metric]",
            { y: -22, autoAlpha: 0.48, stagger: 0.08, duration: 0.32 },
            0.58
          );
      } else {
        heroProgressRef.current = 0;
        setActiveChapter(0);
      }

      gsap.utils.toArray<HTMLElement>("[data-cinematic-band]").forEach((band) => {
        gsap.fromTo(
          band,
          { yPercent: 8 },
          {
            yPercent: -8,
            ease: "none",
            scrollTrigger: {
              trigger: band,
              start: "top bottom",
              end: "bottom top",
              scrub: 0.8,
            },
          }
        );
      });
    }, pageRef);

    const refresh = () => ScrollTrigger.refresh();
    window.addEventListener("load", refresh);
    window.addEventListener("resize", refresh);
    window.requestAnimationFrame(refresh);

    return () => {
      removeLenisUpdate?.();
      window.removeEventListener("load", refresh);
      window.removeEventListener("resize", refresh);
      context.revert();
    };
  }, [lenis, spatialEnabled]);

  useEffect(() => {
    const elements = SECTION_IDS.map((id) => document.getElementById(id)).filter(
      (element): element is HTMLElement => Boolean(element)
    );

    const observer = new IntersectionObserver(
      (entries) => {
        const visible = entries
          .filter((entry) => entry.isIntersecting)
          .sort((a, b) => b.intersectionRatio - a.intersectionRatio)[0];

        if (visible && isSectionId(visible.target.id)) {
          setActiveSection(visible.target.id);
        }
      },
      {
        rootMargin: "-38% 0px -48% 0px",
        threshold: [0.08, 0.24, 0.52],
      }
    );

    elements.forEach((element) => observer.observe(element));

    return () => observer.disconnect();
  }, []);

  return (
    <div ref={pageRef} className="min-h-screen bg-[#151310] text-[#151310]">
      <SpatialNav
        activeSection={activeSection}
        onNavigate={navigateTo}
        onOpenAppointment={() => setAppointmentOpen(true)}
      />

      <motion.main
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
      >
        <HeroSection
          heroRef={heroRef}
          stageRef={heroStageRef}
          progressRef={heroProgressRef}
          spatialEnabled={spatialEnabled}
          activeChapter={activeChapter}
          onNavigate={navigateTo}
          onOpenAppointment={() => setAppointmentOpen(true)}
        />
        <ManifestoSection />
        <ProcessSection />
        <ProjectsSection />
        <ServicesSection onOpenAppointment={() => setAppointmentOpen(true)} />
        <TrackingSection onOpenAppointment={() => setAppointmentOpen(true)} />
        <ContactSection onOpenAppointment={() => setAppointmentOpen(true)} />
      </motion.main>

      <LandingFooter onNavigate={navigateTo} />

      <button
        type="button"
        onClick={() => navigateTo(NEXT_SECTION[activeSection])}
        aria-label={
          activeSection === "contact" ? "Başlangıca dön" : "Sonraki bölüme git"
        }
        data-cursor="Kay"
        className="fixed bottom-6 right-6 z-40 hidden h-12 w-12 cursor-pointer items-center justify-center rounded-full border border-[#f8f0e5]/20 bg-[#151310]/78 text-[#e6c777] shadow-xl backdrop-blur-md transition-colors hover:bg-[#c8a34c] hover:text-[#151310] md:flex"
      >
        <ArrowDownRight className="h-5 w-5" />
      </button>

      <AppointmentModal
        isOpen={appointmentOpen}
        onClose={() => setAppointmentOpen(false)}
      />
    </div>
  );
}
