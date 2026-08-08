import { z } from "zod";
import { PROJECT_STATUSES } from "@/types/projects";
import { optionalTrimmedString, trimmedString } from "@/lib/validation/common";

const optionalDateString = z.preprocess((value) => {
  if (typeof value !== "string") return value;

  const trimmed = value.trim();
  return trimmed.length > 0 ? trimmed : undefined;
}, z.string().regex(/^\d{4}-\d{2}-\d{2}$/).optional());

export const adminProjectSchema = z.object({
  title: trimmedString(2, 160),
  customerName: trimmedString(2, 120),
  phone: trimmedString(5, 30),
  projectType: optionalTrimmedString(100),
  location: optionalTrimmedString(160),
  startDate: optionalDateString,
  estimatedCompletion: optionalDateString,
  currentStage: z.enum(PROJECT_STATUSES),
  progress: z.coerce.number().int().min(0).max(100),
  publicNote: optionalTrimmedString(1000),
});

export const adminTimelineUpdateSchema = z.object({
  stage: z.enum(PROJECT_STATUSES),
  title: trimmedString(2, 160),
  description: optionalTrimmedString(1000),
  completed: z.boolean(),
  completedAt: optionalTrimmedString(40),
  sortOrder: z.number().int().min(1).max(100),
});
