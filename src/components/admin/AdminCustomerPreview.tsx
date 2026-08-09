import { Check } from "lucide-react";
import { PROJECT_STAGES, getProjectStageIndex } from "@/data/project-tracking";
import type { AdminProject } from "@/lib/admin/projects";

type AdminCustomerPreviewProps = {
  project: AdminProject;
};

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

function formatStageNumber(index: number) {
  return String(index + 1).padStart(2, "0");
}

export function AdminCustomerPreview({ project }: AdminCustomerPreviewProps) {
  const currentStageIndex = getProjectStageIndex(project.currentStage);
  const timelineByStage = new Map(
    project.timeline.map((update) => [update.stage, update])
  );

  return (
    <div className="rounded-lg border border-[#102B49]/10 bg-[#FBFAF7] p-4 sm:p-5">
      <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-4">
        {[
          ["Proje", project.title],
          ["Konum", project.location ?? "Belirtilmedi"],
          ["Başlangıç", formatDate(project.startDate)],
          ["Güncel Aşama", project.currentStageLabel],
        ].map(([label, value]) => (
          <div key={label} className="rounded-lg border border-[#102B49]/10 bg-white p-4">
            <span className="block text-[10px] font-semibold uppercase tracking-[0.18em] text-[#9A5C2F]">
              {label}
            </span>
            <span className="mt-2 block text-sm font-semibold text-[#102B49]">
              {value}
            </span>
          </div>
        ))}
      </div>

      <div className="mt-5">
        <div className="mb-2 flex items-center justify-between text-xs font-semibold uppercase tracking-[0.14em] text-[#102B49]/60">
          <span>İlerleme</span>
          <span>{project.progress}%</span>
        </div>
        <div className="h-2 overflow-hidden rounded-full bg-[#102B49]/10">
          <div
            className="h-full rounded-full bg-[#9A5C2F]"
            style={{ width: `${Math.min(100, Math.max(0, project.progress))}%` }}
          />
        </div>
      </div>

      {project.publicNote && (
        <p className="mt-5 rounded-lg border border-[#102B49]/10 bg-white p-4 text-sm leading-6 text-[#102B49]/72">
          {project.publicNote}
        </p>
      )}

      <ol className="mt-6 space-y-0">
        {PROJECT_STAGES.map((stage, index) => {
          const update = timelineByStage.get(stage.id);
          const isCompleted = index < currentStageIndex || Boolean(update?.completed);
          const isActive = index === currentStageIndex;

          return (
            <li
              key={stage.id}
              className="relative grid grid-cols-[3rem_1fr] gap-4 pb-5 last:pb-0"
              aria-current={isActive ? "step" : undefined}
            >
              <div className="relative flex justify-center">
                {index < PROJECT_STAGES.length - 1 && (
                  <span
                    className={`absolute bottom-0 top-10 w-px ${
                      isCompleted || isActive ? "bg-[#9A5C2F]" : "bg-[#102B49]/14"
                    }`}
                  />
                )}
                <span
                  className={`relative z-10 flex h-10 w-10 items-center justify-center rounded-full border text-[11px] font-bold ${
                    isCompleted
                      ? "border-[#102B49] bg-[#102B49] text-[#F6F2EA]"
                      : isActive
                        ? "border-[#9A5C2F] bg-[#9A5C2F] text-white"
                        : "border-[#102B49]/14 bg-[#F6F2EA] text-[#102B49]/45"
                  }`}
                >
                  {isCompleted ? <Check className="h-4 w-4" /> : formatStageNumber(index)}
                </span>
              </div>
              <div className="rounded-lg border border-[#102B49]/10 bg-white px-4 py-3">
                <div className="flex items-center gap-3">
                  <span className="font-serif text-lg font-bold text-[#9A5C2F]/70">
                    {formatStageNumber(index)}
                  </span>
                  <h4 className="text-xs font-bold uppercase tracking-[0.16em] text-[#102B49]">
                    {stage.label}
                  </h4>
                </div>
                <p className="mt-2 text-sm leading-6 text-[#102B49]/68">
                  {update?.description ?? stage.description}
                </p>
              </div>
            </li>
          );
        })}
      </ol>
    </div>
  );
}
