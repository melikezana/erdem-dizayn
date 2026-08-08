import type { ProjectStatus } from "@/types/projects";

export type ProjectStageState = "completed" | "active" | "upcoming";

export type ProjectStage = {
  id: ProjectStatus;
  order: number;
  label: string;
  description: string;
  activeText: string;
};

export const PROJECT_STAGES: ProjectStage[] = [
  {
    id: "pre_meeting",
    order: 1,
    label: "Ön Görüşme",
    description: "İhtiyaçlarınız ve mekanınız değerlendiriliyor.",
    activeText: "Ön görüşme devam ediyor.",
  },
  {
    id: "design",
    order: 2,
    label: "Tasarım",
    description: "Plan, malzeme ve mekansal kararlar hazırlanıyor.",
    activeText: "Tasarım çalışması devam ediyor.",
  },
  {
    id: "approval",
    order: 3,
    label: "Onay",
    description: "Tasarım detayları sizinle birlikte netleştiriliyor.",
    activeText: "Onay süreci devam ediyor.",
  },
  {
    id: "preparation",
    order: 4,
    label: "Uygulama Hazırlığı",
    description: "Malzeme ve saha planlaması tamamlanıyor.",
    activeText: "Uygulama hazırlığı devam ediyor.",
  },
  {
    id: "implementation",
    order: 5,
    label: "Uygulama",
    description: "Projeniz sahada hayata geçiriliyor.",
    activeText: "Uygulama devam ediyor.",
  },
  {
    id: "final_checks",
    order: 6,
    label: "Son Kontroller",
    description: "Detaylar, kalite ve uygulama kontrolleri yapılıyor.",
    activeText: "Son kontroller devam ediyor.",
  },
  {
    id: "ready",
    order: 7,
    label: "Teslime Hazır",
    description: "Projeniz son dokunuşların ardından teslim için hazır.",
    activeText: "Projeniz teslime hazır.",
  },
];

export const PROJECT_STAGE_LABELS: Record<ProjectStatus, string> = PROJECT_STAGES.reduce(
  (labels, stage) => ({
    ...labels,
    [stage.id]: stage.label,
  }),
  {} as Record<ProjectStatus, string>
);

export function getProjectStageLabel(stage: ProjectStatus) {
  return PROJECT_STAGE_LABELS[stage];
}

export function getProjectStageIndex(stage: ProjectStatus) {
  return PROJECT_STAGES.findIndex((item) => item.id === stage);
}
