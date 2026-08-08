export const BUSINESS_CONTACT = {
  phoneDisplay: "+90 553 983 14 20",
  phoneHref: "tel:+905539831420",
  whatsappBaseUrl: "https://wa.me/905539831420",
  instagramUrl: "https://www.instagram.com/erdem.dizayn.mekanik/",
};

export const QUICK_WHATSAPP_MESSAGE =
  "Merhaba Erdem Bey, web siteniz üzerinden projem hakkında bilgi almak istiyorum.";

export function createWhatsAppUrl(message: string = QUICK_WHATSAPP_MESSAGE) {
  return `${BUSINESS_CONTACT.whatsappBaseUrl}?text=${encodeURIComponent(message)}`;
}
