import { CONTACT_CONFIG, WHATSAPP_MESSAGES } from "@/config/contact";

export const BUSINESS_CONTACT = {
  ...CONTACT_CONFIG,
  phoneHref: `tel:${CONTACT_CONFIG.phoneInternational}`,
  whatsappBaseUrl: `https://wa.me/${CONTACT_CONFIG.whatsappNumber}`,
};

export const QUICK_WHATSAPP_MESSAGE = WHATSAPP_MESSAGES.quick;

export function createWhatsAppUrl(message: string = QUICK_WHATSAPP_MESSAGE) {
  return `${BUSINESS_CONTACT.whatsappBaseUrl}?text=${encodeURIComponent(message)}`;
}

export function normalizeWhatsAppNumber(value: string) {
  const digits = value.replace(/\D/g, "");

  if (!digits) {
    return null;
  }

  if (digits.startsWith("00")) {
    return digits.slice(2);
  }

  if (digits.startsWith("0") && digits.length === 11) {
    return `90${digits.slice(1)}`;
  }

  if (digits.length === 10) {
    return `90${digits}`;
  }

  return digits;
}

export function createWhatsAppUrlForNumber(phone: string, message: string) {
  const whatsappNumber = normalizeWhatsAppNumber(phone);

  if (!whatsappNumber) {
    return null;
  }

  return `https://wa.me/${whatsappNumber}?text=${encodeURIComponent(message)}`;
}

export function createProjectTrackingWhatsAppUrl(projectCode: string) {
  return createWhatsAppUrl(WHATSAPP_MESSAGES.projectTracking(projectCode));
}

export function createProjectCodeShareWhatsAppUrl(
  projectCode: string,
  phone: string
) {
  return createWhatsAppUrlForNumber(
    phone,
    WHATSAPP_MESSAGES.projectCodeShare(projectCode)
  );
}

export function createAppointmentFollowUpWhatsAppUrl() {
  return createWhatsAppUrl(WHATSAPP_MESSAGES.appointmentFollowUp);
}
