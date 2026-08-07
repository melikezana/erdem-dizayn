export interface ServiceItem {
  id: string;
  number: string;
  title: string;
  description: string;
  discipline: string;
  details: string[];
}

export const SERVICES_DATA: ServiceItem[] = [
  {
    id: "mimari-tasarim",
    number: "01",
    title: "MİMARİ TASARIM",
    description: "Mekânın karakterini; işlev, oran ve malzeme üzerinden kuruyoruz.",
    discipline: "Mimari",
    details: [
      "Bütüncül konsept geliştirme",
      "Kütle ve oran etütleri",
      "Biyoklimatik ve çevresel mimari",
      "BIM (Yapı Bilgi Modellemesi)"
    ]
  },
  {
    id: "ic-mimari",
    number: "02",
    title: "İÇ MİMARİ",
    description: "İç mekânı yalnızca görünen yüzeylerle değil, kullanım deneyimiyle tasarlıyoruz.",
    discipline: "Tasarım",
    details: [
      "Mekânsal kurgu ve sirkülasyon",
      "Aydınlatma ve akustik tasarımı",
      "Özel mobilya ve detay üretimi",
      "Malzeme ve doku paletleri"
    ]
  },
  {
    id: "mekanik-projelendirme",
    number: "03",
    title: "MEKANİK PROJELENDİRME",
    description: "Yapının görünmeyen sistemlerini daha ilk çizgide çözüyoruz.",
    discipline: "Mühendislik",
    details: [
      "3D Disiplinlerarası çakışma analizi",
      "Enerji simülasyonu ve verimlilik",
      "Ruhsat ve uygulama projeleri",
      "BİM LOD 400 detaylandırma"
    ]
  },
  {
    id: "isitma-sogutma",
    number: "04",
    title: "ISITMA VE SOĞUTMA",
    description: "Konfor ile enerji verimliliğini aynı mühendislik yaklaşımı içinde ele alıyoruz.",
    discipline: "HVAC",
    details: [
      "VRV / VRF İklimlendirme sistemleri",
      "Chiller ve merkezi soğutma grupları",
      "Toprak / hava kaynaklı ısı pompaları",
      "Düşük sıcaklıklı radyan ısıtma"
    ]
  },
  {
    id: "havalandirma",
    number: "05",
    title: "HAVALANDIRMA",
    description: "Sağlıklı iç ortam koşulları için hava yönetimini doğru tasarlıyoruz.",
    discipline: "İklimlendirme",
    details: [
      "%100 Taze havalı klima santralleri",
      "Yüksek verimli ısı geri kazanım",
      "Otopark duman tahliye sistemleri",
      "Temiz oda ve hijyenik havalandırma"
    ]
  },
  {
    id: "sihhi-tesisat",
    number: "06",
    title: "SIHHİ TESİSAT",
    description: "Güvenilir ve sürdürülebilir altyapıyı, uygulama gerçekleriyle birlikte planlıyoruz.",
    discipline: "Tesisat",
    details: [
      "Temiz ve atık su altyapı çözümleri",
      "Gri su ve yağmur suyu geri kazanımı",
      "Sessiz borulama ve akustik yalıtım",
      "Merkezi sıcak su hidronik kurgu"
    ]
  },
  {
    id: "yangin-sistemleri",
    number: "07",
    title: "YANGIN SİSTEMLERİ",
    description: "Güvenliği sonradan eklenen bir unsur değil, tasarımın ayrılmaz parçası olarak görüyoruz.",
    discipline: "Güvenlik",
    details: [
      "NFPA & Türkiye Yangın Yönetmeliği",
      "Sulu ve gazlı otomasyonlu söndürme",
      "Duman kontrol ve basınçlandırma",
      "Yangın pompalama ve rezerv depoları"
    ]
  },
  {
    id: "uygulama-taahhut",
    number: "08",
    title: "UYGULAMA VE TAAHHÜT",
    description: "Projeyi çizimde bırakmıyor; sahada doğru uygulamayla tamamlıyoruz.",
    discipline: "Saha",
    details: [
      "Anahtar teslim mimari & mekanik taahhüt",
      "Saha şantiye yönetimi ve denetim",
      "Test, ayar ve dengeleme (TAB)",
      "İşletmeye alma ve as-built teslimi"
    ]
  }
];
