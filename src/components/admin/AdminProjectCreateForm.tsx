"use client";

import { useActionState } from "react";
import { LoaderCircle, Save } from "lucide-react";
import { PROJECT_STAGES } from "@/data/project-tracking";
import {
  createAdminProjectAction,
  type AdminProjectFormState,
} from "@/app/admin/projects/actions";

const initialState: AdminProjectFormState = {
  status: "idle",
  message: "",
  fieldErrors: {},
  values: {
    title: "",
    customerName: "",
    phone: "",
    projectType: "",
    location: "",
    startDate: "",
    estimatedCompletion: "",
    currentStage: "pre_meeting",
    progress: "0",
    publicNote: "",
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
      <span className="mb-2 block text-xs font-semibold uppercase tracking-[0.16em] text-[#102B49]/70">
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
  const stageErrorId = "currentStage-error";
  const noteErrorId = "publicNote-error";

  return (
    <form
      action={formAction}
      className="mt-8 rounded-lg border border-[#102B49]/10 bg-[#FBFAF7] p-5 shadow-sm sm:p-8"
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
          required
          minLength={5}
          maxLength={30}
          autoComplete="tel"
          state={state}
        />
        <TextInput
          label="Proje Türü"
          name="projectType"
          maxLength={100}
          autoComplete="off"
          state={state}
        />
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
          <span className="mb-2 block text-xs font-semibold uppercase tracking-[0.16em] text-[#102B49]/70">
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
          <FieldError
            id={stageErrorId}
            errors={state.fieldErrors.currentStage}
          />
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
        <span className="mb-2 block text-xs font-semibold uppercase tracking-[0.16em] text-[#102B49]/70">
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
          className="inline-flex min-h-12 cursor-pointer items-center justify-center gap-2 rounded-full bg-[#102B49] px-7 text-sm font-semibold uppercase tracking-[0.12em] text-[#F6F2EA] transition-colors hover:bg-[#9A5C2F] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#9A5C2F] disabled:cursor-not-allowed disabled:bg-[#102B49]/60"
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
