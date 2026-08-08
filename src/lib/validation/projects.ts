import { z } from "zod";
import { isValidProjectCode, normalizeProjectCode } from "@/lib/project-code";
import { trimmedString } from "@/lib/validation/common";

export const projectCodeSchema = trimmedString(1, 20)
  .transform(normalizeProjectCode)
  .refine(isValidProjectCode, {
    message: "Geçerli bir proje kodu girin.",
  });

export const projectSlugSchema = z
  .string()
  .trim()
  .min(1)
  .max(120)
  .regex(/^[a-z0-9-]+$/);
