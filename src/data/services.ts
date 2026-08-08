export interface ServiceItem {
  id: string;
  number: string;
  title: string;
  description: string;
  details: string[];
}

export const SERVICES_DATA: ServiceItem[] = [
  {
    id: "ic-mimari-tasarim",
    number: "01",
    title: "İÇ MİMARİ TASARIM",
    description:
      "Mekânınızı kullanım alışkanlıklarınıza, zevkinize ve ihtiyaçlarınıza göre yeniden kurguluyoruz.",
    details: [
      "Mekân planlama",
      "Malzeme ve renk seçimi",
      "Aydınlatma",
      "Mobilya ve özel detaylar",
    ],
  },
  {
    id: "mekanik-cozumler",
    number: "02",
    title: "MEKANİK ÇÖZÜMLER",
    description:
      "Isıtma, soğutma, havalandırma ve tesisat ihtiyaçlarını mekânın bütününe uygun şekilde çözüyoruz.",
    details: [
      "Isıtma ve soğutma",
      "Havalandırma",
      "Sıhhi tesisat",
      "Mekanik uygulamalar",
    ],
  },
  {
    id: "tadilat-yenileme",
    number: "03",
    title: "TADİLAT & YENİLEME",
    description:
      "Mevcut mekânınızı daha işlevli, estetik ve güncel bir yaşam alanına dönüştürüyoruz.",
    details: [
      "Konut yenileme",
      "Ofis yenileme",
      "Mutfak ve banyo",
      "Komple tadilat",
    ],
  },
  {
    id: "uygulama",
    number: "04",
    title: "UYGULAMA",
    description:
      "Tasarımı yalnızca çizimde bırakmıyor; uygulama sürecini başından sonuna takip ediyoruz.",
    details: [
      "Uygulama yönetimi",
      "Malzeme organizasyonu",
      "Saha takibi",
      "Detay çözümleri",
    ],
  },
  {
    id: "anahtar-teslim",
    number: "05",
    title: "ANAHTAR TESLİM",
    description:
      "Siz yalnızca nasıl bir mekân istediğinizi anlatın; tasarımdan son dokunuşa kadar süreci biz yönetelim.",
    details: ["Tasarım", "Planlama", "Uygulama", "Teslim"],
  },
];
