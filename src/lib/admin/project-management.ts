import { z } from "zod";
import { PROJECT_STATUSES } from "@/types/projects";
import { optionalTrimmedString, trimmedString } from "@/lib/validation/common";

export const adminProjectSchema = z.object({
  projectCode: trimmedString(9, 9),
  title: trimmedString(2, 160),
  projectType: optionalTrimmedString(100),
  location: optionalTrimmedString(160),
  customerName: optionalTrimmedString(120),
  startDate: optionalTrimmedString(10),
  estimatedCompletion: optionalTrimmedString(10),
  currentStage: z.enum(PROJECT_STATUSES),
  progress: z.number().int().min(0).max(100),
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
