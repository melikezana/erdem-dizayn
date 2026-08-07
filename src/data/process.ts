export interface ProcessStep {
  step: string;
  title: string;
  subtitle: string;
  description: string;
  deliverables: string[];
}

export const PROCESS_STEPS: ProcessStep[] = [
  {
    step: "01",
    title: "Keşif",
    subtitle: "Saha & Yerinde İnceleme",
    description: "Projenin yapılacağı arsa veya yapının imar, iklim, zemin ve lojistik koşulları sahada detaylı olarak incelenir.",
    deliverables: ["Saha Raporu", "Topografya & İmar Etüdü", "İhtiyaç Analizi"]
  },
  {
    step: "02",
    title: "Analiz",
    subtitle: "İhtiyaç & Teknik Projeksiyon",
    description: "Kullanıcı gereksinimleri, iklimlendirme yükleri ve bütçe hedefleri doğrultusunda teknik matris oluşturulur.",
    deliverables: ["Teknik İhtiyaç Programı", "Yük & Enerji Projeksiyonu", "Bütçe Taslağı"]
  },
  {
    step: "03",
    title: "Konsept",
    subtitle: "Mimari Form & Tasarım Dili",
    description: "Estetik fikirler, kütle etütleri ve mekânsal ilişkiler ilk 3D mimari çizimlerle form kazanır.",
    deliverables: ["Avam Mimari Proje", "3D Görsel Konsept", "İlk Mekanik Şema"]
  },
  {
    step: "04",
    title: "Projelendirme",
    subtitle: "BIM 3D Detaylandırma",
    description: "Mimari, statik ve iç mekan çizimleri 3D BIM ortamında milimetrik detaylarla tamamlanır.",
    deliverables: ["BIM 3D Model", "Mimari Uygulama Paftaları", "Ruhsat Dosyaları"]
  },
  {
    step: "05",
    title: "Mühendislik",
    subtitle: "Mekanik & Otomasyon Hesapları",
    description: "ASHRAE ve EN standartlarında ısı kaybı, iklimlendirme, yangın ve sıhhi tesisat projeleri çizilir ve çakışmalar giderilir.",
    deliverables: ["Mekanik Ruhsat & Uygulama Projeleri", "Hesap Raporları", "Metraj Cetveli"]
  },
  {
    step: "06",
    title: "Uygulama",
    subtitle: "Şantiye & Saha Yönetimi",
    description: "Uzman şantiye mimar ve mühendislerimizin liderliğinde projeler sahada titizlikle hayata geçirilir.",
    deliverables: ["Şantiye İmalat Takibi", "Kalite Kontrol Testleri", "Haftalık Raporlama"]
  },
  {
    step: "07",
    title: "Teslim",
    subtitle: "Komisyonlama & Anahtar Teslim",
    description: "Tüm mekanik otomasyon, iklimlendirme ve yangın sistemleri TAB (Test, Adjust, Balance) süreçlerinden geçirilerek eksiksiz teslim edilir.",
    deliverables: ["TAB Komisyonlama Raporu", "As-Built Çizimler", "Garanti & İşletme Kılavuzu"]
  }
];
