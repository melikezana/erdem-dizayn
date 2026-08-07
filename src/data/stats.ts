export interface StatItem {
  value: string;
  label: string;
  description: string;
}

export const STATS_DATA: StatItem[] = [
  {
    value: "50+",
    label: "Tamamlanan Proje",
    description: "Konut, rezidans, plaza ve endüstriyel tesislerde eksiksiz teslim."
  },
  {
    value: "10+",
    label: "Uzmanlık Alanı",
    description: "Mimari tasarımdan iklimlendirme ve yangın otomasyonuna entegre disiplinler."
  },
  {
    value: "100%",
    label: "Entegre Çözüm",
    description: "Tek noktadan mimari estetik ve mekanik mühendislik güvencesi."
  }
];
