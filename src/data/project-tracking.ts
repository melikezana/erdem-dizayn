export type ProjectStageState = "completed" | "active" | "upcoming";

export type ProjectStage = {
  id: string;
  title: string;
  description: string;
};

export type ProjectTrackingRecord = {
  code: string;
  project: string;
  location: string;
  startDate: string;
  currentStageId: string;
};

export const PROJECT_STAGES: ProjectStage[] = [
  {
    id: "01",
    title: "ÖN GÖRÜŞME",
    description: "İhtiyaçlarınız ve mekânınız değerlendiriliyor.",
  },
  {
    id: "02",
    title: "TASARIM",
    description: "Plan, malzeme ve mekânsal kararlar hazırlanıyor.",
  },
  {
    id: "03",
    title: "ONAY",
    description: "Tasarım detayları sizinle birlikte netleştiriliyor.",
  },
  {
    id: "04",
    title: "UYGULAMA HAZIRLIĞI",
    description: "Malzeme ve saha planlaması tamamlanıyor.",
  },
  {
    id: "05",
    title: "UYGULAMA",
    description: "Projeniz sahada hayata geçiriliyor.",
  },
  {
    id: "06",
    title: "SON KONTROLLER",
    description: "Detaylar, kalite ve uygulama kontrolleri yapılıyor.",
  },
  {
    id: "07",
    title: "TESLİME HAZIR",
    description: "Projeniz son dokunuşların ardından teslim için hazır.",
  },
];

export const DEMO_PROJECTS: ProjectTrackingRecord[] = [
  {
    code: "ERD-24018",
    project: "Villa Yenileme",
    location: "İstanbul / Ataşehir",
    startDate: "12 Ağustos 2026",
    currentStageId: "05",
  },
];

export function normalizeProjectCode(code: string) {
  return code.trim().replace(/\s+/g, "").toUpperCase();
}

// Local demo source; this boundary can be replaced by a Supabase lookup later.
export function findDemoProjectByCode(code: string) {
  const normalizedCode = normalizeProjectCode(code);
  return DEMO_PROJECTS.find((project) => project.code === normalizedCode) ?? null;
}
