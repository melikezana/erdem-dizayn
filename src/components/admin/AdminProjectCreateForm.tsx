"use client";

import { useActionState } from "react";
import { LoaderCircle, Save } from "lucide-react";
import { PROJECT_STAGES } from "@/data/project-tracking";
import { PROJECT_TYPE_OPTIONS } from "@/lib/admin/project-management";
import {
  createAdminProjectAction,
  type AdminProjectFormState,
} from "@/app/admin/projects/actions";

const initialState: AdminProjectFormState = {
  status: "idle",
  message: "",
  fieldErrors: {},
  values: {
    id: "",
    title: "",
    customerName: "",
    phone: "",
    projectType: PROJECT_TYPE_OPTIONS[0],
    location: "",
    startDate: "",
    estimatedCompletion: "",
    currentStage: "pre_meeting",
    progress: "0",
    publicNote: "",
    seoMetaTitle: "",
    seoMetaDescription: "",
    seoSlug: "",
    seoOgImage: "",
  },
};

type FieldErrorProps = {
  id: string;
  errors?: string[];
};

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

type TextInputProps = {
  label: string;
  name: keyof AdminProjectFormState["values"];
  type?: "text" | "tel" | "date" | "number";
  required?: boolean;
  minLength?: number;
  maxLength?: number;
  min?: number;
  max?: number;
  step?: number;
  autoComplete?: string;
  state: AdminProjectFormState;
};

function TextInput({
  label,
  name,
  type = "text",
  required = false,
  minLength,
  maxLength,
  min,
  max,
  step,
  autoComplete,
  state,
}: TextInputProps) {
  const errorId = `${name}-error`;
  const hasError = Boolean(state.fieldErrors[name]?.length);

  return (
    <label className="block">
      <span className="ed-data-label mb-2 block text-xs font-semibold uppercase tracking-[0.16em] text-[#102B49]/70">
        {label}
      </span>
      <input
        name={name}
        type={type}
        required={required}
        minLength={minLength}
        maxLength={maxLength}
        min={min}
        max={max}
        step={step}
        autoComplete={autoComplete}
        defaultValue={state.values[name]}
        aria-invalid={hasError}
        aria-describedby={hasError ? errorId : undefined}
        className="min-h-12 w-full rounded-lg border border-[#102B49]/15 bg-white px-4 text-sm font-semibold text-[#102B49] shadow-xs transition-colors placeholder:text-[#102B49]/35 focus:border-[#9A5C2F] focus:outline-none focus:ring-2 focus:ring-[#9A5C2F]/20"
      />
      <FieldError id={errorId} errors={state.fieldErrors[name]} />
    </label>
  );
}

export function AdminProjectCreateForm() {
  const [state, formAction, isPending] = useActionState(
    createAdminProjectAction,
    initialState
  );
  const typeErrorId = "projectType-error";
  const stageErrorId = "currentStage-error";
  const noteErrorId = "publicNote-error";
  const seoDescriptionErrorId = "seoMetaDescription-error";

  return (
    <form
      action={formAction}
      className="mt-6 rounded-lg border border-[#102B49]/10 bg-[#FBFAF7] p-5 shadow-sm sm:p-6"
    >
      <div className="grid grid-cols-1 gap-5 lg:grid-cols-2">
        <TextInput
          label="Proje Adı"
          name="title"
          required
          minLength={2}
          maxLength={160}
          autoComplete="off"
          state={state}
        />
        <TextInput
          label="Müşteri Adı"
          name="customerName"
          required
          minLength={2}
          maxLength={120}
          autoComplete="name"
          state={state}
        />
        <TextInput
          label="Telefon"
          name="phone"
          type="tel"
          maxLength={30}
          autoComplete="tel"
          state={state}
        />
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
        <TextInput
          label="Konum"
          name="location"
          maxLength={160}
          autoComplete="street-address"
          state={state}
        />
        <TextInput
          label="Başlangıç Tarihi"
          name="startDate"
          type="date"
          state={state}
        />
        <TextInput
          label="Tahmini Teslim Tarihi"
          name="estimatedCompletion"
          type="date"
          state={state}
        />
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
        <TextInput
          label="İlerleme Yüzdesi"
          name="progress"
          type="number"
          min={0}
          max={100}
          step={1}
          required
          state={state}
        />
      </div>

      <label className="mt-5 block">
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
          className="w-full rounded-lg border border-[#102B49]/15 bg-white px-4 py-3 text-sm leading-6 text-[#102B49] shadow-xs transition-colors placeholder:text-[#102B49]/35 focus:border-[#9A5C2F] focus:outline-none focus:ring-2 focus:ring-[#9A5C2F]/20"
        />
        <FieldError id={noteErrorId} errors={state.fieldErrors.publicNote} />
      </label>

      <div className="mt-7 border-t border-[#102B49]/10 pt-6">
        <div className="mb-5">
          <p className="ed-panel-title font-serif text-2xl font-bold text-[#102B49]">
            SEO Görünümü
          </p>
          <p className="ed-body-copy-sm mt-2 text-sm leading-6 text-[#102B49]/68">
            Proje sayfası arama sonuçlarında ve sosyal paylaşımlarda sade,
            profesyonel ve doğru görünsün.
          </p>
        </div>
        <div className="grid grid-cols-1 gap-5 lg:grid-cols-2">
          <TextInput
            label="Meta Title"
            name="seoMetaTitle"
            maxLength={160}
            autoComplete="off"
            state={state}
          />
          <TextInput
            label="Slug / URL"
            name="seoSlug"
            maxLength={120}
            autoComplete="off"
            state={state}
          />
          <TextInput
            label="Open Graph Görseli"
            name="seoOgImage"
            maxLength={500}
            autoComplete="url"
            state={state}
          />
        </div>

        <label className="mt-5 block">
          <span className="ed-data-label mb-2 block text-xs font-semibold uppercase tracking-[0.16em] text-[#102B49]/70">
            Meta Description
          </span>
          <textarea
            name="seoMetaDescription"
            rows={4}
            maxLength={320}
            defaultValue={state.values.seoMetaDescription}
            aria-invalid={Boolean(state.fieldErrors.seoMetaDescription?.length)}
            aria-describedby={
              state.fieldErrors.seoMetaDescription?.length
                ? seoDescriptionErrorId
                : undefined
            }
            className="w-full rounded-lg border border-[#102B49]/15 bg-white px-4 py-3 text-sm leading-6 text-[#102B49] shadow-xs transition-colors placeholder:text-[#102B49]/35 focus:border-[#9A5C2F] focus:outline-none focus:ring-2 focus:ring-[#9A5C2F]/20"
          />
          <FieldError
            id={seoDescriptionErrorId}
            errors={state.fieldErrors.seoMetaDescription}
          />
        </label>
      </div>

      {state.status === "error" && state.message && (
        <p
          role="alert"
          className="mt-5 rounded-lg border border-[#9A3D2F]/20 bg-[#FFF7F4] px-4 py-3 text-sm font-semibold text-[#8A2E24]"
        >
          {state.message}
        </p>
      )}

      <div className="mt-7 flex justify-end">
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
          <span>{isPending ? "Oluşturuluyor" : "Projeyi Oluştur"}</span>
        </button>
      </div>
    </form>
  );
}
