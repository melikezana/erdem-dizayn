export const CONTACT_CONFIG = {
  phoneDisplay: "+90 553 983 14 20",
  phoneInternational: "+905539831420",
  whatsappNumber: "905539831420",
  instagramUrl: "https://www.instagram.com/erdem.dizayn.mekanik/",
} as const;

export const WHATSAPP_MESSAGES = {
  quick:
    "Merhaba Erdem Bey, web siteniz üzerinden projem hakkında bilgi almak istiyorum.",
  appointmentFollowUp:
    "Merhaba Erdem Bey,\nweb siteniz üzerinden randevu talebi oluşturdum.",
  projectTracking: (projectCode: string) =>
    `Merhaba Erdem Bey,\n${projectCode} kodlu projem hakkında bilgi almak istiyorum.`,
  projectCodeShare: (projectCode: string) =>
    `Merhaba,\n\nErdem Dizayn & Mekanik projenizin takip kodu:\n\n${projectCode}\n\nProjenizin güncel durumunu web sitemizdeki\n‘Projem Nerede?’ alanından takip edebilirsiniz.`,
} as const;
