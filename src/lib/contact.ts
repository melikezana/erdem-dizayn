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

export function createProjectTrackingWhatsAppUrl(projectCode: string) {
  return createWhatsAppUrl(WHATSAPP_MESSAGES.projectTracking(projectCode));
}

export function createAppointmentFollowUpWhatsAppUrl() {
  return createWhatsAppUrl(WHATSAPP_MESSAGES.appointmentFollowUp);
}
