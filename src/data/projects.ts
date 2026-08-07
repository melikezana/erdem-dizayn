export interface ProjectItem {
  id: string;
  title: string;
  subtitle: string;
  category: "Mimari" | "Mekanik" | "Entegre Proje";
  location: string;
  year: string;
  area: string;
  image: string;
  description: string;
  disciplines: string[];
  highlights: string[];
}

export const PROJECTS_DATA: ProjectItem[] = [
  {
    id: "vadi-villas",
    title: "Vadi Premium Konutları",
    subtitle: "Modern Villa Mimarisi & Akıllı Mekanik İklimlendirme",
    category: "Entegre Proje",
    location: "İstanbul, Sarıyer",
    year: "2024",
    area: "4.200 m²",
    image: "/images/project-1.jpg",
    description: "Kentsel lüks ile doğayı buluşturan 6 adet müstakil modern villa projesinin hem mimari cephe tasarımı hem de gizli VRV iklimlendirme ve akıllı otomasyon tesisatı üstlenilmiştir.",
    disciplines: ["Mimari Tasarım", "İç Mimari", "VRV İklimlendirme", "Yerden Isıtma"],
    highlights: ["Sıfır Karbon Hedefli Isı Pompası", "Gizli Tavan Menfez Entegrasyonu", "Akustik Atık Su Yalıtımı"]
  },
  {
    id: "panora-business",
    title: "Panora Plazaları & İş Merkezi",
    subtitle: "Merkezi HVAC, Yangın Otomasyonu & Sıhhi Tesisat Taahhüt",
    category: "Mekanik",
    location: "Ankara, Çankaya",
    year: "2023",
    area: "18.500 m²",
    image: "/images/project-2.jpg",
    description: "16 katlı A+ ofis bloğunun tüm taze hava santralleri, chiller soğutma grupları, NFPA uyumlu sprinkler yangın tesisatı ve sıhhi altyapısı zamanında teslim edilmiştir.",
    disciplines: ["Mekanik Projelendirme", "Chiller Soğutma", "NFPA Yangın Tesisatı", "Uygulama & Taahhüt"],
    highlights: ["2x 800 kW Chiller Grubu", "FM200 Veri Merkezi Söndürme", "BIM Clash-Free Sertifikası"]
  },
  {
    id: "artisan-penthouse",
    title: "Artisan Loft & Residence",
    subtitle: "Minimalist İç Mimari & Şeffaf Mühendislik Detayları",
    category: "Mimari",
    location: "İzmir, Urla",
    year: "2024",
    area: "850 m²",
    image: "/images/project-3.jpg",
    description: "Ege kıyısında konumlanan panoramik deniz manzaralı rezidansın brut beton ve bakır detaylı iç mimarisi ile gizli hava şartlandırma mekanikleri tasarlanmıştır.",
    disciplines: ["İç Mimari Tasarım", "Özel Aydınlatma", "Mekanik Detay Çizimi"],
    highlights: ["Özel Bakır Menfez Tasarımı", "Akustik Yalıtımlı Havalandırma", "Lineer Işık Kurgusu"]
  },
  {
    id: "teknopark-r-d",
    title: "Ar-Ge ve İnovasyon Merkezi",
    subtitle: "Hijyenik Klima, Hassas Nem Kontrolü & Enerji Geri Kazanımı",
    category: "Mekanik",
    location: "Kocaeli, Gebze",
    year: "2023",
    area: "9.600 m²",
    image: "/images/project-4.jpg",
    description: "Laboratuvar ve temiz oda alanlarına sahip yüksek teknolojili Ar-Ge tesisinin hijyenik iklimlendirme, gaz altı söndürme ve otomasyon taahhüdü gerçekleştirilmiştir.",
    disciplines: ["Hijyenik Klima", "Temiz Oda Tesisatı", "Otomasyon Entegrasyonu"],
    highlights: ["Class 10.000 Temiz Oda", "%92 Isı Geri Kazanım Verimi", "Kesintisiz Yedekli Pompa Grubu"]
  }
];
