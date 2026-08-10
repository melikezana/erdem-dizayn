"use client";

import { useActionState } from "react";
import { Check, LoaderCircle, RadioTower, Save } from "lucide-react";
import { updateAdminTimelineAction } from "@/app/admin/projects/actions";
import type {
  AdminProject,
  AdminTimelineUpdate,
} from "@/lib/admin/projects";

type AdminTimelineManagerProps = {
  project: AdminProject;
};

function formatInputDate(value: string | null) {
  if (!value) {
    return "";
  }

  return value.slice(0, 10);
}

function formatStageNumber(value: number) {
  return String(value).padStart(2, "0");
}

function TimelineStageForm({
  project,
  update,
}: {
  project: AdminProject;
  update: AdminTimelineUpdate;
}) {
  const [state, formAction, isPending] = useActionState(
    updateAdminTimelineAction,
    {
      status: "idle" as const,
      message: "",
      stage: update.stage,
    }
  );
  const isActive = project.currentStage === update.stage;
  const showState = state.stage === update.stage && state.message;

  return (
    <form
      action={formAction}
      className={`ed-card-lift rounded-lg border bg-white p-4 transition-colors ${
        isActive ? "border-[#9A5C2F]/45" : "border-[#102B49]/10"
      }`}
    >
      <input type="hidden" name="projectId" value={project.id} />
      <input type="hidden" name="projectCode" value={project.projectCode} />
      <input type="hidden" name="stage" value={update.stage} />

      <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
        <div>
          <div className="flex flex-wrap items-center gap-3">
            <span className="font-serif text-xl font-bold text-[#9A5C2F]">
              {formatStageNumber(update.sortOrder)}
            </span>
            <h3 className="ed-data-label text-sm font-bold uppercase tracking-[0.16em] text-[#102B49]">
              {update.stageLabel}
            </h3>
            {isActive && (
              <span className="ed-data-label inline-flex min-h-7 items-center gap-1 rounded-full bg-[#102B49] px-3 text-[11px] font-bold uppercase tracking-[0.12em] text-[#F6F2EA]">
                <RadioTower className="h-3.5 w-3.5" />
                Güncel
              </span>
            )}
            {update.completed && (
              <span className="ed-data-label inline-flex min-h-7 items-center gap-1 rounded-full bg-[#F0FAF4] px-3 text-[11px] font-bold uppercase tracking-[0.12em] text-[#24583E]">
                <Check className="h-3.5 w-3.5" />
                Tamamlandı
              </span>
            )}
          </div>
          <p className="ed-body-copy-sm mt-2 text-sm leading-6 text-[#102B49]/65">
            {update.title}
          </p>
        </div>
      </div>

      <label className="mt-4 block">
        <span className="ed-data-label mb-2 block text-xs font-semibold uppercase tracking-[0.16em] text-[#102B49]/70">
          Müşteriye Görünecek Açıklama
        </span>
        <textarea
          name="description"
          rows={3}
          defaultValue={update.description ?? ""}
          className="w-full rounded-lg border border-[#102B49]/15 bg-[#FBFAF7] px-4 py-3 text-sm leading-6 text-[#102B49] shadow-xs transition-colors focus:border-[#9A5C2F] focus:outline-none focus:ring-2 focus:ring-[#9A5C2F]/20"
        />
      </label>

      <div className="mt-4 grid grid-cols-1 gap-4 md:grid-cols-[1fr_1fr_auto] md:items-end">
        <label className="flex min-h-12 items-center gap-3 rounded-lg border border-[#102B49]/10 bg-[#FBFAF7] px-4 text-sm font-semibold text-[#102B49]">
          <input
            type="checkbox"
            name="completed"
            defaultChecked={update.completed}
            className="h-4 w-4 accent-[#9A5C2F]"
          />
          <span>Tamamlandı</span>
        </label>

        <label className="block">
          <span className="ed-data-label mb-2 block text-xs font-semibold uppercase tracking-[0.16em] text-[#102B49]/70">
            Tamamlanma Tarihi
          </span>
          <input
            type="date"
            name="completedAt"
            defaultValue={formatInputDate(update.completedAt)}
            className="min-h-12 w-full rounded-lg border border-[#102B49]/15 bg-[#FBFAF7] px-4 text-sm font-semibold text-[#102B49] shadow-xs transition-colors focus:border-[#9A5C2F] focus:outline-none focus:ring-2 focus:ring-[#9A5C2F]/20"
          />
        </label>

        <label className="flex min-h-12 items-center gap-3 rounded-lg border border-[#102B49]/10 bg-[#FBFAF7] px-4 text-sm font-semibold text-[#102B49]">
          <input
            type="checkbox"
            name="setActive"
            defaultChecked={isActive}
            className="h-4 w-4 accent-[#9A5C2F]"
          />
          <span>Güncel aşama yap</span>
        </label>
      </div>

      {showState && (
        <p
          role={state.status === "error" ? "alert" : "status"}
          className={`mt-4 rounded-lg border px-4 py-3 text-sm font-semibold ${
            state.status === "success"
              ? "border-[#2F6F4E]/20 bg-[#F0FAF4] text-[#24583E]"
              : "border-[#9A3D2F]/20 bg-[#FFF7F4] text-[#8A2E24]"
          }`}
        >
          {state.message}
        </p>
      )}

      <div className="mt-4 flex justify-end">
        <button
          type="submit"
          disabled={isPending}
          className="ed-interactive inline-flex min-h-11 cursor-pointer items-center justify-center gap-2 rounded-full border border-[#102B49]/20 bg-[#FBFAF7] px-5 text-sm font-semibold text-[#102B49] transition-colors hover:border-[#9A5C2F] hover:text-[#9A5C2F] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#9A5C2F] disabled:cursor-not-allowed disabled:opacity-60"
        >
          {isPending ? (
            <LoaderCircle className="h-4 w-4 animate-spin" />
          ) : (
            <Save className="h-4 w-4" />
          )}
          <span>{isPending ? "Kaydediliyor" : "Kaydet"}</span>
        </button>
      </div>
    </form>
  );
}

export function AdminTimelineManager({ project }: AdminTimelineManagerProps) {
  return (
    <div className="space-y-3">
      {project.timeline.map((update) => (
        <TimelineStageForm key={update.stage} project={project} update={update} />
      ))}
    </div>
  );
}
