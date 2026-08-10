"use client";

import { useActionState } from "react";
import { LoaderCircle, Save } from "lucide-react";
import { PROJECT_STAGES } from "@/data/project-tracking";
import { PROJECT_TYPE_OPTIONS } from "@/lib/admin/project-management";
import {
  updateAdminProjectAction,
  type AdminProjectFormState,
} from "@/app/admin/projects/actions";
import type { AdminProject } from "@/lib/admin/projects";

type AdminProjectEditFormProps = {
  project: AdminProject;
};

type FieldErrorProps = {
  id: string;
  errors?: string[];
};

const EDIT_TEXT_FIELDS: Array<{
  label: string;
  name: keyof AdminProjectFormState["values"];
  type: "text" | "tel" | "date";
  autoComplete: string;
  required: boolean;
}> = [
  {
    label: "Proje Adı",
    name: "title",
    type: "text",
    autoComplete: "off",
    required: true,
  },
  {
    label: "Müşteri",
    name: "customerName",
    type: "text",
    autoComplete: "name",
    required: true,
  },
  {
    label: "Telefon",
    name: "phone",
    type: "tel",
    autoComplete: "tel",
    required: false,
  },
  {
    label: "Konum",
    name: "location",
    type: "text",
    autoComplete: "street-address",
    required: false,
  },
  {
    label: "Başlangıç",
    name: "startDate",
    type: "date",
    autoComplete: "",
    required: false,
  },
  {
    label: "Tahmini Teslim",
    name: "estimatedCompletion",
    type: "date",
    autoComplete: "",
    required: false,
  },
];

function FieldError({ id, errors }: FieldErrorProps) {
  if (!errors?.length) {
    return null;
  }

  return (
    <p id={id} className="mt-2 text-xs font-semibold text-[#9A3D2F]">
      {errors[0]}
    </p>
  );
}

function getInitialState(project: AdminProject): AdminProjectFormState {
  return {
    status: "idle",
    message: "",
    fieldErrors: {},
    values: {
      id: project.id,
      title: project.title,
      customerName: project.customerName,
      phone: project.customerPhone ?? "",
      projectType: project.projectType,
      location: project.location ?? "",
      startDate: project.startDate ?? "",
      estimatedCompletion: project.estimatedCompletion ?? "",
      currentStage: project.currentStage,
      progress: String(project.progress),
      publicNote: project.publicNote ?? "",
    },
  };
}

export function AdminProjectEditForm({ project }: AdminProjectEditFormProps) {
  const [state, formAction, isPending] = useActionState(
    updateAdminProjectAction,
    getInitialState(project)
  );
  const typeErrorId = "edit-projectType-error";
  const stageErrorId = "edit-currentStage-error";
  const noteErrorId = "edit-publicNote-error";

  return (
    <form id="edit" action={formAction} className="space-y-5">
      <input type="hidden" name="id" value={project.id} />

      <div className="grid grid-cols-1 gap-5 lg:grid-cols-2">
        {EDIT_TEXT_FIELDS.map(({ label, name, type, autoComplete, required }) => {
          const fieldName = name;
          const errorId = `edit-${name}-error`;
          const hasError = Boolean(state.fieldErrors[fieldName]?.length);

          return (
            <label key={name} className="block">
              <span className="ed-data-label mb-2 block text-xs font-semibold uppercase tracking-[0.16em] text-[#102B49]/70">
                {label}
              </span>
              <input
                name={name}
                type={type}
                required={required}
                defaultValue={state.values[fieldName]}
                autoComplete={autoComplete}
                aria-invalid={hasError}
                aria-describedby={hasError ? errorId : undefined}
                className="min-h-12 w-full rounded-lg border border-[#102B49]/15 bg-white px-4 text-sm font-semibold text-[#102B49] shadow-xs transition-colors focus:border-[#9A5C2F] focus:outline-none focus:ring-2 focus:ring-[#9A5C2F]/20"
              />
              <FieldError id={errorId} errors={state.fieldErrors[fieldName]} />
            </label>
          );
        })}

        <label className="block">
          <span className="ed-data-label mb-2 block text-xs font-semibold uppercase tracking-[0.16em] text-[#102B49]/70">
            Proje Türü
          </span>
          <select
            name="projectType"
            required
            defaultValue={state.values.projectType}
            aria-invalid={Boolean(state.fieldErrors.projectType?.length)}
            aria-describedby={
              state.fieldErrors.projectType?.length ? typeErrorId : undefined
            }
            className="min-h-12 w-full rounded-lg border border-[#102B49]/15 bg-white px-4 text-sm font-semibold text-[#102B49] shadow-xs transition-colors focus:border-[#9A5C2F] focus:outline-none focus:ring-2 focus:ring-[#9A5C2F]/20"
          >
            {PROJECT_TYPE_OPTIONS.map((type) => (
              <option key={type} value={type}>
                {type}
              </option>
            ))}
          </select>
          <FieldError id={typeErrorId} errors={state.fieldErrors.projectType} />
        </label>

        <label className="block">
          <span className="ed-data-label mb-2 block text-xs font-semibold uppercase tracking-[0.16em] text-[#102B49]/70">
            Güncel Aşama
          </span>
          <select
            name="currentStage"
            required
            defaultValue={state.values.currentStage}
            aria-invalid={Boolean(state.fieldErrors.currentStage?.length)}
            aria-describedby={
              state.fieldErrors.currentStage?.length ? stageErrorId : undefined
            }
            className="min-h-12 w-full rounded-lg border border-[#102B49]/15 bg-white px-4 text-sm font-semibold text-[#102B49] shadow-xs transition-colors focus:border-[#9A5C2F] focus:outline-none focus:ring-2 focus:ring-[#9A5C2F]/20"
          >
            {PROJECT_STAGES.map((stage) => (
              <option key={stage.id} value={stage.id}>
                {stage.label}
              </option>
            ))}
          </select>
          <FieldError id={stageErrorId} errors={state.fieldErrors.currentStage} />
        </label>

        <label className="block">
          <span className="ed-data-label mb-2 block text-xs font-semibold uppercase tracking-[0.16em] text-[#102B49]/70">
            İlerleme
          </span>
          <input
            name="progress"
            type="number"
            min={0}
            max={100}
            step={1}
            required
            defaultValue={state.values.progress}
            aria-invalid={Boolean(state.fieldErrors.progress?.length)}
            className="min-h-12 w-full rounded-lg border border-[#102B49]/15 bg-white px-4 text-sm font-semibold text-[#102B49] shadow-xs transition-colors focus:border-[#9A5C2F] focus:outline-none focus:ring-2 focus:ring-[#9A5C2F]/20"
          />
          <FieldError id="edit-progress-error" errors={state.fieldErrors.progress} />
        </label>
      </div>

      <label className="block">
        <span className="ed-data-label mb-2 block text-xs font-semibold uppercase tracking-[0.16em] text-[#102B49]/70">
          Müşteriye Görünecek Not
        </span>
        <textarea
          name="publicNote"
          rows={5}
          maxLength={1000}
          defaultValue={state.values.publicNote}
          aria-invalid={Boolean(state.fieldErrors.publicNote?.length)}
          aria-describedby={
            state.fieldErrors.publicNote?.length ? noteErrorId : undefined
          }
          className="w-full rounded-lg border border-[#102B49]/15 bg-white px-4 py-3 text-sm leading-6 text-[#102B49] shadow-xs transition-colors focus:border-[#9A5C2F] focus:outline-none focus:ring-2 focus:ring-[#9A5C2F]/20"
        />
        <FieldError id={noteErrorId} errors={state.fieldErrors.publicNote} />
      </label>

      {state.message && (
        <p
          role={state.status === "error" ? "alert" : "status"}
          className={`rounded-lg border px-4 py-3 text-sm font-semibold ${
            state.status === "success"
              ? "border-[#2F6F4E]/20 bg-[#F0FAF4] text-[#24583E]"
              : "border-[#9A3D2F]/20 bg-[#FFF7F4] text-[#8A2E24]"
          }`}
        >
          {state.message}
        </p>
      )}

      <div className="flex justify-end">
        <button
          type="submit"
          disabled={isPending}
          className="ed-interactive inline-flex min-h-12 cursor-pointer items-center justify-center gap-2 rounded-full bg-[#102B49] px-7 text-sm font-semibold uppercase tracking-[0.12em] text-[#F6F2EA] transition-colors hover:bg-[#9A5C2F] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#9A5C2F] disabled:cursor-not-allowed disabled:bg-[#102B49]/60"
        >
          {isPending ? (
            <LoaderCircle className="h-4 w-4 animate-spin" />
          ) : (
            <Save className="h-4 w-4" />
          )}
          <span>{isPending ? "Kaydediliyor" : "Değişiklikleri Kaydet"}</span>
        </button>
      </div>
    </form>
  );
}
