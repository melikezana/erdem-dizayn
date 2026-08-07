export interface HotspotData {
  id: string;
  number: string;
  position: [number, number, number];
  title: string;
  discipline: string;
  quote: string;
  specs: string[];
}

export const HOTSPOTS_DATA: HotspotData[] = [
  {
    id: "arch-design",
    number: "01",
    position: [-2.4, 2.2, 1.2],
    title: "Mimari Tasarım",
    discipline: "Mimarlık & Konsept",
    quote: "İşlev, estetik ve mekânsal deneyimi aynı çizgide buluşturuyoruz.",
    specs: ["Kütle & Cephe Etüdü", "BIM 3D Modelleme", "Ruhsat & Uygulama Projeleri"]
  },
  {
    id: "interior",
    number: "02",
    position: [-0.6, 0.8, 2.2],
    title: "İç Mimari",
    discipline: "İç Mekan & Detay",
    quote: "İnsan ölçeğini merkeze alan, rafine ve yaşanabilir iç mekânlar tasarlıyoruz.",
    specs: ["Özel Detay İmalatları", "Aydınlatma Kurgusu", "Gizli İklimlendirme Entegrasyonu"]
  },
  {
    id: "mechanical",
    number: "03",
    position: [1.8, 1.4, -0.8],
    title: "Mekanik Proje",
    discipline: "Mühendislik & Hesaplama",
    quote: "Yapının görünmeyen altyapısını doğru mühendislik kararlarıyla planlıyoruz.",
    specs: ["Isı Kaybı & Yük Hesapları", "Otomasyon Entegrasyonu", "Enerji Verimliliği Analizi"]
  },
  {
    id: "hvac",
    number: "04",
    position: [0.2, 3.2, -0.4],
    title: "HVAC Sistemleri",
    discipline: "İklimlendirme & İklim Kontrol",
    quote: "Konfor ile enerji verimliliğini birlikte gözeten sistemler geliştiriyoruz.",
    specs: ["VRV / VRF İklimlendirme", "Isı Pompası Sistemleri", "Taze Hava Santralleri"]
  },
  {
    id: "plumbing",
    number: "05",
    position: [2.2, -0.4, 1.4],
    title: "Sıhhi Tesisat",
    discipline: "Su & Altyapı Yönetimi",
    quote: "Güvenilir, sürdürülebilir ve uygulanabilir altyapı çözümleri oluşturuyoruz.",
    specs: ["Hidrofor & Su Depolama", "Gri Su Geri Kazanımı", "Sessiz Atık Su Hatları"]
  },
  {
    id: "fire-safety",
    number: "06",
    position: [-2.6, -0.2, -1.8],
    title: "Yangın Sistemleri",
    discipline: "Güvenlik & Mühendislik",
    quote: "Yapının güvenliğini proje aşamasından uygulamaya kadar bütüncül ele alıyoruz.",
    specs: ["Sprinkler Söndürme Hatları", "FM200 Gazlı Söndürme", "Duman Tahliye & Basınçlandırma"]
  },
  {
    id: "contracting",
    number: "07",
    position: [1.0, -1.2, 0.6],
    title: "Uygulama ve Taahhüt",
    discipline: "Saha & Anahtar Teslim",
    quote: "Projeyi çizimde bırakmıyor; sahada doğru uygulamayla tamamlıyoruz.",
    specs: ["Anahtar Teslim Şantiye Yönetimi", "Test, Ayar & Komisyonlama (TAB)", "As-Built Proje Teslimi"]
  }
];
