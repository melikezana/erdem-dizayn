export interface ServiceItem {
  number: string;
  title: string;
  category: "Mimari" | "Mekanik" | "Uygulama";
  shortDesc: string;
  fullDesc: string;
  features: string[];
  deliverables: string[];
}

export const SERVICES_DATA: ServiceItem[] = [
  {
    number: "01",
    title: "Mimari Tasarım",
    category: "Mimari",
    shortDesc: "Mekânın karakterini; işlev, oran ve malzeme üzerinden kuruyoruz.",
    fullDesc: "Estetik vizyonu mühendislik gerçekleriyle birleştiren bütüncül mimari projeler üretiyoruz. Mekân kurgusu, kütle etüdü, iklimsel yerleşim ve BIM tabanlı 3D modelleme ile projelerinizin sarsılmaz temellerini atıyoruz.",
    features: ["Konsept & Avam Mimari Proje", "Ruhsat & Uygulama Çizimleri", "BIM 3D Modelleme", "Cephe & Kütle Tasarımı"],
    deliverables: ["Mimari Uygulama Paftaları", "Fotogerçekçi Renderlar", "Ruhsat Dosyaları"]
  },
  {
    number: "02",
    title: "İç Mimari",
    category: "Mimari",
    shortDesc: "İnsan ölçeğini merkeze alan, rafine ve yaşanabilir iç mekânlar tasarlıyoruz.",
    fullDesc: "İç mekânlarda estetik zarafet ile görünmeyen iklimlendirme ve havalandırma altyapısını milimetrik olarak gizliyoruz. Malzeme kalitesi, akustik konfor ve ışık kurgusu ile yaşanabilir alanlar yaratıyoruz.",
    features: ["İç Mekân Konsept & Moodboard", "Detay & İmalat Çizimleri", "Aydınlatma & Akustik Tasarım", "Gizli Menfez & Tesisat Entegrasyonu"],
    deliverables: ["Detay İmalat Paftaları", "Malzeme Metraj Listeleri", "Özel Mobilya Çizimleri"]
  },
  {
    number: "03",
    title: "Mekanik Projelendirme",
    category: "Mekanik",
    shortDesc: "Yapının görünmeyen altyapısını doğru mühendislik kararlarıyla planlıyoruz.",
    fullDesc: "Binaların yaşam kalitesini ve sürdürülebilirliğini belirleyen mekanik tesisat projelerini çiziyoruz. ASHRAE standartlarında ısı kaybı, hidrolik ve yük hesaplamaları ile çakışmasız BIM modelleri geliştiriyoruz.",
    features: ["Isı Kaybı & Kazancı Hesapları", "BIM Clash (Çakışma) Analizi", "Enerji Verimliliği Simülasyonu", "Mekanik Şartname Hazırlığı"],
    deliverables: ["Mekanik Ruhsat & Uygulama Projesi", "Hesap Raporları & Metraj"]
  },
  {
    number: "04",
    title: "Isıtma ve Soğutma",
    category: "Mekanik",
    shortDesc: "Konfor ile enerji verimliliğini birlikte gözeten sistemler geliştiriyoruz.",
    fullDesc: "Mevsim koşulları ne olursa olsun optimum enerji tüketimli ve yüksek konforlu iklimlendirme sistemleri tasarlıyoruz. VRV/VRF, ısı pompası ve merkezi chiller soğutma sistemlerinde uçtan uca mühendislik sunuyoruz.",
    features: ["VRV / VRF İklimlendirme", "Yüksek Verimli Isı Pompaları", "Chiller Soğutma Grupları", "Yerden Isıtma & Fan-Coil"],
    deliverables: ["Kapasite & Borulama Şemaları", "Cihaz Seçim Föyü"]
  },
  {
    number: "05",
    title: "Havalandırma",
    category: "Mekanik",
    shortDesc: "Sağlıklı ve dengeli iç ortam koşulları için doğru hava yönetimini sağlıyoruz.",
    fullDesc: "İç mekan hava kalitesini en üst düzeyde tutan taze hava santralleri, nem kontrolü, ısı geri kazanım üniteleri (HRV) ve sessiz kanal tasarımları kurguluyoruz.",
    features: ["Isı Geri Kazanımlı Taze Hava", "Hijyenik Klima Santralleri", "Otopark Ezoz & Jet-Fan", "Sessiz Hava Kanalı Hesabı"],
    deliverables: ["Hava Kanalı Şemaları", "TAB Dengeleme Şartnamesi"]
  },
  {
    number: "06",
    title: "Sıhhi Tesisat",
    category: "Mekanik",
    shortDesc: "Güvenilir, sürdürülebilir ve uygulanabilir altyapı çözümleri oluşturuyoruz.",
    fullDesc: "Kesintisiz kullanım suyu tedariki, basınçlandırma, arıtma ve sessiz atık su tahliyesi için modern mühendislik standartlarında altyapı projeleri çiziyoruz.",
    features: ["Basınçlı Kullanım Suyu & Hidrofor", "Sessiz Atık Su Borulama", "Gri Su & Yağmur Suyu Kazanımı", "Kullanım Suyu Arıtma"],
    deliverables: ["Sıhhi Tesisat Paftaları", "Hidrofor & Pompa Hesapları"]
  },
  {
    number: "07",
    title: "Yangın Sistemleri",
    category: "Mekanik",
    shortDesc: "Yapının güvenliğini proje aşamasından uygulamaya kadar bütüncül ele alıyoruz.",
    fullDesc: "NFPA ve Türkiye Yangın Yönetmeliği standartlarına tam uyumlu otomatik sulu söndürme (sprinkler), gazlı söndürme ve duman tahliye sistemleri kurguluyoruz.",
    features: ["Otomatik Sprinkler Hatları", "FM200 & Novec Gazlı Söndürme", "Yangın Dolapları & Hydrant", "Duman Tahliye & Basınçlandırma"],
    deliverables: ["Yangın Senaryo & Hidrolik Hesabı", "Söndürme Projeleri"]
  },
  {
    number: "08",
    title: "Uygulama ve Taahhüt",
    category: "Uygulama",
    shortDesc: "Projeyi çizimde bırakmıyor; sahada doğru uygulamayla tamamlıyoruz.",
    fullDesc: "Tasarlanan tüm mimari ve mekanik projeleri uzman şantiye mimar ve mühendislerimizle zamanında, bütçesinde ve milimetrik imalat kalitesiyle hayata geçiriyoruz.",
    features: ["Anahtar Teslim Şantiye Yönetimi", "Test, Ayar & Komisyonlama (TAB)", "As-Built Proje Çizimleri", "İşletme & Bakım Tesisatı"],
    deliverables: ["As-Built Çizimler", "Komisyonlama Raporu", "Garanti & Kullanım Kılavuzu"]
  }
];
