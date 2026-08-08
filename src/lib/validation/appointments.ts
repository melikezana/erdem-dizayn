import { z } from "zod";
import { optionalTrimmedString, trimmedString } from "@/lib/validation/common";

const ISO_DATE_PATTERN = /^\d{4}-\d{2}-\d{2}$/;

function isValidIsoDate(value: string) {
  if (!ISO_DATE_PATTERN.test(value)) return false;

  const date = new Date(`${value}T00:00:00.000Z`);
  return !Number.isNaN(date.getTime()) && date.toISOString().slice(0, 10) === value;
}

export const appointmentRequestSchema = z.object({
  fullName: trimmedString(2, 100),
  phone: optionalTrimmedString(30),
  projectType: trimmedString(1, 80),
  preferredDate: trimmedString(10, 10).refine(isValidIsoDate, {
    message: "Geçerli bir tarih girin.",
  }),
  preferredTime: trimmedString(1, 30),
  note: optionalTrimmedString(1000),
  website: optionalTrimmedString(200),
});
